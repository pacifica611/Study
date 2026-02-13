const KEY = 'study-loop-v1';

const nowDate = () => new Date().toISOString().slice(0, 10);
const uid = () => crypto.randomUUID();

const defaultState = {
  tasks: [],
  problems: [],
  planBlocks: [],
  sessions: [],
  timetable: [{ id: uid(), day: 1, start: '19:00', end: '20:00', title: '수학 자습', subject: '수학', type: 'CLASS' }],
  events: [],
  planner: { cycleFilter: 'daily', monthAnchor: nowDate().slice(0, 7) },
  timer: { running: false, blockId: null, startedAt: null, elapsedSec: 0 },
};

let state = load();

function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return structuredClone(defaultState);
  return { ...structuredClone(defaultState), ...JSON.parse(raw), planner: { ...defaultState.planner, ...JSON.parse(raw).planner } };
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === tab));
  if (tab === 'report') renderReport();
  if (tab === 'planner') renderPlannerCalendar();
}

function calcNextAction(problem) {
  if (problem.starCount >= 2 || problem.wrongCount >= 2) return 'STUDY_SOLUTION';
  if (problem.redoFlag || problem.starCount > 0 || problem.wrongCount > 0) return 'RETRY_BLIND';
  return 'NONE';
}

function createPlanForToday() {
  const today = nowDate();
  const todo = state.tasks.filter((t) => !t.done && isTaskInCycleForDate(t, today));

  const queue = [
    ...state.problems
      .map((p) => ({ ...p, nextAction: calcNextAction(p) }))
      .filter((p) => p.nextAction !== 'NONE')
      .sort((a, b) => b.starCount + b.wrongCount - (a.starCount + a.wrongCount))
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
    state.planBlocks.push({ id: uid(), date: today, start, end, ...item, status: 'planned', memo: '' });
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
  const list = state.planBlocks.filter((b) => b.date === today).sort((a, b) => a.start.localeCompare(b.start));
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = '';

  if (!list.length) {
    timeline.innerHTML = '<p class="small">오늘 블록이 없습니다. 자동 계획 생성을 눌러주세요.</p>';
    return;
  }

  list.forEach((b) => {
    const node = document.getElementById('timelineItemTemplate').content.firstElementChild.cloneNode(true);
    node.querySelector('.meta').textContent = `${b.start}~${b.end} · ${b.subject} · ${b.type}`;
    node.querySelector('h3').textContent = b.title;
    node.querySelector('.status').textContent = `상태: ${b.status}`;
    const actions = node.querySelector('.actions');

    actions.append(
      btn('지금 시작', 'primary', () => startTimer(b.id)),
      btn('완료', 'success', () => {
        stopTimer(b.id);
        b.status = 'done';
        save();
        renderAll();
      }),
      btn('미루기', 'warn', () => {
        b.status = 'postponed';
        b.start = bumpTime(b.end, 0);
        b.end = bumpTime(b.end, 30);
        save();
        renderAll();
      })
    );

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
    p.nextAction = calcNextAction(p);
    const card = document.createElement('div');
    card.className = 'problem-card';
    card.innerHTML = `
      <div><strong>${p.subject}</strong> · ${p.book} #${p.no}</div>
      <div class="small">NextAction: ${p.nextAction}</div>
      <div style="margin:6px 0;">
        <span class="badge">∞ ${p.redoFlag ? 'ON' : 'OFF'}</span>
        <span class="badge">★ ${p.starCount}</span>
        <span class="badge">/ ${p.wrongCount}</span>
      </div>
      <div class="small">${p.note || ''}</div>
      ${p.photoData ? `<img class="problem-photo" src="${p.photoData}" alt="문제 사진" />` : ''}
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

function isTaskInCycleForDate(task, dateStr) {
  const base = task.planDate || task.due || dateStr;
  if (task.planCycle === 'daily') return true;
  if (task.planCycle === 'weekly') return weekKey(base) === weekKey(dateStr);
  return base.slice(0, 7) === dateStr.slice(0, 7);
}

function weekKey(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day + 3);
  const firstThursday = new Date(date.getFullYear(), 0, 4);
  const diff = date - firstThursday;
  return `${date.getFullYear()}-W${String(1 + Math.round(diff / 604800000)).padStart(2, '0')}`;
}

function renderTasks() {
  const box = document.getElementById('taskList');
  box.innerHTML = '';
  const cycle = state.planner.cycleFilter;

  state.tasks
    .filter((t) => t.planCycle === cycle)
    .sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'))
    .forEach((t) => {
      const row = document.createElement('div');
      row.className = 'problem-card';
      row.innerHTML = `<strong>${t.title}</strong> <span class="small">(${t.subject}, ${t.minutes}분, P${t.priority}, ${cycleLabel(t.planCycle)})</span><div class="small">기준일: ${t.planDate || '-'} / 마감: ${t.due || '-'}</div>`;
      row.append(btn(t.done ? '완료됨' : '완료 처리', t.done ? 'ghost' : 'success', () => { t.done = true; save(); renderAll(); }));
      box.appendChild(row);
    });

  if (!box.innerHTML) box.innerHTML = '<p class="small">해당 주기의 Task가 없습니다.</p>';
}

function cycleLabel(cycle) {
  return cycle === 'daily' ? '매일' : cycle === 'weekly' ? '매주' : '매월';
}

function renderPlannerCalendar() {
  const title = document.getElementById('calendarTitle');
  const grid = document.getElementById('calendarGrid');
  if (!title || !grid) return;

  const [year, month] = state.planner.monthAnchor.split('-').map(Number);
  title.textContent = `${year}년 ${month}월`;

  const first = new Date(year, month - 1, 1);
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push({ day: '', muted: true, count: '' });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const count = state.tasks.filter((t) => isTaskInCycleForDate(t, dateStr)).length;
    cells.push({ day: String(d), muted: false, count: count ? `${count}개` : '' });
  }

  grid.innerHTML = '';
  ['월', '화', '수', '목', '금', '토', '일'].forEach((w) => {
    const h = document.createElement('div');
    h.className = 'calendar-cell muted';
    h.innerHTML = `<div class="day">${w}</div>`;
    grid.appendChild(h);
  });

  cells.forEach((cell) => {
    const div = document.createElement('div');
    div.className = `calendar-cell ${cell.muted ? 'muted' : ''}`;
    div.innerHTML = `<div class="day">${cell.day}</div><div class="count">${cell.count}</div>`;
    grid.appendChild(div);
  });
}

function changeMonth(delta) {
  const [y, m] = state.planner.monthAnchor.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  state.planner.monthAnchor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  save();
  renderPlannerCalendar();
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

  document.getElementById('reportBody').innerHTML = `
    <p><strong>오늘 순공 시간:</strong> ${(secSum / 60).toFixed(1)}분</p>
    <p><strong>완료 블록:</strong> ${doneBlocks}개 / <strong>미룬 블록:</strong> ${postponed}개</p>
    <p><strong>오늘 추가한 문제:</strong> ${newProblems}개</p>
    <h3>과목별 시간</h3>
    <ul>${Object.entries(bySubject).map(([sub, sec]) => `<li>${sub}: ${(sec / 60).toFixed(1)}분</li>`).join('') || '<li>기록 없음</li>'}</ul>
  `;
}

function btn(text, cls, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `btn ${cls}`;
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function bindForms() {
  const photoInput = document.querySelector('#problemForm input[name="photo"]');
  const preview = document.getElementById('photoPreview');

  photoInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      preview.classList.add('hidden');
      preview.src = '';
      return;
    }
    preview.src = await readFileAsDataURL(file);
    preview.classList.remove('hidden');
  });

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
      planCycle: f.get('planCycle') || 'daily',
      planDate: f.get('planDate') || nowDate(),
      done: false,
    });
    e.target.reset();
    save();
    renderAll();
  });

  document.getElementById('problemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const photoFile = f.get('photo');
    const photoData = photoFile && photoFile.size ? await readFileAsDataURL(photoFile) : '';

    state.problems.push({
      id: uid(),
      book: f.get('book'),
      no: f.get('no'),
      subject: f.get('subject'),
      tags: String(f.get('tags') || '').split(',').map((v) => v.trim()).filter(Boolean),
      note: f.get('note') || '',
      photoData,
      redoFlag: false,
      starCount: 0,
      wrongCount: 0,
      createdAt: nowDate(),
    });

    e.target.reset();
    preview.classList.add('hidden');
    preview.src = '';
    save();
    renderAll();
  });
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => switchTab(t.dataset.tab)));
  document.querySelectorAll('.cycle-tab').forEach((t) => {
    t.addEventListener('click', () => {
      state.planner.cycleFilter = t.dataset.cycle;
      document.querySelectorAll('.cycle-tab').forEach((x) => x.classList.toggle('active', x.dataset.cycle === state.planner.cycleFilter));
      save();
      renderTasks();
    });
  });
  document.getElementById('prevMonthBtn').addEventListener('click', () => changeMonth(-1));
  document.getElementById('nextMonthBtn').addEventListener('click', () => changeMonth(1));
}

function renderQuickSummary() {
  const today = nowDate();
  const todayBlocks = state.planBlocks.filter((b) => b.date === today);
  const done = todayBlocks.filter((b) => b.status === 'done').length;
  const totalMin = state.sessions.filter((s) => s.date === today).reduce((sum, s) => sum + s.activeSec, 0) / 60;

  const summary = document.getElementById('quickSummary');
  if (!summary) return;
  summary.innerHTML = `<li>PlanBlock: ${todayBlocks.length}개</li><li>완료: ${done}개</li><li>순공: ${totalMin.toFixed(1)}분</li>`;
}

function syncPlannerTabState() {
  document.querySelectorAll('.cycle-tab').forEach((x) => x.classList.toggle('active', x.dataset.cycle === state.planner.cycleFilter));
}

function renderAll() {
  renderToday();
  renderProblems();
  renderTasks();
  renderReport();
  renderPlannerCalendar();
  renderQuickSummary();
  syncPlannerTabState();
}

document.getElementById('generatePlanBtn').addEventListener('click', createPlanForToday);
bindForms();
bindTabs();
renderAll();
setInterval(() => {
  if (state.timer.running) renderToday();
}, 1000);
