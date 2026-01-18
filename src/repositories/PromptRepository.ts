import { Prompt, PromptInput } from '@/types/prompt';

export interface PromptRepository {
  init(): { success: boolean; error?: string };
  getAll(): Prompt[];
  getById(id: string): Prompt | null;
  create(input: PromptInput): Prompt;
  update(id: string, input: PromptInput): Prompt;
  remove(id: string): void;
}
