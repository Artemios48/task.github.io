let append = document.getElementById('Append');
let Delete = document.getElementById('Delete');
let edit = document.getElementsByClassName('edit_button');
let save = document.getElementsByClassName('save_button');
const description = document.getElementsByClassName('description');
const task_list =  document.getElementsByClassName('task_list');
const taskList =  document.getElementById('main');
let index = 0;
function loadTasks() {
  fetch('http://127.0.0.1:8000/tasks')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        const taskEl = createTaskEl(data[i].name, data[i].description);
        taskList.appendChild(taskEl);
        //taskEl.containerDiv.taskListDiv.descriptionElement.contentEditable = 'false'
        //taskEl.containerDiv.taskListDiv.titleElement.contentEditable = 'false'
      }
    })
    .catch(error => {
      console.error('Ошибка при получении данных:', error);
    });
}
loadTasks()

append.addEventListener('click', () => {
  fetch('http://127.0.0.1:8000/tasks') 
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data)
    const taskEl = createTaskEl()
    taskList.appendChild(taskEl); 
    taskEl.scrollIntoView(top=false)
    index ++
    //console.log(data[0].name);
    //console.log(data[0].description);
    //console.log(data[0].id);
  })
  .catch(error => {
    console.error('Ошибка при получении данных:', error);
  });

})
async function sendData(title,description) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/tasks?name=${title}&description=${description}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    });
    

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    console.log('Успешная отправка:', json,json.task_id);


  } catch (error) {
    console.error('Ошибка отправки:', error);
  }
}


Delete.addEventListener('click', () => {
   fetch('http://127.0.0.1:8000/tasks/del', {
       method: 'DELETE'})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('del');
  })
  .catch(error => {
    console.error('Ошибка при получении данных:', error);
  });
  const lastTask = taskList.lastChild;
  lastTask.style.animation = 'fadeOut 0.5s ease-in-out forwards';
  // Удаляем элемент через 0.5 секунды (после завершения анимации)
  setTimeout(() => {taskList.removeChild(lastTask);}, 500); });// 500 миллисекунд = 0.5 секунды

  

function createTaskEl(title='',description=''){
  var editble = 0;
  var id = 1
  id++
  // Создайте новый элемент div с классом container
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  // Создайте новый элемент div с классом task_list
  const taskListDiv = document.createElement('div');
  taskListDiv.classList.add('task_list');

  // Создайте новый элемент h1 с классом "title"
  const titleElement = document.createElement('h1');
  titleElement.classList.add('task_input_h1'); 
  titleElement.contentEditable = 'true'
  titleElement.textContent = title
  titleElement.dir = 'ltr'

  // Создайте новый элемент p с классом "description"
  const descriptionElement = document.createElement('p');
  descriptionElement.classList.add('task_input'); 
  descriptionElement.contentEditable = 'true'
  descriptionElement.textContent = description
  descriptionElement.dir = 'ltr'

  const edit_button = document.createElement('button');
  edit_button.textContent = '🖉';
  edit_button.classList.add('edit_button');

  const save_button = document.createElement('button');
  save_button.textContent = '🖭';
  save_button.classList.add('save_button');

  save_button.addEventListener('click', () => {
    if (editble == 0){
      titleElement.contentEditable = 'false';
      descriptionElement.contentEditable = 'false';
      sendData(titleElement.textContent, descriptionElement.textContent); 
    }else{
      try {
        const response = fetch(`http://127.0.0.1:8000/tasks/edit/${id}/${titleElement.textContent}/${descriptionElement.textContent}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = response.json();
        console.log('Успешная отправка:', json);
    
      } catch (error) {
        console.error('Ошибка отправки:', error);
      }
      titleElement.contentEditable = 'false';
      descriptionElement.contentEditable = 'false';
      //sendData(titleElement.textContent, descriptionElement.textContent); 
      editble = 0
    }
  })
  edit_button.addEventListener('click', () => {
    editble = 1
    titleElement.contentEditable = 'true';
    descriptionElement.contentEditable = 'true';
    
  })
  

  // Добавьте элементы в DOM
  taskListDiv.appendChild(titleElement);
  taskListDiv.appendChild(descriptionElement);
  taskListDiv.appendChild(edit_button);
  taskListDiv.appendChild(save_button);

  containerDiv.appendChild(taskListDiv);

  // Добавьте containerDiv в main
  //document.getElementById('main').appendChild(containerDiv);
  return containerDiv;
}
