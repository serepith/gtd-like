// src/lib/models/Tag.ts
export interface Tag {
    tagId: string;        // Firestore document ID
    content: string;         // Display name for the tag
    color?: string;       // Optional styling, because humans are visual creatures
    createdAt: Date;      // Temporal metadata, because history matters
    updatedAt: Date;
    userId: string;       // Ownership attribution
  }