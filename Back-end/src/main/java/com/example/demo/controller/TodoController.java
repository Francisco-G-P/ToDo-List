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
                // /todos-------------------------------------------------------------------------------------------
    public List<Todo> getTodos(
            @RequestParam(defaultValue = "1") int page, // Número de página (por defecto 1)
            @RequestParam(defaultValue = "10") int size // Tamaño de página (por defecto 10)
    ) {
        // Obtener todas las tareas
        List<Todo> todos = todoRepository.findAll();

        // Calcular índices para la paginación
        int fromIndex = (page - 1) * size;
        int toIndex = Math.min(fromIndex + size, todos.size());

        // Manejar el caso en que la página solicitada esté fuera del rango
        if (fromIndex >= todos.size() || fromIndex < 0) {
            return List.of(); // Retornar lista vacía
        }

        // Retornar la sublista correspondiente
        return todos.subList(fromIndex, toIndex);
    }

    @PostMapping // POST
                 // /todos-----------------------------------------------------------------------------------------
    public Todo createTodo(@RequestBody Todo newTodo) {
        // Validar que el texto no esté vacío
        if (newTodo.getText() == null || newTodo.getText().isEmpty()) {
            throw new IllegalArgumentException("Text is required. Don`t be shy!");
        }

        // Validar que el texto no exceda 120 caracteres
        if (newTodo.getText().length() > 120) {
            throw new IllegalArgumentException("Text cannot exceed 120 characters. Or fall behind 1 character...");
        }

        // Validar que la prioridad sea válida
        if (newTodo.getPriority() == null ||
                (!newTodo.getPriority().equalsIgnoreCase("low") &&
                        !newTodo.getPriority().equalsIgnoreCase("medium") &&
                        !newTodo.getPriority().equalsIgnoreCase("high"))) {
            throw new IllegalArgumentException("Priority must be 'low', 'medium', or 'high'. Please and thank you!");
        }

        // Asignar la fecha de creación automáticamente
        newTodo.setCreationDate(LocalDate.now());

        // Guardar la tarea y retornarla
        return todoRepository.save(newTodo);
    }

    @PutMapping("/{id}") // PUT
                         // /todos/{id}-----------------------------------------------------------------------------
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo) {
        // Buscar la tarea existente
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found! Try again!"));

        // Validar y actualizar el texto
        if (updatedTodo.getText() != null && !updatedTodo.getText().isEmpty()) {
            if (updatedTodo.getText().length() > 120) {
                throw new IllegalArgumentException("Text cannot exceed 120 characters. Or fall behind 1 character...");
            }
            existingTodo.setText(updatedTodo.getText());
        }

        // Validar y actualizar la prioridad
        if (updatedTodo.getPriority() != null) {
            if (!List.of("low", "medium", "high").contains(updatedTodo.getPriority().toLowerCase())) {
                throw new IllegalArgumentException(
                        "Priority must be 'low', 'medium', or 'high'. Please and thank you!");
            }
            existingTodo.setPriority(updatedTodo.getPriority());
        }

        // Actualizar la fecha de entrega (opcional)
        if (updatedTodo.getDueDate() != null) {
            existingTodo.setDueDate(updatedTodo.getDueDate());
        }

        // Guardar los cambios
        return todoRepository.save(existingTodo);
    }

    @PostMapping("/{id}/done") // POST
                               // /todos/{id}/done-----------------------------------------------------------------
    public Todo markTodoAsDone(@PathVariable Long id) {
        // Buscar la tarea existente
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found. Don't get greedy!"));

        // Marcar como terminada solo si no está ya terminada
        if (!todo.isDoneUndone()) {
            todo.setDoneUndone(true);
            todo.setDoneDate(LocalDate.now()); // Asigna la fecha actual como fecha de finalización
        }

        // Guardar los cambios
        return todoRepository.save(todo);
    }

    @PutMapping("/{id}/undone") // PUT
                                // /todos/{id}/undone-------------------------------------------------------------------
    public Todo markTodoAsUndone(@PathVariable Long id) {
        // Buscar la tarea existente
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));

        // Marcar como no terminada solo si está terminada
        if (todo.isDoneUndone()) {
            todo.setDoneUndone(false);
            todo.setDoneDate(null); // Eliminar la fecha de finalización
        }

        // Guardar los cambios
        return todoRepository.save(todo);
    }
}
