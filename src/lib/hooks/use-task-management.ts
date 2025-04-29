//AI WROTE THIS

'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { collection, onSnapshot, query, orderBy, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Content } from 'next/font/google';
import { Task } from '../types/gtd-items';
import { getFirestore } from '@/lib/data-firebase/init';
import { newItem } from '../sync';
import { queryClient } from '../utils/queryClient';
import { yjs } from '../data-yjs/init';


// operations without auth
const useTaskOperations = (userId : string) => {
  const tasksQuery = useQuery({
    queryKey: ['tasks', userId],
    queryFn: async () => {
      return new Array(yjs().get('tasks')?.entries());

    //   const q = query(collection(getFirestore(), 'tasks'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    //   const snapshot = await getDocs(q);
    //   return snapshot.docs.map(doc => {
    //     const data = doc.data();
    //     if (data && data.content) {
    //       return data as Task;
    //     }
    //     throw new Error('Invalid task data');
    //  });
    },
    staleTime: Infinity,
  });

  // Add task mutation
  const addTask = useMutation({
    mutationFn: async (newTask: { title: string, tags?: string[] }) => {
      const taskItem = new Task(newTask.title, userId);
      return await newItem(taskItem, "tasks");
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    }
  });

  // Delete task mutation
  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      return Promise.resolve(yjs().delete(id));
    },
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', userId] });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', userId]);
      
      // Optimistically update to remove the task
    //   queryClient.setQueryData(['tasks', userId], (old = []) => 
    //     (old as Task[]).filter(task => task.taskId !== taskId)
    //   );
      
      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      console.error('Error deleting task:', err);
      // Restore the previous state if there's an error
      //queryClient.setQueryData(['tasks', userId], context?.previousTasks);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    }
  });
  
  // Update task mutation
//   const updateMutation = useMutation({
//     mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
//       if (!userId) throw new Error("User not authenticated");
//       return tasks.updateTask(taskId, updates);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
//     }
//   }); 


  const updateMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      if (!userId) throw new Error("User not authenticated");
      // Simulate an async operation or replace with actual implementation
      return Promise.resolve(); // Replace with: return tasks.updateTask(taskId, updates);
    },
    onMutate: async ({ taskId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', userId] });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', userId]);
      
      // Optimistically update the cache
    //   queryClient.setQueryData<Task[] | undefined>(['tasks', userId], (old: Task[] | undefined) => 
    //     old?.map((task: Task) => task.taskId === taskId ? { ...task, ...updates } : task)
    //   );
      
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


