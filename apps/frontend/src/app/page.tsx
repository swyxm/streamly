'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Stream {
  id: number;
  stream_key: string;
  status: string;
  hls_url: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/streams/public');
        if (response.ok) {
          const data = await response.json();
          setStreams(data.streams || []);
        } else {
          setError('Failed to fetch streams');
        }
      } catch (err) {
        setError('Failed to connect to stream service');
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  const filteredStreams = streams.filter(stream =>
    stream.stream_key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Live Streams</h2>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl overflow-hidden border border-border">
              <div className="aspect-video bg-muted/50 animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 bg-muted/50 animate-pulse rounded-full mb-3 w-3/4"></div>
                <div className="h-4 bg-muted/50 animate-pulse rounded-full w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStreams.map((stream) => (
            <Link key={stream.id} href={`/stream/${stream.stream_key}`} className="group">
              <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-video bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-pink-600/80 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <div className="text-3xl mb-2">🎥</div>
                      <div className="text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
                        {stream.stream_key}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-1.5"></span>
                    LIVE
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {stream.stream_key}'s Stream
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Streaming now</p>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 rounded-full bg-muted mr-2"></div>
                    <span className="text-sm text-muted-foreground">
                      {stream.status === 'active' ? 'Live Now' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
