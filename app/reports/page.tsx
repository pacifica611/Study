import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { ChartCard, SectionPanel } from '@/components/ui/cards';
import { metrics } from '@/lib/demo-data';

export default function ReportsPage() {
  return <AppShell><PageHeader title="주간 리포트" description="총 공부시간보다 산출물·인출·설명 가능성을 우선 확인합니다." />
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartCard title="Deliverable 완료율" value={metrics.completion} />
      <ChartCard title="인출 성공률" value={metrics.retrieval} />
      <ChartCard title="설명 가능률" value={metrics.explainability} />
      <ChartCard title="스프린트 완주율" value={metrics.sprint} />
      <ChartCard title="환경-과제 매칭" value={metrics.envMatch} />
    </section>
    <SectionPanel title="다음 주 제안"><p className="text-sm text-[var(--text-muted)]">오전 A블록 국어 심화 루틴은 유지하고, 점심 B블록에서 수학 조건 인출 훈련을 하루 1회 추가하세요.</p></SectionPanel>
  </AppShell>;
}
