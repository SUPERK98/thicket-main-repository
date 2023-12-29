package com.example.thicketstage.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.thicketstage.domain.Stage;
import com.example.thicketstage.dto.request.RequestCreateStageDto;
import com.example.thicketstage.dto.request.RequestUpdateInfoDto;
import com.example.thicketstage.dto.response.ResponseAdminStageDto;
import com.example.thicketstage.dto.response.ResponseStageDto;
import com.example.thicketstage.dto.response.ResponseStageThumbnailDto;
import com.example.thicketstage.enumerate.StageType;
import com.example.thicketstage.repository.StageRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class StageServiceImpl implements StageService{

    private final StageRepository stageRepository;
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Override
    @Transactional
    public String createStage(RequestCreateStageDto stageDto, UUID adminId) {
        Stage stage = stageDto.toEntity(adminId);
        log.info(stage.getDetailPosterImg());
        return stageRepository.save(stage).getId().toString();
    }

    @Override
    public List<String> uploadImage(List<MultipartFile> images) {
        if(images.isEmpty()) {
            throw new IllegalArgumentException("한 장 이상의 이미지를 등록해주세요.");
        }

        return images.stream().map(img -> {
            String imgId = UUID.randomUUID().toString();
            try {
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(img.getContentType());
                metadata.setContentLength(img.getSize());
                amazonS3Client.putObject(bucket, imgId, img.getInputStream(), metadata);
            } catch (IOException e) {
                throw new IllegalArgumentException("잘못된 이미지 입니다.");
            }
            return amazonS3Client.getUrl(bucket, imgId).toString();
        }).toList();
    }

    @Override
    public List<ResponseAdminStageDto> getAllStage(UUID adminId){
        List<Stage> all = stageRepository.findAllByAdminId(adminId);

        ArrayList<ResponseAdminStageDto> dtos = new ArrayList<>();
        for (Stage stage : all) {
            dtos.add(new ResponseAdminStageDto(stage));
        }

        if(dtos.isEmpty()) {
            throw new EntityNotFoundException("공연이 존재하지 않습니다.");
        }

        return dtos;
    }

    // 판매 중인 공연 모두 최신 순으로 => main
    @Override
    public Page<ResponseStageThumbnailDto> getOngoingList(Pageable pageable){
        LocalDateTime now = LocalDateTime.now();

        List<Stage> allStages = stageRepository.findAll();
        List<Stage> ongoingStages = allStages.stream()
                .filter(stage -> stage.getTicketOpen().isBefore(now)
                                    && stage.getStageClose().isAfter(now))
                .collect(Collectors.toList());

        if (ongoingStages.isEmpty()) {
            throw new EntityNotFoundException("현재 진행 중인 공연이 없습니다.");
        }

        return new PageImpl<>(ongoingStages, pageable, ongoingStages.size())
                                        .map(ResponseStageThumbnailDto::new);
    }

    // 판매 중인 공연 모두 최신순으로 => admin
    @Override
    public Page<ResponseAdminStageDto> getOngoingListAdmin(Pageable pageable, UUID adminId){
        LocalDateTime now = LocalDateTime.now();

        List<Stage> allStages = stageRepository.findAllByAdminId(adminId);
        List<Stage> ongoingStages = allStages.stream()
                .filter(stage -> stage.getStageOpen().isBefore(now)
                                    && stage.getStageClose().isAfter(now))
                .collect(Collectors.toList());

        if (ongoingStages.isEmpty()) {
            throw new EntityNotFoundException("현재 진행 중인 공연이 없습니다.");
        }

        return new PageImpl<>(ongoingStages, pageable, ongoingStages.size())
                                                       .map(ResponseAdminStageDto::new);
    }

    // 공연 하나 선택 했을 때 상세 페이지 조회 되게
    @Override
    public ResponseStageDto stageDetail(UUID id) {
        Optional<Stage> optionalStage = stageRepository.findById(id);

        if(optionalStage.isEmpty()){
            throw new EntityNotFoundException("해당 공연이 존재하지 않습니다");
        }
        Stage stage = optionalStage.get();

        return new ResponseStageDto(stage);
    }

    // StageType 별로 줄 세우기 - 진행 중인 공연 최신 등록 순으로 정렬
    @Override
    public Page<ResponseStageThumbnailDto> getStageTypeList(StageType stageType,
                                                             Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();

        List<Stage> stages = stageRepository.findByStageType(stageType);
        List<Stage> ongoingStages = stages.stream()
                .filter(stage -> stage.getTicketOpen().isBefore(now)
                                    && stage.getStageClose().isAfter(now))
                .toList();

        if(ongoingStages.isEmpty()){
            throw new EntityNotFoundException("현재 진행 중인 공연이 없습니다.");
        }

        return new PageImpl<>(ongoingStages, pageable, ongoingStages.size())
                                                         .map(ResponseStageThumbnailDto::new);
    }

    // ticketOpen시간 비교해서 이전인것만 - 커밍순 main /shows/before
    @Override
    public Page<ResponseStageThumbnailDto> getComingSoonList(Pageable pageable){

        List<Stage> allStages = stageRepository.findAll();
        List<Stage> comingSoonStages = allStages.stream()
                .filter(stage -> stage.getTicketOpen().isAfter(LocalDateTime.now()))
                .toList();

        if (comingSoonStages.isEmpty()) {
            throw new EntityNotFoundException("개막 예정인 공연이 없습니다.");
        }

        return new PageImpl<>(comingSoonStages, pageable, comingSoonStages.size())
                                             .map(ResponseStageThumbnailDto::new);
    }

    // ticketOpen시간 비교해서 이전인것만 => 관리자
    @Override
    public Page<ResponseAdminStageDto> getComingSoonListAdmin(Pageable pageable, UUID adminId){

        List<Stage> allStages = stageRepository.findAllByAdminId(adminId);
        List<Stage> comingSoonStages = allStages.stream()
                .filter(stage -> stage.getStageOpen().isAfter(LocalDateTime.now()))
                .toList();

        if (comingSoonStages.isEmpty()) {
            throw new EntityNotFoundException("개막 예정인 공연이 없습니다.");
        }

        return new PageImpl<>(comingSoonStages, pageable, comingSoonStages.size())
                                                            .map(ResponseAdminStageDto::new);
    }

    // stageClose보다 이후 - 관리자 page -> /shows/ended
    @Override
    public Page<ResponseAdminStageDto> getEndedList(Pageable pageable, UUID adminId){

        List<Stage> allStages = stageRepository.findAllByAdminId(adminId);
        List<Stage> endedStages = allStages.stream()
                .filter(stage -> stage.getStageClose().isBefore(LocalDateTime.now()))
                .toList();

        if (endedStages.isEmpty()) {
            throw new EntityNotFoundException("종료된 공연이 없습니다.");
        }

        return new PageImpl<>(endedStages, pageable, endedStages.size())
                                                        .map(ResponseAdminStageDto::new);
    }

    @Override
    public List<ResponseStageThumbnailDto> searchStage(String keyword) {
        List<Stage> searchResults = stageRepository.searchByNameOrPlace("%"+keyword+"%");

        ArrayList<ResponseStageThumbnailDto> stageInfoList = new ArrayList<>();

        for (Stage stage : searchResults) {
            ResponseStageThumbnailDto stageInfoDto = new ResponseStageThumbnailDto(stage);
            stageInfoList.add(stageInfoDto);
        }

        return stageInfoList;
    }

    @Override
    @Transactional
    public void updateInfo(UUID id, RequestUpdateInfoDto updateInfoDto) {

        Stage stage = stageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("공연을 찾을 수 없습니다."));
        stage.updateStageInfo(updateInfoDto);
    }

    @Override
    @Transactional
    public void deleteStage(UUID id) {
        Optional<Stage> optionalStage = stageRepository.findById(id);

        if(optionalStage.isEmpty()){
            throw new EntityNotFoundException("공연을 찾을 수 없습니다.");
        }
        Stage stage = optionalStage.get();
        stageRepository.delete(stage);
    }
}