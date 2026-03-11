import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.weeklyReportSnapshot.deleteMany();
  await prisma.mockExamReview.deleteMany();
  await prisma.ideaNote.deleteMany();
  await prisma.retrievalReview.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.studyTask.deleteMany();
  await prisma.timeBlock.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.sprintPreset.deleteMany();

  const profile = await prisma.userProfile.create({
    data: {
      name: '김수험', gradeYear: '고3', targetGrade: '상위 3%', weakSubjects: '국어, 수학',
      schoolArrivalTime: '07:30', schoolDepartureTime: '16:30', lunchTime: '12:20', selfStudySlots: '07:50-08:30, 19:00-22:00',
      afterSchoolLocation: '도서관', morningZeroPossible: true,
      subjects: { create: [{ name: '국어', code: 'KOREAN' }, { name: '수학', code: 'MATH' }, { name: '영어', code: 'ENGLISH' }] },
    },
  });

  await prisma.sprintPreset.createMany({ data: [{ minutes: 40, label: '집중 워밍업' }, { minutes: 60, label: '표준 스프린트' }, { minutes: 80, label: '실전형 스프린트' }] });

  const tasks = await Promise.all([
    prisma.studyTask.create({ data: { profileId: profile.id, title: '국어 독서 지문 2개 분석', subjectCode: 'KOREAN', deliverable: '각 지문 사고 흐름 5문장 요약', taskType: 'DEEP', difficulty: 4, estimatedMinutes: 70, environmentHint: 'A' } }),
    prisma.studyTask.create({ data: { profileId: profile.id, title: '수학 20문항 풀이', subjectCode: 'MATH', deliverable: '오답 3개 행동 규칙 작성', taskType: 'DEEP', difficulty: 5, estimatedMinutes: 80, environmentHint: 'A' } }),
    prisma.studyTask.create({ data: { profileId: profile.id, title: '영단어 인출 테스트', subjectCode: 'ENGLISH', deliverable: '80단어 중 64단어 이상 즉시 회상', taskType: 'RETRIEVAL', difficulty: 2, estimatedMinutes: 40, environmentHint: 'B' } }),
    prisma.studyTask.create({ data: { profileId: profile.id, title: '과탐 개념 백지복습', subjectCode: 'SCIENCE', deliverable: '1단원 핵심식/조건 재현', taskType: 'RETRIEVAL', difficulty: 3, estimatedMinutes: 45, environmentHint: 'B' } }),
  ]);

  for (let i = 0; i < 3; i++) {
    const date = new Date(); date.setDate(date.getDate() - i);
    await prisma.timeBlock.createMany({ data: [
      { profileId: profile.id, date, startTime: '07:50', endTime: '08:30', environment: 'A', note: '0교시 조용한 시간' },
      { profileId: profile.id, date, startTime: '12:20', endTime: '13:00', environment: 'B', note: '점심 후 인출 중심' },
      { profileId: profile.id, date, startTime: '19:00', endTime: '21:00', environment: 'A', note: '도서관 심화 학습' },
    ]});
    await prisma.studySession.create({ data: { profileId: profile.id, taskId: tasks[i % tasks.length].id, sprintMinutes: 60, completed: true, blankPageReview: true, explainAloud: i !== 1, retrievalRating: 4, reflection: '처음 10분에 목표를 고정하니 집중이 안정됨.' } });
    await prisma.ideaNote.create({ data: { profileId: profile.id, subjectCode: i % 2 ? 'MATH' : 'KOREAN', insight: '조건을 빨리 해석하면 시간 절약이 큼', actionRule: '문제 시작 30초 내 조건/질문/제약 3요소 체크', tags: '실모,시간관리' } });
  }

  await prisma.mockExamReview.create({ data: { profileId: profile.id, examName: '9월 모평', section: '국어 독서', timeAllocation: '독서 38분', stuckPoint: '경제 지문 27번', stuckReason: '조건 해석 지연', nextActionRule: '10분 경과 시 난도 높은 문항 임시 스킵 후 회귀' } });
  await prisma.weeklyReportSnapshot.create({ data: { profileId: profile.id, weekStart: new Date(), deliverableCompletionRate: 74, retrievalSuccessRate: 78, explainabilityRate: 69, sprintCompletionRate: 82, environmentMatchQuality: 76, summary: '국어 오전 A블록 효율이 높아 유지, 수학은 B블록 인출량을 확대 권장.' } });
}

main().finally(async () => prisma.$disconnect());
