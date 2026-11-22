import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@omuk/ui/input-group';
import { SearchIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export default function InputGroupSearch() {
  const [query, setQuery] = useState('');
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <SearchIcon strokeWidth={1.5} aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        enterKeyHint="search"
        aria-label="Search secrets"
        placeholder="Search secrets"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon"
            aria-label="Clear the search"
            onClick={() => setQuery('')}
          >
            <XIcon strokeWidth={1.5} />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
