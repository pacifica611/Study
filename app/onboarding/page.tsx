import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { SectionPanel } from '@/components/ui/cards';
import { Input, Select } from '@/components/ui/forms';
import { PrimaryButton } from '@/components/ui/buttons';

export default function OnboardingPage() {
  return <AppShell><PageHeader title="온보딩" description="현실적인 루틴을 위해 기본 학습 환경을 설정합니다." />
    <SectionPanel title="학생 정보">
      <div className="grid gap-3 md:grid-cols-2">
        <Input placeholder="학년 (예: 고3)" /><Input placeholder="목표 등급/백분위" />
        <Input placeholder="취약 과목" /><Input placeholder="등교 시간" />
        <Input placeholder="하교 시간" /><Input placeholder="점심 시간" />
        <Input placeholder="자습 가능 시간대" /><Input placeholder="방과 후 학습 장소" />
        <Select><option>0교시 가능 여부</option><option>가능</option><option>어려움</option></Select>
      </div>
      <PrimaryButton className="mt-4">저장하고 플래너로 이동</PrimaryButton>
    </SectionPanel></AppShell>;
}
