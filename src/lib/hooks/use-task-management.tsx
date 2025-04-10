//AI WROTE THIS

'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from "../firebase/client";
import { TaskRepository } from '@/lib/firebase/TaskRepository';
import { useQueryClient } from '@tanstack/react-query';
import { useRequireAuth } from './use-auth';
import { useEffect } from 'react';
import { useRepositories } from './use-repositories'
import { Task } from '@/lib/models/Task';
import { TagRepository } from '@/lib/firebase/TagRepository';

// operations without auth
const useTaskOperations = (userId : string) => {
  const { tasks } = useRepositories();
  const queryClient = useQueryClient();
  
  
  console.log("user? ", userId);

  // The query is still used for initial loading state and error handling
  const tasksQuery = useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => tasks.getTasks(userId),
    // This prevents unnecessary fetching since we're using real-time updates
    staleTime: Infinity
  });

  // Set up subscription to real-time updates
  useEffect(() => {
    // This is the only place where we reference the subscription
    const unsubscribe = tasks.onTasksChanged(userId, (newTasks) => {
      // When Firebase pushes new data, update React Query's cache
      queryClient.setQueryData(['tasks', userId], newTasks);
    });
    
    return () => unsubscribe();
  }, [userId, queryClient, tasks]);

  // fetch all tasks
/*   const fetchTasks = async () => {
    if (!userId) throw new Error("User not authenticated");
    return tasks.getTasks(userId);
  }; */


  // Add task mutation
  const addTask = useMutation({
    mutationFn: (newTask: { content: string, tags? : string[] }) => {
      return tasks.addTask(newTask.content, userId, newTask.tags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    }
  });

  // Delete task mutation
  const deleteTask = useMutation({
    mutationFn: (taskId: string) => {
      return tasks.deleteTask(taskId, userId);
    },
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', userId] });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', userId]);
      
      // Optimistically update to remove the task
      queryClient.setQueryData(['tasks', userId], (old = []) => 
        (old as Task[]).filter(task => task.taskId !== taskId)
      );
      
      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      console.error('Error deleting task:', err);
      // Restore the previous state if there's an error
      queryClient.setQueryData(['tasks', userId], context?.previousTasks);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    }
  });
  
  // Update task mutation
  /* const updateMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      if (!userId) throw new Error("User not authenticated");
      return tasks.updateTask(taskId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    }
  }); */


  const updateMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      if (!userId) throw new Error("User not authenticated");
      return tasks.updateTask(taskId, updates);
    },
    onMutate: async ({ taskId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', userId] });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', userId]);
      
      // Optimistically update the cache
      queryClient.setQueryData<Task[] | undefined>(['tasks', userId], (old: Task[] | undefined) => 
        old?.map((task: Task) => task.taskId === taskId ? { ...task, ...updates } : task)
      );
      
      // Return a context with the previous value
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // If there's an error, roll back
      queryClient.setQueryData(['tasks', userId], context?.previousTasks ?? []);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    }
  });

  return {
    // Query results
    tasks: tasksQuery.data,
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    
    // Add functionality
    addTask: addTask.mutate,
    isAdding: addTask.isPending,
    
    // Update functionality
    updateTask: updateMutation.mutate,
    isUpdating: updateMutation.isPending,

    // Delete functionality
    deleteTask: deleteTask.mutate,
    isDeleting: deleteTask.isPending,
  };
}

export const useTaskManagement = (userId: string) => {
  return useTaskOperations(userId);
}