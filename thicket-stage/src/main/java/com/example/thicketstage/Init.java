package com.example.thicketstage;

import com.example.thicketstage.domain.Chair;
import com.example.thicketstage.domain.Stage;
import com.example.thicketstage.domain.StageStart;
import com.example.thicketstage.enumerate.StageType;
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
    public void init() {
        initService.init();
    }

    @Component
    @Transactional
    @RequiredArgsConstructor
    static class InitService {

        private final EntityManager em;

        public void init() {

            Stage stage1 = Stage.createStage(
                    "뮤지컬<마리퀴리>",
                    "홍익대 아트센터 대극장",
                    LocalDateTime.of(2023, 10, 25, 14, 0),
                    LocalDateTime.of(2023, 11, 25, 19, 30),
                    LocalDateTime.of(2024, 2, 7, 19, 30),
                    LocalDateTime.of(2024, 2, 6, 0, 0),
                    "180분",
                    "8세이상 관람가",
                    StageType.MUSICAL,
                    "https://thicket-image-storage.s3.ap-northeast-2.amazonaws.com/%EB%A7%88%EB%A6%AC%ED%80%B4%EB%A6%AC1.gif",
                    "https://thicket-image-storage.s3.ap-northeast-2.amazonaws.com/%EB%A7%88%EB%A6%AC%ED%80%B4%EB%A6%AC2.jpg&" +
                            "https://thicket-image-storage.s3.ap-northeast-2.amazonaws.com/%EB%A7%88%EB%A6%AC%ED%80%B4%EB%A6%AC3.jpg&" +
                            "https://thicket-image-storage.s3.ap-northeast-2.amazonaws.com/%EB%A7%88%EB%A6%AC%ED%80%B4%EB%A6%AC3.jpg",
                    "공연 상세 설명",
                    UUID.randomUUID()
            );
            em.persist(stage1);

            StageStart stageStart1 = initStageStart(stage1, LocalDate.of(2023, 12, 30),
                    LocalTime.of(14, 30));
            StageStart stageStart2 = initStageStart(stage1, LocalDate.of(2023, 12, 30),
                    LocalTime.of(19, 30));
            StageStart stageStart3 = initStageStart(stage1, LocalDate.of(2023, 12, 31),
                    LocalTime.of(14, 30));
            StageStart stageStart4 = initStageStart(stage1, LocalDate.of(2023, 12, 31),
                    LocalTime.of(19, 30));

            chairInit(stageStart1, "VIP", 100, 99000);
            chairInit(stageStart1, "R", 200, 88000);
            chairInit(stageStart1, "S", 300, 77000);
            chairInit(stageStart2, "VIP", 100, 99000);
            chairInit(stageStart2, "R", 200, 88000);
            chairInit(stageStart2, "S", 300, 77000);
            chairInit(stageStart3, "VIP", 100, 99000);
            chairInit(stageStart3, "R", 200, 88000);
            chairInit(stageStart3, "S", 300, 77000);
            chairInit(stageStart4, "VIP", 100, 99000);
            chairInit(stageStart4, "R", 200, 88000);
            chairInit(stageStart4, "S", 300, 77000);

            Stage stage2 = Stage.createStage(
                    "청소년극<#버킷리스트>",
                    "국립극단 소극장 판",
                    LocalDateTime.of(2023, 10, 25, 14, 0),
                    LocalDateTime.of(2023, 11, 25, 19, 30),
                    LocalDateTime.of(2024, 2, 7, 19, 30),
                    LocalDateTime.of(2024, 2, 6, 0, 0),
                    "100분",
                    "전체 관람가",
                    StageType.PLAY,
                    "https://thicket-image-storage.s3.ap-northeast-2.amazonaws.com/%EB%B2%84%ED%82%B7%EB%A6%AC%EC%8A%A4%ED%8A%B81.webp",
                    "https://thicket-image-storage.s3.ap-northeast-2.amazonaws.com/%EB%B2%84%ED%82%B7%EB%A6%AC%EC%8A%A4%ED%8A%B82.jpg&" +
                            "https://thicket-image-storage.s3.ap-northeast-2.amazonaws.com/%EB%B2%84%ED%82%B7%EB%A6%AC%EC%8A%A4%ED%8A%B83.jpg",
                    "공연 상세 설명",
                    UUID.randomUUID()
            );
            em.persist(stage2);

            StageStart stageStart5 = initStageStart(stage2, LocalDate.of(2023, 12, 29),
                    LocalTime.of(19, 30));
            StageStart stageStart6 = initStageStart(stage2, LocalDate.of(2023, 12, 30),
                    LocalTime.of(19, 30));
            StageStart stageStart7 = initStageStart(stage2, LocalDate.of(2023, 12, 31),
                    LocalTime.of(19, 30));

            chairInit(stageStart5, "VIP", 200, 99000);
            chairInit(stageStart5, "R", 200, 88000);
            chairInit(stageStart6, "VIP", 200, 99000);
            chairInit(stageStart6, "R", 200, 88000);
            chairInit(stageStart7, "VIP", 200, 99000);
            chairInit(stageStart7, "R", 200, 88000);

            Stage stage3 = Stage.createStage(
                    "하현상 콘서트<With All My Heart>",
                    "올림픽공원 올림픽홀",
                    LocalDateTime.of(2023, 12, 29, 14, 30),
                    LocalDateTime.of(2024, 1, 13, 18, 0),
                    LocalDateTime.of(2024, 1, 14, 17, 0),
                    LocalDateTime.of(2024, 1, 13, 14, 0),
                    "100분",
                    "만 7세이상",
                    StageType.CONCERT,
                    "https://thicket-image-storage.s3.ap-northeast-2.amazonaws.com/%ED%95%98%ED%98%84%EC%83%81+%EC%BD%98%EC%84%9C%ED%8A%B8+1.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23018077-06.jpg",
                    "[ 추가 좌석 오픈 안내 ] \n" +
                            "2024 하현상 콘서트 〈With All My Heart〉에 보내주시는 많은 관심과 사랑에 감사드리며, 더 많은 관객 분들과 함께 시간을 나누고자 최초 티켓 오픈 시 판매를 진행하지 않았던 좌석의 추가 오픈을 진행합니다",
                    UUID.randomUUID()
            );
            em.persist(stage3);

            StageStart stageStart8 = initStageStart(stage3, LocalDate.of(2024, 1, 13),
                    LocalTime.of(18, 0));
            StageStart stageStart9 = initStageStart(stage3, LocalDate.of(2024, 1, 14),
                    LocalTime.of(17, 0));
            chairInit(stageStart8, "R", 2500, 143000);
            chairInit(stageStart8, "S", 500, 132000);
            chairInit(stageStart9, "R", 2500, 143000);
            chairInit(stageStart9, "S", 500, 132000);


            Stage stage4 = Stage.createStage(
                    "뮤지컬 〈스토리오브마이라이프〉",
                    "두산아트센터 연강홀",
                    LocalDateTime.of(2023,11,1,14,0),
                    LocalDateTime.of(2023, 11, 30, 19, 30),
                    LocalDateTime.of(2024, 2, 18, 19, 30),
                    LocalDateTime.of(2024, 2, 17, 0, 0),
                    "100분",
                    "8세 이상 관람가능",
                    StageType.MUSICAL,
                    "https://ticketimage.interpark.com/Play/image/large/23/23013668_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23013668-01.jpg",
                    "※ 1/19(금) 7시 30분, 1/20(토) 2시, 1/20(토) 6시 공연은 전관으로 사전 마감되었습니다.\n" +
                            "※ 극장, 공연제작사 및 관계사의 협의에 따라 일부 좌석이 마감되었습니다.",
                    UUID.randomUUID()
            );
            em.persist(stage4);

            StageStart stageStart10 = initStageStart(stage4, LocalDate.of(2023, 12, 29),
                    LocalTime.of(19, 30));
            StageStart stageStart11 = initStageStart(stage4, LocalDate.of(2023, 12, 30),
                    LocalTime.of(14, 30));
            StageStart stageStart12 = initStageStart(stage4, LocalDate.of(2023, 12, 30),
                    LocalTime.of(19, 30));
            StageStart stageStart13 = initStageStart(stage4, LocalDate.of(2023, 12, 31),
                    LocalTime.of(14, 30));
            StageStart stageStart14 = initStageStart(stage4, LocalDate.of(2023, 12, 31),
                    LocalTime.of(19, 30));
            StageStart stageStart15 = initStageStart(stage4, LocalDate.of(2024, 1, 1),
                    LocalTime.of(19, 30));

            chairInit(stageStart10, "R", 200, 77000);
            chairInit(stageStart10, "S", 200, 55000);
            chairInit(stageStart11, "R", 200, 77000);
            chairInit(stageStart11, "S", 200, 55000);
            chairInit(stageStart12, "R", 200, 77000);
            chairInit(stageStart12, "S", 200, 55000);
            chairInit(stageStart13, "R", 200, 77000);
            chairInit(stageStart13, "S", 200, 55000);
            chairInit(stageStart14, "R", 200, 77000);
            chairInit(stageStart14, "S", 200, 55000);
            chairInit(stageStart15, "R", 200, 77000);
            chairInit(stageStart15, "S", 200, 55000);

            Stage stage5 = Stage.createStage(
                    "뮤지컬 〈라스트 파이브 이어스〉",
                    "세종문화회관 S씨어터",
                    LocalDateTime.of(2023,12,29,14,30),
                    LocalDateTime.of(2024, 1, 17, 19, 30),
                    LocalDateTime.of(2024, 4, 7, 19, 30),
                    LocalDateTime.of(2024, 4, 6, 0, 0),
                    "100분",
                    "14세 이상 관람가",
                    StageType.MUSICAL,
                    "https://ticketimage.interpark.com/Play/image/large/23/23017574_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23017574-03.jpg",
                    "* 휠체어(보행 보조의료기 포함) 이용자 및 장애인 단체 예매는 공연장 객석 구조에 따른 안내와 상담을 위해서\n" +
                            "반드시 세종문화회관 (02-399-1000)로 사전 문의 바랍니다.",
                    UUID.randomUUID()
            );
            em.persist(stage5);

            StageStart stageStart16 = initStageStart(stage5, LocalDate.of(2024, 1, 17),
                    LocalTime.of(19, 30));
            StageStart stageStart17 = initStageStart(stage5, LocalDate.of(2024, 1, 18),
                    LocalTime.of(14, 30));
            StageStart stageStart18 = initStageStart(stage5, LocalDate.of(2024, 1, 18),
                    LocalTime.of(19, 30));
            StageStart stageStart19 = initStageStart(stage5, LocalDate.of(2024, 1, 19),
                    LocalTime.of(14, 30));
            StageStart stageStart20 = initStageStart(stage5, LocalDate.of(2024, 1, 19),
                    LocalTime.of(19, 30));
            StageStart stageStart21 = initStageStart(stage5, LocalDate.of(2024, 1, 20),
                    LocalTime.of(19, 30));

            chairInit(stageStart16, "R", 200, 80000);
            chairInit(stageStart16, "S", 200, 70000);
            chairInit(stageStart16, "A", 200, 60000);
            chairInit(stageStart17, "R", 200, 80000);
            chairInit(stageStart17, "S", 200, 70000);
            chairInit(stageStart17, "A", 200, 60000);
            chairInit(stageStart18, "R", 200, 80000);
            chairInit(stageStart18, "S", 200, 70000);
            chairInit(stageStart18, "A", 200, 60000);
            chairInit(stageStart19, "R", 200, 80000);
            chairInit(stageStart19, "S", 200, 70000);
            chairInit(stageStart19, "A", 200, 60000);
            chairInit(stageStart20, "R", 200, 80000);
            chairInit(stageStart20, "S", 200, 70000);
            chairInit(stageStart20, "A", 200, 60000);
            chairInit(stageStart21, "R", 200, 80000);
            chairInit(stageStart21, "S", 200, 70000);
            chairInit(stageStart21, "A", 200, 60000);

            Stage stage6 = Stage.createStage(
                    "연극 〈작은 아씨들〉",
                    "드림아트센터 2관",
                    LocalDateTime.of(2023,11,1,14,0),
                    LocalDateTime.of(2023, 11, 19, 19, 30),
                    LocalDateTime.of(2024, 1, 14, 19, 30),
                    LocalDateTime.of(2024, 1, 13, 0, 0),
                    "110분",
                    "초등학생이상 관람가",
                    StageType.PLAY,
                    "https://ticketimage.interpark.com/Play/image/large/23/23014931_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23014931-10.jpg",
                    "화~금 20:00 / 토 15:00, 19:00 / 일,공휴일 14:00, 18:00 (월 쉼)\n" +
                            "* 12/26(화) 공연없음, 1/2(화) 공연없음",
                    UUID.randomUUID()
            );
            em.persist(stage6);

            StageStart stageStart22 = initStageStart(stage6, LocalDate.of(2023, 12, 29),
                    LocalTime.of(19, 30));
            StageStart stageStart23 = initStageStart(stage6, LocalDate.of(2023, 12, 30),
                    LocalTime.of(14, 30));
            StageStart stageStart24 = initStageStart(stage6, LocalDate.of(2023, 12, 30),
                    LocalTime.of(19, 30));
            StageStart stageStart25 = initStageStart(stage6, LocalDate.of(2023, 12, 31),
                    LocalTime.of(14, 30));
            StageStart stageStart26 = initStageStart(stage6, LocalDate.of(2023, 12, 31),
                    LocalTime.of(19, 30));
            StageStart stageStart27 = initStageStart(stage6, LocalDate.of(2024, 1, 1),
                    LocalTime.of(19, 30));

            chairInit(stageStart22, "R", 200, 66000);
            chairInit(stageStart22, "S", 200, 55000);
            chairInit(stageStart23, "R", 200, 66000);
            chairInit(stageStart23, "S", 200, 55000);
            chairInit(stageStart24, "R", 200, 66000);
            chairInit(stageStart24, "S", 200, 55000);
            chairInit(stageStart25, "R", 200, 66000);
            chairInit(stageStart25, "S", 200, 55000);
            chairInit(stageStart26, "R", 200, 66000);
            chairInit(stageStart26, "S", 200, 55000);
            chairInit(stageStart27, "R", 200, 66000);
            chairInit(stageStart27, "S", 200, 55000);

            Stage stage7 = Stage.createStage(
                    "연극 〈템플〉",
                    "서경대학교 공연예술센터 스콘1관",
                    LocalDateTime.of(2023,11, 15,14,0),
                    LocalDateTime.of(2023, 12, 15, 19, 30),
                    LocalDateTime.of(2024, 2, 18, 19, 30),
                    LocalDateTime.of(2024, 2, 17, 0, 0),
                    "95분",
                    "만 12세이상",
                    StageType.PLAY,
                    "https://ticketimage.interpark.com/Play/image/large/23/23016360_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23016360-07.jpg",
                    "평일 8시 / 토 3시, 6시 30분 / 일, 공휴일 2시, 5시 30분 / 월 쉼 (*단, 12/25(월), 1/1(월) 2시, 5시 30분 | 12/26(화) 쉼)\n",
                    UUID.randomUUID()
            );
            em.persist(stage7);

            StageStart stageStart28 = initStageStart(stage7, LocalDate.of(2023, 12, 29),
                    LocalTime.of(19, 30));
            StageStart stageStart29 = initStageStart(stage7, LocalDate.of(2023, 12, 30),
                    LocalTime.of(14, 30));
            StageStart stageStart30 = initStageStart(stage7, LocalDate.of(2023, 12, 30),
                    LocalTime.of(19, 30));
            StageStart stageStart31 = initStageStart(stage7, LocalDate.of(2023, 12, 31),
                    LocalTime.of(14, 30));
            StageStart stageStart32 = initStageStart(stage7, LocalDate.of(2023, 12, 31),
                    LocalTime.of(19, 30));
            StageStart stageStart33 = initStageStart(stage7, LocalDate.of(2024, 1, 1),
                    LocalTime.of(19, 30));

            chairInit(stageStart28, "R", 200, 66000);
            chairInit(stageStart28, "S", 200, 55000);
            chairInit(stageStart29, "R", 200, 66000);
            chairInit(stageStart29, "S", 200, 55000);
            chairInit(stageStart30, "R", 200, 66000);
            chairInit(stageStart30, "S", 200, 55000);
            chairInit(stageStart31, "R", 200, 66000);
            chairInit(stageStart31, "S", 200, 55000);
            chairInit(stageStart32, "R", 200, 66000);
            chairInit(stageStart32, "S", 200, 55000);
            chairInit(stageStart33, "R", 200, 66000);
            chairInit(stageStart33, "S", 200, 55000);

            Stage stage8 = Stage.createStage(
                    "피지컬 시어터 〈네이처 오브 포겟팅〉",
                    "대학로 아트원씨어터 2관",
                    LocalDateTime.of(2024,1, 1,14,0),
                    LocalDateTime.of(2024, 1, 28, 19, 30),
                    LocalDateTime.of(2024, 4, 18, 19, 30),
                    LocalDateTime.of(2024, 4, 17, 0, 0),
                    "70분",
                    "만 8세이상",
                    StageType.PLAY,
                    "https://ticketimage.interpark.com/Play/image/large/23/23015267_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23015267-05.jpg",
                    "화·수·금 8시 / 목 4시, 8시 30분 / 토 3시, 7시 30분 / 일·공휴일 3시 (월 공연 없음)",
                    UUID.randomUUID()
            );
            em.persist(stage8);

            StageStart stageStart34 = initStageStart(stage8, LocalDate.of(2024, 1, 28),
                    LocalTime.of(19, 30));
            StageStart stageStart35 = initStageStart(stage8, LocalDate.of(2024, 1, 29),
                    LocalTime.of(14, 30));
            StageStart stageStart36 = initStageStart(stage8, LocalDate.of(2024, 1, 29),
                    LocalTime.of(19, 30));
            StageStart stageStart37 = initStageStart(stage8, LocalDate.of(2024, 1, 30),
                    LocalTime.of(14, 30));
            StageStart stageStart38 = initStageStart(stage8, LocalDate.of(2024, 1, 30),
                    LocalTime.of(19, 30));
            StageStart stageStart39 = initStageStart(stage8, LocalDate.of(2024, 1, 31),
                    LocalTime.of(19, 30));

            chairInit(stageStart34, "R", 200, 60000);
            chairInit(stageStart34, "S", 200, 45000);
            chairInit(stageStart35, "R", 200, 60000);
            chairInit(stageStart35, "S", 200, 45000);
            chairInit(stageStart36, "R", 200, 60000);
            chairInit(stageStart36, "S", 200, 45000);
            chairInit(stageStart37, "R", 200, 60000);
            chairInit(stageStart37, "S", 200, 45000);
            chairInit(stageStart38, "R", 200, 60000);
            chairInit(stageStart38, "S", 200, 45000);
            chairInit(stageStart39, "R", 200, 60000);
            chairInit(stageStart39, "S", 200, 45000);

            Stage stage9 = Stage.createStage(
                    "2024 윤하 20주년 기념 콘서트 〈스물〉",
                    "KSPO DOME(올림픽공원 체조경기장)",
                    LocalDateTime.of(2024,1, 3,14,0),
                    LocalDateTime.of(2024, 2, 3, 19, 30),
                    LocalDateTime.of(2024, 2, 4, 19, 30),
                    LocalDateTime.of(2024, 2, 4, 14, 0),
                    "120분",
                    "만 7세이상",
                    StageType.CONCERT,
                    "https://ticketimage.interpark.com/Play/image/large/23/23018640_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23018640-03.jpg",
                    "",
                    UUID.randomUUID()
            );
            em.persist(stage9);

            StageStart stageStart40 = initStageStart(stage9, LocalDate.of(2024, 2, 3),
                    LocalTime.of(17, 30));
            StageStart stageStart41 = initStageStart(stage9, LocalDate.of(2024, 2, 4),
                    LocalTime.of(14, 30));
            StageStart stageStart42 = initStageStart(stage9, LocalDate.of(2024, 2, 4),
                    LocalTime.of(19, 30));

            chairInit(stageStart40, "R", 200, 154000);
            chairInit(stageStart40, "S", 200, 143000);
            chairInit(stageStart40, "A", 200, 132000);
            chairInit(stageStart40, "B", 200, 121000);
            chairInit(stageStart40, "C", 200, 110000);
            chairInit(stageStart41, "R", 200, 154000);
            chairInit(stageStart41, "S", 200, 143000);
            chairInit(stageStart41, "A", 200, 132000);
            chairInit(stageStart41, "B", 200, 121000);
            chairInit(stageStart41, "C", 200, 110000);
            chairInit(stageStart42, "R", 200, 154000);
            chairInit(stageStart42, "S", 200, 143000);
            chairInit(stageStart42, "A", 200, 132000);
            chairInit(stageStart42, "B", 200, 121000);
            chairInit(stageStart42, "C", 200, 110000);

            Stage stage10 = Stage.createStage(
                    "2024 김필 앵콜 콘서트 〈LIFE〉",
                    "올림픽공원 우리금융아트홀",
                    LocalDateTime.of(2023,12, 20,14,0),
                    LocalDateTime.of(2024, 1, 13, 19, 30),
                    LocalDateTime.of(2024, 1, 14, 19, 30),
                    LocalDateTime.of(2024, 1, 14, 14, 0),
                    "120분",
                    "8세이상 관람가능",
                    StageType.CONCERT,
                    "https://ticketimage.interpark.com/Play/image/large/23/23018569_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23018569-02.jpg",
                    "2024년 1월 13일(토) 18시 / 1월 14일(일) 17시",
                    UUID.randomUUID()
            );
            em.persist(stage10);

            StageStart stageStart43 = initStageStart(stage10, LocalDate.of(2024, 1, 13),
                    LocalTime.of(18, 0));
            StageStart stageStart44 = initStageStart(stage10, LocalDate.of(2024, 1, 14),
                    LocalTime.of(17, 0));

            chairInit(stageStart43, "전", 200, 132000);
            chairInit(stageStart44, "전", 200, 132000);

            Stage stage11 = Stage.createStage(
                    "뮤지컬 〈렌트〉",
                    "coex 신한카드 artium",
                    LocalDateTime.of(2024,1, 2,14,0),
                    LocalDateTime.of(2024, 1, 11, 19, 30),
                    LocalDateTime.of(2024, 4, 25, 19, 30),
                    LocalDateTime.of(2024, 4, 25, 14, 0),
                    "160분 (인터미션 20분 포함)",
                    "14세 이상 관람가",
                    StageType.MUSICAL,
                    "https://ticketimage.interpark.com/Play/image/large/23/23013171_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23013171-05.jpg",
                    "- 설연휴기간 : 2/9(금) 2시, 7시 2회, 2/10(토) 7시 1회, 2/11(일) 2시, 7시 2회, 2/12(월) 2시 1회\n" +
                            "                   2/13(화) 공연 없음\n" +
                            "\n" +
                            "* 극장, 공연제작사 및 관계사의 협의에 따라 일부 좌석이 마감되었습니다.",
                    UUID.randomUUID()
            );
            em.persist(stage11);

            StageStart stageStart45 = initStageStart(stage11, LocalDate.of(2024, 1, 11),
                    LocalTime.of(19, 30));
            StageStart stageStart46 = initStageStart(stage11, LocalDate.of(2024, 1, 12),
                    LocalTime.of(14, 30));
            StageStart stageStart47 = initStageStart(stage11, LocalDate.of(2024, 1, 12),
                    LocalTime.of(19, 30));
            StageStart stageStart48 = initStageStart(stage11, LocalDate.of(2024, 1, 13),
                    LocalTime.of(14, 30));
            StageStart stageStart49 = initStageStart(stage11, LocalDate.of(2024, 1, 14),
                    LocalTime.of(19, 30));
            StageStart stageStart50 = initStageStart(stage11, LocalDate.of(2024, 1, 16),
                    LocalTime.of(19, 30));

            chairInit(stageStart45, "VIP", 200, 140000);
            chairInit(stageStart45, "OP", 200, 130000);
            chairInit(stageStart45, "R", 200, 110000);
            chairInit(stageStart45, "S", 200, 90000);
            chairInit(stageStart45, "A", 200, 70000);

            chairInit(stageStart46, "VIP", 200, 140000);
            chairInit(stageStart46, "OP", 200, 130000);
            chairInit(stageStart46, "R", 200, 110000);
            chairInit(stageStart46, "S", 200, 90000);
            chairInit(stageStart46, "A", 200, 70000);
            chairInit(stageStart47, "VIP", 200, 140000);
            chairInit(stageStart47, "OP", 200, 130000);
            chairInit(stageStart47, "R", 200, 110000);
            chairInit(stageStart47, "S", 200, 90000);
            chairInit(stageStart47, "A", 200, 70000);
            chairInit(stageStart48, "VIP", 200, 140000);
            chairInit(stageStart48, "OP", 200, 130000);
            chairInit(stageStart48, "R", 200, 110000);
            chairInit(stageStart48, "S", 200, 90000);
            chairInit(stageStart48, "A", 200, 70000);
            chairInit(stageStart49, "VIP", 200, 140000);
            chairInit(stageStart49, "OP", 200, 130000);
            chairInit(stageStart49, "R", 200, 110000);
            chairInit(stageStart49, "S", 200, 90000);
            chairInit(stageStart49, "A", 200, 70000);
            chairInit(stageStart50, "VIP", 200, 140000);
            chairInit(stageStart50, "OP", 200, 130000);
            chairInit(stageStart50, "R", 200, 110000);
            chairInit(stageStart50, "S", 200, 90000);
            chairInit(stageStart50, "A", 200, 70000);

            Stage stage12 = Stage.createStage(
                    "2024 이무진 전국투어 콘서트 ［별책부록］ - 안양",
                    "안양아트센터 관악홀",
                    LocalDateTime.of(2023,11, 2,14,0),
                    LocalDateTime.of(2023, 12, 7, 19, 30),
                    LocalDateTime.of(2023, 12, 8, 19, 30),
                    LocalDateTime.of(2023, 12, 8, 14, 0),
                    "120분",
                    "만 7세이상",
                    StageType.CONCERT,
                    "https://ticketimage.interpark.com/Play/image/large/23/23016026_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23016026-01.jpg",
                    "* 휠체어석 예매는 공연기획사 전화예매를 통해서만 가능하며, 동반인도 티켓을 구매하셔야 합니다. (1522-2274 / 현장수령)\n" +
                            "* 관람 당일 매표소에서 할인과 관련된 증빙자료를 제시해 주셔야 하며 미지참시 정가대비 차액을 지불하셔야 합니다.\n" +
                            "* 티켓수령 시 할인대상 본인이 오셔야 합니다. (대리수령, 양도 불가)\n" +
                            "* 현장에서는 할인율 변경이 불가하오니 사전예매 시 유의해 주시기 바랍니다",
                    UUID.randomUUID()
            );
            em.persist(stage12);

            StageStart stageStart51 = initStageStart(stage12, LocalDate.of(2023, 12, 7),
                    LocalTime.of(19, 30));
            StageStart stageStart52 = initStageStart(stage12, LocalDate.of(2023, 12, 8),
                    LocalTime.of(19, 30));

            chairInit(stageStart51, "R", 200, 132000);
            chairInit(stageStart51, "S", 200, 110000);
            chairInit(stageStart52, "R", 200, 132000);
            chairInit(stageStart52, "S", 200, 110000);

            Stage stage13 = Stage.createStage(
                    "오월오일 전국 클럽투어 ‘Campo de Seoul’ (첫 주)",
                    "웨스트브릿지 라이브홀",
                    LocalDateTime.of(2024,12, 2,14,0),
                    LocalDateTime.of(2024, 1, 7, 19, 30),
                    LocalDateTime.of(2024, 1, 8, 19, 30),
                    LocalDateTime.of(2024, 1, 8, 14, 0),
                    "100분",
                    "만 7세이상",
                    StageType.CONCERT,
                    "https://ticketimage.interpark.com/Play/image/large/23/23018560_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23018560-02.jpg",
                    "- 본 공연은 전석 스탠딩으로 예매 시 선택한 입장 번호 순으로 입장하실 수 있습니다. 빠른 번호를 예매하실수록 먼저 입장하실 수 있습니다.",
                    UUID.randomUUID()
            );
            em.persist(stage13);

            StageStart stageStart53 = initStageStart(stage13, LocalDate.of(2024, 1, 7),
                    LocalTime.of(19, 30));
            StageStart stageStart54 = initStageStart(stage13, LocalDate.of(2024, 1, 8),
                    LocalTime.of(19, 30));

            chairInit(stageStart53, "스탠딩", 200, 66000);
            chairInit(stageStart54, "스탠딩", 200, 66000);

            Stage stage14 = Stage.createStage(
                    "뮤지컬 〈홀연했던 사나이〉",
                    "대학로 TOM(티오엠) 1관",
                    LocalDateTime.of(2023,11, 2,14,0),
                    LocalDateTime.of(2023, 12, 5, 19, 30),
                    LocalDateTime.of(2024, 2, 25, 19, 30),
                    LocalDateTime.of(2024, 2, 24, 14, 0),
                    "110분",
                    "8세이상 관람가능",
                    StageType.MUSICAL,
                    "https://ticketimage.interpark.com/Play/image/large/23/23015283_p.gif",
                    "https://ticketimage.interpark.com/Play/image/etc/23/23015283-06.jpg",
                    "* 12/07(목), 01/18(목) 마티네 없음, 12/25(월) 2시, 6시 공연",
                    UUID.randomUUID()
            );
            em.persist(stage14);

            StageStart stageStart55 = initStageStart(stage14, LocalDate.of(2023, 12, 29),
                    LocalTime.of(19, 30));
            StageStart stageStart56 = initStageStart(stage14, LocalDate.of(2023, 12, 30),
                    LocalTime.of(14, 30));
            StageStart stageStart57 = initStageStart(stage14, LocalDate.of(2023, 12, 30),
                    LocalTime.of(19, 30));
            StageStart stageStart58 = initStageStart(stage14, LocalDate.of(2023, 12, 31),
                    LocalTime.of(14, 30));
            StageStart stageStart59 = initStageStart(stage14, LocalDate.of(2024, 1, 1),
                    LocalTime.of(19, 30));
            StageStart stageStart60 = initStageStart(stage14, LocalDate.of(2024, 1, 3),
                    LocalTime.of(19, 30));

            chairInit(stageStart55, "R", 200, 70000);
            chairInit(stageStart55, "S", 200, 50000);
            chairInit(stageStart56, "R", 200, 70000);
            chairInit(stageStart56, "S", 200, 50000);
            chairInit(stageStart57, "R", 200, 70000);
            chairInit(stageStart57, "S", 200, 50000);
            chairInit(stageStart58, "R", 200, 70000);
            chairInit(stageStart58, "S", 200, 50000);
            chairInit(stageStart59, "R", 200, 70000);
            chairInit(stageStart59, "S", 200, 50000);
            chairInit(stageStart60, "R", 200, 70000);
            chairInit(stageStart60, "S", 200, 50000);


        }

        private StageStart initStageStart(Stage stage, LocalDate date, LocalTime time) {
            StageStart stageStart = StageStart.createStageStart(date, time, stage);
            em.persist(stageStart);
            return stageStart;
        }

        public void chairInit(StageStart stageStart, String chairType, int count, int price) {
            Chair chair = Chair.createChair(chairType, count, price, stageStart);
            em.persist(chair);
        }
    }
}