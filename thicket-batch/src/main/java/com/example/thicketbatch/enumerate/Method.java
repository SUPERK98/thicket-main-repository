package com.example.thicketbatch.enumerate;

public enum Method {
    WAIT, // 결제 대기중
    KAKAO, // 카카오 페이로 결제
    DEPOSIT, // 무통장 입금으로 결제
    CREDIT, // 신용카드로 결제
    MOBILE, // 모바일 통신사 결제
    CANCEL // 결제 취소
}
