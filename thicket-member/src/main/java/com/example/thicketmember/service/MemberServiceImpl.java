package com.example.thicketmember.service;

import com.example.thicketmember.domain.Member;
import com.example.thicketmember.dto.request.*;
import com.example.thicketmember.dto.response.ResponseMemberDto;
import com.example.thicketmember.dto.response.ResponseMemberDtoForAdmin;
import com.example.thicketmember.enumerate.MemberRole;
import com.example.thicketmember.enumerate.MemberStatus;
import com.example.thicketmember.repository.MemberRepository;
import com.example.thicketmember.util.JwtTokenGenerator;
import com.sun.jdi.request.DuplicateRequestException;
import jakarta.ws.rs.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.webjars.NotFoundException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MemberServiceImpl implements MemberService{
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenGenerator tokenGenerator;
    private final List<UUID> loginSession = new CopyOnWriteArrayList<>();

    public Member signup(RequestMemberSignupDto dto) {
        // 이미 가입한 계정이 있으면 해당 계정이 리턴됨
        // 첫 가입이면 새 계정이 리턴됨

        Optional<Member> findMember = memberRepository.findByEmail(dto.getEmail());

        // 해당 이메일로 가입된 계정이 이미 있다면
        // 계정 상태를 검사하고 ACTIVE상태면 익셉션
        if (findMember.isPresent()) {
            Member member = findMember.get();
            if(member.getStatus().equals(MemberStatus.ACTIVE)){
                throw new IllegalArgumentException("이미 가입된 회원입니다.");
            }
            // 상태가 INACTIVE라면 ACTIVE로 바꿔서 재가입 처리
            member.changeStatus(MemberStatus.ACTIVE);
            return member;
        }
        // dto의 이메일로 가입된 계정이 없다면 신규 가입 처리
        return memberRepository.save(Member.createMember(dto.getName(),
                dto.getBirthdate(), dto.getEmail(), passwordEncoder.encode(dto.getPassword()),
                dto.getPhoneNumber(), MemberRole.ROLE_USER));
    }

    @Override
    public HttpHeaders signin(RequestMemberSigninDto dto) {
        Member member = memberRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new NotFoundException("계정 정보를 확인해주세요."));
        UUID id = member.getId();


        if (!passwordEncoder.matches(dto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("계정 정보를 확인해주세요.");
        }
        
        if (member.getStatus().equals(MemberStatus.INACTIVE)) {
            throw new NotFoundException("계정 정보를 확인해주세요.");
        }
        
        if (loginSession.contains(id)) {
            log.info("중복 로그인 발생!");
            throw new DuplicateRequestException(String.valueOf(id));
        }
        // 중복 로그인 방지 세션에 추가
        loginSession.add(id);

        return tokenGenerator.createToken(String.valueOf(id),
                String.valueOf(member.getMemberRole()));
    }

    public void logout(UUID uuid){
            loginSession.remove(uuid);
    }

    @Override
    @Transactional(readOnly = true)
    // 이 메서드에 접근된 요청은 회원정보가 디비에 무조건 있으므로 유효성 검증 제외
    public ResponseMemberDto findMember(String id) {
        return ResponseMemberDto
                .toDto(memberRepository.findMemberById(UUID.fromString(id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResponseMemberDtoForAdmin> findMembers() {

        List<Member> members = memberRepository.findAllByMemberRole(MemberRole.ROLE_USER);
        if (members.isEmpty()) {
            throw new NotFoundException("회원 정보가 없습니다.");
        }
        return members.stream()
                .map(ResponseMemberDtoForAdmin::toDto).toList();
    }

    @Override
    // 이 메서드에 접근된 요청은 회원정보가 디비에 무조건 있으므로 유효성 검증 제외
    public void changePassword(String id, RequestChangePasswordDto dto) {
        Member findMember = memberRepository.findMemberById(UUID.fromString(id));

        // 서로 다를때 예외 발생이므로 부정 연산(!) O
        if (!passwordEncoder.matches(dto.getCurrentPassword(), findMember.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 서로 같을때 예외 발생이므로 부정 연산(!) X
        if (passwordEncoder.matches(dto.getNewPassword(),findMember.getPassword())) {
            throw new IllegalArgumentException("이전 비밀번호와 다른 비밀번호를 입력해 주세요.");
        }

        findMember.changePassword(passwordEncoder.encode(dto.getNewPassword()));
    }

    @Override
    // 이 메서드에 접근된 요청은 회원정보가 디비에 무조건 있으므로 유효성 검증 제외
    public void withdraw(String id, RequestWithdrawDto dto) {
        Member findMember = memberRepository.findMemberById(UUID.fromString(id));

        if (!passwordEncoder.matches(dto.getPassword(), findMember.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        findMember.changeStatus(MemberStatus.INACTIVE);
    }

    @Override
    public void changeMemberRole(RequestChangeMemberRoleDto dto) {
        Member findMember = memberRepository.findMemberById(dto.getId());
        findMember.changeAdmin(dto.getBusinessCode());
    }
}
