// Bom dia :D

const classTaskForm = "js-task-form";
const classTaskInputForm = "js-task-form-input";
const classTaskContainer = "js-task-container";
const classTaskTemplate = "c-task--template";
const classTaskInput = "js-task-input";
const classTask = "js-task";

const classBtnAdd = "c-icon--add";
const classBtnDone = "c-icon--done";
const classBtnEdit = "c-icon--edit";
const classBtnDel = "c-icon--del";
const classBtnSearch = "c-icon--search";

const classSearchForm = "js-search-form";
const classSearchInput = "js-seach-input";
const classSelectFilter = "js-select-filter";

//

const taskForm = document.querySelector(`.${classTaskForm}`);
const taskContainer = document.querySelector(`.${classTaskContainer}`);
const taskTemplate = document.querySelector(`.${classTaskTemplate}`);
const taskInputForm = document.querySelector(`.${classTaskInputForm}`);

const searchForm = document.querySelector(`.${classSearchForm}`);
const searchInput = document.querySelector(`.${classSearchInput}`);
const selectFilter = document.querySelector(`.${classSelectFilter}`);

const btnAdd = document.querySelector(`.${classBtnAdd}`);
const btnSearch = document.querySelector(`.${classBtnSearch}`);

//

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewTask();
});

btnAdd.addEventListener("click", addNewTask);

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

searchInput.addEventListener("input", () => {
  filterTask();
});

btnSearch.addEventListener("click", filterTask);

selectFilter.addEventListener("change", filterTask);

//

function filterTask() {
  const taskList = taskContainer.querySelectorAll(`.${classTask}`);

  taskList.forEach((task) => {
    task.classList.add("is-hide");

    const inputValue = task
      .querySelector(`.${classTaskInput}`)
      .value.toLowerCase();

    const toObject = JSON.parse(localStorage.getItem(task.id));

    let validateSearch = false;
    let validateDoneState;

    if (inputValue.indexOf(searchInput.value.toLowerCase()) !== -1) {
      validateSearch = true;
    }

    switch (selectFilter.value) {
      case "all":
        validateDoneState = true;
        break;
      case "done":
        validateDoneState = toObject["done"] === true;
        break;
      case "pendent":
        validateDoneState = toObject["done"] === false;
        break;
    }

    if (validateSearch && validateDoneState) {
      task.classList.remove("is-hide");
    }
  });
}

function removeExtraSpaces(string) {
  const formattedString = string.trim().replace(/( )+/g, " ");
  return formattedString;
}

function addNewTask() {
  const taskValue = removeExtraSpaces(taskInputForm.value);
  if (!taskValue) {
    return;
  }
  const template = createTaskTemplate();
  template.querySelector(`.${classTaskInput}`).value = taskValue;
  const taskData = {
    id: template.id,
    value: taskValue,
    done: false,
  };

  const taskIdList = localStorage.getItem("taskIdList") + " " + template.id;
  localStorage.setItem("taskIdList", taskIdList);
  localStorage.setItem(template.id, JSON.stringify(taskData));

  taskContainer.appendChild(template);
  taskInputForm.value = "";
}

function createTaskTemplate(id, done) {
  const template = taskTemplate.cloneNode(true);

  id
    ? template.setAttribute("id", id)
    : template.setAttribute("id", generateRandomId());

  if (done) {
    template.classList.add("c-task--done");
  }

  template.classList.add(classTask);
  template.classList.remove(classTaskTemplate);

  template
    .querySelector(`.${classBtnDone}`)
    .addEventListener("click", doneTask);

  template
    .querySelector(`.${classBtnEdit}`)
    .addEventListener("click", editTask);

  template.querySelector(`.${classBtnDel}`).addEventListener("click", delTask);

  const inputTask = template.querySelector(`.${classTaskInput}`);

  inputTask.addEventListener("focusout", taskInputOutFocus);

  inputTask.addEventListener("keydown", (e) => {
    if (!inputTask.hasAttribute("readonly") && e.key === "Enter") {
      inputTask.blur();
    }
  });

  return template;
}

function doneTask({ target }) {
  const parent = target.parentNode;
  parent.classList.toggle("c-task--done");
  const toObject = JSON.parse(localStorage.getItem(parent.id));
  toObject["done"] = !toObject["done"];
  localStorage.setItem(parent.id, JSON.stringify(toObject));
}

function editTask({ target }) {
  const taskInput = target.parentNode.querySelector(`.${classTaskInput}`);
  taskInput.removeAttribute("readonly");
  taskInput.focus();

  taskInput.parentNode.classList.remove("c-task--done");
  taskInput.parentNode.querySelector(`.${classBtnEdit}`).style.color = "blue";
}

function delTask({ target }) {
  const parent = target.parentNode;
  taskContainer.removeChild(parent);
  localStorage.removeItem(parent.id);
  const taskIdList = localStorage.getItem("taskIdList").replace(parent.id, "");
  localStorage.setItem("taskIdList", taskIdList);
}

function taskInputOutFocus({ target }) {
  const taskInput = target.parentNode.querySelector(`.${classTaskInput}`);
  taskInput.setAttribute("readonly", "");

  const parent = target.parentNode;
  const toObject = JSON.parse(localStorage.getItem(parent.id));

  const taskValue = removeExtraSpaces(taskInput.value);
  if (taskValue) {
    toObject["value"] = taskValue;
  }

  taskInput.value = toObject["value"];
  localStorage.setItem(parent.id, JSON.stringify(toObject));
  taskInput.parentNode.querySelector(`.${classBtnEdit}`).style.color = "black";
}

function generateRandomId() {
  const id = Math.floor(Date.now() * Math.random()).toString(36);
  return id;
}

function loadTask() {
  const taskIdList = localStorage.getItem("taskIdList").split(" ");

  taskIdList.forEach((id) => {
    const item = JSON.parse(localStorage.getItem(id));
    if (item) {
      const template = createTaskTemplate(item["id"], item["done"]);
      template.querySelector(`.${classTaskInput}`).value = item["value"];
      taskContainer.appendChild(template);
    }
  });
}

window.onload = () => {
  if (!localStorage.getItem("taskIdList")) {
    localStorage.setItem("taskIdList", []);
    return;
  }

  loadTask();
};
