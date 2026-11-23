import { Button } from '@omuk/ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useRef, useState } from 'react';

/**
 * Copies a text. The icon turns into a tick for a moment; the button keeps
 * its size, as both icons are 16.
 */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? 'Copied' : label}
      onClick={copy}
      className="text-muted hover:text-foreground"
    >
      {copied ? (
        <CheckIcon className="size-4 text-success" strokeWidth={1.5} />
      ) : (
        <CopyIcon className="size-4" strokeWidth={1.5} />
      )}
    </Button>
  );
}
