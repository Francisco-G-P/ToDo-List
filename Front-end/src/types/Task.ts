export interface Task {
    id: string;
    text: string;
    priority: 'Low' | 'Medium' | 'High';
    doneUndone: boolean;
    creationDate: string; // Format: YYYY-MM-DD
    dueDate?: string; // Optional, format: YYYY-MM-DD
    doneDate?: string; // Optional, format: YYYY-MM-DD
  }  
