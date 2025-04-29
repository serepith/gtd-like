//AI WROTE THIS
// TaskItem.tsx
import { Task } from '@/lib/types/gtd-items';
import { useEffect, useState } from 'react';

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskItemEdit({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedContent, setEditedContent] = useState(task.content || '');
  
    // Important: Update local state when prop changes
    useEffect(() => {
        setEditedTitle(task.title);
        setEditedContent(task.content || '');
    }, [task]);
    
    // Handler for content input changes
const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditedTitle(e.target.value);
};
  
  // Handler for notes textarea changes
const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setEditedContent(e.target.value);
};
  
  // Handler for save button
  const handleSave = () => {
    // Call the onUpdate function from parent component
    onUpdate(task.id, {
      title: editedTitle,
      content: editedContent
    });
    
    // Exit edit mode
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
};
  
  if (isEditing) {
    return (
      <li className="p-3 border rounded">
        <input
          type="text"
          value={editedTitle}
          onChange={handleTitleChange}
          className="w-full mb-2 p-1 border rounded"
        />
        <textarea
          value={editedContent}
          onChange={handleContentChange}
          className="w-full p-1 border rounded text-sm"
          rows={2}
        />
        <div className="mt-2 flex justify-end space-x-2">
          <button 
            onClick={() => setIsEditing(false)} 
            className="px-2 py-1 text-sm border rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
          >
            Save
          </button><button 
            onClick={handleDelete} 
            className="px-2 py-1 text-sm border rounded"
          >
            Delete
          </button>
        </div>
      </li>
    );
  }

  return (
    <li 
      key={task.id} 
      className="p-3 border rounded cursor-pointer hover:bg-gray-50"
      onClick={() => setIsEditing(true)}
    >
      <h3 className="font-medium">{task.content}</h3>
      {task.title && <p className="text-sm">{task.content}</p>}
    </li>
  );
}