import React, { useState } from "react";
import { Task } from "../types/Task";

interface TaskTableProps {
  tasks: Task[];
  onToggleDone: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onToggleDone,
  onEdit,
  onDelete,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: "priority" | "dueDate";
    direction: "asc" | "desc";
  } | null>(null);

  const sortedTasks = React.useMemo(() => {
    if (!sortConfig) return tasks;
    const sorted = [...tasks];
    sorted.sort((a, b) => {
      if (sortConfig.key === "priority") {
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        return sortConfig.direction === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortConfig.key === "dueDate") {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    return sorted;
  }, [tasks, sortConfig]);

  const handleSort = (key: "priority" | "dueDate") => {
    setSortConfig((prevConfig) =>
      prevConfig?.key === key && prevConfig.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" }
    );
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Done</th>
            <th style={styles.header}>Name</th>
            <th style={styles.header} onClick={() => handleSort("priority")}>
              Priority{" "}
              {sortConfig?.key === "priority"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th style={styles.header} onClick={() => handleSort("dueDate")}>
              Due Date{" "}
              {sortConfig?.key === "dueDate"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th style={styles.header}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <tr key={task.id}>
                <td style={styles.cell}>
                  <input
                    type="checkbox"
                    checked={task.doneUndone}
                    onChange={() => onToggleDone(task.id)}
                  />
                </td>
                <td style={styles.cell}>{task.text}</td>
                <td style={styles.cell}>{task.priority}</td>
                <td style={styles.cell}>{task.dueDate || "No due date"}</td>
                <td style={styles.cell}>
                  <button
                    style={styles.actionButton}
                    onClick={() => onEdit(task.id)}
                  >
                    📝
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() => onDelete(task.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={styles.noTasks}>
                No tasks available... yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "15px",
    border: "3px solid grey",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  header: {
    borderBottom: "1px solid black",
    backgroundColor: "grey",
    color: "white",
    padding: "10px",
    textAlign: "center" as const,
    cursor: "pointer",
  },
  cell: {
    borderBottom: "1px solid black",
    padding: "10px",
    textAlign: "center" as const,
  },
  actionButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  noTasks: {
    padding: "15px",
    textAlign: "center" as const,
    fontStyle: "italic",
  },
};

export default TaskTable;
