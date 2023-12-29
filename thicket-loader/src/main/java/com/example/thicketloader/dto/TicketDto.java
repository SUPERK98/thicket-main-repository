package com.example.thicketloader.dto;


import com.example.thicketloader.domain.Ticket;
import com.example.thicketloader.enumerate.Status;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class TicketDto {

    private UUID id;

    @NotBlank(message = "stageName cannot be empty")
    private String stageName;

    @NotBlank(message = "stageType cannot be empty")
    private String stageType;

    @NotNull(message = "DATE cannot be null")
    private LocalDateTime date;

    @NotBlank(message = "place cannot be empty")
    private String place;

    @NotBlank(message = "chairType cannot be empty")
    private String chairType;

    @NotNull(message = "count cannot be empty")
    private int count;

    @NotBlank(message = "memberName cannot be empty")
    private String memberName;

    @Min(value = 0, message = "price must be greater than or equal to 0")
    private int price;
    private int sequence;
    private String phone;

    private LocalDateTime cancelDate;

    @NotNull(message = "stageId cannot be null")
    private UUID stageId;

    @NotNull(message = "memberId cannot be null")
    private UUID memberId;

    @NotNull
    private boolean deleted;

    @NotNull
    private int latency;
    // 추가된 필드
    @NotNull
    private UUID uuid;

    private Long cts;

    @NotNull(message = "chairId cannot be null")
    private UUID chairId;

    private Status status;

    @NotNull(message = "arriveServer cannot be null")
    private LocalDateTime arriveServer;

    public Ticket toEntity() {
        return Ticket.createTicket(
                stageName, place, date, uuid,
                chairType, count,
                memberName, phone, price,
                cancelDate, stageId, memberId, chairId,
                stageType, sequence, latency, cts, arriveServer,status
        );

    }


}
