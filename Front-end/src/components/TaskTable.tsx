import React, { useState, useEffect } from "react";
import TaskModal from "./TaskModal";
import Filters from "./Filters";
import Metrics from "./Metrics";

interface Task {
  id: string;
  text: string;
  doneUndone: boolean;
  priority: string;
  creationDate: string;
  dueDate?: string;
  doneDate?: string;
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:9090/todos")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Task[]) => {
        setTasks(data);
        setFilteredTasks(data);
      })
      .catch((error) => {
        console.error("Error al cargar las tareas:", error);
      });
  }, []);

  useEffect(() => {
    // Sincroniza filteredTasks con tasks cuando tasks cambia
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleAddTask = (task: Task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
  };

  const handleToggleDone = (id: string) => {
    const taskToUpdate = tasks.find((task) => task.id === id);

    if (!taskToUpdate) {
      console.error("Task not found!");
      return;
    }

    const endpoint = taskToUpdate.doneUndone
      ? `http://localhost:9090/todos/${id}/undone`
      : `http://localhost:9090/todos/${id}/done`;

    fetch(endpoint, {
      method: taskToUpdate.doneUndone ? "PUT" : "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((updatedTask: Task) => {
        const updatedTasks = tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        setTasks(updatedTasks);
      })
      .catch((error) => console.error("Error toggling task status:", error));
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    const updatedFilteredTasks = filteredTasks.filter((task) => task.id !== id);
    setFilteredTasks(updatedFilteredTasks);

    const totalPages = Math.ceil(updatedFilteredTasks.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  };

  const handleFilter = (filters: {
    name: string;
    priority: string;
    state: string;
  }) => {
    const { name, priority, state } = filters;

    let filtered = tasks;

    if (name) {
      filtered = filtered.filter((task) =>
        task.text.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (priority && priority !== "All") {
      filtered = filtered.filter((task) => task.priority === priority);
    }

    if (state && state !== "All") {
      const isDone = state === "Done";
      filtered = filtered.filter((task) => task.doneUndone === isDone);
    }

    setFilteredTasks(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: "30px" }}>
      <Filters onFilter={handleFilter} />
      <button
        onClick={() => setModalOpen(true)}
        style={{
          backgroundColor: "white",
          border: "1px solid black",
          padding: "5px 10px",
          cursor: "pointer",
          fontSize: "12px",
          marginBottom: "15px",
        }}
      >
        + New To Do
      </button>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "3px solid #a0a0a0",
          fontFamily: "Roboto",
          fontSize: "12px",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Checkbox</th>
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Priority</th>
            <th style={tableHeaderStyle}>Due Date</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "10px" }}>
                No todos yet...
              </td>
            </tr>
          ) : (
            currentTasks.map((task) => (
              <tr key={`${task.id}-${task.doneUndone}`}>
                <td style={tableCellStyle}>
                  <input
                    type="checkbox"
                    checked={task.doneUndone}
                    onChange={() => handleToggleDone(task.id)}
                  />
                </td>
                <td style={tableCellStyle}>{task.text}</td>
                <td style={tableCellStyle}>{task.priority}</td>
                <td style={tableCellStyle}>{task.dueDate || "-"}</td>
                <td style={tableCellStyle}>
                  <span
                    role="img"
                    aria-label="delete"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    🗑️
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  border: "1px solid black",
                  backgroundColor: page === currentPage ? "#a0a0a0" : "white",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
      {isModalOpen && (
        <TaskModal onClose={() => setModalOpen(false)} onSave={handleAddTask} />
      )}
      <Metrics tasks={tasks} />
    </div>
  );
};

const tableHeaderStyle: React.CSSProperties = {
  border: "1px solid black",
  padding: "8px",
  textAlign: "left",
  backgroundColor: "#f9f9f9",
  width: "20%",
};

const tableCellStyle: React.CSSProperties = {
  border: "1px solid black",
  padding: "8px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export default TaskTable;
