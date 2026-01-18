import { usePromptContext } from '@/contexts/PromptContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatDateTime } from '@/utils/time';
import { Plus, Save, Copy, Trash2 } from 'lucide-react';

export function PromptEditor() {
  const {
    selectedPrompt,
    mode,
    draft,
    updateDraft,
    startCreate,
    saveDraft,
    copySelected,
    requestDeleteSelected,
  } = usePromptContext();

  const isCreateMode = mode === 'create';
  const canSave = draft.title.trim() && draft.promptText.trim();
  const canCopyOrDelete = !!selectedPrompt;

  return (
    <div className="flex flex-col h-full">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 p-4 border-b border-border">
        <Button onClick={startCreate} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Prompt
        </Button>
        <Button onClick={saveDraft} disabled={!canSave} size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          onClick={copySelected}
          disabled={!canCopyOrDelete}
          variant="secondary"
          size="sm"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Prompt
        </Button>
        <Button
          onClick={requestDeleteSelected}
          disabled={!canCopyOrDelete}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Editor Form */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter prompt title..."
            value={draft.title}
            onChange={(e) => updateDraft({ title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Optional description..."
            value={draft.description}
            onChange={(e) => updateDraft({ description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="promptText">Prompt Text *</Label>
          <Textarea
            id="promptText"
            placeholder="Enter your prompt text..."
            value={draft.promptText}
            onChange={(e) => updateDraft({ promptText: e.target.value })}
            className="min-h-[200px] resize-y"
          />
        </div>

        {/* Metadata (read-only, only shown in edit mode) */}
        {!isCreateMode && selectedPrompt && (
          <div className="pt-4 border-t border-border space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Metadata</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>{' '}
                <span className="text-foreground">{formatDateTime(selectedPrompt.createdAt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Updated:</span>{' '}
                <span className="text-foreground">{formatDateTime(selectedPrompt.updatedAt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Create Count:</span>{' '}
                <span className="text-foreground">{selectedPrompt.createCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Update Count:</span>{' '}
                <span className="text-foreground">{selectedPrompt.updateCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
