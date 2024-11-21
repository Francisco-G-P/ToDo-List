package com.example.demo.model;

import java.time.LocalDate;

public class Todo {
    private Long id;
    private String text;
    private String priority; // "low", "medium", "high".
    private boolean doneUndone; // true = complete, false = to complete.
    private LocalDate creationDate;
    private LocalDate dueDate; // Optional.
    private LocalDate doneDate; // Added till done.

    // Empty Constructor.
    public Todo() {
    }

    // Full Constructor.
    public Todo(Long id, String text, String priority, boolean doneUndone, LocalDate creationDate, LocalDate dueDate,
            LocalDate doneDate) {
        this.id = id;
        this.text = text;
        this.priority = priority;
        this.doneUndone = doneUndone;
        this.creationDate = creationDate;
        this.dueDate = dueDate;
        this.doneDate = doneDate;
    }

    // Getters y Setters.
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public boolean isDoneUndone() {
        return doneUndone;
    }

    public void setDoneUndone(boolean doneUndone) {
        this.doneUndone = doneUndone;
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
}
