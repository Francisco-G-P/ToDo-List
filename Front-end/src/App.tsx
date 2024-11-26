import React, { useEffect, useState } from "react";
import Filters from "./components/Filters";
import TaskTable from "./components/TaskTable";
import TaskModal from "./components/TaskModal";
import EditTaskModal from "./components/EditTaskModal";
import Metrics from "./components/Metrics";
import { Task } from "./types/Task";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    text: "",
    priority: "All",
    state: "All",
  });

  // Function to load tasks from the Back-end
  const loadTasks = async () => {
    try {
      const response = await fetch("http://localhost:9090/todos");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: Task[] = await response.json();
      setTasks(data);
      console.log("Tasks loaded from Back-end:", data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSearch = (newFilters: {
    text: string;
    priority: string;
    state: string;
  }) => {
    setFilters(newFilters);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesText =
      filters.text === "" ||
      task.text.toLowerCase().includes(filters.text.toLowerCase());
    const matchesPriority =
      filters.priority === "All" || task.priority === filters.priority;
    const matchesState =
      filters.state === "All" ||
      (filters.state === "Done" && task.doneUndone) ||
      (filters.state === "Undone" && !task.doneUndone);

    return matchesText && matchesPriority && matchesState;
  });

  const toggleDone = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, doneUndone: !task.doneUndone } : task
      )
    );
  };

  const editTask = (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setTaskToEdit(task);
    }
  };

  const saveEditedTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(
        `http://localhost:9090/todos/${updatedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: updatedTask.text,
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const editedTask: Task = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editedTask.id ? editedTask : task))
      );
      setTaskToEdit(null);
      console.log("Task edited successfully:", editedTask);
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const addTask = async (
    newTask: Omit<Task, "id" | "creationDate" | "doneDate">
  ) => {
    try {
      const response = await fetch("http://localhost:9090/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const createdTask: Task = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setShowNewTaskModal(false);
      console.log("Task added successfully:", createdTask);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  return (
    <div style={{ margin: "25px" }}>
      <Filters onSearch={handleSearch} />
      <button
        onClick={() => setShowNewTaskModal(true)}
        style={{ marginBottom: "15px" }}
      >
        + New To Do
      </button>
      <TaskTable
        tasks={filteredTasks}
        onToggleDone={toggleDone}
        onEdit={editTask}
        onDelete={deleteTask}
      />
      {showNewTaskModal && (
        <TaskModal
          onSave={addTask}
          onCancel={() => setShowNewTaskModal(false)}
        />
      )}
      {taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          onSave={saveEditedTask}
          onCancel={() => setTaskToEdit(null)}
        />
      )}
      <Metrics tasks={tasks} />
    </div>
  );
};

export default App;
