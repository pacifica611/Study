# Study Loop (MVP Prototype)

요구한 학습 루프를 웹 MVP로 실행 가능한 단일 페이지 앱입니다.

## 실행

```bash
python3 -m http.server 4173
# 브라우저에서 http://localhost:4173
```

## 포함된 기능

- PC 사이드바 레이아웃 + 모바일 반응형 탭
- 오늘 타임라인(PlanBlock) + 자동 계획 생성
- 타이머 시작/종료 + 세션 기록
- 달력 기반 플래너 + Task 주기 설정(매일/매주/매월)
- 문제 단위 기록 + `∞/★//` 처리
- 문제 사진 촬영/업로드 + 목록에서 사진 확인
- `NextAction` 자동 계산 (`RETRY_BLIND`, `STUDY_SOLUTION`, `NONE`)
- 데일리 리포트 + 과목별 순공 시간

## 저장 방식

- 브라우저 `localStorage` (`study-loop-v1`)에 데이터 저장

## 파일 구성

- `index.html`: PC 사이드바 + 4뷰(오늘/문제/플래너/리포트) UI
- `styles.css`: iOS 톤의 카드/버튼/달력/반응형 스타일
- `app.js`: 상태 관리, 자동 계획, 루프 엔진, 타이머, 달력/사진 기능
