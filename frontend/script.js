document.addEventListener("DOMContentLoaded", () => {
    // Splash → depois mostra login ou app
    setTimeout(() => {
        document.getElementById("splash").classList.add("d-none");
        checkLogin();
    }, 2000);
});

// Verifica login salvo
function checkLogin() {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
        document.getElementById("mainContent").classList.remove("d-none");
    } else {
        document.getElementById("loginScreen").classList.remove("d-none");
    }
}

// Login fake
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username && password) {
        localStorage.setItem("loggedIn", "true");
        document.getElementById("loginScreen").classList.add("d-none");
        document.getElementById("mainContent").classList.remove("d-none");
        loadTasks();
    } else {
        alert("Preencha usuário e senha!");
    }
}

// Logout
function logout() {
    localStorage.removeItem("loggedIn");
    document.getElementById("mainContent").classList.add("d-none");
    document.getElementById("loginScreen").classList.remove("d-none");
}

// CRUD de tarefas com LocalStorage
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    const task = { text: taskText, completed: false };

    saveTask(task);
    renderTask(task);

    taskInput.value = "";
}

function renderTask(task) {
    const taskList = document.getElementById("taskList");

    const taskItem = document.createElement("div");
    taskItem.className = "list-group-item d-flex justify-content-between align-items-center fade-in";

    const taskSpan = document.createElement("span");
    taskSpan.textContent = task.text;
    if (task.completed) taskSpan.classList.add("completed");

    const btnGroup = document.createElement("div");

    const completeBtn = document.createElement("button");
    completeBtn.className = "btn btn-success btn-sm me-2";
    completeBtn.innerHTML = '<i class="bi bi-check2"></i>';
    completeBtn.onclick = () => {
        task.completed = !task.completed;
        taskSpan.classList.toggle("completed");
        updateTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.onclick = () => {
        taskItem.classList.add("fade-out");
        setTimeout(() => {
            removeTask(task);
            taskItem.remove();
        }, 300);
    };

    btnGroup.appendChild(completeBtn);
    btnGroup.appendChild(deleteBtn);

    taskItem.appendChild(taskSpan);
    taskItem.appendChild(btnGroup);

    taskList.appendChild(taskItem);
}

// LocalStorage helpers
function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList .list-group-item").forEach(item => {
        const text = item.querySelector("span").textContent;
        const completed = item.querySelector("span").classList.contains("completed");
        tasks.push({ text, completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(taskToRemove) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.text !== taskToRemove.text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasks();
    document.getElementById("taskList").innerHTML = "";
    tasks.forEach(task => renderTask(task));
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}