//AI WROTE THIS
// TaskItem.tsx
import { useEffect, useState } from 'react';
import { Task } from '../lib/models/Task'; 

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskItemEdit({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [editedNotes, setEditedNotes] = useState(task.notes || '');
  
    // Important: Update local state when prop changes
    useEffect(() => {
        setEditedContent(task.content);
        setEditedNotes(task.notes || '');
    }, [task]);
    
    // Handler for content input changes
const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditedContent(e.target.value);
};
  
  // Handler for notes textarea changes
const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setEditedNotes(e.target.value);
};
  
  // Handler for save button
  const handleSave = () => {
    // Call the onUpdate function from parent component
    onUpdate(task.taskId, {
      content: editedContent,
      notes: editedNotes
    });
    
    // Exit edit mode
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.taskId);
};
  
  if (isEditing) {
    return (
      <li className="p-3 border rounded">
        <input
          type="text"
          value={editedContent}
          onChange={handleContentChange}
          className="w-full mb-2 p-1 border rounded"
        />
        <textarea
          value={editedNotes}
          onChange={handleNotesChange}
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
      key={task.taskId} 
      className="p-3 border rounded cursor-pointer hover:bg-gray-50"
      onClick={() => setIsEditing(true)}
    >
      <h3 className="font-medium">{task.content}</h3>
      {task.notes && <p className="text-sm">{task.notes}</p>}
    </li>
  );
}