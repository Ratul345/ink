import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

export interface Note {
    id: string;
    title: string;
    body: string;
    updatedAt: number;
}

const STORAGE_KEY = 'ink_notes';

export const getNotes = async (): Promise<Note[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to fetch notes', e);
        return [];
    }
};

export const getNote = async (id: string): Promise<Note | undefined> => {
    const notes = await getNotes();
    return notes.find((n) => n.id === id);
};

export const saveNote = async (title: string, body: string, id?: string): Promise<Note> => {
    const notes = await getNotes();
    const timestamp = Date.now();
    let newNote: Note;

    if (id) {
        const index = notes.findIndex((n) => n.id === id);
        if (index !== -1) {
            newNote = { ...notes[index], title, body, updatedAt: timestamp };
            notes[index] = newNote;
        } else {
            // Create if ID provided but not found (shouldn't happen usually)
            newNote = { id, title, body, updatedAt: timestamp };
            notes.unshift(newNote);
        }
    } else {
        newNote = {
            id: Crypto.randomUUID(),
            title: title || 'Untitled',
            body,
            updatedAt: timestamp,
        };
        notes.unshift(newNote);
    }

    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
        console.error('Failed to save note', e);
    }
    return newNote;
};

export const deleteNote = async (id: string): Promise<void> => {
    const notes = await getNotes();
    const filteredNotes = notes.filter((n) => n.id !== id);
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
    } catch (e) {
        console.error('Failed to delete note', e);
    }
};
