package com.example.todo_list_backend.repositories;

import com.example.todo_list_backend.models.Todo;

import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

// Repository class to manage the to-do list in memory.
@Repository
public class TodoRepository {

    private final List<Todo> todos = new ArrayList<>(); // In-memory list to store tasks.
    private final Random random = new Random();

    // Method to retrieve all tasks.
    public List<Todo> findAll() {
        return new ArrayList<>(todos);
    }

    // Method to add a new task.
    public Todo save(Todo todo) {
        todo.setId(generateShortId()); // Generate a unique short ID for the task.
        todo.setCreationDate(LocalDate.now()); // Set the creation date.
        todos.add(todo);
        return todo;
    }

    // Method to find a task by id.
    public Optional<Todo> findById(String id) {
        return todos.stream().filter(todo -> todo.getId().equals(id)).findFirst();
    }

    // Method to delete a task by id.
    public boolean deleteById(String id) {
        return todos.removeIf(todo -> todo.getId().equals(id));
    }

    // Method to update a task.
    public Optional<Todo> update(String id, Todo updatedTodo) {
        Optional<Todo> existingTodo = findById(id);
        existingTodo.ifPresent(todo -> {
            todo.setText(updatedTodo.getText());
            todo.setPriority(updatedTodo.getPriority());
            todo.setDueDate(updatedTodo.getDueDate());
        });
        return existingTodo;
    }

    // Helper method to generate a short alphanumeric id.
    private String generateShortId() {
        int idLength = 5;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder idBuilder = new StringBuilder(idLength);
        for (int i = 0; i < idLength; i++) {
            idBuilder.append(characters.charAt(random.nextInt(characters.length())));
        }
        return idBuilder.toString();
    }
}
