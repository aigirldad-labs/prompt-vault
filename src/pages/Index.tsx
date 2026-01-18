import { PromptProvider } from '@/contexts/PromptContext';
import { AppShell } from '@/components/prompt-library/AppShell';

const Index = () => {
  return (
    <PromptProvider>
      <AppShell />
    </PromptProvider>
  );
};

export default Index;
