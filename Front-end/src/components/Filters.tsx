import React, { useState } from "react";

interface FiltersProps {
  onSearch: (filters: {
    text: string;
    priority: string;
    state: string;
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onSearch }) => {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("All");
  const [state, setState] = useState("All");

  const handleSearch = () => {
    onSearch({ text, priority, state });
  };

  return (
    <div style={styles.container}>
      <div style={styles.field}>
        <label htmlFor="text">Text:</label>
        <input
          id="text"
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
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div style={styles.field}>
        <label htmlFor="state">State:</label>
        <select
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={styles.select}
        >
          <option value="All">All</option>
          <option value="Done">Done</option>
          <option value="Undone">Undone</option>
        </select>
      </div>
      <button onClick={handleSearch} style={styles.button}>
        Search
      </button>
    </div>
  );
};

const styles = {
  container: {
    border: "3px solid grey",
    padding: "20px",
    marginBottom: "24px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  header: {
    margin: 0,
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
  },
  input: {
    padding: "5px",
    fontSize: "14px",
  },
  select: {
    padding: "5px",
    fontSize: "14px",
    width: "50%", // Cambia el ancho al 50%
  },
  button: {
    alignSelf: "flex-end",
    padding: "10px 15px",
  },
};

export default Filters;
