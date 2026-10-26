const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const message = document.getElementById('message');

// Get tasks from the server and display them
async function fetchTasks() {
    try {
        const response = await fetch('/api/tasks');

        if (!response.ok) {
            message.textContent = 'Could not load tasks.';
            return;
        }

        const tasks = await response.json();

        // Clear the old list
        taskList.textContent = '';

        // Display each task
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];

            const row = document.createElement('div');
            row.className = 'task-item';

            const title = document.createElement('span');
            title.textContent = task.title;

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Delete';

            deleteButton.addEventListener('click', function () {
                deleteTask(task.id);
            });

            row.appendChild(title);
            row.appendChild(deleteButton);
            taskList.appendChild(row);
        }
    } catch (error) {
        message.textContent = 'Could not connect to the server.';
    }
}

// Add a task
async function addTask(event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === '') {
        message.textContent = 'Enter a task title first.';
        return;
    }

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title })
        });

        if (!response.ok) {
            message.textContent = 'Could not add task.';
            return;
        }

        taskInput.value = '';
        message.textContent = 'Task added.';

        await fetchTasks();
    } catch (error) {
        message.textContent = 'Could not connect to the server.';
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        const response = await fetch('/api/tasks/' + id, {
            method: 'DELETE'
        });

        if (!response.ok) {
            message.textContent = 'Could not delete task.';
            return;
        }

        message.textContent = 'Task deleted.';

        await fetchTasks();
    } catch (error) {
        message.textContent = 'Could not connect to the server.';
    }
}

// Run addTask when the form is submitted
taskForm.addEventListener('submit', addTask);

// Display tasks when the page opens
fetchTasks();