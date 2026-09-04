// ===== TaskFlow - Priority Task Manager =====

const STORAGE_KEY = 'taskflow.tasks';

// Priority ordering used for sorting (higher first)
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };

let tasks = loadTasks();
let currentFilter = 'all';

// DOM references
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');
const filtersEl = document.getElementById('filters');
const clearAllBtn = document.getElementById('clear-all-btn');

// ===== Persistence =====
function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ===== Add Task =====
function addTask(text, priority) {
    const trimmed = text.trim();
    if (!trimmed) return;

    tasks.push({
        id: Date.now().toString(),
        text: trimmed,
        priority: priority,
        completed: false
    });

    saveTasks();
    render();
}

// ===== Delete Task =====
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    render();
}

// ===== Toggle Complete =====
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        render();
    }
}

// ===== Clear All =====
function clearAll() {
    if (tasks.length === 0) return;
    if (confirm('Delete all tasks? This cannot be undone.')) {
        tasks = [];
        saveTasks();
        render();
    }
}

// ===== Render =====
function render() {
    // Sort by priority (high -> low), completed tasks sink to the bottom
    const sorted = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });

    const visible = currentFilter === 'all'
        ? sorted
        : sorted.filter(t => t.priority === currentFilter);

    taskList.innerHTML = '';

    visible.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority}${task.completed ? ' completed' : ''}`;

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        // Content
        const content = document.createElement('div');
        content.className = 'task-content';

        const textEl = document.createElement('div');
        textEl.className = 'task-text';
        textEl.textContent = task.text;

        const badge = document.createElement('span');
        badge.className = `priority-badge ${task.priority}`;
        badge.textContent = PRIORITY_LABELS[task.priority];

        content.appendChild(textEl);
        content.appendChild(badge);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    // Empty state + count
    emptyState.classList.toggle('hidden', visible.length > 0);
    if (visible.length === 0 && tasks.length > 0) {
        emptyState.textContent = 'No tasks match this filter.';
        emptyState.classList.remove('hidden');
    } else if (tasks.length === 0) {
        emptyState.textContent = 'No tasks yet. Add one above to get started! 🚀';
    }

    const remaining = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''} · ${remaining} active`;
}

// ===== Event Listeners =====
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value, prioritySelect.value);
    taskInput.value = '';
    taskInput.focus();
});

filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
});

clearAllBtn.addEventListener('click', clearAll);

// Initial render
render();
