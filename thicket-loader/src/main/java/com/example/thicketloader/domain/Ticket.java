    package com.example.thicketloader.domain;


    import com.example.thicketloader.TimeStamp;
    import com.example.thicketloader.enumerate.Status;
    import jakarta.persistence.*;
    import lombok.*;
    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.annotation.LastModifiedDate;

    import java.time.LocalDateTime;
    import java.util.UUID;

    @Entity
    @Table(name = "ticket", schema = "thicket_local_db")
    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public class Ticket extends TimeStamp {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        @Column(nullable = false)
        private String stageName;

        @Column(nullable = false)
        private String stageType;

        @Column(nullable = false)
        private LocalDateTime date;

        @Column(nullable = false)
        private String place;

        @Column(nullable = false)
        private String chairType;

        @Column(nullable = false)
        private int count;

        @Column(nullable = false)
        private int price;

        @Column(nullable = false)
        private String memberName;

        @Column
        private String phone;

        @Column
        private UUID uuid;

        @Column(nullable = false)
        private LocalDateTime cancelDate;

        @Column
        private LocalDateTime arriveServer;

        @Enumerated(EnumType.STRING) // Enum 타입을 문자열로 저장
        @Column
        private Status status;
        @Column
        private Long cts;
        @Column
        private int sequence;
        @Column
        private int latency;

        @Column(nullable = false)
        private UUID stageId;

        @Column(nullable = false)
        private UUID chairId;

        @Column(nullable = false)
        private UUID memberId;

        @Column(nullable = false)
        private boolean deleted;

        @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
        private Payment payment;

        @CreatedDate
        private LocalDateTime createAt;
        @LastModifiedDate
        private LocalDateTime updateAt;
        public static Ticket createTicket(String newStageName, String newPlace, LocalDateTime newDate,
                                          UUID uuid,
                                          String newChairType, int newCount, String newMemberName,
                                          String newPhone, int newPrice, LocalDateTime newCancelDate,
                                          UUID newStageId, UUID newMemberId, UUID newChairId, String newStageType,
                                          int sequence, int latency, Long cts, LocalDateTime arriveServer,Status status) {
            Ticket ticket = new Ticket();

            ticket.deleted = false;
            ticket.stageName = newStageName;
            ticket.date = newDate;
            ticket.uuid = uuid;
            ticket.place = newPlace;
            ticket.chairType = newChairType;
            ticket.count = newCount;
            ticket.memberName = newMemberName;
            ticket.price = newPrice;
            ticket.phone = newPhone;
            ticket.cancelDate = newCancelDate;
            ticket.stageId = newStageId;
            ticket.memberId = newMemberId;
            ticket.chairId=newChairId;
            ticket.stageType = newStageType;
            ticket.sequence=sequence;
            ticket.latency=latency;
            ticket.cts=cts;
            ticket.arriveServer=arriveServer;
            ticket.status=status;
            return ticket;
        }
        public void updateDeleted(boolean deleted) {
            this.deleted = deleted;
        }

        public void setPayment(Payment payment) {
            this.payment = payment;
        }
    }
