import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Music, X } from "lucide-react";

const songs = [
  { id: "47mUgngp3bk", title: "Featured Track", artist: "SHNWAZX" },
  { id: "SmZpCs4QlY0", title: "Track 1", artist: "SHNWAZX" },
  { id: "BBM57gr9fFU", title: "Track 2", artist: "SHNWAZX" },
  { id: "nNUYfQu7vCY", title: "Track 3", artist: "SHNWAZX" },
  { id: "UvmffFRojQA", title: "Track 4", artist: "SHNWAZX" },
  { id: "oQFNHR9U_hU", title: "Track 5", artist: "SHNWAZX" },
  { id: "l5sgIqzlPXc", title: "Track 6", artist: "SHNWAZX" },
];

const getThumbnail = (videoId: string) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
}

const MusicSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerIdRef = useRef<string>(`yt-player-${Date.now()}`);

  const onPlayerStateChange = useCallback((event: { data: number }) => {
    const YT = (window as any).YT;
    if (!YT) return;
    if (event.data === YT.PlayerState.PLAYING) setIsPlaying(true);
    else if (event.data === YT.PlayerState.PAUSED) setIsPlaying(false);
    else if (event.data === YT.PlayerState.ENDED) {
      const newIndex = (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(newIndex);
      playerRef.current?.loadVideoById(songs[newIndex].id);
    }
  }, [currentSongIndex]);

  useEffect(() => {
    const playerDiv = document.createElement("div");
    playerDiv.id = playerIdRef.current;
    playerDiv.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
    document.body.appendChild(playerDiv);

    const createPlayer = () => {
      if ((window as any).YT?.Player && !playerRef.current) {
        playerRef.current = new (window as any).YT.Player(playerIdRef.current, {
          height: "1",
          width: "1",
          videoId: songs[0].id,
          playerVars: { autoplay: 0, controls: 0 },
          events: {
            onStateChange: onPlayerStateChange,
            onReady: () => setIsReady(true),
          },
        });
      }
    };

    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    (window as any).onYouTubeIframeAPIReady = createPlayer;
    if ((window as any).YT?.Player) createPlayer();

    return () => {
      playerRef.current?.destroy();
      document.getElementById(playerIdRef.current)?.remove();
    };
  }, [onPlayerStateChange]);

  const togglePlay = () => {
    if (!isReady) return;
    isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo();
  };

  const nextSong = () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
    playerRef.current?.loadVideoById(songs[newIndex].id);
  };

  const prevSong = () => {
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);
    playerRef.current?.loadVideoById(songs[newIndex].id);
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    playerRef.current?.loadVideoById(songs[index].id);
    setShowPlaylist(false);
  };

  return (
    <section id="music" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Music</h2>
          <p className="text-muted-foreground">Listen to my latest tracks</p>
        </div>

        {/* 3D Player Card */}
        <div className="relative perspective-1000 flex justify-center">
          <div 
            className="relative w-full max-w-md bg-card rounded-3xl p-6 border border-border shadow-2xl transition-transform duration-500 hover:rotate-y-3"
            style={{ 
              transformStyle: "preserve-3d",
              transform: "rotateX(5deg) rotateY(-5deg)",
              boxShadow: "20px 20px 60px rgba(0,0,0,0.3), -5px -5px 20px rgba(255,255,255,0.05)"
            }}
          >
            {/* Album Art */}
            <div 
              className="relative aspect-square rounded-2xl overflow-hidden mb-6 shadow-lg"
              style={{ transform: "translateZ(20px)" }}
            >
              <img
                src={getThumbnail(songs[currentSongIndex].id)}
                alt={songs[currentSongIndex].title}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute bottom-4 left-4 flex items-end gap-1 h-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s`, height: `${40 + i * 15}%` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="text-center mb-6" style={{ transform: "translateZ(15px)" }}>
              <h3 className="text-xl font-display text-foreground">{songs[currentSongIndex].title}</h3>
              <p className="text-muted-foreground text-sm">{songs[currentSongIndex].artist}</p>
            </div>

            {/* Controls */}
            <div 
              className="flex items-center justify-center gap-6"
              style={{ transform: "translateZ(25px)" }}
            >
              <button onClick={prevSong} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <Play className="w-6 h-6 text-primary-foreground ml-1" />
                )}
              </button>
              <button onClick={nextSong} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Playlist Button */}
            <button
              onClick={() => setShowPlaylist(true)}
              className="mt-6 w-full py-3 rounded-xl bg-secondary/50 text-foreground font-medium flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
              style={{ transform: "translateZ(10px)" }}
            >
              <Music className="w-5 h-5" />
              View Playlist ({songs.length} tracks)
            </button>
          </div>
        </div>

        {/* Playlist Modal */}
        {showPlaylist && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-card rounded-2xl w-full max-w-md border border-border shadow-2xl animate-scale-in">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h4 className="font-display text-lg text-foreground">Playlist</h4>
                <button
                  onClick={() => setShowPlaylist(false)}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2 max-h-80 overflow-y-auto">
                {songs.map((song, index) => (
                  <button
                    key={song.id}
                    onClick={() => selectSong(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      currentSongIndex === index
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-secondary/50 text-foreground"
                    }`}
                  >
                    <img
                      src={getThumbnail(song.id)}
                      alt={song.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="text-left">
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                    {currentSongIndex === index && isPlaying && (
                      <div className="ml-auto flex items-end gap-0.5 h-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-1 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s`, height: `${50 + i * 15}%` }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MusicSection;
