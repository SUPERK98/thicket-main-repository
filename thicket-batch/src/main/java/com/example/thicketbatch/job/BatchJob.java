package com.example.thicketbatch.job;

import com.example.thicketbatch.dto.request.RequestCreateTicketDto;
import com.example.thicketbatch.enumerate.Status;
import com.example.thicketbatch.repository.ChairRepository;
import com.example.thicketbatch.service.KafkaProducer;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Queue;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
@Slf4j
public class BatchJob {

    private final KafkaProducer kafkaProducer;
    private final ObjectMapper objectMapper;
    private final ChairRepository chairRepository;

    /**
     * 좌석(chairId)별로 예매 요청을 쌓는 Map.
     *
     * - Key: chairId (문자열)
     * - Value: PriorityBlockingQueue — cts(보정된 클릭 시각) 기준 오름차순 자동 정렬
     *
     * PriorityBlockingQueue를 사용하는 이유:
     * Kafka 리스너 스레드(offer)와 @Async 배치 스레드(poll)가
     * 동시에 접근할 수 있기 때문에 스레드 안전한 자료구조 필요.
     * 기존 PriorityQueue는 스레드 안전하지 않아 데이터 손상 위험이 있었음.
     */
    private final Map<String, PriorityBlockingQueue<RequestCreateTicketDto>> groupedBychairId
            = new ConcurrentHashMap<>();

    /**
     * 좌석(chairId)별 누적 예매 순위 카운터.
     *
     * - Key: chairId
     * - Value: AtomicInteger — 멀티스레드 환경에서 원자적 증가(incrementAndGet) 보장
     *
     * 서버 재시작 시 0으로 초기화되므로 DB의 예매 현황과 불일치 가능성 있음.
     * (개선 과제: 서버 시작 시 DB에서 기존 rank 값을 로드하는 로직 추가 필요)
     */
    private final Map<String, AtomicInteger> mCountMap = new ConcurrentHashMap<>();


    /**
     * Kafka pre-order topic 구독 — 예매 서버(Producer)가 발행한 메시지 수신.
     *
     * 수신한 JSON 메시지를 RequestCreateTicketDto로 역직렬화한 후
     * 해당 좌석(chairId)의 PriorityBlockingQueue에 적재.
     * 큐에 적재되는 순간 cts 기준으로 자동 정렬됨 (compareTo 구현에 의해).
     *
     * 역직렬화 실패 시 해당 메시지는 유실됨.
     * (개선 과제: Dead Letter Queue(DLQ) 도입으로 실패 메시지 보존 필요)
     */
    @KafkaListener(topics = "test", groupId = "group-id-1")
    public void consume(ConsumerRecord<String, String> record) {
        try {
            RequestCreateTicketDto dto = objectMapper.readValue(
                    record.value(), RequestCreateTicketDto.class);
            log.info("Received message: {}", dto);
            addToQueue(dto);
        } catch (Exception e) {
            log.error("Error processing Kafka message: {}", e.getMessage(), e);
        }
    }

    /**
     * 예매 요청 DTO를 해당 좌석의 큐에 적재.
     *
     * computeIfAbsent: 해당 chairId의 큐가 없으면 새로 생성, 있으면 기존 큐 반환.
     * offer: 큐에 삽입하면서 compareTo(cts 기준)에 의해 자동 정렬됨.
     */
    private void addToQueue(RequestCreateTicketDto message) {
        String chairId = message.getChairId();
        groupedBychairId
                .computeIfAbsent(chairId, k -> new PriorityBlockingQueue<>())
                .offer(message);
        log.info("Added to queue. chairId: {}", chairId);
    }

    /**
     * 1초마다 실행되는 배치 처리 메서드.
     *
     * 각 좌석별 큐를 순회하며 producer()를 호출해 RESERVED/FAILED 판정 후 Kafka 재발행.
     * producer() 내부에서 rank(누적 순위 카운터)를 원자적으로 증가시키며 판정하므로
     * 멀티스레드 환경에서도 순위 중복 없이 정확한 판정
     * 같은 클래스 내부에서 producer()를 호출하므로 Spring AOP 프록시를 거치지 않아
     * producer()의 @Transactional도 동작하지 않는 문제가 있음.
     * (개선 과제: producer()를 별도 @Service로 분리하면 트랜잭션 정상 적용 가능)
     */
    @Scheduled(fixedRate = 1000)
    @Async
    protected void processAndSendMessages() {
        groupedBychairId.forEach((chairId, queue) -> {

            // 처리할 메시지가 없는 좌석은 Map에서 제거하여 불필요한 DB 조회 방지
            if (queue.isEmpty()) {
                groupedBychairId.remove(chairId);
                mCountMap.remove(chairId);
                return;
            }

            // 해당 좌석의 누적 순위 카운터 가져오기 (없으면 0으로 초기화)
            AtomicInteger rank = mCountMap.computeIfAbsent(
                    chairId, k -> new AtomicInteger(0));

            UUID chairUUID = UUID.fromString(chairId);

            // 총 좌석 수 조회 — 예매 순위 판정의 기준값
            Integer count = chairRepository.findCountByChairId(chairUUID);
            if (count == null) {
                log.warn("chairId {} 에 해당하는 좌석 정보 없음, 처리 건너뜀", chairId);
                return;
            }

            producer(rank, queue, count, chairUUID);
        });
    }

    /**
     * 큐에서 메시지를 순서대로 꺼내 RESERVED/FAILED 판정 후 Kafka ordered topic으로 발행.
     *
     * 판정 기준:
     * - cts(보정된 클릭 시각) 오름차순으로 정렬된 큐에서 순서대로 꺼냄
     * - sequence(순위)가 count(총 좌석 수) 이내이면 RESERVED, 초과이면 FAILED
     * - 예: 총 좌석 100석, sequence 1~100 → RESERVED / 101~ → FAILED
     *
     * @param rank     해당 좌석의 누적 순위 카운터 (AtomicInteger로 원자적 증가)
     * @param queue    cts 기준 정렬된 예매 요청 큐
     * @param count    총 좌석 수 (RESERVED/FAILED 판정 기준)
     * @param chairId  좌석 UUID (DB 갱신에 사용)
     */
    public void producer(AtomicInteger rank,
                         Queue<RequestCreateTicketDto> queue,
                         int count,
                         UUID chairId) {

        while (!queue.isEmpty()) {
            RequestCreateTicketDto message = queue.poll();

            // PriorityBlockingQueue.poll()은 비어있으면 null 반환 — null 체크 필요
            if (message == null) continue;

            // 누적 순위 원자적 증가 (멀티스레드 환경에서 중복 순위 방지)
            int sequence = rank.incrementAndGet();
            message.setSequence(sequence);

            // 순위가 총 좌석 수 이내 → 예매 성공, 초과 → 실패
            if (count >= sequence) {
                message.setStatus(Status.RESERVED.getValue());
                log.info("RESERVED - chairId: {}, sequence: {}", chairId, sequence);
            } else {
                message.setStatus(Status.FAILED.getValue());
                log.info("FAILED   - chairId: {}, sequence: {}", chairId, sequence);
            }

            // ordered topic으로 판정 결과 발행
            // CompletableFuture 반환값을 처리하여 전송 실패 시 로깅
            // (개선 과제: 실패 시 재시도 로직 또는 DLQ 추가 필요)
            kafkaProducer.send(message)
                    .exceptionally(ex -> {
                        log.error("Kafka 전송 실패 - chairId: {}, sequence: {}, error: {}",
                                chairId, sequence, ex.getMessage());
                        return "실패";
                    });
        }

        // 잔여 좌석 수 갱신
        // rank.get()이 count를 초과한 경우 음수 방지를 위해 Math.max(0, ...) 적용
        int availableCount = Math.max(0, count - rank.get());
        chairRepository.updateAvailableCountByChairId(chairId, availableCount);
        log.info("availableCount updated - chairId: {}, remaining: {}", chairId, availableCount);
    }
}