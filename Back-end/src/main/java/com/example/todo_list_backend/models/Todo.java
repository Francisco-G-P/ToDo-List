package com.example.todo_list_backend.models;

import java.time.LocalDate;

// Model class representing a task in the to-do list.
public class Todo {

    private String id; // Unique id for the task.
    private String text; // Task name or description.
    private boolean doneUndone; // Indicates if the task is completed.
    private String priority; // Priority level: low, medium, high.
    private LocalDate creationDate; // Date the task was created.
    private LocalDate dueDate; // Optional due date for the task.
    private LocalDate doneDate; // Date when the task was completed (optional).

    // Default constructor.
    public Todo() {
    }

    // Constructor with all fields.
    public Todo(String id, String text, boolean doneUndone, String priority, LocalDate creationDate, LocalDate dueDate,
            LocalDate doneDate) {
        this.id = id;
        this.text = text;
        this.doneUndone = doneUndone;
        this.priority = priority;
        this.creationDate = creationDate;
        this.dueDate = dueDate;
        this.doneDate = doneDate;
    }

    // Getters and setters.
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public boolean isDoneUndone() {
        return doneUndone;
    }

    public void setDoneUndone(boolean doneUndone) {
        this.doneUndone = doneUndone;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getDoneDate() {
        return doneDate;
    }

    public void setDoneDate(LocalDate doneDate) {
        this.doneDate = doneDate;
    }

    @Override
    public String toString() {
        return "Todo{" +
                "id='" + id + '\'' +
                ", text='" + text + '\'' +
                ", doneUndone=" + doneUndone +
                ", priority='" + priority + '\'' +
                ", creationDate=" + creationDate +
                ", dueDate=" + dueDate +
                ", doneDate=" + doneDate +
                '}';
    }
}
