import React, { useState } from 'react';

interface Task {
  id: string;
  text: string;
  doneUndone: boolean;
  priority: string;
  creationDate: string;
  dueDate?: string;
  doneDate?: string;
}

interface TaskModalProps {
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, onSave }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('low');
  const [dueDate, setDueDate] = useState('');

  const handleSave = () => {
    if (!text || text.length > 120) {
      alert('Task name is required and must be less than 120 characters.');
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      priority,
      doneUndone: false,
      creationDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || undefined,
      doneDate: undefined,
    };

    onSave(newTask);
    onClose();
  };

  return (
    <div style={{ ...modalStyle }}>
      <h3>New Task</h3>
      <label>
        Task Name:
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={120}
          style={inputStyle}
        />
      </label>
      <label>
        Priority:
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={inputStyle}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <label>
        Due Date:
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={inputStyle}
        />
      </label>
      <button onClick={handleSave} style={buttonStyle}>
        Save
      </button>
      <button onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#f5f5f5' }}>
        Cancel
      </button>
    </div>
  );
};

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  border: '1px solid black',
  borderRadius: '8px',
  width: '300px',
  zIndex: 1000,
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  margin: '10px 0',
  padding: '5px',
  width: '100%',
  fontSize: '14px',
};

const buttonStyle: React.CSSProperties = {
  padding: '5px 10px',
  border: '1px solid black',
  backgroundColor: 'white',
  cursor: 'pointer',
  marginTop: '10px',
};

export default TaskModal;
