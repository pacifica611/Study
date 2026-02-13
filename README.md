# Study Loop (MVP Prototype)

요구한 학습 루프를 웹 MVP로 바로 실행 가능한 단일 페이지 앱으로 구현했습니다.

## 실행

```bash
python3 -m http.server 4173
# 브라우저에서 http://localhost:4173
```

## 포함된 기능

- PC 사이드바 레이아웃 + 모바일 반응형 탭
- 오늘 타임라인(PlanBlock) + 자동 계획 생성
- 타이머 시작/종료 + 세션 기록
- 완료/미루기(롤오버 느낌의 시간 이동)
- 플래너 Task 입력/완료
- 문제 단위 기록 + `∞/★//` 처리
- `NextAction` 자동 계산 (`RETRY_BLIND`, `STUDY_SOLUTION`, `NONE`)
- 데일리 리포트 + 과목별 순공 시간
- iOS 느낌의 글래스모피즘 UI

## 저장 방식

- 브라우저 `localStorage` (`study-loop-v1`)에 데이터 저장

## 파일 구성

- `index.html`: PC 사이드바 + 4뷰(오늘/문제/플래너/리포트) UI
- `styles.css`: iOS 스타일 톤, 카드/버튼/반응형
- `app.js`: 상태 관리, 자동 계획, 루프 엔진, 타이머, 통계
