import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Prompt, PromptInput } from '@/types/prompt';
import { PromptRepository } from '@/repositories/PromptRepository';
import { LocalStoragePromptRepository } from '@/repositories/LocalStoragePromptRepository';
import { toast } from '@/hooks/use-toast';

type EditorMode = 'create' | 'edit';

interface Draft {
  title: string;
  description: string;
  promptText: string;
}

interface PromptContextValue {
  prompts: Prompt[];
  selectedId: string | null;
  selectedPrompt: Prompt | null;
  mode: EditorMode;
  draft: Draft;
  isDeleteModalOpen: boolean;
  startCreate: () => void;
  selectPrompt: (id: string) => void;
  updateDraft: (patch: Partial<Draft>) => void;
  saveDraft: () => void;
  requestDeleteSelected: () => void;
  confirmDeleteSelected: () => void;
  cancelDelete: () => void;
  copySelected: () => void;
}

const PromptContext = createContext<PromptContextValue | null>(null);

const emptyDraft: Draft = { title: '', description: '', promptText: '' };

export function PromptProvider({ children }: { children: ReactNode }) {
  const [repository] = useState<PromptRepository>(() => new LocalStoragePromptRepository());
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>('create');
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Initialize repository on mount
  useEffect(() => {
    const result = repository.init();
    if (result.error) {
      toast({
        title: 'Storage Error',
        description: result.error,
        variant: 'destructive',
      });
    }
    setPrompts(repository.getAll());
  }, [repository]);

  const selectedPrompt = selectedId ? prompts.find((p) => p.id === selectedId) || null : null;

  const startCreate = useCallback(() => {
    setSelectedId(null);
    setMode('create');
    setDraft(emptyDraft);
  }, []);

  const selectPrompt = useCallback((id: string) => {
    const prompt = repository.getById(id);
    if (prompt) {
      setSelectedId(id);
      setMode('edit');
      setDraft({
        title: prompt.title,
        description: prompt.description,
        promptText: prompt.promptText,
      });
    }
  }, [repository]);

  const updateDraft = useCallback((patch: Partial<Draft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const saveDraft = useCallback(() => {
    const titleTrimmed = draft.title.trim();
    const promptTextTrimmed = draft.promptText.trim();
    const descriptionTrimmed = draft.description.trim();

    // Validation
    if (!titleTrimmed || !promptTextTrimmed) {
      toast({
        title: 'Validation Error',
        description: 'Title and Prompt Text are required.',
        variant: 'destructive',
      });
      return;
    }

    const input: PromptInput = {
      title: titleTrimmed,
      description: descriptionTrimmed,
      promptText: promptTextTrimmed,
    };

    try {
      if (mode === 'create') {
        const newPrompt = repository.create(input);
        setPrompts(repository.getAll());
        setSelectedId(newPrompt.id);
        setMode('edit');
        setDraft({
          title: newPrompt.title,
          description: newPrompt.description,
          promptText: newPrompt.promptText,
        });
      } else if (selectedId) {
        const updated = repository.update(selectedId, input);
        setPrompts(repository.getAll());
        setDraft({
          title: updated.title,
          description: updated.description,
          promptText: updated.promptText,
        });
      }

      toast({
        title: 'Success',
        description: 'Prompt saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save prompt.',
        variant: 'destructive',
      });
    }
  }, [draft, mode, selectedId, repository]);

  const requestDeleteSelected = useCallback(() => {
    if (selectedId) {
      setIsDeleteModalOpen(true);
    }
  }, [selectedId]);

  const confirmDeleteSelected = useCallback(() => {
    if (selectedId) {
      repository.remove(selectedId);
      setPrompts(repository.getAll());
      setSelectedId(null);
      setMode('create');
      setDraft(emptyDraft);
      setIsDeleteModalOpen(false);

      toast({
        title: 'Success',
        description: 'Prompt deleted.',
      });
    }
  }, [selectedId, repository]);

  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const copySelected = useCallback(async () => {
    if (!selectedPrompt) {
      toast({
        title: 'Error',
        description: 'Nothing to copy.',
        variant: 'destructive',
      });
      return;
    }

    const textToCopy = selectedPrompt.promptText.trim();
    if (!textToCopy) {
      toast({
        title: 'Error',
        description: 'Nothing to copy.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: 'Success',
        description: 'Copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Copy failed. Please copy manually.',
        variant: 'destructive',
      });
    }
  }, [selectedPrompt]);

  const value: PromptContextValue = {
    prompts,
    selectedId,
    selectedPrompt,
    mode,
    draft,
    isDeleteModalOpen,
    startCreate,
    selectPrompt,
    updateDraft,
    saveDraft,
    requestDeleteSelected,
    confirmDeleteSelected,
    cancelDelete,
    copySelected,
  };

  return <PromptContext.Provider value={value}>{children}</PromptContext.Provider>;
}

export function usePromptContext() {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePromptContext must be used within a PromptProvider');
  }
  return context;
}
