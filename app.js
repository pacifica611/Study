const KEY = 'study-loop-v1';

const nowDate = () => new Date().toISOString().slice(0, 10);
const uid = () => crypto.randomUUID();

const defaultState = {
  tasks: [],
  problems: [],
  planBlocks: [],
  sessions: [],
  timetable: [
    { id: uid(), day: 1, start: '19:00', end: '20:00', title: '수학 자습', subject: '수학', type: 'CLASS' }
  ],
  events: [],
  timer: { running: false, blockId: null, startedAt: null, elapsedSec: 0 },
};

let state = load();

function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return structuredClone(defaultState);
  return { ...structuredClone(defaultState), ...JSON.parse(raw) };
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === tab));
  if (tab === 'report') renderReport();
}

function calcNextAction(problem) {
  if (problem.starCount >= 2) return 'STUDY_SOLUTION';
  if (problem.wrongCount >= 2) return 'STUDY_SOLUTION';
  if (problem.redoFlag) return 'RETRY_BLIND';
  if (problem.starCount > 0 || problem.wrongCount > 0) return 'RETRY_BLIND';
  return 'NONE';
}

function createPlanForToday() {
  const today = nowDate();
  const carry = state.planBlocks.filter((b) => b.date < today && ['planned', 'postponed'].includes(b.status));
  carry.forEach((b) => {
    b.date = today;
    b.status = 'planned';
  });

  const todo = state.tasks.filter((t) => !t.done);
  const queue = [
    ...state.problems
      .map((p) => ({ ...p, nextAction: calcNextAction(p) }))
      .filter((p) => p.nextAction !== 'NONE')
      .sort((a, b) => (b.starCount + b.wrongCount) - (a.starCount + a.wrongCount))
      .map((p) => ({ type: 'LOOP', title: `${p.subject} ${p.book} #${p.no} ${calcNextAction(p)}`, subject: p.subject, refId: p.id })),
    ...todo
      .sort((a, b) => b.priority - a.priority)
      .map((t) => ({ type: 'TASK', title: t.title, subject: t.subject, refId: t.id })),
  ];

  const startHour = 17;
  state.planBlocks = state.planBlocks.filter((b) => b.date === today && b.status === 'done');
  queue.slice(0, 10).forEach((item, i) => {
    const start = `${String(startHour + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`;
    const end = `${String(startHour + Math.floor((i + 1) / 2)).padStart(2, '0')}:${(i + 1) % 2 === 0 ? '00' : '30'}`;
    state.planBlocks.push({
      id: uid(),
      date: today,
      start,
      end,
      ...item,
      status: 'planned',
      memo: ''
    });
  });

  save();
  renderAll();
}

function startTimer(blockId) {
  state.timer = { running: true, blockId, startedAt: Date.now(), elapsedSec: 0 };
  save();
  renderToday();
}

function stopTimer(blockId) {
  if (!state.timer.running || state.timer.blockId !== blockId) return;
  const elapsed = Math.floor((Date.now() - state.timer.startedAt) / 1000);
  state.sessions.push({ id: uid(), blockId, date: nowDate(), activeSec: elapsed });
  state.timer = { running: false, blockId: null, startedAt: null, elapsedSec: 0 };
  save();
  renderToday();
}

function renderToday() {
  const today = nowDate();
  const list = state.planBlocks
    .filter((b) => b.date === today)
    .sort((a, b) => a.start.localeCompare(b.start));

  const timeline = document.getElementById('timeline');
  timeline.innerHTML = '';

  if (list.length === 0) {
    timeline.innerHTML = '<p class="small">오늘 블록이 없습니다. 자동 계획 생성을 눌러주세요.</p>';
    return;
  }

  list.forEach((b) => {
    const node = document.getElementById('timelineItemTemplate').content.firstElementChild.cloneNode(true);
    node.querySelector('.meta').textContent = `${b.start}~${b.end} · ${b.subject} · ${b.type}`;
    node.querySelector('h3').textContent = b.title;
    node.querySelector('.status').textContent = `상태: ${b.status}`;
    const actions = node.querySelector('.actions');

    const startBtn = btn('지금 시작', 'primary', () => startTimer(b.id));
    const doneBtn = btn('완료', 'success', () => {
      stopTimer(b.id);
      b.status = 'done';
      save();
      renderAll();
    });
    const postponeBtn = btn('미루기', 'warn', () => {
      b.status = 'postponed';
      b.start = bumpTime(b.end, 0);
      b.end = bumpTime(b.end, 30);
      save();
      renderAll();
    });
    actions.append(startBtn, doneBtn, postponeBtn);

    if (state.timer.running && state.timer.blockId === b.id) {
      const elapsed = Math.floor((Date.now() - state.timer.startedAt) / 1000);
      const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const ss = String(elapsed % 60).padStart(2, '0');
      const timerTag = document.createElement('span');
      timerTag.className = 'badge';
      timerTag.textContent = `타이머 ${mm}:${ss}`;
      actions.append(timerTag, btn('종료', 'ghost', () => stopTimer(b.id)));
    }

    timeline.appendChild(node);
  });
}

function bumpTime(base, plusMin) {
  const [h, m] = base.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + plusMin, 0, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function renderProblems() {
  const box = document.getElementById('problemList');
  box.innerHTML = '';
  state.problems.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'problem-card';
    p.nextAction = calcNextAction(p);
    card.innerHTML = `
      <div><strong>${p.subject}</strong> · ${p.book} #${p.no}</div>
      <div class="small">NextAction: ${p.nextAction}</div>
      <div style="margin:6px 0;"> 
        <span class="badge">∞ ${p.redoFlag ? 'ON' : 'OFF'}</span>
        <span class="badge">★ ${p.starCount}</span>
        <span class="badge">/ ${p.wrongCount}</span>
      </div>
      <div class="small">${p.note || ''}</div>
    `;

    const row = document.createElement('div');
    row.className = 'actions';
    row.append(
      btn('∞ 토글', 'ghost', () => { p.redoFlag = !p.redoFlag; save(); renderAll(); }),
      btn('못 품(★)', 'warn', () => { p.starCount += 1; save(); renderAll(); }),
      btn('틀림(/)', 'warn', () => { p.wrongCount += 1; save(); renderAll(); }),
      btn('답지X 재풀이 성공', 'success', () => {
        state.sessions.push({ id: uid(), blockId: null, date: nowDate(), activeSec: 300, subject: p.subject });
        p.redoFlag = false;
        save();
        renderAll();
      })
    );

    card.appendChild(row);
    box.appendChild(card);
  });
}

function renderTasks() {
  const box = document.getElementById('taskList');
  box.innerHTML = '';
  state.tasks.forEach((t) => {
    const row = document.createElement('div');
    row.className = 'problem-card';
    row.innerHTML = `<strong>${t.title}</strong> <span class="small">(${t.subject}, ${t.minutes}분, P${t.priority})</span>`;
    row.append(btn(t.done ? '완료됨' : '완료 처리', t.done ? 'ghost' : 'success', () => { t.done = true; save(); renderAll(); }));
    box.appendChild(row);
  });
}

function renderReport() {
  const today = nowDate();
  const todaySessions = state.sessions.filter((s) => s.date === today);
  const secSum = todaySessions.reduce((sum, s) => sum + s.activeSec, 0);
  const bySubject = {};

  todaySessions.forEach((s) => {
    const block = state.planBlocks.find((b) => b.id === s.blockId);
    const subject = s.subject || block?.subject || '미분류';
    bySubject[subject] = (bySubject[subject] || 0) + s.activeSec;
  });

  const doneBlocks = state.planBlocks.filter((b) => b.date === today && b.status === 'done').length;
  const postponed = state.planBlocks.filter((b) => b.date === today && b.status === 'postponed').length;
  const newProblems = state.problems.filter((p) => p.createdAt === today).length;

  const html = `
    <p><strong>오늘 순공 시간:</strong> ${(secSum / 60).toFixed(1)}분</p>
    <p><strong>완료 블록:</strong> ${doneBlocks}개 / <strong>미룬 블록:</strong> ${postponed}개</p>
    <p><strong>오늘 추가한 문제:</strong> ${newProblems}개</p>
    <h3>과목별 시간</h3>
    <ul>
      ${Object.entries(bySubject).map(([sub, sec]) => `<li>${sub}: ${(sec / 60).toFixed(1)}분</li>`).join('') || '<li>기록 없음</li>'}
    </ul>
  `;

  document.getElementById('reportBody').innerHTML = html;
}

function btn(text, cls, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `btn ${cls}`;
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
}

function bindForms() {
  document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    state.tasks.push({
      id: uid(),
      title: f.get('title'),
      subject: f.get('subject'),
      minutes: Number(f.get('minutes')),
      due: f.get('due') || null,
      priority: Number(f.get('priority')),
      done: false,
    });
    e.target.reset();
    save();
    renderAll();
  });

  document.getElementById('problemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    state.problems.push({
      id: uid(),
      book: f.get('book'),
      no: f.get('no'),
      subject: f.get('subject'),
      tags: String(f.get('tags') || '').split(',').map((v) => v.trim()).filter(Boolean),
      note: f.get('note') || '',
      redoFlag: false,
      starCount: 0,
      wrongCount: 0,
      createdAt: nowDate(),
    });
    e.target.reset();
    save();
    renderAll();
  });
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => switchTab(t.dataset.tab)));
}


function renderQuickSummary() {
  const today = nowDate();
  const todayBlocks = state.planBlocks.filter((b) => b.date === today);
  const done = todayBlocks.filter((b) => b.status === 'done').length;
  const totalMin = state.sessions
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + s.activeSec, 0) / 60;

  const summary = document.getElementById('quickSummary');
  if (!summary) return;
  summary.innerHTML = `
    <li>PlanBlock: ${todayBlocks.length}개</li>
    <li>완료: ${done}개</li>
    <li>순공: ${totalMin.toFixed(1)}분</li>
  `;
}

function renderAll() {
  renderToday();
  renderProblems();
  renderTasks();
  renderReport();
  renderQuickSummary();
}

document.getElementById('generatePlanBtn').addEventListener('click', createPlanForToday);
bindForms();
bindTabs();
renderAll();
setInterval(() => {
  if (state.timer.running) renderToday();
}, 1000);
