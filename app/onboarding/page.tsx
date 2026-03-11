'use client';

import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { SectionPanel } from '@/components/ui/cards';
import { Input, Select } from '@/components/ui/forms';
import { PrimaryButton } from '@/components/ui/buttons';
import { useStudyStore } from '@/lib/store';
import { useState } from 'react';

export default function OnboardingPage() {
  const { data, actions, ready } = useStudyStore();
  const [profile, setProfile] = useState(data.profile);
  if (!ready) return <AppShell><SectionPanel title="로딩">설정 불러오는 중...</SectionPanel></AppShell>;

  return <AppShell><PageHeader title="온보딩" description="현실적인 루틴을 위해 기본 학습 환경을 설정합니다." />
    <SectionPanel title="학생 정보">
      <div className="grid gap-3 md:grid-cols-2">
        <Input value={profile.gradeYear} onChange={(e) => setProfile({ ...profile, gradeYear: e.target.value })} placeholder="학년" /><Input value={profile.targetGrade} onChange={(e) => setProfile({ ...profile, targetGrade: e.target.value })} placeholder="목표 등급/백분위" />
        <Input value={profile.weakSubjects} onChange={(e) => setProfile({ ...profile, weakSubjects: e.target.value })} placeholder="취약 과목" /><Input value={profile.schoolArrivalTime} onChange={(e) => setProfile({ ...profile, schoolArrivalTime: e.target.value })} placeholder="등교 시간" />
        <Input value={profile.schoolDepartureTime} onChange={(e) => setProfile({ ...profile, schoolDepartureTime: e.target.value })} placeholder="하교 시간" /><Input value={profile.lunchTime} onChange={(e) => setProfile({ ...profile, lunchTime: e.target.value })} placeholder="점심 시간" />
        <Input value={profile.selfStudySlots} onChange={(e) => setProfile({ ...profile, selfStudySlots: e.target.value })} placeholder="자습 가능 시간대" /><Input value={profile.afterSchoolLocation} onChange={(e) => setProfile({ ...profile, afterSchoolLocation: e.target.value })} placeholder="방과 후 학습 장소" />
        <Select value={profile.morningZeroPossible ? 'Y' : 'N'} onChange={(e) => setProfile({ ...profile, morningZeroPossible: e.target.value === 'Y' })}><option value="Y">0교시 가능</option><option value="N">0교시 어려움</option></Select>
      </div>
      <PrimaryButton className="mt-4" onClick={() => actions.updateProfile(profile)}>저장</PrimaryButton>
    </SectionPanel></AppShell>;
}
