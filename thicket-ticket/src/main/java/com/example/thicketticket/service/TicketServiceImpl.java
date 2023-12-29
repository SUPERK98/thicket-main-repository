package com.example.thicketticket.service;

import com.example.thicketticket.domain.Payment;
import com.example.thicketticket.domain.Ticket;
import com.example.thicketticket.dto.request.RequestCreateTicketDto;
import com.example.thicketticket.dto.response.ResponseAdminTicketDto;
import com.example.thicketticket.dto.response.ResponseTicketDto;
import com.example.thicketticket.dto.response.ResponseTicketsByStageIdDto;
import com.example.thicketticket.dto.response.ResponseTicketsDto;
import com.example.thicketticket.enumerate.Status;
import com.example.thicketticket.repository.TicketRepository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;


@Service
@RequiredArgsConstructor
@Slf4j
public class TicketServiceImpl implements TicketService{

    private final TicketRepository ticketRepository;

    private final KafkaTemplate<String, String> kafkaTemplate;
    // JSON 직렬화 및 역직렬화를 수행하는 Jackson 라이브러리의 핵심 클래스
    private final ObjectMapper objectMapper;
    //생성
    @Override
    @Transactional

    public CompletableFuture<String> createTicket(RequestCreateTicketDto ticketDto,UUID memberId) {
        // 현재 서버 시간
        Instant currentTime = Instant.now();

        //latency
        int latency = ticketDto.getLatency();

        // latency 빼서 보정된 시간값 계산
        Instant correctedTimestamp = currentTime.minusMillis(latency);

        // 고유값(UUID) 값을 DTO에 설정
        ticketDto.setUuid(UUID.randomUUID());
        ticketDto.setMemberId(String.valueOf(memberId));

        // CorrectedTimestamp 설정
        LocalDateTime localDateTime = LocalDateTime.ofInstant(currentTime, ZoneId.systemDefault());
        ticketDto.setCts(correctedTimestamp.toEpochMilli());
        ticketDto.setArriveServer(localDateTime);
        System.out.println("Corrected Timestamp in DTO: " + ticketDto.getCts());
        System.out.println(ticketDto);
        // 객체를 JSON 문자열로 직렬화
        String jsonMessage;
        try {
            jsonMessage = objectMapper.writeValueAsString(ticketDto);
        } catch (JsonProcessingException e) {
            // JSON 직렬화 실패 시
            return CompletableFuture.completedFuture("JSON 직렬화 실패");
        }

        // Kafka에 메시지 전송
        CompletableFuture<SendResult<String, String>> future = CompletableFuture.supplyAsync(() -> {
            try {
                return kafkaTemplate.send("test", jsonMessage).get();
            } catch (InterruptedException | ExecutionException e) {
                throw new RuntimeException(e);
            }
        });

        // 메시지 전송 결과에 대한 처리 - 비동기
        return future.thenApply(result -> {
            // 메시지 전송 성공 시
            System.out.println("Sent message=[" +
                    "] with offset=[" + result.getRecordMetadata().offset() + "]");
            return "성공";
        }).exceptionally(ex -> {
            // 메시지 전송 실패 시
            System.out.println("Unable to send message= due to : " + ex.getMessage());
            return "실패";
        });


    }

    //단일 티켓 조회
    @Override
    @Transactional
    public ResponseTicketDto findById(UUID id) {
        Optional<Ticket> findTicket = ticketRepository.findByIdAndDeletedFalse(id);


        if (findTicket.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 티켓.");
        }
        Ticket ticket = findTicket.get();
        return new ResponseTicketDto(ticket);
    }

    //admin 티켓 id 조회
    @Override
    @Transactional
    public ResponseAdminTicketDto adminFindById(UUID id) {
        Optional<Ticket> findTicket = ticketRepository.findByIdAndDeletedFalse(id);


        if (findTicket.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 티켓.");
        }
        Ticket ticket = findTicket.get();
        return new ResponseAdminTicketDto(ticket);
    }

    //사용자가 사용한 티켓 조회
    @Override
    @Transactional
    public Page<ResponseTicketsDto> findByMemberIdAndDateBefore(UUID memberId, LocalDateTime currentTime, Pageable pageable) {
        Page<Ticket> tickets = ticketRepository.findByMemberIdAndDateBeforeAndDeletedFalse(memberId,currentTime,pageable);
        if (tickets.isEmpty()) {
            throw new EntityNotFoundException("공연의 예매가 존재하지 않습니다.");
        }

        return tickets.map(ResponseTicketsDto::new);

    }
    //사용자가 앞으로 볼 티켓 조회
    @Override
    @Transactional
    public Page<ResponseTicketsDto> findByMemberIdAndDateAfter(UUID memberId, LocalDateTime currentTime, Pageable pageable) {
        Page<Ticket> ticketsPage = ticketRepository.findByMemberIdAndDateAfterAndDeletedFalse(memberId, currentTime, pageable);

        if (ticketsPage.isEmpty()) {
            throw new EntityNotFoundException("공연의 예매가 존재하지 않습니다.");
        }

        return ticketsPage.map(ResponseTicketsDto::new);
    }
    //admin 공연별 티켓조회
    @Override
    @Transactional

    public Page<ResponseTicketsByStageIdDto> findByStageId(UUID Stage, Pageable pageable) {
        Page<Ticket> tickets = ticketRepository.findByStageIdAndDeletedFalse(Stage, pageable);

        if(tickets.isEmpty()){
            throw new EntityNotFoundException("공연의 예매가 존재하지 않습니다.");

        }
       return tickets.map(ResponseTicketsByStageIdDto::new);


    }

    //티켓 삭제
    @Override
    @Transactional
    public void deleteTicket(UUID id) {
        Optional<Ticket> findTicket = ticketRepository.findById(id);

        if(findTicket.isEmpty()){
            throw new EntityNotFoundException("공연을 찾을 수 없습니다.");
        }

        Ticket ticket = findTicket.get();
        //티켓 STATUS가 RESERVE 일 경우
        if(ticket.getStatus().equals(Status.RESERVE)) {
            ticket.updateDeleted(true);
        }
        //티켓 상태가 PAY일경우
    }
}
