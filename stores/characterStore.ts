import { create } from "zustand";

interface Character {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  age: number | null;
  personality: string | null;
  appearance: string | null;
  photo: string | null;
  embedding: string | null;
  createdAt: string;
}

interface CharacterState {
  characters: Character[];
  currentCharacter: Character | null;
  setCharacters: (chars: Character[]) => void;
  setCurrentCharacter: (char: Character | null) => void;
  addCharacter: (char: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  removeCharacter: (id: string) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  characters: [],
  currentCharacter: null,
  setCharacters: (characters) => set({ characters }),
  setCurrentCharacter: (character) => set({ currentCharacter: character }),
  addCharacter: (char) => set((s) => ({ characters: [...s.characters, char] })),
  updateCharacter: (id, updates) =>
    set((s) => ({
      characters: s.characters.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  removeCharacter: (id) =>
    set((s) => ({
      characters: s.characters.filter((c) => c.id !== id),
    })),
}));
