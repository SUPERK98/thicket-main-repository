package com.example.thicketloader.service;

import com.example.thicketloader.dto.TicketDto;
import com.example.thicketloader.repository.TicketRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
@Component
@RequiredArgsConstructor
@Slf4j
public class consume {
    private final TicketService ticketService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "test2", groupId = "group-id-2")
    public void consume(ConsumerRecord<String, String> record) {
        try {
            // Kafka 메시지의 값을 RequestCreateTicketDto로 역직렬화
            TicketDto ticketDto = objectMapper.readValue(record.value(), TicketDto.class);
            // consume한 메세지
            log.info("Received message: " + ticketDto.getStatus().toString());
            log.info("Received message: " + ticketDto.getStatus().getClass());
            log.info(String.valueOf(ticketDto.getCts()));

            ticketDto.setMemberName(ticketService.findName(ticketDto.getMemberId()));
            ticketDto.setPhone(ticketService.findPhone(ticketDto.getMemberId()));

            //DB저장
            ticketService.save(ticketDto);

        } catch (Exception e) {
            // 역직렬화나 처리 중에 오류가 발생한 경우 예외 처리
            System.err.println("Error processing Kafka message: " + e.getMessage());

        }
    }
}
