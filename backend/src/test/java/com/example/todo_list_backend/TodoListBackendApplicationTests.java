package com.example.todo_list_backend;

// import com.example.todo_list_backend.models.Todo;
// import com.example.todo_list_backend.repositories.TodoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
// import java.util.Optional;

@SpringBootTest
@AutoConfigureMockMvc
class TodoListBackendApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	// @Autowired
	// private TodoRepository todoRepository;

	@Test
	void testGetAllTodos() throws Exception {
		mockMvc.perform(get("/todos"))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON));
	}

	@Test
	void testCreateTodo() throws Exception {
		String newTodoJson = "{\"text\":\"Test Task\",\"priority\":\"high\",\"dueDate\":\""
				+ LocalDate.now().plusDays(1) + "\"}";

		mockMvc.perform(post("/todos")
				.contentType(MediaType.APPLICATION_JSON)
				.content(newTodoJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.text").value("Test Task"))
				.andExpect(jsonPath("$.priority").value("high"));
	}

	@Test
	void testCreateTodoWithInvalidPriority() throws Exception {
		String invalidTodoJson = "{\"text\":\"Invalid Task\",\"priority\":\"invalid\",\"dueDate\":\""
				+ LocalDate.now().plusDays(1) + "\"}";

		mockMvc.perform(post("/todos")
				.contentType(MediaType.APPLICATION_JSON)
				.content(invalidTodoJson))
				.andExpect(status().isBadRequest());
	}

	@Test
	void testCreateTodoWithPastDueDate() throws Exception {
		String invalidDateJson = "{\"text\":\"Past Task\",\"priority\":\"medium\",\"dueDate\":\""
				+ LocalDate.now().minusDays(1) + "\"}";

		mockMvc.perform(post("/todos")
				.contentType(MediaType.APPLICATION_JSON)
				.content(invalidDateJson))
				.andExpect(status().isBadRequest());
	}

	@Test
	void testDeleteNonExistentTodo() throws Exception {
		mockMvc.perform(delete("/todos/9999"))
				.andExpect(status().isNotFound());
	}
}
