package com.example.thicketticket;

import com.example.thicketticket.domain.Payment;
import com.example.thicketticket.domain.Ticket;
import com.example.thicketticket.enumerate.HowReceive;
import com.example.thicketticket.enumerate.Method;
import com.example.thicketticket.enumerate.State;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class Init {
    private final InitService initService;

    @PostConstruct
    public void init(){
        initService.init();
    }

    @Component
    @Transactional
    @RequiredArgsConstructor
    static class InitService {
        private final EntityManager em;
        public void init() {
            em.persist(Payment
                    .createPayment("member1", "thicket1", "stage1"));

            // 이미 결제 완료된 예약 테스트용
            Payment payment2 = Payment
                    .createPayment("member1", "thicket2", "stage2");
            payment2.updateState(State.COMPLETED);
            em.persist(payment2);

            em.persist(Payment
                    .createPayment("member1", "thicket3", "stage3"));

            em.persist(Payment
                    .createPayment("member1", "thicket4", "stage4"));

            em.persist(Payment
                    .createPayment("member2", "thicket5", "stage1"));

            em.persist(Payment
                    .createPayment("member3", "thicket6", "stage1"));

            em.persist(Payment
                    .createPayment("member4", "thicket7", "stage1"));

            // 취소 가능 날짜가 지난 결제 내역
            Payment paymentByMember5 = Payment.createPayment("member5", "thicket8", "stage1");
            paymentByMember5.updateState(State.COMPLETED);
            paymentByMember5.updateHowReceive(HowReceive.DIRECTLY);
            paymentByMember5.updateMethod(Method.KAKAO);
            paymentByMember5.updateCancelDeadline(LocalDateTime.now());
            em.persist(paymentByMember5);

            // 취소 가능한 결제 내역
            Payment paymentByMember6 = Payment.createPayment("member6", "thicket9", "stage5");
            paymentByMember6.updateState(State.COMPLETED);
            paymentByMember6.updateHowReceive(HowReceive.DIRECTLY);
            paymentByMember6.updateMethod(Method.KAKAO);
            paymentByMember6.updateCancelDeadline(LocalDateTime.of(LocalDate.of(2024, 11, 25), LocalTime.MIDNIGHT));
            em.persist(paymentByMember6);

            // 취소 마감일 업데이트 테스트용 더미데이터
            Payment payment328 = Payment
                    .createPayment("member78", "thicket328", "stage30");
            payment328.updateState(State.COMPLETED);

            Payment payment329 = Payment
                    .createPayment("member1548", "thicket329", "stage30");
            payment329.updateState(State.COMPLETED);

            Payment payment330 = Payment
                    .createPayment("member7778", "thicket330", "stage30");
            payment330.updateState(State.COMPLETED);

            Payment payment331 = Payment
                    .createPayment("member156", "thicket331", "stage30");
            payment331.updateState(State.COMPLETED);

            Payment payment332 = Payment
                    .createPayment("member7845", "thicket332", "stage30");
            payment332.updateState(State.COMPLETED);

            em.persist(payment328);
            em.persist(payment329);
            em.persist(payment330);
            em.persist(payment331);
            em.persist(payment332);

            // Ticket 더미데이터 생성
            Ticket ticket1 = Ticket.createTicket(
                    "청소년극<#버킷리스트>",
                    "국립극단 소극장 판",
                    LocalDateTime.of(2023, 12, 26, 19, 30),
                    "VIP", 1, "홍길동", "987654321", 99000, LocalDateTime.now().plusDays(4),
                    UUID.fromString("00af095e-7334-4e93-a858-abf3aa5f1871"),
                    UUID.fromString("d45608e2-a8eb-4e78-a49c-9062763df011"), // 실제 회원 ID 넣어야 함
                    UUID.fromString("69a3da0c-6bf3-4d0c-b093-e594d31a2456"),
                    "PLAY"
            );

            Payment newPayment1 = Payment
                    .createPayment("member1", "thicket1", "stage1");
            em.persist(newPayment1);

            ticket1.setPayment(newPayment1);
            em.persist(ticket1);

            Ticket ticket2 = Ticket.createTicket(
                    "청소년극<#버킷리스트>",
                    "국립극단 소극장 판",
                    LocalDateTime.of(2023, 11, 23, 19, 30),
                    "VIP", 1, "홍길동", "987654321", 99000, LocalDateTime.now().plusDays(4),
                    UUID.fromString("00af095e-7334-4e93-a858-abf3aa5f1871"),
                    UUID.fromString("d45608e2-a8eb-4e78-a49c-9062763df011"), // 실제 회원 ID 넣어야 함
                    UUID.fromString("69a3da0c-6bf3-4d0c-b093-e594d31a2456"),
                    "PLAY"
            );

            Payment newPayment2 = Payment
                    .createPayment("member2", "thicket2", "stage2");
            newPayment2.updateState(State.COMPLETED);
            em.persist(newPayment2);

            ticket2.setPayment(newPayment2);
            em.persist(ticket2);


            Ticket ticket3 = Ticket.createTicket(
                    "청소년극<#버킷리스트>",
                    "국립극단 소극장 판",
                    LocalDateTime.of(2023, 11, 23, 19, 30),
                    "VIP", 1, "홍길동", "987654321", 99000, LocalDateTime.now().plusDays(4),
                    UUID.fromString("00af095e-7334-4e93-a858-abf3aa5f1871"),
                    UUID.fromString("d45608e2-a8eb-4e78-a49c-9062763df011"), // 실제 회원 ID 넣어야 함
                    UUID.fromString("69a3da0c-6bf3-4d0c-b093-e594d31a2456"),
                    "PLAY"
            );

            Payment newPayment3 = Payment
                    .createPayment("member3", "thicket3", "stage3");
            em.persist(newPayment3);

            ticket3.setPayment(newPayment3);
            em.persist(ticket3);

            Ticket ticket4 = Ticket.createTicket(
                    "청소년극<#버킷리스트>",
                    "국립극단 소극장 판",
                    LocalDateTime.of(2023, 12, 22, 19, 30),
                    "VIP", 1, "홍길동", "987654321", 99000, LocalDateTime.now().plusDays(4),
                    UUID.fromString("00af095e-7334-4e93-a858-abf3aa5f1871"),
                    UUID.fromString("d45608e2-a8eb-4e78-a49c-9062763df011"), // 실제 회원 ID 넣어야 함
                    UUID.fromString("69a3da0c-6bf3-4d0c-b093-e594d31a2456"),
                    "PLAY"
            );

            Payment newPayment4 = Payment
                    .createPayment("member4", "thicket4", "stage4");
            em.persist(newPayment4);

            ticket4.setPayment(newPayment4);
            em.persist(ticket4);

            Ticket ticket5 = Ticket.createTicket(
                    "청소년극<#버킷리스트>",
                    "국립극단 소극장 판",
                    LocalDateTime.of(2023, 12, 26, 19, 30),
                    "VIP", 1, "홍길동", "987654321", 99000, LocalDateTime.now().plusDays(4),
                    UUID.fromString("00af095e-7334-4e93-a858-abf3aa5f1871"),
                    UUID.fromString("d45608e2-a8eb-4e78-a49c-9062763df011"), // 실제 회원 ID 넣어야 함
                    UUID.fromString("69a3da0c-6bf3-4d0c-b093-e594d31a2456"),
                    "PLAY"
            );

            Payment newPayment5 = Payment
                    .createPayment("member5", "thicket5", "stage5");
            em.persist(newPayment5);

            ticket5.setPayment(newPayment5);
            em.persist(ticket5);

            em.flush();
            em.clear();
        }
    }
}
