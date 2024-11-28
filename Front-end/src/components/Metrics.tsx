import React from "react";
import { Task } from "../types/Task";

interface MetricsProps {
  tasks: Task[];
}

const Metrics: React.FC<MetricsProps> = ({ tasks }) => {
  // Define priority weights.
  const priorityWeights = {
    Low: 20,
    Medium: 10,
    High: 5,
  };

  // Calculate total time.
  const totalMinutes = tasks.reduce((sum, task) => {
    return sum + (priorityWeights[task.priority] || 0);
  }, 0);

  // Format total time.
  const formattedTime =
    totalMinutes < 60
      ? `${totalMinutes} minutes`
      : `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(
          2,
          "0"
        )} hours`;

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h3>Average time to finish tasks:</h3>
        <p style={styles.time}>{formattedTime}</p>
      </div>
      <div style={styles.right}>
        <h3>Average time to finish tasks by priority:</h3>
        <p>Low: 20 min</p>
        <p>Medium: 10 min</p>
        <p>High: 5 min</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "3px solid grey",
    padding: "20px",
    marginTop: "15px",
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
    textAlign: "right" as const,
  },
  time: {
    fontSize: "18px",
    fontWeight: "bold" as const,
  },
};

export default Metrics;
