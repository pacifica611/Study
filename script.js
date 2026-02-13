const KEY = 'studyos-app-v2';

const initialState = {
  tasks: [],
  blocks: [],
  problems: [],
  sessions: [],
};

let state = load();
let activeTimer = null;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || structuredClone(initialState);
  } catch {
    return structuredClone(initialState);
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function secToMin(sec) {
  return Math.floor(sec / 60);
}

function nextAction(problem) {
  if (problem.star >= 2 || problem.wrong >= 2) return 'STUDY_SOLUTION';
  if (problem.star > 0 || problem.wrong > 0 || problem.redo) return 'RETRY_BLIND';
  return 'NONE';
}

function switchTab(tabId) {
  $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tabId));
  $$('.panel').forEach((p) => p.classList.toggle('active', p.id === tabId));
}

function emptyState(text) {
  const li = document.createElement('li');
  li.className = 'empty';
  li.textContent = text;
  return li;
}

function renderSummary() {
  const totalSec = state.sessions.reduce((a, s) => a + s.sec, 0);
  const doneTasks = state.tasks.filter((t) => t.done).length;
  const plannedBlocks = state.blocks.filter((b) => b.status === 'planned').length;
  const loopNeeded = state.problems.filter((p) => nextAction(p) !== 'NONE').length;

  $('#summary').innerHTML = `
    <div class="col-6 col-md-3"><article class="summary-card card card-body"><p>오늘 순공 시간</p><strong>${secToMin(totalSec)}분</strong></article></div>
    <div class="col-6 col-md-3"><article class="summary-card card card-body"><p>완료 Task</p><strong>${doneTasks}개</strong></article></div>
    <div class="col-6 col-md-3"><article class="summary-card card card-body"><p>예정 PlanBlock</p><strong>${plannedBlocks}개</strong></article></div>
    <div class="col-6 col-md-3"><article class="summary-card card card-body"><p>재풀이 필요 문제</p><strong>${loopNeeded}개</strong></article></div>
  `;
}

$$('.tab').forEach((btn) => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

$('#resetData').addEventListener('click', () => {
  if (!confirm('모든 학습 데이터를 초기화할까요?')) return;
  localStorage.removeItem(KEY);
  state = structuredClone(initialState);
  stopActiveTimer();
  render();
});

$('#taskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  state.tasks.unshift({
    id: uid(),
    title: String(fd.get('title')).trim(),
    subject: String(fd.get('subject')).trim(),
    minutes: Number(fd.get('minutes')),
    done: false,
  });
  e.currentTarget.reset();
  save();
  render();
});

$('#problemForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const problem = {
    id: uid(),
    title: String(fd.get('title')).trim(),
    subject: String(fd.get('subject')).trim(),
    book: String(fd.get('book')).trim(),
    redo: false,
    star: 0,
    wrong: 0,
    attempts: 0,
  };
  problem.action = nextAction(problem);
  state.problems.unshift(problem);
  e.currentTarget.reset();
  save();
  render();
});

$('#generateBlocks').addEventListener('click', () => {
  const pending = state.tasks.filter((t) => !t.done);
  pending.forEach((task) => {
    const hasPlanned = state.blocks.some((b) => b.taskId === task.id && b.status === 'planned');
    if (hasPlanned) return;
    state.blocks.push({
      id: uid(),
      taskId: task.id,
      title: task.title,
      subject: task.subject,
      minutes: Math.min(25, task.minutes),
      status: 'planned',
      spentSec: 0,
    });
  });
  save();
  render();
});

function renderTasks() {
  const el = $('#taskList');
  el.innerHTML = '';

  if (state.tasks.length === 0) {
    el.append(emptyState('아직 Task가 없습니다. 플래너에서 오늘 할 일을 추가해보세요.'));
    return;
  }

  state.tasks.forEach((t) => {
    const node = $('#itemTpl').content.firstElementChild.cloneNode(true);
    node.querySelector('.name').textContent = t.title;
    node.querySelector('.meta').textContent = `${t.subject} · ${t.minutes}분 · ${t.done ? '완료' : '미완료'}`;
    node.querySelector('.submeta').textContent = t.done ? '완료된 Task입니다.' : '완료하면 자동으로 통계에 반영됩니다.';

    const actions = node.querySelector('.actions');
    const doneBtn = document.createElement('button');
    doneBtn.className = `btn ${t.done ? 'btn-outline-secondary' : 'btn-outline-success'}`;
    doneBtn.textContent = t.done ? '완료 취소' : '완료';
    doneBtn.onclick = () => {
      t.done = !t.done;
      save();
      render();
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-outline-danger';
    delBtn.textContent = '삭제';
    delBtn.onclick = () => {
      state.tasks = state.tasks.filter((x) => x.id !== t.id);
      state.blocks = state.blocks.filter((b) => b.taskId !== t.id);
      save();
      render();
    };

    actions.append(doneBtn, delBtn);
    el.append(node);
  });
}

function stopActiveTimer() {
  if (!activeTimer) return;
  clearInterval(activeTimer.timer);
  const block = state.blocks.find((b) => b.id === activeTimer.blockId);
  if (block) {
    const sec = Math.max(0, Math.floor((Date.now() - activeTimer.startedAt) / 1000));
    block.spentSec += sec;
    state.sessions.push({ id: uid(), subject: block.subject, sec, at: Date.now() });
  }
  activeTimer = null;
}

function renderBlocks() {
  const el = $('#blockList');
  el.innerHTML = '';

  if (state.blocks.length === 0) {
    el.append(emptyState('생성된 PlanBlock이 없습니다. 플래너 Task를 추가한 뒤 블록을 생성하세요.'));
    return;
  }

  state.blocks.forEach((b) => {
    const node = $('#itemTpl').content.firstElementChild.cloneNode(true);
    node.querySelector('.name').textContent = b.title;
    node.querySelector('.meta').textContent = `${b.subject} · ${b.minutes}분 · 상태: ${b.status}`;

    const running = activeTimer?.blockId === b.id;
    const liveSec = running ? Math.floor((Date.now() - activeTimer.startedAt) / 1000) : 0;
    node.querySelector('.submeta').textContent = `누적 순공 시간 ${secToMin(b.spentSec + liveSec)}분`;

    const actions = node.querySelector('.actions');

    const startBtn = document.createElement('button');
    startBtn.className = 'btn btn-outline-primary';
    startBtn.textContent = running ? '진행중' : '시작';
    startBtn.disabled = b.status !== 'planned' || running;
    startBtn.onclick = () => {
      stopActiveTimer();
      activeTimer = { blockId: b.id, startedAt: Date.now(), timer: setInterval(render, 1000) };
      render();
    };

    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'btn btn-outline-secondary';
    pauseBtn.textContent = '정지/저장';
    pauseBtn.onclick = () => {
      stopActiveTimer();
      save();
      render();
    };

    const doneBtn = document.createElement('button');
    doneBtn.className = 'btn btn-outline-success';
    doneBtn.textContent = '완료';
    doneBtn.onclick = () => {
      if (activeTimer?.blockId === b.id) stopActiveTimer();
      b.status = 'done';
      const task = state.tasks.find((t) => t.id === b.taskId);
      if (task) task.done = true;
      save();
      render();
    };

    const postponeBtn = document.createElement('button');
    postponeBtn.className = 'btn btn-outline-warning';
    postponeBtn.textContent = '미루기';
    postponeBtn.onclick = () => {
      if (activeTimer?.blockId === b.id) stopActiveTimer();
      b.status = 'postponed';
      state.blocks.push({ ...b, id: uid(), status: 'planned', spentSec: 0 });
      save();
      render();
    };

    actions.append(startBtn, pauseBtn, doneBtn, postponeBtn);
    el.append(node);
  });
}

function renderProblems() {
  const el = $('#problemList');
  el.innerHTML = '';

  if (state.problems.length === 0) {
    el.append(emptyState('등록된 문제가 없습니다. 문제를 추가하고 ∞/★//를 기록해보세요.'));
    return;
  }

  state.problems.forEach((p) => {
    p.action = nextAction(p);

    const node = $('#itemTpl').content.firstElementChild.cloneNode(true);
    node.querySelector('.name').textContent = p.title;
    node.querySelector('.meta').textContent = `${p.subject}${p.book ? ` · ${p.book}` : ''} · ∞:${p.redo ? 'ON' : 'OFF'} · ★:${p.star} · /:${p.wrong}`;
    node.querySelector('.submeta').textContent = `NextAction: ${p.action} · 시도 ${p.attempts}회`;

    const actions = node.querySelector('.actions');
    const redo = document.createElement('button');
    redo.className = 'btn btn-outline-primary';
    redo.textContent = '∞ 토글';
    redo.onclick = () => {
      p.redo = !p.redo;
      p.attempts += 1;
      save();
      render();
    };

    const star = document.createElement('button');
    star.className = 'btn btn-outline-warning';
    star.textContent = '★ +1';
    star.onclick = () => {
      p.star += 1;
      p.attempts += 1;
      save();
      render();
    };

    const wrong = document.createElement('button');
    wrong.className = 'btn btn-outline-warning';
    wrong.textContent = '/ +1';
    wrong.onclick = () => {
      p.wrong += 1;
      p.attempts += 1;
      save();
      render();
    };

    const clear = document.createElement('button');
    clear.className = 'btn btn-outline-success';
    clear.textContent = '정답 처리';
    clear.onclick = () => {
      p.redo = false;
      p.attempts += 1;
      save();
      render();
    };

    actions.append(redo, star, wrong, clear);
    el.append(node);
  });
}

function renderReport() {
  const totalSec = state.sessions.reduce((a, s) => a + s.sec, 0);
  const doneBlocks = state.blocks.filter((b) => b.status === 'done').length;
  const postponed = state.blocks.filter((b) => b.status === 'postponed').length;

  const bySubject = {};
  state.sessions.forEach((s) => {
    bySubject[s.subject] = (bySubject[s.subject] || 0) + s.sec;
  });

  const rows = Object.entries(bySubject)
    .sort((a, b) => b[1] - a[1])
    .map(([subject, sec]) => `<li>${subject}: ${secToMin(sec)}분</li>`)
    .join('');

  $('#reportBody').innerHTML = `
    <div class="kpi row g-2 mb-3">
      <div class="col-md-4"><div class="card card-body"><strong>${secToMin(totalSec)}분</strong><p class="mb-0">총 순공 시간</p></div></div>
      <div class="col-md-4"><div class="card card-body"><strong>${doneBlocks}</strong><p class="mb-0">완료 블록</p></div></div>
      <div class="col-md-4"><div class="card card-body"><strong>${postponed}</strong><p class="mb-0">미룬 블록</p></div></div>
    </div>
    <h3>과목별 시간</h3>
    ${rows ? `<ul>${rows}</ul>` : '<div class="empty">아직 기록된 세션이 없습니다.</div>'}
  `;
}

function render() {
  renderSummary();
  renderTasks();
  renderBlocks();
  renderProblems();
  renderReport();
}

window.addEventListener('beforeunload', () => {
  stopActiveTimer();
  save();
});

render();
