/// Service module
import { Collection, Note, db } from '@/modules/database.mjs';

// Create collection
export function createCollection(name: string): Promise<Pick<Collection, 'id'>> {
  return new Promise<Pick<Collection, 'id'>>((resolve: (value: Pick<Collection, 'id'>)=>void, reject: (reason?: any)=>void): void=>{
    db<Collection>('collections')
      .insert({ name }, 'id')
      .then((value: Pick<Collection, 'id'>[]): void=>{
        resolve(value[0]);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}

// Read all collections
export function readAllCollections(): Promise<Collection[]> {
  return new Promise<Collection[]>((resolve: (value: Collection[])=>void, reject: (reason?: any)=>void): void=>{
    db<Collection>('collections')
      .select()
      .then((value: Collection[]): void=>{
        resolve(value);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}

// Read all collections by name
export function readAllCollectionsByName(name: string): Promise<Collection[]> {
  return new Promise<Collection[]>((resolve: (value: Collection[])=>void, reject: (reason?: any)=>void): void=>{
    db<Collection>('collections')
      .select()
      .whereLike('name', `%${name}%`)
      .then((value: Collection[]): void=>{
        resolve(value);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}

// Update collection
export function updateCollection(id: number, name: string): Promise<number> {
  return new Promise<number>((resolve: (value: number)=>void, reject: (reason?: any)=>void): void=>{
    db<Collection>('collections')
      .update({ name })
      .where('id', id)
      .then((value: number): void=>{
        resolve(value);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}

// Delete collection
export function deleteCollection(id: number): Promise<number> {
  return new Promise<number>((resolve: (value: number)=>void, reject: (reason?: any)=>void): void=>{
    db<Collection>('collections')
      .delete()
      .where('id', id)
      .then((value: number): void=>{
        resolve(value);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}

// Create note
export function createNote(title: string, contents: string): Promise<Pick<Note, 'id'>> {
  return new Promise<Pick<Note, 'id'>>((resolve: (value: Pick<Note, 'id'>)=>void, reject: (reason?: any)=>void): void=>{
    db<Note>('notes')
      .insert({
        title,
        modify_at: db.fn.now(),
        contents
      }, 'id')
      .then((value: Pick<Note, 'id'>[]): void=>{
        resolve(value[0]);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}

// Read note by id
export function readNoteById(id: number): Promise<Note | null> {
  return new Promise<Note | null>((resolve: (value: Note | null)=>void, reject: (reason?: any)=>void): void=>{
    db<Note>('notes')
      .first()
      .where('id', id)
      .then((value: Note | undefined): void=>{
        resolve(value ?? null);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}

// Read all notes by collection
export function readAllNotesByCollection(collection: number | null): Promise<Pick<Note, 'id' | 'title'>[]> {
  return new Promise<Pick<Note, 'id' | 'title'>[]>((resolve: (value: Pick<Note, 'id' | 'title'>[])=>void, reject: (reason?: any)=>void): void=>{
    db<Note>('notes')
      .select('id', 'title')
      .where('collection', collection)
      .then((value: Pick<Note, 'id' | 'title'>[]): void=>{
        resolve(value);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}

// Read all notes by title
export function readAllNotesByTitle(title: string): Promise<Pick<Note, 'id' | 'title'>[]> {
  return new Promise<Pick<Note, 'id' | 'title'>[]>((resolve: (value: Pick<Note, 'id' | 'title'>[])=>void, reject: (reason?: any)=>void): void=>{
    db<Note>('notes')
      .select('id', 'title')
      .whereLike('title', `%${title}%`)
      .then((value: Pick<Note, 'id' | 'title'>[]): void=>{
        resolve(value);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}

// Update note
export function updateNote(id: number, data: Partial<Omit<Note, 'id' | 'modify_at'>>): Promise<number> {
  return new Promise<number>((resolve: (value: number)=>void, reject: (reason?: any)=>void): void=>{
    db<Note>('collections')
      .update({
        modify_at: db.fn.now(),
        ...data
      })
      .where('id', id)
      .then((value: number): void=>{
        resolve(value);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}

// Delete note
export function deleteNote(id: number): Promise<number> {
  return new Promise<number>((resolve: (value: number)=>void, reject: (reason?: any)=>void): void=>{
    db<Note>('notes')
      .delete()
      .where('id', id)
      .then((value: number): void=>{
        resolve(value);
      })
      .catch((reason: any): void=>{
        reject(reason);
      });
  });
}
