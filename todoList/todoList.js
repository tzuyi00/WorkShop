let todoInput = document.getElementById('newTodo');
let addBtn = document.getElementById('addTodo');
let clearAllBtn = document.getElementById('clearTask');
let todoList = document.getElementById('todoList');
let countTodo = document.getElementById('taskCount');

addBtn.addEventListener('click', addTodo); 
clearAllBtn.addEventListener('click', clearAllTask);
todoList.addEventListener('click', removeTodo);
todoList.addEventListener('click', completeTodo);

let todoData = []; //存放資料空間
render(todoData); 

// 畫面呈現
function render(data) {
  let str = '';
  data.forEach((item) => {
    str += `<li class="list-group-item">
      <div class="d-flex">
        <div class="form-check" data-action="complete" data-id="${item.id}">
          <input type="checkbox" class="form-check-input" ${item.completed ? 'checked' : ''}>
          <label class="form-check-label ${item.completed ? 'completed' : ''}"> ${item.title}</label>
        </div>
        <button type="button" class="close ml-auto remove" aria-label="Close" data-action="remove" data-id="${item.id}">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </li>`;
  })
  todoList.innerHTML = str;
  countTodo.textContent = data.length; //有幾筆資料
  todoInput.value = ''; //任務input清空
}

// 新增資料
function addTodo() {
  let newTodo = todoInput.value.trim();
  let timeStamp = Math.floor(Date.now());
  if (newTodo !== '') {
    todoData.push({
      id: timeStamp,
      title: newTodo,
      completed: false,
    })
    render(todoData);
  } else if (newTodo === ''){
    alert('請輸入任務');
  }
}

// 清除單一資料
function removeTodo(e) {
  let action = e.target.parentNode.dataset.action;
  let id = e.target.parentNode.dataset.id;
  if (action == 'remove') {
    let newIndex = todoData.findIndex((item) => {
      return item.id == id;
    })
    todoData.splice(newIndex, 1);
    render(todoData);
  }
}

// 是否完成切換
function completeTodo(e) {
  let action = e.target.parentNode.dataset.action;
  let id = e.target.parentNode.dataset.id;
  if (action == 'complete') {
    todoData.forEach((item) => {
      if (item.id == id ) {
        item.completed = item.completed ? false : true; //item.completed若是false則改為true，若是true則改為false
      }
    })
    render(todoData);
  }
}

// 清除所有資料
function clearAllTask(e) {
  e.preventDefault();
  todoData = [];
  render(todoData);
}



