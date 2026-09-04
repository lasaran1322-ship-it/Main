/* Monthly Budget Planner — vanilla JS, localStorage persistence */

const EXPENSE_CATEGORIES = ['Housing', 'Food', 'Transport', 'Utilities', 'Health', 'Entertainment', 'Education', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Other'];
const CATEGORY_COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#ec4899', '#8b5cf6', '#94a3b8'];

const STORAGE_KEY = 'budget-planner-data';

const state = {
    month: currentMonthKey(),
    transactions: [], // { id, month, type, category, description, amount, date }
    goal: { name: '', target: 0, saved: 0 }
};

function currentMonthKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function $(id) { return document.getElementById(id); }

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            state.transactions = saved.transactions || [];
            state.goal = saved.goal || state.goal;
        }
    } catch (e) { /* corrupt data — start fresh */ }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatMoney(n) {
    return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---------- Transactions ---------- */

function monthTransactions() {
    return state.transactions.filter(t => t.month === state.month);
}

function addTransaction(e) {
    e.preventDefault();
    const type = $('tx-type').value;
    const category = $('tx-category').value;
    const description = $('tx-description').value.trim();
    const amount = parseFloat($('tx-amount').value);

    if (!amount || amount <= 0) return;

    state.transactions.push({
        id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        month: state.month,
        type,
        category,
        description,
        amount,
        date: new Date().toISOString().slice(0, 10)
    });
    saveState();

    $('tx-form').reset();
    render();
}

function deleteTransaction(id) {
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveState();
    render();
}

/* ---------- Rendering ---------- */

function render() {
    renderSummary();
    renderTable();
    renderChart();
    renderGoal();
}

function renderSummary() {
    const txs = monthTransactions();
    const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = income - expense;
    const rate = income > 0 ? Math.round((balance / income) * 100) : 0;

    $('stat-income').textContent = formatMoney(income);
    $('stat-expense').textContent = formatMoney(expense);
    $('stat-balance').textContent = (balance < 0 ? '-' : '') + formatMoney(Math.abs(balance));
    $('stat-balance').style.color = balance < 0 ? 'var(--expense)' : 'var(--balance)';
    $('stat-savings-rate').textContent = rate + '%';
}

function renderTable() {
    const tbody = $('tx-table-body');
    const txs = monthTransactions().slice().reverse();
    tbody.innerHTML = '';
    $('tx-empty-msg').style.display = txs.length ? 'none' : 'block';

    for (const t of txs) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${t.date}</td>
            <td><span class="tx-type-badge ${t.type}">${t.type === 'income' ? 'Income' : 'Expense'}</span></td>
            <td>${escapeHtml(t.category)}</td>
            <td>${escapeHtml(t.description || '—')}</td>
            <td class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '−'}${formatMoney(t.amount)}</td>
            <td class="no-print"><button class="btn btn-danger" data-id="${t.id}">Delete</button></td>`;
        tr.querySelector('.btn-danger').addEventListener('click', () => deleteTransaction(t.id));
        tbody.appendChild(tr);
    }
}

function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
}

/* ---------- Doughnut chart (canvas, no libraries) ---------- */

function renderChart() {
    const canvas = $('doughnut-chart');
    const ctx = canvas.getContext('2d');
    const legend = $('chart-legend');

    const txs = monthTransactions().filter(t => t.type === 'expense');
    const totals = {};
    for (const t of txs) {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
    }
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const sum = entries.reduce((s, [, v]) => s + v, 0);

    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (sum === 0) {
        // Empty state ring
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, 100, 0, Math.PI * 2);
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 32;
        ctx.stroke();
        ctx.fillStyle = '#9ca3af';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No expenses yet', W / 2, H / 2 + 5);
        legend.innerHTML = '<li style="color:#6b7280">Add expenses to see the breakdown.</li>';
        return;
    }

    let start = -Math.PI / 2;
    entries.forEach(([cat, val], i) => {
        const slice = (val / sum) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(W / 2, H / 2);
        ctx.arc(W / 2, H / 2, 100, start, start + slice);
        ctx.closePath();
        ctx.fillStyle = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
        ctx.fill();
        start += slice;
    });

    // Center hole
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 62, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Center label
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(formatMoney(sum), W / 2, H / 2);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Total Spent', W / 2, H / 2 + 18);

    legend.innerHTML = entries.map(([cat, val], i) => `
        <li>
            <span class="legend-dot" style="background:${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}"></span>
            ${escapeHtml(cat)}
            <span class="legend-value">${Math.round((val / sum) * 100)}% · ${formatMoney(val)}</span>
        </li>`).join('');
}

/* ---------- Savings goal ---------- */

function renderGoal() {
    const { name, target, saved } = state.goal;
    const pct = target > 0 ? Math.min(100, (saved / target) * 100) : 0;
    const txs = monthTransactions();
    const net = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
        - txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    $('goal-title').textContent = name || 'No savings goal set';
    $('goal-detail').textContent = `${formatMoney(saved)} of ${formatMoney(target)} saved (${Math.round(pct)}%)`;
    $('goal-progress-fill').style.width = pct + '%';
    $('goal-remaining').textContent = 'Remaining: ' + formatMoney(Math.max(0, target - saved));
    $('goal-monthly').textContent = `This month's net balance: ${formatMoney(net)}`;
}

function updateGoal(e) {
    e.preventDefault();
    const target = parseFloat($('goal-target').value);
    const saved = parseFloat($('goal-saved').value) || 0;
    const name = $('goal-name').value.trim();

    if (!name || !target || target <= 0) {
        alert('Please enter a goal name and a target amount greater than zero.');
        return;
    }

    state.goal = { name, target, saved };
    saveState();
    renderGoal();
}

/* ---------- Init ---------- */

function populateCategoryOptions() {
    const type = $('tx-type').value;
    const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    $('tx-category').innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
}

loadState();
$('budget-month').value = state.month;
populateCategoryOptions();
render();

$('budget-month').addEventListener('change', (e) => {
    state.month = e.target.value || currentMonthKey();
    render();
});

$('tx-type').addEventListener('change', populateCategoryOptions);
$('tx-form').addEventListener('submit', addTransaction);
$('btn-save-goal').addEventListener('click', updateGoal);
$('btn-print').addEventListener('click', () => window.print());
