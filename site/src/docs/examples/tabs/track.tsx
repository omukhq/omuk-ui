import { Tabs, TabsContent, TabsList, TabsTrigger } from '@omuk/ui/tabs';
import { useState } from 'react';

const SNIPPETS: Record<string, string> = {
  bun: 'bun add github:omukhq/omuk-ui',
  npm: 'npm install github:omukhq/omuk-ui',
  pnpm: 'pnpm add github:omukhq/omuk-ui',
};

export default function TabsTrack() {
  const [manager, setManager] = useState<unknown>('bun');
  return (
    <Tabs
      value={manager}
      onValueChange={setManager}
      className="w-full max-w-md"
    >
      <TabsList aria-label="Package manager">
        <TabsTrigger value="bun">Bun</TabsTrigger>
        <TabsTrigger value="npm">npm</TabsTrigger>
        <TabsTrigger value="pnpm">pnpm</TabsTrigger>
        <TabsTrigger value="yarn" disabled>
          Yarn
        </TabsTrigger>
      </TabsList>
      {Object.entries(SNIPPETS).map(([key, command]) => (
        <TabsContent
          key={key}
          value={key}
          className="rounded-lg bg-panel p-4 font-mono text-xs"
        >
          {command}
        </TabsContent>
      ))}
    </Tabs>
  );
}
