package com.example.demo.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.example.demo.model.Todo;

@Repository
public class InMemoryTodoRepository {

    private final Map<Long, Todo> todoMap = new HashMap<>();
    private long idCounter = 1;

    // Guardar una nueva tarea
    public Todo save(Todo todo) {
        if (todo.getId() == null) {
            todo.setId(idCounter++);
        }
        todoMap.put(todo.getId(), todo);
        return todo;
    }

    // Obtener todas las tareas
    public List<Todo> findAll() {
        return new ArrayList<>(todoMap.values());
    }

    // Obtener tarea por ID
    public Optional<Todo> findById(Long id) {
        return Optional.ofNullable(todoMap.get(id));
    }

    // Eliminar tarea por ID
    public boolean deleteById(Long id) {
        return todoMap.remove(id) != null;
    }

    // Prellenar datos de ejemplo
    public void populateSampleData() {
        save(new Todo(null, "Complete the to-do project!", "high", false, LocalDate.now(), LocalDate.of(2024, 11, 22),
                null));
        save(new Todo(null, "Prepare to-do presentation!", "medium", true, LocalDate.now(), LocalDate.of(2024, 12, 29),
                LocalDate.of(2024, 12, 01)));
        save(new Todo(null, "Organize repo files and README!", "low", false, LocalDate.now(), null, null));
        save(new Todo(null, "Complete task #4!", "high", false, LocalDate.now(), LocalDate.of(2024, 11, 22), null));
        save(new Todo(null, "Prepare task 5#!", "medium", true, LocalDate.now(), LocalDate.of(2024, 12, 29),
                LocalDate.of(2024, 12, 01)));
    }
}
