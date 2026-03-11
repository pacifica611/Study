'use client';

import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { EnvironmentBlockCard } from '@/components/domain';
import { SectionPanel } from '@/components/ui/cards';
import { useStudyStore } from '@/lib/store';

export default function PlannerPage() {
  const { derived, data, ready } = useStudyStore();
  if (!ready) return <AppShell><SectionPanel title="로딩">플랜 생성 중...</SectionPanel></AppShell>;

  const lookup = new Map(data.tasks.map((t) => [t.id, t.title]));

  return <AppShell><PageHeader title="환경 블록 플래너" description="A/B/C 환경에 맞춰 오늘의 산출물을 자동 배치합니다." />
    <section className="grid gap-4 md:grid-cols-3">
      <EnvironmentBlockCard name="A 블록 · 07:50-08:30" task={lookup.get(derived.plan[0]?.taskId || '') || '심화 과제를 먼저 추가해 주세요.'} />
      <EnvironmentBlockCard name="B 블록 · 12:20-13:00" task={lookup.get(derived.plan[1]?.taskId || '') || '인출 과제를 추가해 주세요.'} />
      <EnvironmentBlockCard name="A 블록 · 19:00-21:00" task={lookup.get(derived.plan[2]?.taskId || '') || '수학/국어 심화 과제를 추천합니다.'} />
    </section>
    <SectionPanel title="오늘의 자동 배치 원칙">
      <ul className="list-disc pl-5 text-sm text-[var(--text-muted)]"><li>조용한 오전 A블록에 국어 독서 심화 우선</li><li>과목 하나가 밀려도 나머지 블록은 유지</li><li>총 시간보다 오늘 완료할 산출물을 기준으로 계획</li></ul>
    </SectionPanel></AppShell>;
}
