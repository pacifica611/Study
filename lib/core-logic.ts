import { EnvironmentType, SessionInput, StudyTaskInput, SubjectCode, TimeBlockInput } from './types';

export function classifyEnvironmentBlock(block: TimeBlockInput): EnvironmentType {
  if (block.focusReady && block.noiseLevel === 'LOW' && block.handFree) return 'A';
  if (block.noiseLevel === 'HIGH' || !block.focusReady) return 'C';
  return 'B';
}

export function recommendTaskTypes(
  environment: EnvironmentType,
  subject: SubjectCode,
  energyLevel: 'LOW' | 'MID' | 'HIGH',
  upcomingExam: boolean,
): string[] {
  if (environment === 'A') {
    const base = ['고난도 문제 풀이', '심화 지문 분석'];
    if (subject === 'KOREAN') base.unshift('국어 사고 흐름 재현');
    if (subject === 'MATH') base.push('시나리오 매핑 + 행동 규칙 작성');
    return upcomingExam ? [...base, '실전 세트 연습'] : base;
  }
  if (environment === 'B') {
    return ['백지복습', '핵심 개념 인출', '오답 노트 리콜', energyLevel === 'LOW' ? '짧은 구술 설명' : '구술 설명 연습'];
  }
  return ['반복형 쉬운 문제', '강의 시청', '학습 정리/관리 작업'];
}

export function generateDailyPlan(profile: { morningZero: boolean; afterSchoolDirectToStudy: boolean }, availableBlocks: Array<{ id: string; environment: EnvironmentType; subject: SubjectCode }>, backlogTasks: StudyTaskInput[]) {
  const sorted = [...backlogTasks].sort((a, b) => b.difficulty - a.difficulty);
  return availableBlocks.map((block, idx) => {
    const pool = sorted.filter((t) => {
      if (block.environment === 'A') return t.type === 'DEEP';
      if (block.environment === 'B') return t.type === 'RETRIEVAL';
      return t.type === 'MECHANICAL';
    });
    const preferred = block.environment === 'A' && block.subject === 'KOREAN' && profile.morningZero && idx === 0
      ? pool.find((t) => t.subject === 'KOREAN')
      : pool[0];
    return {
      blockId: block.id,
      taskId: preferred?.id ?? null,
      note: profile.afterSchoolDirectToStudy && idx > 2 ? '하교 후 바로 학습 장소로 이동 후 시작' : '블록 시작 전 3분 세팅',
    };
  });
}

export function scoreSession(session: SessionInput): number {
  let score = session.completed ? 40 : 10;
  if (session.blankPageReview) score += 20;
  if (session.explainAloud) score += 20;
  score += Math.min(20, Math.max(0, session.retrievalRating * 4));
  return score;
}

export function buildWeeklyReport(
  sessions: SessionInput[],
  tasks: Array<{ completed: boolean; environmentMatched: boolean }>,
  reviews: Array<{ retrievalRating: number; explainable: boolean }>,
) {
  const deliverableCompletionRate = Math.round((tasks.filter((t) => t.completed).length / Math.max(tasks.length, 1)) * 100);
  const retrievalSuccessRate = Math.round((reviews.reduce((a, b) => a + b.retrievalRating, 0) / Math.max(reviews.length, 1)) * 20);
  const explainabilityRate = Math.round((reviews.filter((r) => r.explainable).length / Math.max(reviews.length, 1)) * 100);
  const sprintCompletionRate = Math.round((sessions.filter((s) => s.completed).length / Math.max(sessions.length, 1)) * 100);
  const environmentTaskMatchQuality = Math.round((tasks.filter((t) => t.environmentMatched).length / Math.max(tasks.length, 1)) * 100);

  return { deliverableCompletionRate, retrievalSuccessRate, explainabilityRate, sprintCompletionRate, environmentTaskMatchQuality };
}

export function createMockExamFeedbackRules(mockReview: { stuckReasons: string[]; timingIssue: boolean; section: string }): string[] {
  const rules = [`${mockReview.section} 시작 30초 내 문제 유형 판단 후 접근법 선택`];
  if (mockReview.timingIssue) rules.push('매 10분마다 진행률 체크 후 어려운 문항은 표시하고 다음으로 이동');
  if (mockReview.stuckReasons.includes('개념 혼선')) rules.push('다음 시험 전 관련 개념 1페이지 백지복습 + 구술 설명 2분');
  if (mockReview.stuckReasons.includes('조건 해석 실패')) rules.push('조건 표시 규칙: 수치/관계/예외를 색 분리하여 표시');
  return rules;
}
