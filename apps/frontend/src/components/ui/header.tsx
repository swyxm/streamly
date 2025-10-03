'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from './badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
import {
  Menu,
  Bell,
  MessageSquare,
  Settings,
  User,
  LogIn,
  ChevronDown,
  Search
} from 'lucide-react';

export interface HeaderProps {
  currentUser?: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    isVerified?: boolean;
    followerCount?: number;
  };
  onMenuToggle?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  notifications?: number;
  messages?: number;
  className?: string;
}

export function Header({
  currentUser,
  onMenuToggle,
  showSearch = true,
  searchPlaceholder = "Search streams, channels, or games",
  onSearch,
  notifications = 0,
  messages = 0,
  className = '',
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className={`sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border ${className}`}>
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {showSearch && (
            <div className="hidden md:block w-96">
              <SearchBar
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                size="sm"
              />
            </div>
          )}

          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-600 hover:bg-red-700">
                {notifications > 99 ? '99+' : notifications}
              </Badge>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            {messages > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-blue-600 hover:bg-blue-700">
                {messages > 99 ? '99+' : messages}
              </Badge>
            )}
          </Button>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2">
                  <UserProfile
                    user={currentUser}
                    variant="compact"
                    showStats={false}
                  />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUser.displayName || currentUser.username}</p>
                  <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="md:hidden px-4 pb-3">
          <SearchBar
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            size="sm"
          />
        </div>
      )}
    </header>
  );
}
