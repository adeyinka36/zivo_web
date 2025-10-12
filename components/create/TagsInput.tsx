'use client';

import React, { useState } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  error?: string;
}

export default function TagsInput({ tags, onTagsChange, error }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tagName: string) => {
    const trimmedTag = tagName.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Tags
      </label>
      
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Add a tag..."
          className={`flex-1 px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 ${
            error ? 'border-red-500' : 'border-gray-600'
          }`}
          maxLength={255}
        />
        <button
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim() || tags.length >= 10}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-medium"
          >
            <TagIcon size={12} />
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:bg-yellow-300 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      <p className="text-gray-400 text-sm">
        Add up to 10 tags to help viewers discover your content. Press Enter to add a tag.
      </p>
    </div>
  );
}
