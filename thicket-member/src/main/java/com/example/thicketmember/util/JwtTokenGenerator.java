package com.example.thicketmember.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@PropertySource("classpath:secretKey.properties")
public class JwtTokenGenerator {
    // JWT의 유효기간
    private final Integer accessTokenValidTime = 1000 * 60 * 60 * 24; // 하루

    // secretKey값을 디코딩한 결과를 저장하는 Key
    private Key key;

    public JwtTokenGenerator(@Value("${jwtSecret}") String secret) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public HttpHeaders createToken(String id, String role) {
        Claims claims = Jwts.claims();
        // 토큰이 될 claims의 Subject 영역에 memberId 등록
        claims.setSubject(id);
        // 토큰이 될 claims의 Audience 영역에 memberRole 등록
        claims.setAudience(role);
        // 유효기간 계산할 현재 시간 저장
        Date now = new Date();
        String accessToken = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)// 토큰 생성 시간
                .setExpiration(new Date(now.getTime() + accessTokenValidTime)) // 토큰 만료 기간
                .signWith(key) // 암호화 알고리즘과 SecretKey 세팅
                .compact();

        // 헤더에 전송
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.AUTHORIZATION,accessToken);

        return httpHeaders;
    }
}