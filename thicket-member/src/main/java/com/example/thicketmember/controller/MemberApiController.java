package com.example.thicketmember.controller;

import com.example.thicketmember.dto.request.*;
import com.example.thicketmember.service.MemberService;
import com.sun.jdi.request.DuplicateRequestException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.webjars.NotFoundException;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberApiController {
    private final MemberService memberService;

    @GetMapping("health")
    public String health_check() {
        return "healthy~!!";
    }

    @PostMapping("join")
    public ResponseEntity<?> signup(@RequestBody RequestMemberSignupDto dto) {
        memberService.signup(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("{role}") //토큰 반환
    public ResponseEntity<?> signin(@RequestBody RequestMemberSigninDto dto) {

        HttpHeaders headers = memberService.signin(dto);
        return ResponseEntity.status(HttpStatus.PERMANENT_REDIRECT)
                .headers(headers).body("로그인 성공");
    }

    @GetMapping("logout")
    public ResponseEntity<?> logout(@RequestHeader("UUID") UUID uuid) {
        memberService.logout(uuid);
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }

    @GetMapping("master")
    public ResponseEntity<?> memberList() {
        return ResponseEntity.ok(memberService.findMembers());
    }

    @GetMapping
    public ResponseEntity<?> memberDetail(HttpServletRequest req) {
        return ResponseEntity.ok(memberService.findMember(req.getHeader("UUID")));
    }

    @PostMapping("master")
    public ResponseEntity<?> changeMemberRole(@RequestBody RequestChangeMemberRoleDto dto) {
        memberService.changeMemberRole(dto);
        return ResponseEntity.ok("권한 승급 성공");
    }

    @PatchMapping
    public ResponseEntity<?> changePassword(HttpServletRequest req,
                                            @RequestBody RequestChangePasswordDto dto) {
        memberService.changePassword(req.getHeader("UUID"),dto);
        return ResponseEntity.ok("비밀번호 변경 성공");
    }

    @DeleteMapping
    public ResponseEntity<?> withdraw(HttpServletRequest req, @RequestBody RequestWithdrawDto dto) {
        memberService.withdraw(req.getHeader("UUID"),dto);
        return ResponseEntity.ok("회원 탈퇴 성공");
    }

    @ExceptionHandler({IllegalArgumentException.class, NotFoundException.class})
    public ResponseEntity<?> exceptionHandler(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(DuplicateRequestException.class)
    public ResponseEntity<?> exceptionHandlerByDuplicateLogin(Exception e) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(e.getMessage());
    }
}
