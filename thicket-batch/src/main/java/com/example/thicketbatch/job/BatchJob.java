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
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
@Slf4j
public class BatchJob {

    private final KafkaProducer kafkaProducer;
    private final ObjectMapper objectMapper;
    private final ChairRepository chairRepository;
    private final double BUFFER_SIZE = 0.2;
    // chairId별로 메시지를 쌓을 Map
    private Map<String, PriorityQueue<RequestCreateTicketDto>> groupedBychairId = new ConcurrentHashMap<>();

    private Map<String, AtomicInteger> mCountMap = new ConcurrentHashMap<>();

    private Map<String, Integer> seatCount = new ConcurrentHashMap<>();

    @KafkaListener(topics = "test", groupId = "group-id-1")
    public void consume(ConsumerRecord<String, String> record) {
        try {
            // Kafka 메시지의 값을 RequestCreateTicketDto로 역직렬화
            RequestCreateTicketDto requestCreateTicketDto = objectMapper.readValue(record.value(), RequestCreateTicketDto.class);


            // consume한 메세지
            System.out.println("Received message: " + requestCreateTicketDto.toString());
            // chairId를 기준으로 메시지를 큐에 추가
            addToQueue(requestCreateTicketDto);
        } catch (Exception e) {
            // 역직렬화나 처리 중에 오류가 발생한 경우 예외 처리
            System.err.println("Error processing Kafka message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    //큐에 메세지 추가
    private void addToQueue(RequestCreateTicketDto message) {
        String chairId = message.getChairId();
        groupedBychairId.computeIfAbsent(chairId, k -> new PriorityQueue<>()).offer(message);
        System.out.println("Added message to queue. chairId: " + chairId + ", Message: " + message);
    }

    //메세지 전송 및 업데이트
    @Scheduled(fixedRate = 1000)
    @Async
    @Transactional
    protected void processAndSendMessages() {
        groupedBychairId.forEach((chairId, queue) -> {
            log.info(chairId);
            //chairId별 rank생성
            AtomicInteger rank = mCountMap.computeIfAbsent(chairId, k -> new AtomicInteger(0));

            //남은좌석조회,db의 availablecount 가져옴
            Integer count = chairRepository.findCountByChairId(UUID.fromString(chairId));
            log.info(String.valueOf(count));

            producer(rank, queue, count, UUID.fromString(chairId));

        });
    }

    @Transactional
    public void producer(AtomicInteger rank, Queue<RequestCreateTicketDto> queue, int count, UUID chairId) {

//        int processable = (int) (availableCount * BUFFER_SIZE);
        while (!queue.isEmpty()) {
            //메세지 추출
            RequestCreateTicketDto message = queue.poll();
            //메세지 sequence 입력
            int sequence = rank.incrementAndGet();
            message.setSequence(sequence);
            if (count >= sequence) {
                message.setStatus(Status.RESERVED.getValue());
                log.info(String.valueOf(message.getSequence()));
            } else {
                message.setStatus(Status.FAILED.getValue());
            }
            log.info(message.toString());
            // 처리된 메시지를 다시 Kafka로 전송
            kafkaProducer.send(message);
            //chair db rank 업데이트

        }
        int availableCount = rank.get() > count ? -1 : count - rank.get();
        chairRepository.updateAvailableCountByChairId(chairId, availableCount);
    }
}
