export const metrics = {
  topPriority: '국어 독서 지문 2개 사고 흐름 재현',
  currentBlock: 'A (고집중 가능)',
  nextSprint: '19:00 도서관 60분 스프린트',
  completion: 74,
  retrieval: 78,
  explainability: 69,
  sprint: 82,
  envMatch: 76,
};

export const tasks = [
  { title: '수학 20문항 풀이 + 풀이 논리 설명', deliverable: '오답 3개 행동 규칙 메모', subject: '수학' },
  { title: '국어 독서 지문 2개 분석', deliverable: '선지 판단 근거 5문장', subject: '국어' },
  { title: '영단어 인출 80개', deliverable: '64개 이상 즉시 회상', subject: '영어' },
];

export const notes = [
  { subject: '국어', insight: '문단별 관점 전환을 먼저 잡으면 선지 소거가 빨라짐', actionRule: '첫 문단에서 필자 관점 라벨링' },
  { subject: '수학', insight: '조건을 늦게 읽으면 계산량이 불필요하게 커짐', actionRule: '문제 시작 30초: 조건/목표/제약 체크' },
];
