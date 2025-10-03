import Image from 'next/image';
import { Badge } from './badge';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

export interface StreamCardProps {
  id: string;
  title: string;
  streamer: string;
  game?: string;
  viewers: number;
  thumbnail: string;
  avatar: string;
  isLive: boolean;
  tags?: string[];
  onClick?: () => void;
  className?: string;
}

export function StreamCard({
  id,
  title,
  streamer,
  game,
  viewers,
  thumbnail,
  avatar,
  isLive,
  tags = [],
  onClick,
  className = '',
}: StreamCardProps) {
  return (
    <div
      className={`bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="relative aspect-video bg-muted">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
        />
        {isLive && (
          <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">
            LIVE
          </Badge>
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
          {viewers.toLocaleString()} viewers
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={avatar} alt={streamer} />
            <AvatarFallback>{streamer.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h3 className="font-medium truncate mb-1" title={title}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">{streamer}</p>
            {game && (
              <p className="text-xs text-muted-foreground mb-2">{game}</p>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
