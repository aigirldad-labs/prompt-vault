import { usePromptContext } from '@/contexts/PromptContext';
import { PromptListItem } from './PromptListItem';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PromptList() {
  const { prompts, selectedId, selectPrompt } = usePromptContext();

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-muted-foreground">
          No prompts yet. Click "New Prompt" to create one.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col">
        {prompts.map((prompt) => (
          <PromptListItem
            key={prompt.id}
            prompt={prompt}
            isSelected={selectedId === prompt.id}
            onSelect={selectPrompt}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
