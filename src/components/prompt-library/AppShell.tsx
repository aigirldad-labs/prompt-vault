import { HeaderBar } from './HeaderBar';
import { PromptList } from './PromptList';
import { PromptEditor } from './PromptEditor';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export function AppShell() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <HeaderBar />
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel - Prompt List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border bg-card flex-shrink-0 h-1/2 md:h-full overflow-hidden">
          <PromptList />
        </div>

        {/* Right Panel - Editor */}
        <div className="flex-1 bg-background overflow-hidden h-1/2 md:h-full">
          <PromptEditor />
        </div>
      </div>

      <ConfirmDeleteModal />
    </div>
  );
}
