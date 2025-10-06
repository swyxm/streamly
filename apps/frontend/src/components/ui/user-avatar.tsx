'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { cn } from '@/lib/utils';

export interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const name = user?.name || 'User';
  const email = user?.email || '';
  const image = user?.image;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={cn('h-10 w-10', className)}>
      {image ? (
        <AvatarImage src={image} alt={name} />
      ) : (
        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          {getInitials(name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
