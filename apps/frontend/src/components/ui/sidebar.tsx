import Link from 'next/link';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { UserProfile } from './user-profile';
import {
  Home,
  Compass,
  ThumbsUp,
  History,
  Users,
  Settings,
  HelpCircle,
  LogIn,
  TrendingUp,
  Gamepad2
} from 'lucide-react';

export interface SidebarProps {
  currentUser?: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    isVerified?: boolean;
    followerCount?: number;
  };
  recommendedChannels?: Array<{
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    game?: string;
    isLive?: boolean;
    viewers?: number;
  }>;
  categories?: Array<{
    id: string;
    name: string;
    icon?: string;
    viewerCount?: number;
  }>;
  className?: string;
  variant?: 'default' | 'compact';
}

export function Sidebar({
  currentUser,
  recommendedChannels = [],
  categories = [],
  className = '',
  variant = 'default',
}: SidebarProps) {
  return (
    <aside className={`bg-card border-r border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Twitch Clone</h1>
      </div>

      <nav className="p-4">
        {/* Main navigation */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
            Browse
          </h2>
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className="flex items-center px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
              >
                <Home className="w-5 h-5 mr-3" />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/browse"
                className="flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <Compass className="w-5 h-5 mr-3" />
                Browse
              </Link>
            </li>
            <li>
              <Link
                href="/trending"
                className="flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Trending
              </Link>
            </li>
          </ul>
        </div>
        {currentUser && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
              Following
            </h2>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/following"
                  className="flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  <ThumbsUp className="w-5 h-5 mr-3" />
                  Following
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  <History className="w-5 h-5 mr-3" />
                  History
                </Link>
              </li>
            </ul>
          </div>
        )}
        {categories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
              Categories
            </h2>
            <ul className="space-y-1">
              {categories.slice(0, 8).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.id}`}
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center">
                      <Gamepad2 className="w-4 h-4 mr-3" />
                      <span className="truncate">{category.name}</span>
                    </div>
                    {category.viewerCount && (
                      <Badge variant="secondary" className="text-xs">
                        {category.viewerCount.toLocaleString()}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {recommendedChannels.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
              Recommended Channels
            </h2>
            <ul className="space-y-2">
              {recommendedChannels.slice(0, 5).map((channel) => (
                <li key={channel.id}>
                  <Link
                    href={`/channel/${channel.id}`}
                    className="flex items-center px-3 py-1.5 rounded-md hover:bg-accent"
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={channel.avatar} alt={channel.username} />
                        <AvatarFallback>
                          {channel.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {channel.isLive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card"></div>
                      )}
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {channel.displayName || channel.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {channel.game || 'Just chatting'}
                      </p>
                      {channel.isLive && channel.viewers && (
                        <p className="text-xs text-red-500">
                          {channel.viewers.toLocaleString()} viewers
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-auto pt-6 border-t border-border">
          {!currentUser ? (
            <Button className="w-full" variant="outline">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          ) : (
            <UserProfile
              user={currentUser}
              variant="sidebar"
              showDropdown={true}
            />
          )}
        </div>
      </nav>
    </aside>
  );
}
