// Get elements
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const themeToggle = document.getElementById("themeToggle");
const taskCountEl = document.getElementById("taskCount");
const filterBtns = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

// Theme toggle
function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  applyTheme(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Restore saved theme on load
applyTheme(localStorage.getItem("theme") === "dark");

// Filter tabs
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

function applyFilter() {
  const items = todoList.querySelectorAll(".todo-item");
  items.forEach((item) => {
    const isCompleted = item.querySelector(".todo-checkbox").checked;
    let visible = true;
    if (currentFilter === "active") visible = !isCompleted;
    if (currentFilter === "completed") visible = isCompleted;
    item.style.display = visible ? "" : "none";
  });
  updateEmptyState();
}

// Update task counter (counts active/uncompleted items)
function updateTaskCount() {
  const items = todoList.querySelectorAll(".todo-item");
  let active = 0;
  items.forEach((item) => {
    if (!item.querySelector(".todo-checkbox").checked) active++;
  });
  taskCountEl.textContent = active;
}

// Check and update empty state
function updateEmptyState() {
  const existing = todoList.querySelector(".empty-state");
  const visibleItems = todoList.querySelectorAll(
    ".todo-item:not([style*='display: none'])",
  );

  if (visibleItems.length === 0) {
    if (!existing) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";

      const icon = document.createElement("span");
      icon.className = "empty-icon";

      if (currentFilter === "completed") {
        icon.textContent = "🏆";
        emptyState.appendChild(icon);
        emptyState.append("No completed tasks yet.");
      } else if (currentFilter === "active") {
        icon.textContent = "✅";
        emptyState.appendChild(icon);
        emptyState.append("All tasks done — great job!");
      } else {
        icon.textContent = "📝";
        emptyState.appendChild(icon);
        emptyState.append("No tasks yet. Add one to get started!");
      }

      todoList.appendChild(emptyState);
    }
  } else {
    if (existing) existing.remove();
  }
}

// Add todo function
function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText === "") {
    todoInput.focus();
    todoInput.style.borderColor = "var(--delete-color)";
    setTimeout(() => (todoInput.style.borderColor = ""), 800);
    return;
  }

  // Create todo item
  const todoItem = document.createElement("li");
  todoItem.className = "todo-item";

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.addEventListener("change", () => {
    todoTextSpan.classList.toggle("completed", checkbox.checked);
    updateTaskCount();
    applyFilter();
  });

  // Todo text
  const todoTextSpan = document.createElement("span");
  todoTextSpan.className = "todo-text";
  todoTextSpan.textContent = todoText;

  // Delete button with SVG icon
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.setAttribute("aria-label", "Delete task");
  deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  deleteBtn.addEventListener("click", () => {
    todoItem.classList.add("removing");
    todoItem.addEventListener(
      "animationend",
      () => {
        todoItem.remove();
        updateTaskCount();
        updateEmptyState();
      },
      { once: true },
    );
  });

  // Assemble item
  todoItem.appendChild(checkbox);
  todoItem.appendChild(todoTextSpan);
  todoItem.appendChild(deleteBtn);

  // Remove empty state before inserting
  const existing = todoList.querySelector(".empty-state");
  if (existing) existing.remove();

  todoList.appendChild(todoItem);

  // Clear input and focus
  todoInput.value = "";
  todoInput.focus();

  updateTaskCount();
  applyFilter();
}

// Event listeners
addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") addTodo();
});

// Initialize empty state
updateEmptyState();
