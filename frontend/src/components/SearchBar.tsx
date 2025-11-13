import React, { useState } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  suggestions = [],
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch?.(suggestion);
    setIsFocused(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`
        relative flex items-center
        bg-white border-2 rounded-xl overflow-hidden
        transition-all duration-250
        ${isFocused ? 'border-orange-500 shadow-lg' : 'border-primary-200 hover:border-primary-300'}
      `}>
        <Search className="absolute left-4 w-5 h-5 text-primary-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full py-3 pl-12 pr-12 text-primary-900 placeholder-primary-400 focus:outline-none bg-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 p-1 hover:bg-primary-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-primary-600" />
          </button>
        )}
      </div>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary-200 rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
          <div className="p-3 border-b border-primary-100">
            <div className="flex items-center gap-2 text-sm text-primary-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Popular searches</span>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors flex items-center gap-3 group"
              >
                <Search className="w-4 h-4 text-primary-400 group-hover:text-orange-500 transition-colors" />
                <span className="text-primary-900">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
