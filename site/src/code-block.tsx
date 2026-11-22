import { CopyButton } from './copy-button';

/** A block of code on the panel ground, with a copy button. */
export function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="relative rounded-lg bg-panel">
      <pre className="overflow-x-auto p-4 pr-12 font-mono text-xs text-foreground">
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <CopyButton text={code} label={label} />
      </div>
    </div>
  );
}
