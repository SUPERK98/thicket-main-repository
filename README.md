<div align="center">

<img src="https://img.shields.io/badge/THICKET-FF4136?style=for-the-badge&logoColor=white" alt="Thicket"/>

# 🎫 Thicket — 공정한 콘서트 티켓 예매 시스템

> **네트워크 지연을 보정해 모든 사용자에게 공정한 예매 순서를 보장하는 MSA 기반 티켓 예매 플랫폼**

<br/>

[한국어](#) · [日本語](./README_ja.md) · [English](./README_en.md)

<br/>

![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-6DB33F?style=flat-square&logo=spring&logoColor=white)
![Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=flat-square&logo=mariadb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![AWS](https://img.shields.io/badge/AWS_EC2/S3-FF9900?style=flat-square&logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

---

## 📌 목차

1. [프로젝트 소개](#-프로젝트-소개)
2. [핵심 문제 & 해결 전략](#-핵심-문제--해결-전략)
3. [CTS 알고리즘](#-cts-알고리즘--클라이언트-시간-보정)
4. [시스템 아키텍처](#-시스템-아키텍처)
5. [Kafka 파이프라인](#-kafka-예매-파이프라인)
6. [부하 테스트 결과](#-부하-테스트-결과-jmeter)
7. [기술 스택](#-기술-스택)
8. [팀원 소개](#-팀원-소개)
9. [개발 기간](#-개발-기간)

---

## 🎯 프로젝트 소개

기존 티켓 예매 시스템은 사용자의 **인터넷 속도**와 **클릭 타이밍**에 따라 예매 성공 여부가 결정됩니다.  
Thicket은 이 불공정한 구조를 해결하기 위해, **클라이언트-서버 간 RTT(Round Trip Time) 측정** 을 통해 네트워크 지연을 보정하고, 모든 사용자가 동등한 조건에서 예매에 참여할 수 있도록 설계했습니다.

| 항목 | 내용 |
|------|------|
| 개발 기간 | 2023.11 ~ 2023.12 (약 2개월) |
| 팀 구성 | 4인 팀 (팀장: 오강석) |
| 목표 성능 | 인스턴스 3개 기준 **1,600 TPS** 처리 |
| 핵심 역할 | Ticket·Batch·Loader 서비스, CTS 알고리즘, Kafka 토픽 설계, 부하 테스트 |

---

## 🚨 핵심 문제 & 해결 전략

### 기존 시스템의 문제점

```
❌ 인터넷이 빠른 사람이 무조건 유리
❌ 예매 버튼을 누른 시각 ≠ 서버에 도착한 시각  (네트워크 지연)
❌ 매크로·다중 기기 사용으로 인한 불필요한 트래픽
```

### Thicket의 해결 방법

```
✅ 예매 버튼 클릭 시각 기준으로 순서 정렬 (서버 수신 시각 X)
✅ RTT 측정으로 클라이언트 시각 보정 → 공정한 이벤트 타임 산출
✅ Kafka 비동기 파이프라인으로 대량 트래픽 분산 처리
✅ 예매 완료 즉시 마이페이지 리다이렉트 → 중복 요청 억제
```

---

## 🧮 CTS 알고리즘 — 클라이언트 시간 보정

> CTS(Client Time Synchronization) : RTT 기반 네트워크 지연 보정 알고리즘

### 보정 원리

온라인 게임의 **Ping 보정**과 동일한 개념을 예매 도메인에 적용했습니다.

```
t0 : 클라이언트가 요청을 보낸 시각
t1 : 서버가 요청을 받은 시각
t2 : 서버가 응답을 보낸 시각
t3 : 클라이언트가 응답을 받은 시각

Round-trip delay = (t1 - t0) + (t3 - t2)
Offset           = t1 - t0 - Round-trip delay / 2
```

### 동작 흐름

```
① 프론트엔드가 주기적으로 Gateway에 더티체킹 요청
② RTT 계산 후 배열에 누적 저장
③ 배열의 중간 인덱스 값(누적 중앙값)을 전역 latency로 유지
④ 예매 요청 시 해당 latency 값을 페이로드에 포함
⑤ 서버는 수신 시각 - latency = 실제 클릭 이벤트 타임으로 보정
⑥ 보정된 이벤트 타임 기준으로 Kafka 정렬 → 공정한 예매 순서 확정
```

> **인터뷰 포인트:** 배열은 정렬되지 않으므로 이 값은 수학적 중앙값(median)이 아닌 **누적 중간 인덱스 값**입니다.

---

## 🏗 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React 18)                    │
│              주기적 RTT 측정 (더티체킹)                        │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
                        ▼
┌───────────────────────────────────────────────────────────┐
│              Spring Cloud Gateway + JWT 인증               │
│              (NTP 서버 시간 동기화 적용)                      │
└──────┬──────────────────────────┬──────────────────────────┘
       │ API 라우팅                │ Health Check (Eureka)
       ▼                          ▼
┌─────────────┐         ┌──────────────────┐
│ Member      │         │ Eureka Server    │
│ Service     │         │ (서비스 디스커버리) │
├─────────────┤         └──────────────────┘
│ Show        │
│ Service     │◄──── MariaDB (로컬)
├─────────────┤
│ Ticket      │──── Kafka Producer ──► preordered-topic
│ Service ×3  │                              │
├─────────────┤                              ▼
│ Batch       │◄──────────────── Kafka Consumer
│ Service     │                    (정렬 처리)
├─────────────┤                              │
│ Loader      │◄──────────────── ordered-topic
│ Service     │                    (DB 적재)
└─────────────┘
       │
       ▼
  AWS EC2 + S3
  (Kafka Cluster Docker 배포)
```

**마이크로서비스 역할**

| 서비스 | 담당 | 설명 |
|--------|------|------|
| Gateway | 공동 | JWT 인증·인가, 라우팅, NTP 시간 동기화 |
| Member | 오진석 | 회원가입·로그인·마이페이지 |
| Show | 하은지 | 공연 정보·회차 관리 |
| Ticket | **오강석** | 예매 수신·Kafka Producer |
| Batch | **오강석** | Kafka Consumer·이벤트 타임 정렬 |
| Loader | **오강석** | 정렬 결과 DB 적재 |
| Eureka | 공동 | 서비스 디스커버리 |

---

## 📨 Kafka 예매 파이프라인

```
[클라이언트]
    │  예매 요청 (이벤트 타임 + latency 포함)
    ▼
[Ticket Service]
    │  보정된 이벤트 타임 계산
    ▼  Produce
[preordered-topic]  ← Kafka Cluster (EC2 Docker)
    │
    ▼  Consume
[Batch Service]
    │  이벤트 타임 기준 오름차순 정렬
    ▼  Produce
[ordered-topic]
    │
    ▼  Consume
[Loader Service]
    │  MariaDB에 순서대로 적재
    ▼
[예매 확정 완료]
```

---

## 📊 부하 테스트 결과 (JMeter)

> 환경: Ticket Service 인스턴스 **3개**, Kafka Cluster EC2 배포

### 테스트 영상

<!-- 영상 업로드 방법: GitHub 이슈에 mp4 드래그 → 생성된 URL을 아래에 붙여넣기 -->
> 🎬 **[부하 테스트 영상 — 클릭하여 재생]**  
> *(영상 링크 준비 중 — GitHub Issue에 mp4 드래그 후 URL 삽입 예정)*

### 결과 요약

| 항목 | 수치 |
|------|------|
| 목표 TPS | 1,600 TPS |
| 인스턴스 수 | 3개 (Ticket Service) |
| 테스트 도구 | Apache JMeter |
| Kafka 배포 | AWS EC2 Docker |

---

## 🛠 기술 스택

### Backend

| 분류 | 기술 |
|------|------|
| Language | Java 17 |
| Framework | Spring Boot 3, Spring Cloud (Gateway, Eureka, OpenFeign) |
| Security | Spring Security, JWT |
| ORM | Spring Data JPA |
| Message Queue | Apache Kafka |
| Cache | Redis |
| Database | MariaDB |
| Test | JMeter (부하), JUnit5 (단위) |

### Frontend

| 분류 | 기술 |
|------|------|
| Library | React 18 |
| Language | JavaScript, HTML5, CSS3 |

### Infrastructure

| 분류 | 기술 |
|------|------|
| Cloud | AWS EC2, AWS S3 |
| Container | Docker |
| VCS | GitHub |
| PM | Jira |
| Communication | Slack |

---

## 👥 팀원 소개

| 이름 | 역할 | 담당 |
|------|------|------|
| **오강석** (팀장) | Backend | Ticket·Batch·Loader 서비스, CTS 알고리즘, Kafka 토픽 설계, JMeter 부하 테스트 |
| 오진석 | Backend / 프로젝트 매니징 | Member 서비스, Gateway JWT 인증, Eureka, 프론트 세팅 |
| 이건주 | Frontend | 공연 상세·예매 페이지, 어드민 페이지 |
| 하은지 | Backend | Show·회차 정보 서비스, 결제 프론트 |

---

## 📅 개발 기간

```
2023.11  ─────── 기획·설계·Flow Chart 작성, MSA 구조 설계, 각 서비스 기초 CRUD 구현, Kafka 파이프라인, CTS 알고리즘, 정렬 로직 구현, 부하 테스트, 리팩토링, 문서화·발표 자료 완성
```

---

<div align="center">

**Thicket** — *티켓팅은 실력이 아닌 공정함으로*

</div>