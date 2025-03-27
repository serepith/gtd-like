'use client';

import { useState } from 'react';
import { useTasks } from '@/app/hooks/use-tasks';

export default function TextInput() {
  const [text, setText] = useState('');
  const { tasks, addTask  } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
        setText('');
        addTask({content: text});
    } catch (error) {
      setText(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="What's on your mind?"
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