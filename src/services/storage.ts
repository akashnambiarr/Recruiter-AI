import type { Candidate } from '../types';

const STORAGE_KEY = 'recruiter_ai_data';

export function saveToStorage(candidates: Candidate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
}

export function loadFromStorage(): Candidate[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return null;
  }
}