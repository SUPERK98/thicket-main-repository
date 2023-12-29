package com.example.thicketticket.dto.request;

import com.example.thicketticket.domain.Ticket;
import com.example.thicketticket.enumerate.Status;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class RequestCreateTicketDto {

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

    private LocalDateTime arriveServer;

    private String memberName;

    @Min(value = 0, message = "price must be greater than or equal to 0")
    private int price;

    private String phone;

    @NotNull(message = "cancelDate cannot be null")
    private LocalDateTime cancelDate;

    @NotNull(message = "stageId cannot be null")
    private String stageId;

    private String memberId;

    @Enumerated(EnumType.STRING)
    private Status status;

    @NotNull
    private boolean deleted;

    @NotNull
    private int latency;
    // 추가된 필드
    private UUID uuid;

    @NotNull(message = "chairId cannot be null")
    private String chairId;

    private Long cts;



}
