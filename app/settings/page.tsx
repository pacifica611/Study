import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { SectionPanel } from '@/components/ui/cards';
import { Input } from '@/components/ui/forms';

export default function SettingsPage() {
  return <AppShell><PageHeader title="설정" description="루틴과 회복 시간을 함께 반영해 현실적인 계획을 유지하세요." />
    <SectionPanel title="학습 루틴 설정"><div className="grid gap-3 md:grid-cols-2"><Input placeholder="취침 목표 시간"/><Input placeholder="기상 목표 시간"/><Input placeholder="식사/휴식 고정 시간"/><Input placeholder="하교 후 이동 동선"/></div></SectionPanel>
  </AppShell>;
}
