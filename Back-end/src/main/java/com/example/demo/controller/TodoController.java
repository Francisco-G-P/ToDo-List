package com.example.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Todo;
import com.example.demo.repository.InMemoryTodoRepository;

import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/todos")
public class TodoController {

    @Autowired
    private InMemoryTodoRepository todoRepository;

    @PostConstruct
    public void init() {
        todoRepository.populateSampleData();
    }

    @GetMapping // GET
                // /todos-----------------------------------------------------------------------------------------------
    public List<Todo> getTodos(
            @RequestParam(defaultValue = "1") int page, // Page number (default: 1).
            @RequestParam(defaultValue = "10") int size // Page size (default: 10).
    ) {
        // Get all the tasks.
        List<Todo> todos = todoRepository.findAll();

        // Calculate indexes for pagination.
        int fromIndex = (page - 1) * size;
        int toIndex = Math.min(fromIndex + size, todos.size());

        // Requested page out of range.
        if (fromIndex >= todos.size() || fromIndex < 0) {
            return List.of(); // Return empty list.
        }

        // Return specified sub-list.
        return todos.subList(fromIndex, toIndex);
    }

    @PostMapping // POST
                 // /todos----------------------------------------------------------------------------------------------
    public Todo createTodo(@RequestBody Todo newTodo) {
        // Validation for empty text.
        if (newTodo.getText() == null || newTodo.getText().isEmpty()) {
            throw new IllegalArgumentException("Text is required. Don`t be shy! Nothing less than 1 character!");
        }

        // Validation for over 120 characters text.
        if (newTodo.getText().length() > 120) {
            throw new IllegalArgumentException("Text cannot exceed 120 characters. Little tiny bit more concise!");
        }

        // Validation for existing priorities.
        if (newTodo.getPriority() == null ||
                (!newTodo.getPriority().equalsIgnoreCase("low") &&
                        !newTodo.getPriority().equalsIgnoreCase("medium") &&
                        !newTodo.getPriority().equalsIgnoreCase("high"))) {
            throw new IllegalArgumentException("Priority must be 'low', 'medium', or 'high'. Please and thank you!");
        }

        // Set 'creationDate' automatically.
        newTodo.setCreationDate(LocalDate.now());

        // Save and return task.
        return todoRepository.save(newTodo);
    }

    @PutMapping("/{id}") // PUT
                         // /todos/{id}---------------------------------------------------------------------------------
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo) {
        // Search existing task.
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found! Try again!"));

        // Validate and update text.
        if (updatedTodo.getText() != null && !updatedTodo.getText().isEmpty()) {
            if (updatedTodo.getText().length() > 120) {
                throw new IllegalArgumentException("Text cannot exceed 120 characters. Or fall behind 1 character...");
            }
            existingTodo.setText(updatedTodo.getText());
        }

        // Validate and update priority.
        if (updatedTodo.getPriority() != null) {
            if (!List.of("low", "medium", "high").contains(updatedTodo.getPriority().toLowerCase())) {
                throw new IllegalArgumentException(
                        "Priority must be 'low', 'medium', or 'high'. Please and thank you!");
            }
            existingTodo.setPriority(updatedTodo.getPriority());
        }

        // Update 'dueDate' (optional).
        if (updatedTodo.getDueDate() != null) {
            existingTodo.setDueDate(updatedTodo.getDueDate());
        }

        // Save changes.
        return todoRepository.save(existingTodo);
    }

    @PostMapping("/{id}/done") // POST
                               // /todos/{id}/done----------------------------------------------------------------------
    public Todo markTodoAsDone(@PathVariable Long id) {
        // Search existing task.
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found. Don't get greedy!"));

        // Mark as done (true) only if it isn't already done.
        if (!todo.isDoneUndone()) {
            todo.setDoneUndone(true);
            todo.setDoneDate(LocalDate.now()); // Current date as 'doneDate'.
        }

        // Save changes.
        return todoRepository.save(todo);
    }

    @PutMapping("/{id}/undone") // PUT
                                // /todos/{id}/undone-------------------------------------------------------------------
    public Todo markTodoAsUndone(@PathVariable Long id) {
        // Search existing task.
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));

        // Mark as undone (false) only if it is done.
        if (todo.isDoneUndone()) {
            todo.setDoneUndone(false);
            todo.setDoneDate(null); // Delete 'doneDate'.
        }

        // Save changes.
        return todoRepository.save(todo);
    }
}
