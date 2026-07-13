import { create } from "zustand";

interface Story {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  storyText: string;
  genre: string | null;
  style: string | null;
  language: string;
  duration: string | null;
  status: string;
  coverImage: string | null;
  characterId: string | null;
  seriesId: string | null;
  createdAt: string;
  updatedAt: string;
  scenes?: Scene[];
}

interface Scene {
  id: string;
  storyId: string;
  sceneNumber: number;
  sceneText: string;
  imagePrompt: string | null;
  imagePath: string | null;
  audioPath: string | null;
}

interface StoryState {
  stories: Story[];
  currentStory: Story | null;
  isGenerating: boolean;
  generationProgress: number;
  setStories: (stories: Story[]) => void;
  setCurrentStory: (story: Story | null) => void;
  addStory: (story: Story) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  removeStory: (id: string) => void;
  setGenerating: (val: boolean) => void;
  setGenerationProgress: (val: number) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  stories: [],
  currentStory: null,
  isGenerating: false,
  generationProgress: 0,
  setStories: (stories) => set({ stories }),
  setCurrentStory: (story) => set({ currentStory: story }),
  addStory: (story) => set((s) => ({ stories: [story, ...s.stories] })),
  updateStory: (id, updates) =>
    set((s) => ({
      stories: s.stories.map((story) =>
        story.id === id ? { ...story, ...updates } : story
      ),
      currentStory:
        s.currentStory?.id === id
          ? { ...s.currentStory, ...updates }
          : s.currentStory,
    })),
  removeStory: (id) =>
    set((s) => ({
      stories: s.stories.filter((story) => story.id !== id),
      currentStory: s.currentStory?.id === id ? null : s.currentStory,
    })),
  setGenerating: (val) => set({ isGenerating: val }),
  setGenerationProgress: (val) => set({ generationProgress: val }),
}));
