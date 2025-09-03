let editingIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("itemInput");
  const addBtn = document.getElementById("addBtn");
  const list = document.getElementById("itemList");

  addBtn.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value) return;

    if (editingIndex !== null) {
      const items = list.querySelectorAll("li");
      items[editingIndex].querySelector("span").textContent = value;
      editingIndex = null;
    } else {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = value;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";

      editBtn.addEventListener("click", () => {
        input.value = span.textContent;
        editingIndex = Array.from(list.children).indexOf(li);
      });

      delBtn.addEventListener("click", () => {
        li.remove();
        editingIndex = null;
      });

      li.append(span, editBtn, delBtn);
      list.appendChild(li);
    }

    input.value = "";
  });
});
