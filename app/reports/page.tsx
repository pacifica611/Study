'use client';

import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { ChartCard, SectionPanel } from '@/components/ui/cards';
import { useStudyStore } from '@/lib/store';

export default function ReportsPage() {
  const { derived, ready } = useStudyStore();
  if (!ready) return <AppShell><SectionPanel title="로딩">리포트 계산 중...</SectionPanel></AppShell>;

  return <AppShell><PageHeader title="주간 리포트" description="총 공부시간보다 산출물·인출·설명 가능성을 우선 확인합니다." />
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartCard title="Deliverable 완료율" value={derived.report.deliverableCompletionRate} />
      <ChartCard title="인출 성공률" value={derived.report.retrievalSuccessRate} />
      <ChartCard title="설명 가능률" value={derived.report.explainabilityRate} />
      <ChartCard title="스프린트 완주율" value={derived.report.sprintCompletionRate} />
      <ChartCard title="환경-과제 매칭" value={derived.report.environmentTaskMatchQuality} />
    </section>
    <SectionPanel title="다음 주 제안"><p className="text-sm text-[var(--text-muted)]">완료율이 낮으면 과제 단위를 더 작게 쪼개고, 인출 성공률이 낮으면 B블록에 백지복습 과제를 추가하세요.</p></SectionPanel>
  </AppShell>;
}
