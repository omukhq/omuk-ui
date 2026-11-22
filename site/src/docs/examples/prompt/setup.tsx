import { PromptProvider } from '@omuk/ui/prompt';

// Once, near the root of the app, inside the providers that the prompts'
// content needs (a router, a query client). The alert, dialog and drawer
// code loads when the first prompt opens.
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PromptProvider />
    </>
  );
}
