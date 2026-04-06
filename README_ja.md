<div align="center">

<img src="https://img.shields.io/badge/THICKET-FF4136?style=for-the-badge&logoColor=white" alt="Thicket"/>

# 🎫 Thicket — 公平なコンサートチケット予約システム

> **ネットワーク遅延を補正し、すべてのユーザーに公平な予約順序を保証するMSAベースのチケット予約プラットフォーム**

<br/>

[한국어](./README_ko.md) · [日本語](#) · [English](./README_en.md)

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

## 📌 目次

1. [プロジェクト概要](#-プロジェクト概要)
2. [課題と解決策](#-課題と解決策)
3. [CTSアルゴリズム](#-ctsアルゴリズム--クライアント時刻補正)
4. [システムアーキテクチャ](#-システムアーキテクチャ)
5. [Kafkaパイプライン](#-kafka予約パイプライン)
6. [負荷テスト結果](#-負荷テスト結果-jmeter)
7. [技術スタック](#-技術スタック)
8. [チームメンバー](#-チームメンバー)
9. [開発期間](#-開発期間)

---

## 🎯 プロジェクト概要

既存のチケット予約システムは、ユーザーの**通信速度**と**クリックタイミング**によって予約の成否が決まります。  
Thicketはこの不公平な構造を解決するため、**クライアント-サーバー間のRTT（Round Trip Time）測定**によりネットワーク遅延を補正し、すべてのユーザーが対等な条件で予約に参加できる設計を実現しました。

| 項目 | 内容 |
|------|------|
| 開発期間 | 2023年11月 〜 2023年12月（約2ヶ月） |
| チーム構成 | 4名（チームリーダー：오강석） |
| 目標性能 | インスタンス3台で **1,600 TPS** 処理 |
| 主な担当 | Ticket・Batch・Loaderサービス、CTSアルゴリズム、Kafkaトピック設計、負荷テスト |

---

## 🚨 課題と解決策

### 既存システムの問題点

```
❌ 通信が速いユーザーが一方的に有利
❌ 予約ボタンを押した時刻 ≠ サーバーへの到達時刻（ネットワーク遅延）
❌ マクロ・複数端末利用による不要なトラフィック
```

### Thicketの解決アプローチ

```
✅ 予約ボタンのクリック時刻を基準に順序を決定（サーバー受信時刻ではない）
✅ RTT測定によるクライアント時刻補正 → 公平なイベントタイム算出
✅ Kafka非同期パイプラインによる大量トラフィックの分散処理
✅ 予約完了後すぐにマイページへリダイレクト → 重複リクエスト抑制
```

---

## 🧮 CTSアルゴリズム — クライアント時刻補正

> CTS（Client Time Synchronization）：RTTベースのネットワーク遅延補正アルゴリズム

### 補正の原理

オンラインゲームの**Ping補正**と同じ概念をチケット予約ドメインへ応用しました。

```
t0 : クライアントがリクエストを送った時刻
t1 : サーバーがリクエストを受け取った時刻
t2 : サーバーがレスポンスを送った時刻
t3 : クライアントがレスポンスを受け取った時刻

Round-trip delay = (t1 - t0) + (t3 - t2)
Offset           = t1 - t0 - Round-trip delay / 2
```

### 動作フロー

```
① フロントエンドが定期的にGatewayへダーティチェックリクエストを送信
② RTTを計算し配列に累積保存
③ 配列の中間インデックス値（累積中央値）を全体latencyとして保持
④ 予約リクエスト時にlatency値をペイロードに含めて送信
⑤ サーバーは「受信時刻 - latency」を実際のクリックイベントタイムとして補正
⑥ 補正後のイベントタイムをKafkaで整列 → 公平な予約順序を確定
```

> **ポイント：** 配列はソートされていないため、この値は数学的な中央値(median)ではなく**累積中間インデックス値**です。

---

## 🏗 システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    クライアント (React 18)                    │
│              定期RTT測定（ダーティチェック）                    │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
                        ▼
┌───────────────────────────────────────────────────────────┐
│         Spring Cloud Gateway + JWT認証                     │
│         （NTPサーバー時刻同期）                               │
└──────┬──────────────────────────┬──────────────────────────┘
       │ APIルーティング            │ ヘルスチェック (Eureka)
       ▼                          ▼
┌─────────────┐         ┌──────────────────┐
│ Member      │         │ Eureka Server    │
│ Service     │         │ (サービスディスカバリ)│
├─────────────┤         └──────────────────┘
│ Show        │
│ Service     │◄──── MariaDB（ローカル）
├─────────────┤
│ Ticket      │──── Kafka Producer ──► preordered-topic
│ Service ×3  │                              │
├─────────────┤                              ▼
│ Batch       │◄──────────────── Kafka Consumer
│ Service     │                    （整列処理）
├─────────────┤                              │
│ Loader      │◄──────────────── ordered-topic
│ Service     │                    （DB書き込み）
└─────────────┘
       │
       ▼
  AWS EC2 + S3
  （Kafka Cluster Dockerデプロイ）
```

**マイクロサービスの役割**

| サービス | 担当 | 説明 |
|--------|------|------|
| Gateway | 共同 | JWT認証・認可、ルーティング、NTP時刻同期 |
| Member | 오진석 | 会員登録・ログイン・マイページ |
| Show | 하은지 | 公演情報・公演回管理 |
| Ticket | **오강석** | 予約受付・Kafka Producer |
| Batch | **오강석** | Kafka Consumer・イベントタイム整列 |
| Loader | **오강석** | 整列結果のDB書き込み |
| Eureka | 共同 | サービスディスカバリ |

---

## 📨 Kafka予約パイプライン

```
[クライアント]
    │  予約リクエスト（イベントタイム + latency付き）
    ▼
[Ticket Service]
    │  補正済みイベントタイム計算
    ▼  Produce
[preordered-topic]  ← Kafka Cluster（EC2 Docker）
    │
    ▼  Consume
[Batch Service]
    │  イベントタイム昇順で整列
    ▼  Produce
[ordered-topic]
    │
    ▼  Consume
[Loader Service]
    │  MariaDBへ順番通りに書き込み
    ▼
[予約確定完了]
```

---

## 📊 負荷テスト結果 (JMeter)

> 環境：Ticket Serviceインスタンス **3台**、Kafka Cluster EC2デプロイ

### テスト動画

<!-- 動画のアップロード方法：GitHubのIssueにmp4をドラッグ → 生成されたURLを下記に貼り付け -->
> 🎬 **[負荷テスト動画 — クリックして再生]**  
> *（動画リンク準備中 — GitHub Issueにmp4をドラッグしてURL挿入予定）*

### 結果サマリー

| 項目 | 数値 |
|------|------|
| 目標TPS | 1,600 TPS |
| インスタンス数 | 3台（Ticket Service） |
| テストツール | Apache JMeter |
| Kafkaデプロイ | AWS EC2 Docker |

---

## 🛠 技術スタック

### バックエンド

| カテゴリ | 技術 |
|------|------|
| 言語 | Java 17 |
| フレームワーク | Spring Boot 3, Spring Cloud（Gateway, Eureka, OpenFeign） |
| セキュリティ | Spring Security, JWT |
| ORM | Spring Data JPA |
| メッセージキュー | Apache Kafka |
| キャッシュ | Redis |
| データベース | MariaDB |
| テスト | JMeter（負荷）, JUnit5（単体） |

### フロントエンド

| カテゴリ | 技術 |
|------|------|
| ライブラリ | React 18 |
| 言語 | JavaScript, HTML5, CSS3 |

### インフラ

| カテゴリ | 技術 |
|------|------|
| クラウド | AWS EC2, AWS S3 |
| コンテナ | Docker |
| VCS | GitHub |
| PM | Jira |
| コミュニケーション | Slack |

---

## 👥 チームメンバー

| 名前 | 役割 | 担当範囲 |
|------|------|---------|
| **오강석**（チームリーダー） | バックエンド | Ticket・Batch・Loaderサービス、CTSアルゴリ즘、Kafkaトピック設計、JMeter負荷テスト |
| 오진석 | バックエンド / PM | Memberサービス、Gateway JWT認証、Eureka、フロント環境構築 |
| 이건주 | フロントエンド | 公演詳細・予約ページ、管理者ページ |
| 하은지 | バックエンド | Show・公演回サービス、決済フロント |

---

## 📅 開発期間

```
2023年11月  ─── 企画・設計・フローチャート作成、MSA構造設計、各サービスの基本CRUD実装、Kafkaパイプライン、CTSアルゴリズム、整列ロジック実装、負荷テスト、リファクタリング、ドキュメント・発表資料完成
```

---

<div align="center">

**Thicket** — *チケッティングは速さではなく、公平さで*

</div>