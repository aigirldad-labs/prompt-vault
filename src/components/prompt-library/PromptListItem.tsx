import { Prompt } from '@/types/prompt';
import { formatDateTime } from '@/utils/time';
import { cn } from '@/lib/utils';

interface PromptListItemProps {
  prompt: Prompt;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function PromptListItem({ prompt, isSelected, onSelect }: PromptListItemProps) {
  return (
    <button
      onClick={() => onSelect(prompt.id)}
      className={cn(
        'w-full text-left p-4 border-b border-border transition-colors',
        'hover:bg-accent/50',
        isSelected && 'bg-accent border-l-2 border-l-primary'
      )}
    >
      <div className="space-y-1">
        <h3 className="font-medium text-foreground truncate">{prompt.title}</h3>
        {prompt.description && (
          <p className="text-sm text-muted-foreground truncate">{prompt.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Updates: {prompt.updateCount}</span>
          <span>{formatDateTime(prompt.updatedAt)}</span>
        </div>
      </div>
    </button>
  );
}
