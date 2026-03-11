import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { EnvironmentBlockCard } from '@/components/domain';
import { SectionPanel } from '@/components/ui/cards';

export default function PlannerPage() {
  return <AppShell><PageHeader title="환경 블록 플래너" description="A/B/C 환경에 맞춰 오늘의 산출물을 자동 배치합니다." />
    <section className="grid gap-4 md:grid-cols-3">
      <EnvironmentBlockCard name="A 블록 · 07:50-08:30" task="국어 심화 지문 분석 / 수학 고난도" />
      <EnvironmentBlockCard name="B 블록 · 12:20-13:00" task="백지복습 / 오답 인출 / 구술 설명" />
      <EnvironmentBlockCard name="C 블록 · 이동 시간" task="쉬운 반복문항 / 강의 / 정리 업무" />
    </section>
    <SectionPanel title="오늘의 자동 배치 원칙">
      <ul className="list-disc pl-5 text-sm text-[var(--text-muted)]"><li>조용한 오전 A블록에 국어 독서 심화 우선</li><li>과목 하나가 밀려도 나머지 블록은 유지</li><li>총 시간보다 오늘 완료할 산출물을 기준으로 계획</li></ul>
    </SectionPanel></AppShell>;
}
