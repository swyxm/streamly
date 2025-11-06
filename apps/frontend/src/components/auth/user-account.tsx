'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, LogOut, Play, Square, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function UserAccount() {
  const { user, logout, isAuthenticated, currentStream, generateStreamKey, stopStream } = useAuth();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const handleGenerateStreamKey = async () => {
    setIsGenerating(true);
    try {
      const response = await generateStreamKey();
      toast.success('Stream key generated! You can now start streaming.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate stream key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStopStream = async () => {
    setIsStopping(true);
    try {
      await stopStream();
      toast.success('Stream stopped successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to stop stream');
    } finally {
      setIsStopping(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => router.push('/login')}
        >
          <User className="h-5 w-5 mr-2" />
          Sign In
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => router.push('/register')}
        >
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <User className="h-5 w-5 mr-2" />
          {user.firstName || user.username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Streaming</p>

          {currentStream && isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status: <span className="text-green-600 font-medium">Live</span></span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStopStream}
                  disabled={isStopping}
                  className="h-7"
                >
                  <Square className="h-3 w-3 mr-1" />
                  {isStopping ? 'Stopping...' : 'Stop'}
                </Button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">RTMP URL:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(currentStream.rtmp_url)}
                    className="h-6 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <code className="text-xs bg-muted px-1 py-0.5 rounded block truncate">
                  {currentStream.rtmp_url}
                </code>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Stream Key:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(currentStream.stream_key)}
                    className="h-6 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <code className="text-xs bg-muted px-1 py-0.5 rounded block truncate">
                  {currentStream.stream_key}
                </code>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">HLS URL:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(currentStream.hls_url)}
                    className="h-6 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <code className="text-xs bg-muted px-1 py-0.5 rounded block truncate">
                  {currentStream.hls_url}
                </code>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateStreamKey}
              disabled={isGenerating}
              className="w-full"
            >
              <Play className="h-3 w-3 mr-1" />
              {isGenerating ? 'Generating...' : 'Start Streaming'}
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
