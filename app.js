let editingIndex = null;
let notes = JSON.parse(localStorage.getItem("notes")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("itemList");
  const addBtn = document.getElementById("addBtn");
  const editor = document.getElementById("richEditor");
  const tagInput = document.getElementById("tagInput");
  const searchBar = document.querySelector(".search-bar");
  const themeToggle = document.querySelector(".theme-toggle");
  const modal = document.getElementById("noteModal");

  // 🧩 Render all notes
  function renderNotes(filter = "") {
    list.innerHTML = "";
    notes
      .filter(n => n.text.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => b.pinned - a.pinned) // pinned notes on top
      .forEach((note, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="note-content">${note.text}</div>
          <div class="note-tag">${note.tag ? "#" + note.tag : ""}</div>
          <div class="note-time">${note.time}</div>
          <div class="note-actions">
            <button class="edit-btn">✏️</button>
            <button class="delete-btn">🗑️</button>
            <button class="pin-btn">${note.pinned ? "📌" : "📍"}</button>
          </div>
        `;

        // Edit
        li.querySelector(".edit-btn").addEventListener("click", () => {
          editor.innerHTML = note.text;
          tagInput.value = note.tag || "";
          editingIndex = index;
          modal.classList.add("active");
        });

        // Delete
        li.querySelector(".delete-btn").addEventListener("click", () => {
          notes.splice(index, 1);
          saveNotes();
          renderNotes(searchBar.value);
        });

        // Pin/Unpin
        li.querySelector(".pin-btn").addEventListener("click", () => {
          notes[index].pinned = !notes[index].pinned;
          saveNotes();
          renderNotes(searchBar.value);
        });

        // Add subtle animation
        li.style.animation = `popIn 0.4s ease`;
        list.appendChild(li);
      });
  }

  // 💾 Save to localStorage
  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  // ➕ Add / Edit Note
  addBtn.addEventListener("click", () => {
    const content = editor.innerHTML.trim();
    const tag = tagInput.value.trim();

    if (!content) return;

    // Get current date and time
    const now = new Date();
    const timestamp = now.toLocaleString(); // e.g., "10/15/2025, 7:30:21 PM"

    const newNote = { text: content, tag, pinned: false, time: timestamp };

    if (editingIndex !== null) {
      notes[editingIndex] = newNote;
      editingIndex = null;
    } else {
      notes.unshift(newNote); // add new notes at top
    }

    saveNotes();
    renderNotes(searchBar.value);
    editor.innerHTML = "";
    tagInput.value = "";
    modal.classList.remove("active");
  });

  // 🔍 Search Notes
  searchBar.addEventListener("input", (e) => {
    renderNotes(e.target.value);
  });

  // 🌙 Theme Toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });

  // 🧰 Rich Text Toolbar
  document.querySelectorAll(".editor-toolbar button").forEach(btn => {
    btn.addEventListener("click", () => {
      const cmd = btn.dataset.cmd;
      document.execCommand(cmd, false, null);
      editor.focus();
    });
  });

  // Initial Render
  renderNotes();
});
