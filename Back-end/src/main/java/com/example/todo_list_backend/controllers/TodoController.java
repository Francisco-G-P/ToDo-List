package com.example.todo_list_backend.controllers;

import com.example.todo_list_backend.models.Todo;
import com.example.todo_list_backend.repositories.TodoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Controller to handle API requests for the to-do list
@RestController
@RequestMapping("/todos")
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    // GET /todos - Retrieve all tasks with pagination
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos(@RequestParam(defaultValue = "1") int page) {
        int pageSize = 10;
        int adjustedPage = page - 1;
        if (adjustedPage < 0) {
            return ResponseEntity.badRequest().build();
        }
        List<Todo> allTodos = todoRepository.findAll();
        int start = adjustedPage * pageSize;
        int end = Math.min(start + pageSize, allTodos.size());
        if (start >= allTodos.size()) {
            return ResponseEntity.ok(List.of()); // Return an empty list if the page is out of range
        }
        return ResponseEntity.ok(allTodos.subList(start, end));
    }

    // POST /todos - Add a new task
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        // Validate input
        if (todo.getText() == null || todo.getText().isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Text is required
        }
        if (!"low".equalsIgnoreCase(todo.getPriority()) &&
                !"medium".equalsIgnoreCase(todo.getPriority()) &&
                !"high".equalsIgnoreCase(todo.getPriority())) {
            return ResponseEntity.badRequest().body(null); // Invalid priority
        }
        Todo savedTodo = todoRepository.save(todo);
        return ResponseEntity.ok(savedTodo);
    }

    // PUT /todos/{id} - Edit an existing task
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable String id, @RequestBody Todo updatedTodo) {
        Optional<Todo> existingTodo = todoRepository.update(id, updatedTodo);
        return existingTodo.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /todos/{id}/done - Mark a task as completed
    @PostMapping("/{id}/done")
    public ResponseEntity<Void> markTodoAsDone(@PathVariable String id) {
        Optional<Todo> todoOptional = todoRepository.findById(id);
        if (todoOptional.isPresent() && !todoOptional.get().isDoneUndone()) {
            Todo todo = todoOptional.get();
            todo.setDoneUndone(true);
            todo.setDoneDate(java.time.LocalDate.now());
            return ResponseEntity.ok().build();
        }
        return todoOptional.isPresent() ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // PUT /todos/{id}/undone - Mark a task as not completed
    @PutMapping("/{id}/undone")
    public ResponseEntity<Void> markTodoAsUndone(@PathVariable String id) {
        Optional<Todo> todoOptional = todoRepository.findById(id);
        if (todoOptional.isPresent() && todoOptional.get().isDoneUndone()) {
            Todo todo = todoOptional.get();
            todo.setDoneUndone(false);
            todo.setDoneDate(null);
            return ResponseEntity.ok().build();
        }
        return todoOptional.isPresent() ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
