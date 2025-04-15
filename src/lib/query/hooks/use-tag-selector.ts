
import { useTagManagement } from "./use-tag-management";

export const useTagSelector = (userId: string) => {

    const tags = useTagManagement(userId);
    
    // Search function (client-side filtering)
    const searchTags = (prefix: string) => {
        if (!prefix) return tags;

        const lowerPrefix = prefix.toLowerCase();
        return tags.allTags.filter(tag => 
          tag.content.toLowerCase().startsWith(lowerPrefix)
        );
      };


}