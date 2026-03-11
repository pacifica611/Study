import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { SectionPanel } from '@/components/ui/cards';

export default function MocksPage() {
  return <AppShell><PageHeader title="모의고사 리뷰" description="점수보다 시험 흐름과 의사결정 규칙을 복기합니다." />
    <SectionPanel title="흐름 기반 리뷰">
      <div className="grid gap-3 text-sm md:grid-cols-2"><p><b>막힌 구간:</b> 국어 독서 27번</p><p><b>원인:</b> 조건 해석 지연</p><p><b>시간 배분:</b> 독서 38분</p><p><b>다음 행동 규칙:</b> 10분 진행률 점검 후 난문항 임시 스킵</p></div>
    </SectionPanel>
  </AppShell>;
}
