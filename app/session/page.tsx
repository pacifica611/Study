'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { Input, Select } from '@/components/ui/forms';
import { SectionPanel } from '@/components/ui/cards';
import { useStudyStore } from '@/lib/store';

export default function SessionPage() {
  const { data, actions, ready } = useStudyStore();
  const [seconds, setSeconds] = useState(60 * 60);
  const [running, setRunning] = useState(false);
  const [sprint, setSprint] = useState(60);
  const [taskId, setTaskId] = useState('');
  const [blank, setBlank] = useState(true);
  const [explain, setExplain] = useState(false);
  const [rating, setRating] = useState(3);

  useEffect(() => setSeconds(sprint * 60), [sprint]);
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, seconds]);

  if (!ready) return <AppShell><SectionPanel title="로딩">세션 준비 중...</SectionPanel></AppShell>;
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return <AppShell><PageHeader title="집중 세션" description="한 번에 하나의 과제에만 몰입하세요." />
    <SectionPanel title="현재 과제">
      <div className="grid gap-3 md:grid-cols-3">
        <Select value={taskId} onChange={(e) => setTaskId(e.target.value)}>
          <option value="">과제 선택</option>
          {data.tasks.filter((t) => !t.completed).map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </Select>
        <Select value={String(sprint)} onChange={(e) => setSprint(Number(e.target.value))}><option value="40">40분</option><option value="60">60분</option><option value="80">80분</option></Select>
        <div className="flex gap-2"><PrimaryButton onClick={() => setRunning(true)}>시작</PrimaryButton><SecondaryButton onClick={() => setRunning(false)}>일시정지</SecondaryButton></div>
      </div>
      <p className="mt-4 text-center text-5xl font-bold">{mm}:{ss}</p>
    </SectionPanel>

    <SectionPanel title="세션 회고">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm"><input type="checkbox" checked={blank} onChange={(e) => setBlank(e.target.checked)} className="mr-2"/>백지복습 진행</label>
        <label className="text-sm"><input type="checkbox" checked={explain} onChange={(e) => setExplain(e.target.checked)} className="mr-2"/>소리내 설명 가능</label>
        <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        <PrimaryButton onClick={() => actions.addSession({ taskId: taskId || data.tasks[0]?.id || '', sprintMinutes: sprint, completed: true, blankPageReview: blank, explainAloud: explain, retrievalRating: rating })}>세션 저장</PrimaryButton>
      </div>
    </SectionPanel>
  </AppShell>;
}
