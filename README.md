# 수능 몰입 플래너 MVP

환경 인지형 계획, 인출 중심 학습, 스프린트 실행/회고, 모의고사 흐름 리뷰를 지원하는 로컬 단일 사용자 MVP입니다.

## 1) Setup & Run
```bash
npm install
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
npm run dev
```

검증 명령:
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## 2) 폴더 구조
- `app/`: App Router 페이지 (`/`, `/onboarding`, `/planner`, `/session`, `/tasks`, `/notes`, `/mocks`, `/reports`, `/settings`)
- `components/`: AppShell, 카드/버튼/폼 등 재사용 UI
- `lib/`: 디자인 토큰, 코어 로직(순수 함수), 타입, 데모 데이터
- `prisma/`: 스키마 및 시드
- `tests/`: 비즈니스 로직 테스트

## 3) 데이터 모델 개요
- `UserProfile`: 학년, 목표, 루틴, 0교시 가능 여부
- `Subject`: 과목
- `TimeBlock`: A/B/C 환경 블록
- `StudyTask`: 산출물 기반 과제
- `StudySession`: 스프린트 기록 + 회고
- `SprintPreset`: 40/60/80분
- `RetrievalReview`: 인출 성공/설명 가능성
- `IdeaNote`: 인사이트 + 다음 행동 규칙
- `MockExamReview`: 흐름/막힘/원인/다음 규칙
- `WeeklyReportSnapshot`: 주간 핵심 지표 스냅샷

## 4) 코어 로직
`lib/core-logic.ts`:
1. `classifyEnvironmentBlock` → 환경 A/B/C 분류
2. `recommendTaskTypes` → 환경/과목/에너지별 추천
3. `generateDailyPlan` → 환경블록과 백로그 기반 일일 배치
4. `scoreSession` → 세션 품질 점수화
5. `buildWeeklyReport` → 완료율/인출/설명/스프린트/환경매칭 집계
6. `createMockExamFeedbackRules` → 막힘 원인 기반 행동 규칙 생성

## 5) 가정
- 로컬 단일 사용자(인증 없음)
- 데모 데이터로 초기 UX 이해 가능
- MVP 범위에서 서버 액션/API는 최소화, 구조와 로직 검증 우선

## 6) 확장 아이디어
- 실제 CRUD 서버 액션 + 낙관적 UI
- 주간 플랜 자동 재배치 고도화(과목 편향 방지)
- 모의고사 구간 타임라인 시각화 강화
- 리포트 추세 차트(4~12주)
- 모바일 전용 집중 모드 UX 강화

## 7) 기존 코드 수정 요약
- 저장소가 비어 있어 신규 프로젝트로 초기화했습니다.
