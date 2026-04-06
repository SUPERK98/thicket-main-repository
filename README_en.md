<div align="center">

<img src="https://img.shields.io/badge/THICKET-FF4136?style=for-the-badge&logoColor=white" alt="Thicket"/>

# 🎫 Thicket — Fair Concert Ticket Reservation System

> **An MSA-based ticket reservation platform that compensates for network latency to guarantee a fair booking order for every user**

<br/>

[한국어](./README_ko.md) · [日本語](./README_ja.md) · [English](#)

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

## 📌 Table of Contents

1. [Overview](#-overview)
2. [Problem & Solution](#-problem--solution)
3. [CTS Algorithm](#-cts-algorithm--client-time-synchronization)
4. [System Architecture](#-system-architecture)
5. [Kafka Pipeline](#-kafka-reservation-pipeline)
6. [Load Test Results](#-load-test-results-jmeter)
7. [Tech Stack](#-tech-stack)
8. [Team](#-team)
9. [Timeline](#-timeline)

---

## 🎯 Overview

Traditional ticket reservation systems determine success based on a user's **internet speed** and **click timing**.  
Thicket addresses this unfair structure by measuring the **Round Trip Time (RTT)** between client and server, compensating for network latency, and ensuring every user competes on equal footing.

| Item | Details |
|------|---------|
| Period | Nov 2023 – Dec 2023 (~2 months) |
| Team | 4 members (Lead: Kang-seok Oh) |
| Target Performance | **1,600 TPS** with 3 Ticket Service instances |
| My Responsibilities | Ticket · Batch · Loader services, CTS algorithm, Kafka topic design, load testing |

---

## 🚨 Problem & Solution

### Problems with Existing Systems

```
❌ Users with faster internet are inherently advantaged
❌ Button click time ≠ server arrival time  (network latency)
❌ Unnecessary traffic from macros & multi-device abuse
```

### Thicket's Approach

```
✅ Sort reservation order by click event time, NOT server receipt time
✅ RTT-based client time correction → fair event time calculation
✅ Kafka async pipeline distributes massive traffic load
✅ Immediate redirect to My Page after booking → suppresses duplicate requests
```

---

## 🧮 CTS Algorithm — Client Time Synchronization

> CTS: An RTT-based network latency correction algorithm applied to the ticketing domain

### Correction Principle

Inspired by **Ping compensation** in online gaming, adapted for ticket reservation:

```
t0 : Time the client sent the request
t1 : Time the server received the request
t2 : Time the server sent the response
t3 : Time the client received the response

Round-trip delay = (t1 - t0) + (t3 - t2)
Offset           = t1 - t0 - Round-trip delay / 2
```

### How It Works

```
① Frontend periodically sends dirty-check requests to the Gateway
② Calculates RTT per round and accumulates values in an array
③ Maintains the middle-index value of the array as the global latency
④ Includes latency in the reservation request payload
⑤ Server computes: receipt time - latency = actual click event time
⑥ Kafka sorts by corrected event time → fair reservation order finalized
```

> **Note:** Because the array is not sorted, this value is the **accumulated middle-index value**, not a true mathematical median.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (React 18)                      │
│              Periodic RTT measurement (dirty-check)         │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
                        ▼
┌───────────────────────────────────────────────────────────┐
│         Spring Cloud Gateway + JWT Auth                    │
│         (NTP server time synchronization)                  │
└──────┬──────────────────────────┬──────────────────────────┘
       │ API Routing              │ Health Check (Eureka)
       ▼                          ▼
┌─────────────┐         ┌──────────────────┐
│ Member      │         │ Eureka Server    │
│ Service     │         │ (Service Discovery)│
├─────────────┤         └──────────────────┘
│ Show        │
│ Service     │◄──── MariaDB (local)
├─────────────┤
│ Ticket      │──── Kafka Producer ──► preordered-topic
│ Service ×3  │                              │
├─────────────┤                              ▼
│ Batch       │◄──────────────── Kafka Consumer
│ Service     │                    (Sort by event time)
├─────────────┤                              │
│ Loader      │◄──────────────── ordered-topic
│ Service     │                    (Persist to DB)
└─────────────┘
       │
       ▼
  AWS EC2 + S3
  (Kafka Cluster deployed via Docker)
```

**Microservice Roles**

| Service | Owner | Description |
|---------|-------|-------------|
| Gateway | Shared | JWT auth/authz, routing, NTP time sync |
| Member | Jinseok Oh | Sign-up, login, My Page |
| Show | Eun-ji Ha | Concert info & schedule management |
| Ticket | **Kang-seok Oh** | Booking intake & Kafka Producer |
| Batch | **Kang-seok Oh** | Kafka Consumer & event-time sorting |
| Loader | **Kang-seok Oh** | Write sorted results to DB |
| Eureka | Shared | Service discovery |

---

## 📨 Kafka Reservation Pipeline

```
[Client]
    │  Reservation request (event time + latency payload)
    ▼
[Ticket Service]
    │  Calculate corrected event time
    ▼  Produce
[preordered-topic]  ← Kafka Cluster (EC2 Docker)
    │
    ▼  Consume
[Batch Service]
    │  Sort ascending by event time
    ▼  Produce
[ordered-topic]
    │
    ▼  Consume
[Loader Service]
    │  Write to MariaDB in order
    ▼
[Reservation Confirmed]
```

---

## 📊 Load Test Results (JMeter)

> Environment: **3 instances** of Ticket Service, Kafka Cluster on EC2

### Demo Video

<!-- How to add video: drag mp4 to a GitHub Issue → paste the generated URL below -->
> 🎬 **[Load Test Demo — Click to Watch]**  
> *(Video link coming soon — drag mp4 to a GitHub Issue and paste the URL here)*

### Summary

| Item | Value |
|------|-------|
| Target TPS | 1,600 TPS |
| Instances | 3 (Ticket Service) |
| Test Tool | Apache JMeter |
| Kafka Deploy | AWS EC2 Docker |

---

## 🛠 Tech Stack

### Backend

| Category | Technology |
|----------|-----------|
| Language | Java 17 |
| Framework | Spring Boot 3, Spring Cloud (Gateway, Eureka, OpenFeign) |
| Security | Spring Security, JWT |
| ORM | Spring Data JPA |
| Message Queue | Apache Kafka |
| Cache | Redis |
| Database | MariaDB |
| Testing | JMeter (load), JUnit5 (unit) |

### Frontend

| Category | Technology |
|----------|-----------|
| Library | React 18 |
| Language | JavaScript, HTML5, CSS3 |

### Infrastructure

| Category | Technology |
|----------|-----------|
| Cloud | AWS EC2, AWS S3 |
| Container | Docker |
| VCS | GitHub |
| PM | Jira |
| Communication | Slack |

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|-----------------|
| **Kang-seok Oh** (Lead) | Backend | Ticket · Batch · Loader services, CTS algorithm, Kafka topic design, JMeter load testing |
| Jinseok Oh | Backend / PM | Member service, Gateway JWT auth, Eureka, frontend setup |
| Geonju Lee | Frontend | Concert detail & booking pages, admin page |
| Eunji Ha | Backend | Show & schedule service, payment frontend |

---

## 📅 Timeline

```
Nov 2023  ─── Planning, system design, flow chart, MSA structure, basic CRUD for each service, Kafka pipeline, CTS algorithm, sort logic, load testing, refactoring, documentation & presentation
```

---

<div align="center">

**Thicket** — *Ticketing should be about fairness, not internet speed*

</div>