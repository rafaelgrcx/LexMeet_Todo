import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Tasks } from "./components/Tasks";

const LOCAL_STORAGE_KEY = 'todo:tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  function loadSavedTasks() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if(saved) {
      setTasks(JSON.parse(saved));
    }
  }

  function setTasksAndSave(newTasks) {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
  }

  useEffect(() => {
    loadSavedTasks();
  }, [])

  function addTask(taskTitle) {
    // Check if the task title is not empty before adding
    if (taskTitle.trim() !== "") {
      setTasksAndSave([
        ...tasks,
        {
          id: crypto.randomUUID(),
          title: taskTitle,
          isCompleted: false,
        },
      ]);

      // Clear the error message
      setErrorMessage('Empty');
    } else {
      // Display an error message for an empty input
      setErrorMessage("Please enter a task title.");
    }
  }

  function deleteTaskById(taskId) {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasksAndSave(newTasks);
  }

  function toggleTaskCompletedById(taskId) {
    const newTasks = tasks.map(task => {
      if(task.id === taskId) {
        return {
          ...task,
          isCompleted: !task.isCompleted
        }
      }
      return task;
    });
    setTasksAndSave(newTasks);
  }

  function deleteAllTasks() {
    setTasksAndSave([]);
  }

  function markAllTasksDone() {
    const newTasks = tasks.map(task => ({
      ...task,
      isCompleted: true,
    }));
    setTasksAndSave(newTasks);
  }

  function editTaskById(taskId, newTitle) {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          title: newTitle,
        };
      }
      return task;
    });
    setTasksAndSave(newTasks);
  }

  function onSaveTask(taskId, newTitle) {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          title: newTitle,
        };
      }
      return task;
    });
  
    setTasksAndSave(updatedTasks);
  }

  return (
    <>
      <Header handleAddTask={addTask} />
      <Tasks
        tasks={tasks}
        onDelete={deleteTaskById}
        onComplete={toggleTaskCompletedById}
        onDeleteAll={deleteAllTasks}
        onMarkAllDone={markAllTasksDone}
        onEdit={editTaskById}
        onSave={onSaveTask}
      />
    </>
  )
  
}

export default App