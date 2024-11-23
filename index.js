const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
const port = 3010;

app.use(cors());
app.use(express.static('static'));

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

function addNewTask(tasks, newTaskObj) {
  tasks.push(newTaskObj);
  return tasks;
}

app.get('/tasks/add', (req, res) => {
  const { taskId, text, priority } = req.query;
  res.json({
    tasks: addNewTask(tasks, { taskId, text, priority: parseFloat(priority) }),
  });
});

app.get('/tasks', (req, res) => {
  res.json({
    tasks: tasks,
  });
});

function sortTasksByPriority(tasks) {
  const copyTasks = [...tasks];
  return copyTasks.sort((a, b) => a.priority - b.priority);
}

app.get('/tasks/sort-by-priority', (req, res) => {
  res.json({
    tasks: sortTasksByPriority(tasks),
  });
});

function updateTaskPriority(tasks, taskId, priority) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].priority = priority;
      break;
    }
  }
  return tasks;
}

app.get('/tasks/edit-priority', (req, res) => {
  const { taskId, priority } = req.query;
  res.json({
    tasks: updateTaskPriority(tasks, parseFloat(taskId), parseFloat(priority)),
  });
});

function updateTaskText(tasks, taskId, text) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].text = text;
      break;
    }
  }
  return tasks;
}

app.get('/tasks/edit-text', (req, res) => {
  const { taskId, text } = req.query;
  res.json({
    tasks: updateTaskText(tasks, parseFloat(taskId), text),
  });
});

function deleteTaskById(tasks, taskId) {
  return tasks.filter((ele) => ele.taskId != taskId);
}

app.get('/tasks/delete', (req, res) => {
  const { taskId } = req.query;
  res.json({
    tasks: deleteTaskById(tasks, parseFloat(taskId)),
  });
});

function filterTasksByPriority(tasks, priority) {
  return tasks.filter((ele) => ele.priority === priority);
}

app.get('/tasks/filter-by-priority', (req, res) => {
  const { priority } = req.query;
  res.json({
    tasks: filterTasksByPriority(tasks, parseFloat(priority)),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
