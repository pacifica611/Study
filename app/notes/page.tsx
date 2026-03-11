'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { IdeaNoteCard } from '@/components/domain';
import { EmptyState, SectionPanel } from '@/components/ui/cards';
import { Input, Textarea, Select } from '@/components/ui/forms';
import { PrimaryButton } from '@/components/ui/buttons';
import { useStudyStore, subjectLabels } from '@/lib/store';
import { SubjectCode } from '@/lib/types';

export default function NotesPage() {
  const { data, actions, ready } = useStudyStore();
  const [subject, setSubject] = useState<SubjectCode>('KOREAN');
  const [insight, setInsight] = useState('');
  const [rule, setRule] = useState('');

  if (!ready) return <AppShell><SectionPanel title="로딩">노트를 불러오는 중...</SectionPanel></AppShell>;

  return <AppShell><PageHeader title="인사이트/행동 규칙 노트" description="짧게 기록하고 다음 시험에서 바로 재사용하세요." />
    <SectionPanel title="빠른 기록">
      <div className="grid gap-3 md:grid-cols-4">
        <Select value={subject} onChange={(e) => setSubject(e.target.value as SubjectCode)}><option value="KOREAN">국어</option><option value="MATH">수학</option><option value="ENGLISH">영어</option><option value="SCIENCE">과학</option><option value="SOCIAL">사탐</option></Select>
        <Input value={insight} onChange={(e) => setInsight(e.target.value)} placeholder="배운 점" className="md:col-span-2" />
        <PrimaryButton onClick={() => { if (!insight || !rule) return; actions.addNote({ subject, insight, actionRule: rule }); setInsight(''); setRule(''); }}>저장</PrimaryButton>
      </div>
      <Textarea rows={3} value={rule} onChange={(e) => setRule(e.target.value)} placeholder="비슷한 상황에서 다음에 할 행동" className="mt-3"/>
    </SectionPanel>
    <section className="grid gap-4 md:grid-cols-2">{data.notes.length ? data.notes.map((n) => <IdeaNoteCard key={n.id} subject={subjectLabels[n.subject]} insight={n.insight} actionRule={n.actionRule} />) : <EmptyState title="노트가 아직 없어요" description="세션 종료 후 1줄 행동 규칙부터 남겨보세요." />}</section>
  </AppShell>;
}
