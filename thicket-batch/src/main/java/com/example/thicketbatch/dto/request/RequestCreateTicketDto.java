package com.example.thicketbatch.dto.request;

import com.example.thicketbatch.enumerate.Status;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class RequestCreateTicketDto implements Comparable<RequestCreateTicketDto>  {

    public int sequence;
    private UUID id;
    @Column(nullable = false)
    private String status;

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

    @NotBlank(message = "arriveServer cannot be empty")
    private LocalDateTime arriveServer;

    @NotNull(message = "count cannot be empty")
    private int count;

    private String memberName;
    private String phone;

    @Min(value = 0, message = "price must be greater than or equal to 0")
    private int price;

    @NotNull(message = "cancelDate cannot be null")
    private LocalDateTime cancelDate;

    @NotNull(message = "stageId cannot be null")
    private String stageId;

    @NotNull(message = "memberId cannot be null")
    private String memberId;

    @NotNull(message = "chairId cannot be null")
    private String chairId;

    @NotNull(message = "chairId cannot be null")
    private String chairId;

    @NotNull
    private boolean deleted;

    @Column
    private LocalDateTime arriveServerTime;

    @NotNull
    private int latency;
    // 추가된 필드
    @NotNull
    private UUID uuid;

    private Long cts;



//    public String toString() {
//        return "RequestCreateTicketDto{" +
//                "id=" + id +
//                ", stageName='" + stageName + '\'' +
//                ", stageType='" + stageType + '\'' +
//                ", date=" + date +
//                ", place='" + place + '\'' +
//                ", chairType='" + chairType + '\'' +
//                ", count=" + count +
//                ", memberName='" + memberName + '\'' +
//                ", price=" + price +
//                ", phone='" + phone + '\'' +
//                ", cancelDate=" + cancelDate +
//                ", stageId='" + stageId + '\'' +
//                ", memberId='" + memberId + '\'' +
//                ", deleted=" + deleted +
//                ", latency=" + latency +
//                ", uuid='" + uuid + '\'' +
//                ", cts=" + cts +
//                '}';
//    }

//localdatetime형태일 때
//    @Override
//    public int compareTo(RequestCreateTicketDto other) {
//        // cts를 기준으로 정렬
//        if (this.cts == null && other.cts == null) {
//            return 0;
//        } else if (this.cts == null) {
//            return -1;
//        } else if (other.cts == null) {
//            return 1;
//        } else {
//            // LocalDateTime.compareTo를 사용하여 두 timestamp를 비교
//            return this.cts.compareTo(other.cts);
//        }
//    }
@Override
public int compareTo(RequestCreateTicketDto other) {
    // cts를 기준으로 정렬
    return this.cts.compareTo(other.cts);
}
}
