'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import HLSPlayer from '@/components/HLSPlayer';
import { Chat } from '@/components/Chat';

interface Stream {
  id: number;
  stream_key: string;
  status: string;
  hls_url: string;
}

export default function StreamPage() {
  const params = useParams();
  const streamKey = params?.streamKey as string;
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const response = await fetch(`http://localhost:8082/api/streams/${streamKey}`);
        const data = await response.json();        
        if (response.ok) {
          setStream(data);
          setError(null);
        } else {
          setError(data.error || 'Stream not found');
          setStream(null);
        }
      } catch (err) {
        console.error('Error fetching stream:', err);
        setError('Failed to fetch stream');
        setStream(null);
      } finally {
        setLoading(false);
      }
    };

    if (streamKey) {
      fetchStream();
    }
  }, [streamKey]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Stream Not Available</h1>
          <p className="text-gray-600">{error || 'Stream not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Live Stream</h1>
        <p className="text-gray-600">Stream Key: {stream.stream_key}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-black rounded-lg overflow-hidden aspect-video">
          <HLSPlayer
            src={stream.hls_url}
            className="w-full h-full"
          />
        </div>
        <div className="lg:col-span-1">
          <Chat streamKey={streamKey} />
        </div>
      </div>
    </div>
  );
}
