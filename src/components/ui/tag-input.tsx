// src/components/tag-input.tsx
//import { Tag } from '@/lib/types/Tag';
import { Tag } from '@/lib/types/gtd-items';
import React, { useState, KeyboardEvent, useRef, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
//import { useTagManagement } from '@/lib/hooks/use-tag-management';

interface TagInputProps {
  userId: string;
  initialTags?: string[];
  placeholder?: string;
  onTagsChange: (enteredTags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({
  userId, 
  initialTags = [], 
  placeholder = "Add tags...",
  onTagsChange,
}) => {
  const [enteredTags, setEnteredTags] = useState<string[]>(initialTags);
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [debouncedValue] = useDebounce(inputValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  //const { findTagsByPrefix } = useTagManagement(userId);
  
  useEffect(() => {
    // Notify parent component when list of tags changes
    onTagsChange(enteredTags);
  }, [enteredTags, onTagsChange]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !enteredTags.includes(trimmedTag)) {
      setEnteredTags([...enteredTags, trimmedTag]);
      setInputValue('');
    }
  };

  // useEffect(() => {
  //   if (debouncedValue.length >= 2) {
  //     // Only search when there are at least 2 characters
  //     const matches = findTagsByPrefix(debouncedValue);
  //     setSuggestions(matches);
  //   } else {
  //     setSuggestions([]);
  //   }
  // }, [debouncedValue]);

  const removeTag = (indexToRemove: number) => {
    setEnteredTags(enteredTags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && enteredTags.length > 0) {
      // If backspace is pressed on empty input, remove the last tag
      removeTag(enteredTags.length - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove commas to handle paste with commas
    setInputValue(e.target.value.replace(/,/g, ''));
  };

  const handleContainerClick = () => {
    // Focus the input when container is clicked
    inputRef.current?.focus();
  };

  return (
    <div 
      className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md min-h-10 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
      onClick={handleContainerClick}
    >
      {enteredTags.map((tag, index) => (
        <div 
          key={index} 
          className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-sm"
        >
          <span>{tag}</span>
          <button
            type="button"
            className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
            onClick={() => removeTag(index)}
          >
            ×
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-grow outline-none bg-transparent min-w-20"
        placeholder={enteredTags.length === 0 ? placeholder : ''}
      />
    </div>
  );
};

export default TagInput;