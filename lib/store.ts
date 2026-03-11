'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildWeeklyReport, createMockExamFeedbackRules, generateDailyPlan } from './core-logic';
import { EnvironmentType, SubjectCode } from './types';

export type Profile = {
  gradeYear: string;
  targetGrade: string;
  weakSubjects: string;
  schoolArrivalTime: string;
  schoolDepartureTime: string;
  lunchTime: string;
  selfStudySlots: string;
  afterSchoolLocation: string;
  morningZeroPossible: boolean;
};

export type Task = {
  id: string;
  title: string;
  subject: SubjectCode;
  deliverable: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  type: 'DEEP' | 'RETRIEVAL' | 'MECHANICAL';
  completed: boolean;
  environmentHint: EnvironmentType;
};

export type Session = {
  id: string;
  taskId: string;
  sprintMinutes: number;
  completed: boolean;
  blankPageReview: boolean;
  explainAloud: boolean;
  retrievalRating: number;
  createdAt: string;
};

export type Note = { id: string; subject: SubjectCode; insight: string; actionRule: string; createdAt: string };
export type MockReview = { id: string; section: string; stuckReason: string; timeAllocation: string; rules: string[]; createdAt: string };

const KEY = 'study-mvp-v2';

const initialData = {
  profile: {
    gradeYear: '고3',
    targetGrade: '상위 3%',
    weakSubjects: '국어, 수학',
    schoolArrivalTime: '07:30',
    schoolDepartureTime: '16:30',
    lunchTime: '12:20',
    selfStudySlots: '07:50-08:30, 19:00-22:00',
    afterSchoolLocation: '도서관',
    morningZeroPossible: true,
  } as Profile,
  tasks: [
    { id: 't1', title: '국어 독서 지문 2개 분석', subject: 'KOREAN', deliverable: '사고 흐름 5문장 재현', difficulty: 4, estimatedMinutes: 70, type: 'DEEP', completed: false, environmentHint: 'A' },
    { id: 't2', title: '수학 20문항 풀이', subject: 'MATH', deliverable: '오답 3개 행동 규칙 작성', difficulty: 5, estimatedMinutes: 80, type: 'DEEP', completed: false, environmentHint: 'A' },
    { id: 't3', title: '영단어 인출 테스트', subject: 'ENGLISH', deliverable: '80개 중 64개 회상', difficulty: 2, estimatedMinutes: 40, type: 'RETRIEVAL', completed: false, environmentHint: 'B' },
  ] as Task[],
  sessions: [] as Session[],
  notes: [] as Note[],
  mocks: [] as MockReview[],
};

export function useStudyStore() {
  const [data, setData] = useState(initialData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setData(JSON.parse(raw));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(data));
  }, [data, ready]);

  const actions = {
    updateProfile: (profile: Profile) => setData((d) => ({ ...d, profile })),
    addTask: (task: Omit<Task, 'id' | 'completed'>) => setData((d) => ({ ...d, tasks: [{ ...task, id: crypto.randomUUID(), completed: false }, ...d.tasks] })),
    toggleTask: (id: string) => setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) })),
    addSession: (session: Omit<Session, 'id' | 'createdAt'>) => setData((d) => ({ ...d, sessions: [{ ...session, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...d.sessions] })),
    addNote: (note: Omit<Note, 'id' | 'createdAt'>) => setData((d) => ({ ...d, notes: [{ ...note, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...d.notes] })),
    addMock: (input: { section: string; stuckReason: string; timeAllocation: string; timingIssue: boolean }) => {
      const rules = createMockExamFeedbackRules({ section: input.section, timingIssue: input.timingIssue, stuckReasons: [input.stuckReason] });
      setData((d) => ({ ...d, mocks: [{ id: crypto.randomUUID(), section: input.section, stuckReason: input.stuckReason, timeAllocation: input.timeAllocation, rules, createdAt: new Date().toISOString() }, ...d.mocks] }));
    },
  };

  const derived = useMemo(() => {
    const taskStats = data.tasks.map((t) => ({ completed: t.completed, environmentMatched: true }));
    const reviewStats = data.sessions.map((s) => ({ retrievalRating: s.retrievalRating, explainable: s.explainAloud }));
    const report = buildWeeklyReport(data.sessions, taskStats, reviewStats);

    const availableBlocks = [
      { id: 'b1', environment: 'A' as EnvironmentType, subject: 'KOREAN' as SubjectCode },
      { id: 'b2', environment: 'B' as EnvironmentType, subject: 'ENGLISH' as SubjectCode },
      { id: 'b3', environment: 'A' as EnvironmentType, subject: 'MATH' as SubjectCode },
    ];

    const plan = generateDailyPlan(
      { morningZero: data.profile.morningZeroPossible, afterSchoolDirectToStudy: !!data.profile.afterSchoolLocation },
      availableBlocks,
      data.tasks.filter((t) => !t.completed).map((t) => ({ ...t, estimatedMinutes: t.estimatedMinutes })),
    );

    return { report, plan, completion: Math.round((data.tasks.filter((t) => t.completed).length / Math.max(data.tasks.length, 1)) * 100) };
  }, [data]);

  return { data, actions, derived, ready };
}

export const subjectLabels: Record<SubjectCode, string> = {
  KOREAN: '국어', MATH: '수학', ENGLISH: '영어', SCIENCE: '과학', SOCIAL: '사탐',
};
