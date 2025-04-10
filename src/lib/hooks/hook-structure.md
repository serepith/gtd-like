Base Layer:
- use-tag-management.ts
  • getAllTags()
  • addTag()
  • deleteTag()

- use-task-management.ts
  • getAllTasks()
  • addTask()
  • deleteTask() 
  • onTasksChanged()

Composition Layer:
- use-tag-selector.ts
  • searchTags()
  • filterTags()
  • useAllTags() (from tag-management)

- use-task-with-tags.ts
  • getTaskWithTags()
  • addTagToTask()
  • removeTagFromTask()
  • onTaskTagsChanged()