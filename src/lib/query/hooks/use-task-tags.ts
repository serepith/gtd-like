//AI WROTE THIS
'use client';

import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireAuth } from './use-auth';
import { useManagers } from './use-managers';
import { useEffect, useState } from 'react';
import { Tag } from '@/lib/models/Tag';
import { useTagManagement } from './use-tag-management';


// 2. Hook for task-specific tags
const useTaskTagOperations = (taskId: string, userId: string) => {
  const { tasks: tasksRepo } = useManagers();
  const queryClient = useQueryClient();
  const { allTags } = useTagManagement(userId); // Reuse the all tags hook
  
  // Query for task tags
  const taskTagsQuery = useSuspenseQuery({
    queryKey: ['taskTags', taskId, userId],
    queryFn: () => tasksRepo.getTaskTags(taskId, userId),
    staleTime: Infinity,
  });
  
  // Set up subscription for real-time updates
  useEffect(() => {
    const unsubscribe = tasksRepo.onTasksChanged(userId, (newTaskTags) => {
      queryClient.setQueryData(['taskTags', taskId, userId], newTaskTags);
    });
    
    return () => unsubscribe();
  }, [taskId, userId, queryClient, tasksRepo]);
  
  // Add tag to task mutation
  const addTagToTask = useMutation({
    mutationFn: async (tagId: string) => {
      return tasksRepo.addTagToTask(taskId, tagId, userId);
    },
    onMutate: async (tagId) => {
      await queryClient.cancelQueries({ queryKey: ['taskTags', taskId, userId] });
      
      const previousTaskTags = queryClient.getQueryData<string[]>(['taskTags', taskId, userId]);
      
      // Optimistically update the task's tags
      queryClient.setQueryData<string[]>(['taskTags', taskId, userId], (old = []) => 
        [...old, tagId]
      );
      
      return { previousTaskTags };
    },
    onError: (err, tagId, context) => {
      queryClient.setQueryData(['taskTags', taskId, userId], context?.previousTaskTags);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTags', taskId, userId] });
    }
  });
  
  // Remove tag from task mutation
  const removeTagFromTask = useMutation({
    mutationFn: async (tagId: string) => {
      return tasksRepo.removeTagFromTask(taskId, tagId, userId);
    },
    onMutate: async (tagId) => {
      await queryClient.cancelQueries({ queryKey: ['taskTags', taskId, userId] });
      
      const previousTaskTags = queryClient.getQueryData<string[]>(['taskTags', taskId, userId]);
      
      // Optimistically update the task's tags
      queryClient.setQueryData<string[]>(['taskTags', taskId, userId], (old = []) => 
        old.filter(id => id !== tagId)
      );
      
      return { previousTaskTags };
    },
    onError: (err, tagId, context) => {
      queryClient.setQueryData(['taskTags', taskId, userId], context?.previousTaskTags);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTags', taskId, userId] });
    }
  });
  
  // Get the full tag objects for the task
  // Map the tag IDs to their corresponding Tag objects
  // Filter out any undefined values
  const taskTagObjects = taskTagsQuery.data
    .map((tag) => allTags.find((t) => t.tagId === tag.tagId))
    .filter((tag): tag is Tag => Boolean(tag));
  
  return {
    taskTags: taskTagObjects,
    addTagToTask: (tagId: string) => addTagToTask.mutate(tagId),
    removeTagFromTask: (tagId: string) => removeTagFromTask.mutate(tagId),
    isAddingTag: addTagToTask.isPending,
    isRemovingTag: removeTagFromTask.isPending,
  };
};

export const useTaskTags = (taskId: string) => {
  const { user } = useRequireAuth();

  // Check if user is authenticated
  if (!user) {
    throw new Error("Authentication required");
  }

  // Use the hook without auth
  return useTaskTagOperations(taskId, user.uid);
}


// 3. Combined hook for a tag selection interface
export const useTagSelector = (userId: string, taskId: string) => {
  const { allTags, findTag, addTag } = useTagManagement(userId);
  const { taskTags, addTagToTask, removeTagFromTask } = useTaskTags(taskId);
  const [searchPrefix, setSearchPrefix] = useState('');
  
  // Filtered tags based on search prefix
  const filteredTags = searchPrefix ? findTag(searchPrefix) : allTags;
  
  // Check if a tag is already on the task
  const isTagOnTask = (tagId: string) => 
    taskTags.some(tag => tag.tagId === tagId);
  
  // Toggle a tag on the task
  const toggleTag = (tagId: string) => {
    if (isTagOnTask(tagId)) {
      removeTagFromTask(tagId);
    } else {
      addTagToTask(tagId);
    }
  };
  
  return {
    // Tag data
    allTags: filteredTags,
    taskTags,
    
    // Search
    searchPrefix,
    setSearchPrefix,
    
    // Actions
    isTagOnTask,
    toggleTag
  };
};