'use client';

import { FormEvent, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { TaskCard } from '@/components/domain';
import { Input, Select } from '@/components/ui/forms';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { SectionPanel } from '@/components/ui/cards';
import { useStudyStore, subjectLabels } from '@/lib/store';
import { SubjectCode } from '@/lib/types';

export default function TasksPage() {
  const { data, actions, ready } = useStudyStore();
  const [title, setTitle] = useState('');
  const [deliverable, setDeliverable] = useState('');
  const [subject, setSubject] = useState<SubjectCode>('KOREAN');

  if (!ready) return <AppShell><SectionPanel title="로딩">과제를 불러오는 중...</SectionPanel></AppShell>;

  const onAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !deliverable) return;
    actions.addTask({ title, deliverable, subject, difficulty: 3, estimatedMinutes: 60, type: 'RETRIEVAL', environmentHint: 'B' });
    setTitle('');
    setDeliverable('');
  };

  return <AppShell><PageHeader title="과제 관리" description="시간이 아닌 완료 산출물 기준으로 과제를 관리합니다." />
    <SectionPanel title="빠른 과제 추가">
      <form className="grid gap-3 md:grid-cols-4" onSubmit={onAdd}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="과제명" />
        <Input value={deliverable} onChange={(e) => setDeliverable(e.target.value)} placeholder="완료 기준(산출물)" />
        <Select value={subject} onChange={(e) => setSubject(e.target.value as SubjectCode)}>
          <option value="KOREAN">국어</option><option value="MATH">수학</option><option value="ENGLISH">영어</option><option value="SCIENCE">과학</option><option value="SOCIAL">사탐</option>
        </Select>
        <PrimaryButton type="submit">추가</PrimaryButton>
      </form>
    </SectionPanel>
    <section className="grid gap-4 md:grid-cols-2">{data.tasks.map((t) => <div key={t.id} className="space-y-2"><TaskCard title={t.title} deliverable={t.deliverable} subject={subjectLabels[t.subject]} /><SecondaryButton onClick={() => actions.toggleTask(t.id)}>{t.completed ? '완료 취소' : '완료 처리'}</SecondaryButton></div>)}</section>
  </AppShell>;
}
