import React from "react";

interface Task {
  id: string;
  text: string;
  doneUndone: boolean;
  priority: string;
  creationDate: string;
  dueDate?: string;
  doneDate?: string;
}

interface MetricsProps {
  tasks: Task[];
}

const Metrics: React.FC<MetricsProps> = ({ tasks }) => {
  // Duration (values) for each priority.
  const timeByPriority = {
    low: 20,
    medium: 10,
    high: 5,
  };

  // Calculate total time in minutes.
  const totalMinutes = tasks.reduce((total, task) => {
    const time =
      timeByPriority[task.priority as keyof typeof timeByPriority] || 0;
    return total + time;
  }, 0);

  // Total time format.
  const formattedTime =
    totalMinutes >= 60
      ? `${Math.floor(totalMinutes / 60)} hours ${totalMinutes % 60} minutes`
      : `${totalMinutes} minutes`;

  return (
    <div style={metricsContainerStyle}>
      <div>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
          Average time to finish tasks:
        </h3>
        <p style={{ margin: 0, fontSize: "12px" }}>{formattedTime}</p>
      </div>
      <div>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
          Average time to finish tasks by priority:
        </h3>
        <p style={{ margin: 0, fontSize: "12px" }}>Low: 20 min</p>
        <p style={{ margin: 0, fontSize: "12px" }}>Medium: 10 min</p>
        <p style={{ margin: 0, fontSize: "12px" }}>High: 5 min</p>
      </div>
    </div>
  );
};

const metricsContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  border: "3px solid #a0a0a0",
  padding: "10px 15px",
  marginTop: "15px",
  fontFamily: "Roboto",
};

export default Metrics;
