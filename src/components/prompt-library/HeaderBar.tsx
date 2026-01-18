import { usePromptContext } from '@/contexts/PromptContext';

export function HeaderBar() {
  const { prompts } = usePromptContext();

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Prompt Library</h1>
        <div className="text-sm text-muted-foreground">
          Total Prompts: <span className="font-semibold text-foreground">{prompts.length}</span>
        </div>
      </div>
    </header>
  );
}
