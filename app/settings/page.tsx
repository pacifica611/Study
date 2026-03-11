'use client';

import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { SectionPanel } from '@/components/ui/cards';
import { Input } from '@/components/ui/forms';
import { PrimaryButton } from '@/components/ui/buttons';
import { useStudyStore } from '@/lib/store';
import { useState } from 'react';

export default function SettingsPage() {
  const { data, actions, ready } = useStudyStore();
  const [afterSchool, setAfterSchool] = useState(data.profile.afterSchoolLocation);
  const [slots, setSlots] = useState(data.profile.selfStudySlots);

  if (!ready) return <AppShell><SectionPanel title="로딩">설정 로딩 중...</SectionPanel></AppShell>;

  return <AppShell><PageHeader title="설정" description="루틴과 회복 시간을 함께 반영해 현실적인 계획을 유지하세요." />
    <SectionPanel title="학습 루틴 설정"><div className="grid gap-3 md:grid-cols-2"><Input placeholder="식사/휴식 고정 시간"/><Input value={slots} onChange={(e) => setSlots(e.target.value)} placeholder="자습 가능 시간대"/><Input value={afterSchool} onChange={(e) => setAfterSchool(e.target.value)} placeholder="하교 후 이동 동선"/><PrimaryButton onClick={() => actions.updateProfile({ ...data.profile, afterSchoolLocation: afterSchool, selfStudySlots: slots })}>저장</PrimaryButton></div></SectionPanel>
  </AppShell>;
}
