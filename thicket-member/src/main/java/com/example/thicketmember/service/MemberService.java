package com.example.thicketmember.service;

import com.example.thicketmember.domain.Member;
import com.example.thicketmember.dto.request.*;
import com.example.thicketmember.dto.response.ResponseMemberDto;
import com.example.thicketmember.dto.response.ResponseMemberDtoForAdmin;
import org.springframework.http.HttpHeaders;

import java.util.List;
import java.util.UUID;

public interface MemberService {
    Member signup(RequestMemberSignupDto dto);
    HttpHeaders signin(RequestMemberSigninDto dto);
    void logout(UUID uuid);
    ResponseMemberDto findMember(String id);
    List<ResponseMemberDtoForAdmin> findMembers();
    void changePassword(String id, RequestChangePasswordDto dto);
    void withdraw(String id, RequestWithdrawDto dto);
    void changeMemberRole(RequestChangeMemberRoleDto dto);
}
