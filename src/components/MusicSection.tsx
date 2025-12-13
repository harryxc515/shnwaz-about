import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, ListMusic } from "lucide-react";

const songs = [
  { id: "SmZpCs4QlY0", title: "Featured Track", artist: "SHNWAZX" },
  { id: "BBM57gr9fFU", title: "Track 1", artist: "SHNWAZX" },
  { id: "nNUYfQu7vCY", title: "Track 2", artist: "SHNWAZX" },
  { id: "UvmffFRojQA", title: "Track 3", artist: "SHNWAZX" },
  { id: "oQFNHR9U_hU", title: "Track 4", artist: "SHNWAZX" },
  { id: "l5sgIqzlPXc", title: "Track 5", artist: "SHNWAZX" },
];

const getThumbnail = (videoId: string) => `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  destroy: () => void;
}

const MusicSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerIdRef = useRef<string>(`yt-player-${Date.now()}`);
  const currentSongIndexRef = useRef(currentSongIndex);

  // Keep ref in sync with state
  useEffect(() => {
    currentSongIndexRef.current = currentSongIndex;
  }, [currentSongIndex]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startProgressInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        try {
          const current = playerRef.current.getCurrentTime();
          const total = playerRef.current.getDuration();
          if (total > 0) {
            setProgress((current / total) * 100);
            setCurrentTime(formatTime(current));
            setDuration(formatTime(total));
          }
        } catch (e) {
          // Player might not be ready
        }
      }
    }, 500);
  }, []);

  const onPlayerReady = useCallback(() => {
    setIsReady(true);
    if (playerRef.current) {
      const total = playerRef.current.getDuration();
      setDuration(formatTime(total));
    }
  }, []);

  const onPlayerStateChange = useCallback((event: { data: number }) => {
    const YT = (window as any).YT;
    if (!YT) return;
    
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressInterval();
    } else if (event.data === YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else if (event.data === YT.PlayerState.ENDED) {
      // Use ref to get current value
      const newIndex = (currentSongIndexRef.current + 1) % songs.length;
      setCurrentSongIndex(newIndex);
      if (playerRef.current) {
        playerRef.current.loadVideoById(songs[newIndex].id);
        setProgress(0);
        setCurrentTime("0:00");
      }
    }
  }, [startProgressInterval]);

  useEffect(() => {
    const playerDiv = document.createElement("div");
    playerDiv.id = playerIdRef.current;
    playerDiv.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
    document.body.appendChild(playerDiv);

    const loadYouTubeAPI = () => {
      if (!(window as any).YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    };

    const createPlayer = () => {
      if ((window as any).YT && (window as any).YT.Player && !playerRef.current) {
        playerRef.current = new (window as any).YT.Player(playerIdRef.current, {
          height: "1",
          width: "1",
          videoId: songs[0].id,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onStateChange: onPlayerStateChange,
            onReady: onPlayerReady,
          },
        });
      }
    };

    loadYouTubeAPI();

    const originalCallback = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      if (originalCallback) originalCallback();
      createPlayer();
    };

    if ((window as any).YT && (window as any).YT.Player) {
      createPlayer();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
      const pDiv = document.getElementById(playerIdRef.current);
      if (pDiv && pDiv.parentNode) {
        pDiv.parentNode.removeChild(pDiv);
      }
    };
  }, [onPlayerReady, onPlayerStateChange]);

  const togglePlay = () => {
    if (playerRef.current && isReady) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current && isReady) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const nextSong = () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
    if (playerRef.current && isReady) {
      playerRef.current.loadVideoById(songs[newIndex].id);
      setProgress(0);
      setCurrentTime("0:00");
    }
  };

  const prevSong = () => {
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);
    if (playerRef.current && isReady) {
      playerRef.current.loadVideoById(songs[newIndex].id);
      setProgress(0);
      setCurrentTime("0:00");
    }
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    if (playerRef.current && isReady) {
      playerRef.current.loadVideoById(songs[index].id);
      setProgress(0);
      setCurrentTime("0:00");
    }
  };

  return (
    <section id="music" className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display text-gradient mb-4">
            SHNWAZX
          </h2>
          <p className="text-muted-foreground text-lg">Immersive Audio Experience</p>
        </div>

        {/* Modern Glassmorphism Player */}
        <div className="max-w-xl mx-auto">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-red-500/40 to-primary/40 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
            
            {/* Main Player Card */}
            <div className="relative bg-card/90 backdrop-blur-xl rounded-3xl p-6 border border-border/50 shadow-2xl">
              {/* Now Playing */}
              <div className="flex items-center gap-4 mb-6">
                {/* Album Art */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                  <img 
                    src={getThumbnail(songs[currentSongIndex].id)}
                    alt={songs[currentSongIndex].title}
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                      <div className="flex items-end gap-[3px] h-6">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-1 bg-primary rounded-full animate-bounce"
                            style={{
                              animationDelay: `${i * 0.15}s`,
                              animationDuration: "0.6s",
                              height: `${Math.random() * 50 + 50}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-display text-foreground truncate">
                    {songs[currentSongIndex].title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{songs[currentSongIndex].artist}</p>
                </div>
                
                {/* Music Icon */}
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-red-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground font-mono">{currentTime}</span>
                  <span className="text-xs text-muted-foreground font-mono">{duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleMute}
                  className="p-2.5 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevSong}
                    className="p-3 rounded-full bg-secondary/50 text-foreground hover:text-primary hover:bg-secondary transition-all hover:scale-105"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/30"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-primary-foreground" />
                    ) : (
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={nextSong}
                    className="p-3 rounded-full bg-secondary/50 text-foreground hover:text-primary hover:bg-secondary transition-all hover:scale-105"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`p-2.5 rounded-full transition-all ${
                    showPlaylist 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-secondary'
                  }`}
                >
                  <ListMusic className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Playlist - Hidden by default */}
          <div 
            className={`mt-4 overflow-hidden transition-all duration-500 ${
              showPlaylist ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-4 border border-border/50">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Queue</h4>
              <div className="space-y-1 max-h-[280px] overflow-y-auto scrollbar-thin">
                {songs.map((song, index) => (
                  <button
                    key={song.id}
                    onClick={() => selectSong(index)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                      currentSongIndex === index 
                        ? 'bg-primary/15 border border-primary/30' 
                        : 'hover:bg-secondary/50 border border-transparent'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={getThumbnail(song.id)}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      {currentSongIndex === index && isPlaying && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-left flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        currentSongIndex === index ? 'text-primary' : 'text-foreground'
                      }`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    
                    <span className="text-xs text-muted-foreground">#{index + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
