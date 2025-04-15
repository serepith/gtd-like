//AI WROTE THIS
'use client';

import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireAuth } from './use-auth';
import { useManagers } from './use-managers';
import { useEffect, useState } from 'react';
import { Tag } from '@/lib/models/Tag';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { DocumentData, DocumentReference } from 'firebase/firestore';


// Hook without auth
const useTagOperations = (userId : string) => {
    const { tags: tagsManager } = useManagers();
    const queryClient = useQueryClient();

    // Query for all tags
    const tagsQuery = useSuspenseQuery({
      queryKey: ['tags', userId],
      queryFn: () => tagsManager.getTags(userId),
      staleTime: Infinity, // Don't refetch automatically
    });
    
    // Set up subscription for real-time updates
    useEffect(() => {
      const unsubscribe = tagsManager.onTagsChanged(userId, (newTags) => {
        queryClient.setQueryData(['tags', userId], newTags);
      });
      
      return () => unsubscribe();
    }, [userId, queryClient, tagsManager]);
    
    // Add tag mutation
    const addTag = useMutation<
        DocumentReference<Partial<Tag>, DocumentData>, // What tagsRepo.addTag returns
        Error, // Error type
        string // Input parameter type
    >({
      mutationFn: (content: string) => {
        return tagsManager.addTag(content, userId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tags', userId] });
      }
    });
    
    // Delete tag mutation
    const deleteTag = useMutation({
      mutationFn: (tagId: string) => {
        return tagsManager.deleteTag(tagId, userId);
      },
      onMutate: async (tagId) => {
        await queryClient.cancelQueries({ queryKey: ['tags', userId] });
        
        const previousTags = queryClient.getQueryData<Tag[]>(['tags', userId]);
        
        queryClient.setQueryData<Tag[]>(['tags', userId], (old = []) => 
          old.filter(tag => tag.tagId !== tagId)
        );
        
        return { previousTags };
      },
      onError: (err, tagId, context) => {
        console.error('Error deleting tag:', err);
        // Restore the previous state if there's an error
        queryClient.setQueryData(['tags', userId], context?.previousTags);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['tags', userId] });
      }
    });

    const findTagById = (tagId: string) => {
      const tag = tagsQuery.data.find(tag => tag.tagId === tagId);
      if (!tag) {
        throw new Error(`Tag with ID ${tagId} not found`);
      }
      return tag;
    };

    const findTagsByPrefix = (prefix: string) => {
      return tagsQuery.data.filter(tag => tag.content.startsWith(prefix));
    }
    
    return {
      allTags: tagsQuery.data,
      addTag: addTag.mutate,
      deleteTag: deleteTag.mutate,
      findTag: findTagById,
      findTagsByPrefix,
      isAdding: addTag.isPending,
      isDeleting: deleteTag.isPending,
    };
  };

// Auth
export const useTagManagement = (userId: string) => {
  return useTagOperations(userId);
}