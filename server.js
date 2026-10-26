const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware: prepare incoming requests and serve frontend files
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Temporary in-memory data store
let tasks = [
    { id: 1, title: 'Learn HTML/CSS', completed: true },
    { id: 2, title: 'Master JavaScript basics', completed: true },
    { id: 3, title: 'Understand REST APIs', completed: false }
];

// Give each new task a unique ID
let nextId = 4;

// 1. GET ALL TASKS
app.get('/api/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// 2. GET ONE TASK BY ID
app.get('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);

    const task = tasks.find(item => item.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
});

// 3. CREATE A TASK
app.post('/api/tasks', (req, res) => {
    if (!req.body || typeof req.body.title !== 'string') {
        return res.status(400).json({
            message: 'A non-empty title is required'
        });
    }

    const title = req.body.title.trim();

    if (title === '') {
        return res.status(400).json({
            message: 'A non-empty title is required'
        });
    }

    const newTask = {
        id: nextId,
        title: title,
        completed: false
    };

    nextId = nextId + 1;
    tasks.push(newTask);

    res.status(201).json(newTask);
});

// 4. DELETE A TASK
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);

    const task = tasks.find(item => item.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks = tasks.filter(item => item.id !== taskId);

    res.status(200).json({
        message: 'Task successfully deleted'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});