import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { MetricCard, SectionPanel } from '@/components/ui/cards';
import { PrimaryButton } from '@/components/ui/buttons';
import { metrics, tasks } from '@/lib/demo-data';
import { TaskCard } from '@/components/domain';

export default function DashboardPage() {
  return <AppShell>
    <PageHeader title="오늘의 학습 흐름" description="지금 환경에서 가장 효과적인 다음 행동을 바로 시작하세요." action={<PrimaryButton>다음 스프린트 시작</PrimaryButton>} />
    <section className="grid gap-4 md:grid-cols-4">
      <MetricCard label="완료율" value={`${metrics.completion}%`} caption="오늘 deliverable 기준" />
      <MetricCard label="인출 성공률" value={`${metrics.retrieval}%`} />
      <MetricCard label="설명 가능률" value={`${metrics.explainability}%`} />
      <MetricCard label="환경 매칭" value={`${metrics.envMatch}%`} />
    </section>
    <SectionPanel title="지금 해야 할 일">
      <p className="text-sm"><b>최우선:</b> {metrics.topPriority}</p>
      <p className="mt-2 text-sm text-[var(--text-muted)]">현재 블록: {metrics.currentBlock} · 다음 스프린트: {metrics.nextSprint}</p>
    </SectionPanel>
    <section className="grid gap-4 md:grid-cols-3">{tasks.map((t) => <TaskCard key={t.title} {...t} />)}</section>
  </AppShell>;
}
