'use client';

import { useContext, useState } from 'react';
import { useTaskManagement } from '@/lib/hooks/use-task-management';
import TagInput from './tag-input';
import { useAuth, useGuaranteedAuth, useSuspenseAuth } from '@/lib/hooks/use-auth';
import {useAuthState} from "react-firebase-hooks/auth";

export default function TextInput() {
  const [taskText, setTaskText] = useState('');
  const [taskTagsState, setTaskTags] = useState<string[]>([]);
  
  const user = useAuth();
  const { tasks, addTask } = useTaskManagement(user?.uid || '');



  const handleSubmit = async (e: React.FormEvent) => {
    //what is the default behavior???
    e.preventDefault();
    if (!taskText.trim()) return;

    try {
        setTaskText('');
        setTaskTags([]);
        addTask({ title: taskText });
    } catch (error) {
      setTaskText(`Error: ${(error as Error).message}`);
    }
  };


  
  return (
    <div className="p-4">
      <h1>Welcome, {user?.displayName}.</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="What's on your mind?"
        />
        <TagInput 
        userId={user?.uid || ''}
        onTagsChange={function (enteredTags: string[]): void {
          console.log('onTagsChange', enteredTags, 'Function not implemented');
          setTaskTags(enteredTags);
        } }
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700"
        >
          Add to List
        </button>
      </form>
    </div>
  );
}