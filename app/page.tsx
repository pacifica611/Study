'use client';

import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { MetricCard, SectionPanel } from '@/components/ui/cards';
import { PrimaryButton } from '@/components/ui/buttons';
import { TaskCard } from '@/components/domain';
import { useStudyStore, subjectLabels } from '@/lib/store';

export default function DashboardPage() {
  const { data, derived, ready } = useStudyStore();
  if (!ready) return <AppShell><SectionPanel title="로딩">학습 데이터를 불러오는 중...</SectionPanel></AppShell>;
  const topTask = data.tasks.find((t) => !t.completed) ?? data.tasks[0];

  return <AppShell>
    <PageHeader title="오늘의 학습 흐름" description="지금 환경에서 가장 효과적인 다음 행동을 바로 시작하세요." action={<Link href="/session"><PrimaryButton>다음 스프린트 시작</PrimaryButton></Link>} />
    <section className="grid gap-4 md:grid-cols-4">
      <MetricCard label="완료율" value={`${derived.report.deliverableCompletionRate}%`} caption="오늘 deliverable 기준" />
      <MetricCard label="인출 성공률" value={`${derived.report.retrievalSuccessRate}%`} />
      <MetricCard label="설명 가능률" value={`${derived.report.explainabilityRate}%`} />
      <MetricCard label="환경 매칭" value={`${derived.report.environmentTaskMatchQuality}%`} />
    </section>
    <SectionPanel title="지금 해야 할 일">
      <p className="text-sm"><b>최우선:</b> {topTask?.title ?? '과제를 추가해 주세요.'}</p>
      <p className="mt-2 text-sm text-[var(--text-muted)]">현재 블록: A · 추천 과목: 국어/수학 심화 · 다음: 60분 스프린트</p>
    </SectionPanel>
    <section className="grid gap-4 md:grid-cols-3">{data.tasks.slice(0, 3).map((t) => <TaskCard key={t.id} title={t.title} deliverable={t.deliverable} subject={subjectLabels[t.subject]} />)}</section>
  </AppShell>;
}
