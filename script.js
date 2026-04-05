// Get elements
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

// Add todo function
function addTodo() {
  const todoText = todoInput.value.trim();

  // Check if input is not empty
  if (todoText === "") {
    alert("Please enter a task!");
    return;
  }

  // Create todo item
  const todoItem = document.createElement("li");
  todoItem.className = "todo-item";

  // Create todo text span
  const todoTextSpan = document.createElement("span");
  todoTextSpan.className = "todo-text";
  todoTextSpan.textContent = todoText;

  // Toggle completed state on click
  todoTextSpan.onclick = function () {
    todoTextSpan.classList.toggle("completed");
  };

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = function () {
    todoItem.remove();
    checkEmptyState();
  };

  // Append elements
  todoItem.appendChild(todoTextSpan);
  todoItem.appendChild(deleteBtn);
  todoList.appendChild(todoItem);

  // Clear input
  todoInput.value = "";
  todoInput.focus();

  // Remove empty state if it exists
  checkEmptyState();
}

// Check and update empty state
function checkEmptyState() {
  const existingEmptyState = document.querySelector(".empty-state");

  if (todoList.children.length === 0) {
    if (!existingEmptyState) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.textContent = "No tasks yet. Add one to get started!";
      todoList.appendChild(emptyState);
    }
  } else {
    if (existingEmptyState) {
      existingEmptyState.remove();
    }
  }
}

// Event listeners
addBtn.addEventListener("click", addTodo);

// Allow Enter key to add todo
todoInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

// Initialize empty state
checkEmptyState();
