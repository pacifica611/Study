import { describe, expect, it } from 'vitest';
import {
  buildWeeklyReport,
  classifyEnvironmentBlock,
  createMockExamFeedbackRules,
  generateDailyPlan,
  recommendTaskTypes,
  scoreSession,
} from '@/lib/core-logic';

describe('core logic', () => {
  it('classifies environment blocks', () => {
    expect(classifyEnvironmentBlock({ startHour: 7, endHour: 8, noiseLevel: 'LOW', handFree: true, focusReady: true })).toBe('A');
    expect(classifyEnvironmentBlock({ startHour: 12, endHour: 13, noiseLevel: 'HIGH', handFree: true, focusReady: true })).toBe('C');
  });

  it('recommends tasks by environment', () => {
    expect(recommendTaskTypes('B', 'ENGLISH', 'MID', false)).toContain('백지복습');
  });

  it('generates plan with block mapping', () => {
    const plan = generateDailyPlan(
      { morningZero: true, afterSchoolDirectToStudy: true },
      [{ id: 'b1', environment: 'A', subject: 'KOREAN' }],
      [{ id: 't1', title: '', subject: 'KOREAN', difficulty: 5, estimatedMinutes: 60, deliverable: '', type: 'DEEP' }],
    );
    expect(plan[0].taskId).toBe('t1');
  });

  it('scores sessions', () => {
    expect(scoreSession({ sprintMinutes: 60, completed: true, blankPageReview: true, explainAloud: true, retrievalRating: 5 })).toBe(100);
  });

  it('builds weekly report', () => {
    const report = buildWeeklyReport([{ sprintMinutes: 40, completed: true, blankPageReview: true, explainAloud: true, retrievalRating: 4 }], [{ completed: true, environmentMatched: true }], [{ retrievalRating: 4, explainable: true }]);
    expect(report.deliverableCompletionRate).toBe(100);
  });

  it('creates mock rules', () => {
    const rules = createMockExamFeedbackRules({ stuckReasons: ['개념 혼선'], timingIssue: true, section: '국어 독서' });
    expect(rules.length).toBeGreaterThan(1);
  });
});
