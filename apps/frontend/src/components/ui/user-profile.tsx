import Link from 'next/link';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
import {
  User,
  Settings,
  LogOut,
  Crown,
  Heart,
  MessageSquare,
  Bell,
  ChevronDown
} from 'lucide-react';

export interface UserProfileProps {
  user: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    isVerified?: boolean;
    isModerator?: boolean;
    isVIP?: boolean;
    followerCount?: number;
    badges?: string[];
  };
  showDropdown?: boolean;
  showStats?: boolean;
  variant?: 'default' | 'compact' | 'sidebar';
  className?: string;
}

export function UserProfile({
  user,
  showDropdown = true,
  showStats = true,
  variant = 'default',
  className = '',
}: UserProfileProps) {
  const displayName = user.displayName || user.username;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{displayName}</p>
          {showStats && user.followerCount && (
            <p className="text-xs text-muted-foreground">
              {user.followerCount.toLocaleString()} followers
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`p-3 border-t border-border ${className}`}>
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="font-medium truncate">{displayName}</p>
              {user.isVerified && (
                <Badge variant="secondary" className="text-xs">✓</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        {showDropdown && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }
  return (
    <div className={`flex items-center space-x-3 p-4 bg-card border border-border rounded-lg ${className}`}>
      <Avatar className="w-12 h-12">
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-semibold truncate">{displayName}</h3>
          {user.isVerified && (
            <Badge variant="secondary" className="text-xs">Verified</Badge>
          )}
          {user.isModerator && (
            <Badge className="text-xs bg-green-600 hover:bg-green-700">Mod</Badge>
          )}
          {user.isVIP && (
            <Badge className="text-xs bg-purple-600 hover:bg-purple-700">
              <Crown className="w-3 h-3 mr-1" />
              VIP
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
        {showStats && (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{user.followerCount?.toLocaleString() || 0} followers</span>
          </div>
        )}

        {user.badges && user.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {user.badges.map((badge) => (
              <Badge key={badge} variant="outline" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {showDropdown && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Heart className="mr-2 h-4 w-4" />
              Add to Favorites
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
