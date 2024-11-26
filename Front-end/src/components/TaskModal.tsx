import React, { useState } from "react";
import { Task } from "../types/Task";

interface TaskModalProps {
  onSave: (task: Omit<Task, "id" | "creationDate" | "doneDate">) => void;
  onCancel: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ onSave, onCancel }) => {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  const handleSave = () => {
    if (!text.trim()) {
      alert("Task name is required.");
      return;
    }

    onSave({
      text,
      priority: priority as "Low" | "Medium" | "High",
      doneUndone: false,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.header}>Add New Task</h3>
        <div style={styles.field}>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={styles.select}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div style={styles.field}>
          <label htmlFor="dueDate">Due Date:</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.actions}>
          <button onClick={handleSave} style={styles.button}>
            Save
          </button>
          <button onClick={onCancel} style={styles.button}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    border: "3px solid grey",
    borderRadius: "5px",
    width: "400px",
  },
  header: {
    margin: "0 0 15px 0",
    fontSize: "18px",
  },
  field: {
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "5px",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    padding: "5px",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  button: {
    padding: "10px 15px",
    cursor: "pointer",
    border: "1px solid black",
    backgroundColor: "grey",
    color: "white",
  },
};

export default TaskModal;
