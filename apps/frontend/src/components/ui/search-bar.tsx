import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Search, X, Filter } from 'lucide-react';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  filters?: Array<{
    label: string;
    value: string;
    active?: boolean;
  }>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchBar({
  placeholder = "Search streams, channels, or games...",
  value = '',
  onChange,
  onSearch,
  showFilters = false,
  filters = [],
  className = '',
  size = 'md',
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(value);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleSearch = () => {
    onSearch?.(searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    onChange?.('');
    onSearch?.('');
  };

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg',
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${size === 'lg' ? 'h-5 w-5' : ''}`} />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`pl-10 pr-20 ${sizeClasses[size]}`}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className={`h-6 w-6 ${size === 'lg' ? 'h-8 w-8' : ''}`}
            >
              <X className={`h-3 w-3 ${size === 'lg' ? 'h-4 w-4' : ''}`} />
            </Button>
          )}

          {showFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`h-6 w-6 ${size === 'lg' ? 'h-8 w-8' : ''}`}
            >
              <Filter className={`h-3 w-3 ${size === 'lg' ? 'h-4 w-4' : ''}`} />
            </Button>
          )}

          <Button
            onClick={handleSearch}
            size={size === 'lg' ? 'default' : 'sm'}
            className="px-3"
          >
            Search
          </Button>
        </div>
      </div>
      {showFilters && showFilterMenu && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-lg z-50">
          <div className="p-3">
            <h4 className="font-medium mb-2">Filters</h4>
            <div className="space-y-2">
              {filters.map((filter) => (
                <label key={filter.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filter.active}
                    onChange={() => {
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{filter.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
