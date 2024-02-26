/** Isi Array
 * [
 *    {
 *      id: <int>
 *      task: <string>
 *      timestamp: <string>
 *      isCompleted: <boolean>
 *    }
 * ]
 */

const todos = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "save-event";
const STORAGE_KEY = "TODO-KEY";

function isStorageExist() {
  if (typeof Storage === "undifined") {
    alert("Sayang sekali, Browser Anda tidak mendukung Web Storage :( ");
    return false;
  }
  return true;
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id == todoId) {
      return index;
    }
  }
  return -1;
}

function makeTodo(todoObject) {
  const { id, task, timestamp, isCompleted } = todoObject;

  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);
  // container.setAttribute('id', `todo-${id}`)

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeTaskToCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addTodo() {
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generateID = generateId();
  const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert(`Tugas baru "${textTodo}" Telah ditambahkan`);
}

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert(`Tugas "${todoTarget.task}" telah terselesaikan`);
}

function removeTaskToCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);

  alert(`Satu tugas telah dihapus`);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert(`Tugas "${todoTarget.task}" dikerjakan ulang`);
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  // console.log(todos)

  const uncompleteTODOlist = document.getElementById("todos");
  uncompleteTODOlist.innerHTML = " ";

  const completeTODOlist = document.getElementById("completed-todos");
  completeTODOlist.innerHTML = " ";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);

    if (!todoItem.isCompleted) uncompleteTODOlist.append(todoElement);
    else completeTODOlist.append(todoElement);
  }
});

document.addEventListener(SAVED_EVENT, function () {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  console.log(data);

  //   alert(`${STORAGE_KEY[0]} Telah ditambahkan`);
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
