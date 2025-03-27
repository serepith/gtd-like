//AI WROTE THIS

// app/components/tasks-client.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchTasks } from '../lib/firebase/firestore-fetch';
import { useAuth } from '@/app/providers/firebase-auth-provider';
import { Task } from '../lib/models/Task';
import { useTasks } from '@/app/hooks/use-tasks';
import TaskItemEdit from './task-edit';

export default function TasksClient() {
  const { tasks, isLoading, error, updateTask, deleteTask } = useTasks();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;
  
  return (
    <ul className="space-y-2">
      {tasks?.map((task) => (
          <TaskItemEdit
            key={task.taskId}
            task={task}
            onUpdate={(taskId, updates) => updateTask({ taskId, updates })}
            onDelete={(taskId) => deleteTask(taskId)}
          />
      ))}
    </ul>
  );
}

/* export default function TaskList() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Only fetch when auth state is determined and user is authenticated
    if (!loading) {
      if (user) {
        const loadTasks = async () => {
          try {
            const taskData = await fetchTasks();
            setTasks(taskData);
          } catch (err) {
            console.error("Failed to fetch tasks:", err);
            setError("Failed to load tasks. Please try again.");
          } finally {
            setIsLoading(false);
          }
        };
        
        loadTasks();
      } else {
        setError("You must be signed in to view tasks");
        setIsLoading(false);
      }
    }
  }, [user, loading]);
  
  if (loading || isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.taskId} className="p-3 border rounded">
          <h3 className="font-medium">{task.content}</h3>
          {task.notes && <p className="text-sm">{task.notes}</p>}
        </li>
      ))}
    </ul>
  );
} */