package com.example.thicketstage.domain;

import com.example.thicketstage.TimeStamp;
import com.example.thicketstage.dto.request.RequestUpdateChairDto;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chair extends TimeStamp {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String chairType;

    @Column(nullable = false)
    private int count;

    @Column(nullable = false)
    private int availableCount;

    @Column(nullable = false)
    private int price;

    @ManyToOne(cascade = CascadeType.REMOVE)
    private StageStart stageStart;

    // 연관관계 메서드
    public void foreignKey(StageStart stageStart) {
        this.stageStart = stageStart;
        stageStart.getChair().add(this);
    }

    // 비즈니스 로직
    public static Chair createChair(String chairType,
                                    int count,
                                    int price,
                                    StageStart stageStart) {
        Chair chair = new Chair();

        chair.chairType = chairType;
        chair.count = count;
        chair.price = price;
        chair.availableCount = count;
        chair.foreignKey(stageStart);

        return chair;
    }

    // 좌석 정보 수정은 추후 고도화 구현시 구현 예정
    public void updateChair(RequestUpdateChairDto UpdateChairDto) {
        for (RequestUpdateChairDto.UpdateChairDto chairDto : UpdateChairDto.getUpdateChairDtos()) {
            this.chairType = chairDto.getChairType();
            this.count = chairDto.getCount();
            this.price = chairDto.getPrice();
            this.foreignKey(this.stageStart);
            this.stageStart.getChair().add(this);
        }
    }

    public void deleteChair() {
        if (stageStart != null) {
            stageStart.getChair().remove(this);
        }
    }
}
