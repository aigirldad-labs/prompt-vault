export interface Prompt {
  id: string;
  title: string;
  description: string;
  promptText: string;
  createdAt: string;
  updatedAt: string;
  createCount: number;
  updateCount: number;
}

export interface PromptInput {
  title: string;
  description: string;
  promptText: string;
}

export interface PromptDataStore {
  schemaVersion: string;
  prompts: Prompt[];
}
