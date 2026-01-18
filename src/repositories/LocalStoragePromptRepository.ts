import { Prompt, PromptInput, PromptDataStore } from '@/types/prompt';
import { PromptRepository } from './PromptRepository';
import { generateId } from '@/utils/id';
import { nowIsoLocal } from '@/utils/time';

const SCHEMA_VERSION_KEY = 'promptLibrary.schemaVersion';
const DATA_KEY = 'promptLibrary.prompts.v1';
const CURRENT_SCHEMA_VERSION = '1';

export class LocalStoragePromptRepository implements PromptRepository {
  private data: PromptDataStore = { schemaVersion: CURRENT_SCHEMA_VERSION, prompts: [] };

  init(): { success: boolean; error?: string } {
    try {
      const storedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);
      const storedData = localStorage.getItem(DATA_KEY);

      // If no version or version mismatch, reset to empty
      if (!storedVersion || storedVersion !== CURRENT_SCHEMA_VERSION) {
        this.resetToEmpty();
        if (storedVersion && storedVersion !== CURRENT_SCHEMA_VERSION) {
          return { success: true, error: 'Schema version mismatch - data reset' };
        }
        return { success: true };
      }

      // Try to parse stored data
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData) as PromptDataStore;
          if (parsed && Array.isArray(parsed.prompts)) {
            this.data = parsed;
            return { success: true };
          } else {
            this.resetToEmpty();
            return { success: false, error: 'Saved data was reset due to a storage error.' };
          }
        } catch {
          this.resetToEmpty();
          return { success: false, error: 'Saved data was reset due to a storage error.' };
        }
      } else {
        // No data stored yet, initialize empty
        this.resetToEmpty();
        return { success: true };
      }
    } catch {
      this.resetToEmpty();
      return { success: false, error: 'Saved data was reset due to a storage error.' };
    }
  }

  private resetToEmpty(): void {
    this.data = { schemaVersion: CURRENT_SCHEMA_VERSION, prompts: [] };
    this.persist();
    localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
  }

  private persist(): void {
    localStorage.setItem(DATA_KEY, JSON.stringify(this.data));
    localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
  }

  getAll(): Prompt[] {
    return [...this.data.prompts];
  }

  getById(id: string): Prompt | null {
    return this.data.prompts.find((p) => p.id === id) || null;
  }

  create(input: PromptInput): Prompt {
    const now = nowIsoLocal();
    const newPrompt: Prompt = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description.trim(),
      promptText: input.promptText.trim(),
      createdAt: now,
      updatedAt: now,
      createCount: 1,
      updateCount: 0,
    };

    this.data.prompts.push(newPrompt);
    this.persist();
    return newPrompt;
  }

  update(id: string, input: PromptInput): Prompt {
    const index = this.data.prompts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Prompt with id ${id} not found`);
    }

    const existing = this.data.prompts[index];
    const updated: Prompt = {
      ...existing,
      title: input.title.trim(),
      description: input.description.trim(),
      promptText: input.promptText.trim(),
      updatedAt: nowIsoLocal(),
      updateCount: existing.updateCount + 1,
    };

    this.data.prompts[index] = updated;
    this.persist();
    return updated;
  }

  remove(id: string): void {
    this.data.prompts = this.data.prompts.filter((p) => p.id !== id);
    this.persist();
  }
}
