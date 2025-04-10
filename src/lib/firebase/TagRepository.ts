import { tagConverter } from './converters';
import { Tag } from '../models/Tag';
import { addDoc, collection, getDocs, getFirestore, onSnapshot, query, where, updateDoc, doc, deleteDoc, limit, DocumentReference, DocumentData } from 'firebase/firestore';
import { getFirebaseFirestore } from "./client";

export class TagRepository {
  private collection = collection(getFirestore(), 'Tags').withConverter(tagConverter);
  
  // Initial fetch
  async getTags(userId: string): Promise<Tag[]> {
    const q = query(this.collection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
      
    return snapshot.docs.map(doc => {
      const data = doc.data();
      if (data && data.content) {
        return data as Tag;
      }
      throw new Error('Invalid Tag data');
    });
  }

  // Push new Tag TO Firestore
  async addTag(TagData: string, userId: string): 
    Promise<DocumentReference<Partial<Tag>, DocumentData>> {
    return await addDoc(this.collection, {
      content: TagData,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Update Tag in Firestore
  async updateTag(TagId: string, updates: Partial<Tag>) {
    const docRef = doc(this.collection, TagId);
    return await updateDoc(docRef, updates);
  }

  // Delete Tag from Firestore
  async deleteTag(TagId: string, userId: string): Promise<void> {
    try {
      const TagRef = doc(this.collection, TagId);
      await deleteDoc(TagRef);
      console.log(`Tag ${TagId} deleted successfully`);
      return;
    } catch (error) {
      console.error('Error deleting Tag:', error);
      throw error;
    }
  }

  // Real-time updates FROM Firestore
  onTagsChanged(userId: string, callback: (Tags: Tag[]) => void): () => void {
    const q = query(this.collection, where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, snapshot => {
      const Tags = snapshot.docs.map(doc => {
        const data = doc.data();
        if (data && data.content) {
          return data as Tag;
        }
        throw new Error('Invalid Tag data');
      });
      callback(Tags);
    });
    return unsubscribe; // Return function to stop listening
  }

  // Autocomplete functionality
  async searchTagsByPrefix(userId: string, prefix: string): Promise<Tag[]> {
    const q = query(
      this.collection,
      where("userId", "==", userId),
      where("name", ">=", prefix),
      where("name", "<=", prefix + "\uf8ff"), // Firebase trick for prefix search
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...(doc.data() as Omit<Tag, "tagId">),
      tagId: doc.id
    }));
  }
  
  
}