package com.example.thicketbatch.enumerate;

import org.springframework.beans.factory.annotation.Value;

public enum Status {

    FAILED("FAILED"),// 예매 실패

    RESERVED("RESERVED"), // 예매 완료

    REQUESTED("REQUESTED"),

    PAYED("PAYED") //결제완료
    ;
    private final String value;

    public String getValue() {
        return value;
    }

    Status(String value) {
        this.value=value;
    }


}
