import React, { useState } from "react";

interface FiltersProps {
  onFilter: (filters: {
    name: string;
    priority: string;
    state: string;
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilter }) => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("All");
  const [state, setState] = useState("All");

  const handleSearch = () => {
    // Configura filtros para devolver todas las tareas cuando todo esté en "All"
    const filters = {
      name: name.trim(),
      priority: priority === "All" ? "" : priority.toLowerCase(),
      state: state === "All" ? "" : state,
    };

    onFilter(filters);
  };

  return (
    <div
      style={{
        border: "3px solid #a0a0a0",
        padding: "15px",
        marginBottom: "15px",
        fontFamily: "Roboto",
        fontSize: "12px",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "93.75%",
              padding: "5px",
              border: "1px solid black",
              marginTop: "5px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Priority:
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              width: "50%",
              padding: "5px",
              border: "1px solid black",
              marginTop: "5px",
            }}
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          State:
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            style={{
              width: "51.65%",
              padding: "5px",
              border: "1px solid black",
              marginTop: "5px",
            }}
          >
            <option value="All">All</option>
            <option value="Done">Done</option>
            <option value="Undone">Undone</option>
          </select>
        </label>
      </div>
      <button
        onClick={handleSearch}
        style={{
          float: "right",
          padding: "5px 10px",
          border: "1px solid black",
          cursor: "pointer",
          backgroundColor: "white",
          position: "absolute",
          bottom: "15px",
          right: "21px",
        }}
      >
        Search
      </button>
    </div>
  );
};

export default Filters;
