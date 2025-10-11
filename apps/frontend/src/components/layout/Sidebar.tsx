import Link from 'next/link';
import { Home as HomeIcon, Compass, ThumbsUp, History } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-card border-r border-border hidden md:block">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Streamly
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-1">
          <Link 
            href="/" 
            className="flex items-center px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium"
          >
            <HomeIcon className="w-5 h-5 mr-3" />
            Home
          </Link>
          <Link 
            href="/browse" 
            className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Compass className="w-5 h-5 mr-3" />
            Browse
          </Link>
          <Link 
            href="/following" 
            className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ThumbsUp className="w-5 h-5 mr-3" />
            Following
          </Link>
          <Link 
            href="/history" 
            className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <History className="w-5 h-5 mr-3" />
            History
          </Link>
        </div>
      </nav>
    </aside>
  );
}
