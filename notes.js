const STORAGE_KEY = 'notes-app.notes';

const noteForm = document.getElementById('noteForm');
const noteTitleInput = document.getElementById('noteTitle');
const noteBodyInput = document.getElementById('noteBody');
const notesList = document.getElementById('notesList');
const emptyState = document.getElementById('emptyState');

let notes = loadNotes();

function loadNotes() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function renderNotes() {
    notesList.innerHTML = '';
    emptyState.style.display = notes.length === 0 ? 'block' : 'none';

    notes.forEach(function (note) {
        const item = document.createElement('li');
        item.className = 'note-item';

        const content = document.createElement('div');
        content.className = 'note-content';

        const title = document.createElement('div');
        title.className = 'note-item-title';
        title.textContent = note.title;

        const body = document.createElement('div');
        body.className = 'note-item-body';
        body.textContent = note.body;

        content.appendChild(title);
        content.appendChild(body);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteNote(note.id);
        });

        item.appendChild(content);
        item.appendChild(deleteButton);
        notesList.appendChild(item);
    });
}

function addNote(title, body) {
    notes.unshift({
        id: Date.now().toString(),
        title: title,
        body: body
    });
    saveNotes();
    renderNotes();
}

function deleteNote(id) {
    notes = notes.filter(function (note) {
        return note.id !== id;
    });
    saveNotes();
    renderNotes();
}

noteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = noteTitleInput.value.trim();
    const body = noteBodyInput.value.trim();

    if (!title || !body) {
        return;
    }

    addNote(title, body);
    noteForm.reset();
    noteTitleInput.focus();
});

renderNotes();
