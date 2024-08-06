// Derived from src/components/SearchBar/SearchBar.js

export interface SearchBarProps {
  onSearch: (term: string) => void;
}

export interface SearchBarState {
  term: string;
}

export interface SearchBarEvent {
  target: {
    value: string;
  };
  key?: string;
}
