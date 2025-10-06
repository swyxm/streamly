'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { UserAccount } from '../components/auth/user-account';
import {
  Home as HomeIcon,
  Compass,
  ThumbsUp,
  History,
  LogIn,
  Menu,
  Search,
  Bell,
  MessageSquare,
  Settings,
  User
} from 'lucide-react';

const mockStreams = [
  {
    id: 1,
    title: 'title1',
    streamer: 'streamer1',
    game: 'random',
    viewers: 1234,
    thumbnail: 'https://via.placeholder.com/440x248/333333/FFFFFF?text=Stream+1',
    avatar: 'https://via.placeholder.com/50x50/333333/FFFFFF?text=CM',
    isLive: true
  },
  {
    id: 2,
    title: 'val',
    streamer: 'kaicenat',
    game: 'valorant',
    viewers: 567,
    thumbnail: 'https://via.placeholder.com/440x248/333333/FFFFFF?text=Stream+2',
    avatar: 'https://via.placeholder.com/50x50/333333/FFFFFF?text=GP',
    isLive: true
  },
  {
    id: 3,
    title: 'peepeepoopoo',
    streamer: 'ishowspeed',
    game: 'ronaldo',
    viewers: 89,
    thumbnail: 'https://via.placeholder.com/440x248/333333/FFFFFF?text=Stream+3',
    avatar: 'https://via.placeholder.com/50x50/333333/FFFFFF?text=BM',
    isLive: false
  },
  {
    id: 4,
    title: 'adin ross',
    streamer: 'adin ross',
    game: 'adin ross',
    viewers: 234,
    thumbnail: 'https://via.placeholder.com/440x248/333333/FFFFFF?text=Stream+4',
    avatar: 'https://via.placeholder.com/50x50/333333/FFFFFF?text=CM',
    isLive: true
  }
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStreams = mockStreams.filter(stream =>
    stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.streamer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-sans min-h-screen bg-background">
      <div className="flex">
        <aside className="fixed left-0 top-0 bottom-0 w-60 bg-card border-r border-border hidden md:block">
          <div className="p-4 border-b border-border">
            <h1 className="text-2xl font-bold text-primary">Streamer</h1>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Menu</h2>
              <ul className="space-y-1">
                <li>
                  <Link href="/" className="flex items-center px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
                    <HomeIcon className="w-5 h-5 mr-3" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/browse" className="flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                    <Compass className="w-5 h-5 mr-3" />
                    Browse
                  </Link>
                </li>
                <li>
                  <Link href="/following" className="flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                    <ThumbsUp className="w-5 h-5 mr-3" />
                    Following
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                    <History className="w-5 h-5 mr-3" />
                    History
                  </Link>
                </li>
              </ul>
            </div>

            <div className="px-4 py-2 mt-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Recommended Channels</h2>
              <ul className="space-y-2">
                {mockStreams.map((stream) => (
                  <li key={stream.id}>
                    <Link href={`/stream/${stream.id}`} className="flex items-center px-3 py-1.5 rounded-md hover:bg-accent">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                          <img src={stream.avatar} alt={stream.streamer} className="w-full h-full object-cover" />
                        </div>
                        {stream.isLive && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card"></div>
                        )}
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium truncate">{stream.streamer}</p>
                        <p className="text-xs text-muted-foreground truncate">{stream.game}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="p-4 border-t border-border">
            <UserAccount />
          </div>
        </aside>

        {isMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-card shadow-lg z-50 animate-in slide-in-from-left">
              <div className="p-4 border-b border-border">
                <h1 className="text-2xl font-bold text-primary">Streamer</h1>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  <li><Link href="/" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">Home</Link></li>
                  <li><Link href="/browse" className="block px-3 py-2 rounded-md hover:bg-accent">Browse</Link></li>
                  <li><Link href="/following" className="block px-3 py-2 rounded-md hover:bg-accent">Following</Link></li>
                  <li><Link href="/history" className="block px-3 py-2 rounded-md hover:bg-accent">History</Link></li>
                </ul>
              </nav>
            </div>
          </div>
        )}

        <div className="flex-1 md:ml-60">
          <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center justify-between h-14 px-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden mr-2"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="relative w-full max-w-xl">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search streams, channels, or games"
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
                <UserAccount />
              </div>
            </div>
          </header>

          <main className="p-4">
            <h2 className="text-2xl font-bold mb-6">Recommended Streams</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStreams.map((stream) => (
                <div key={stream.id} className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors">
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
                      LIVE
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {stream.viewers.toLocaleString()} viewers
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                          <img src={stream.avatar} alt={stream.streamer} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium truncate">{stream.title}</h3>
                        <p className="text-sm text-muted-foreground">{stream.streamer}</p>
                        <p className="text-xs text-muted-foreground">{stream.game}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStreams.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No streams found. Try a different search term.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
