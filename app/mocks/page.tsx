'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState, SectionPanel } from '@/components/ui/cards';
import { Input } from '@/components/ui/forms';
import { PrimaryButton } from '@/components/ui/buttons';
import { useStudyStore } from '@/lib/store';

export default function MocksPage() {
  const { data, actions, ready } = useStudyStore();
  const [section, setSection] = useState('국어 독서');
  const [reason, setReason] = useState('조건 해석 실패');
  const [time, setTime] = useState('독서 38분');
  const [timingIssue, setTimingIssue] = useState(true);

  if (!ready) return <AppShell><SectionPanel title="로딩">모의고사 리뷰를 불러오는 중...</SectionPanel></AppShell>;

  return <AppShell><PageHeader title="모의고사 리뷰" description="점수보다 시험 흐름과 의사결정 규칙을 복기합니다." />
    <SectionPanel title="리뷰 입력">
      <div className="grid gap-3 md:grid-cols-4">
        <Input value={section} onChange={(e) => setSection(e.target.value)} placeholder="영역" />
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="막힌 이유" />
        <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="시간 배분" />
        <PrimaryButton onClick={() => actions.addMock({ section, stuckReason: reason, timeAllocation: time, timingIssue })}>저장</PrimaryButton>
      </div>
      <label className="mt-3 block text-sm"><input checked={timingIssue} onChange={(e) => setTimingIssue(e.target.checked)} type="checkbox" className="mr-2"/>시간 운영 이슈가 있었음</label>
    </SectionPanel>
    {data.mocks.length === 0 ? <EmptyState title="리뷰가 아직 없어요" description="최근 모의고사 1개부터 흐름 중심으로 기록해 보세요." /> : data.mocks.map((m) => (
      <SectionPanel key={m.id} title={`${m.section} · ${m.timeAllocation}`}>
        <p className="text-sm"><b>막힌 이유:</b> {m.stuckReason}</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-[var(--text-muted)]">{m.rules.map((r) => <li key={r}>{r}</li>)}</ul>
      </SectionPanel>
    ))}
  </AppShell>;
}
