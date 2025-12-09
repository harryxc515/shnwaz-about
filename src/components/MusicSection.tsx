import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp } from "lucide-react";

const songs = [
  { id: "SmZpCs4QlY0", title: "Featured Track", artist: "SHNWAZX" },
  { id: "BBM57gr9fFU", title: "Track 1", artist: "SHNWAZX" },
  { id: "nNUYfQu7vCY", title: "Track 2", artist: "SHNWAZX" },
  { id: "UvmffFRojQA", title: "Track 3", artist: "SHNWAZX" },
  { id: "oQFNHR9U_hU", title: "Track 4", artist: "SHNWAZX" },
  { id: "l5sgIqzlPXc", title: "Track 5", artist: "SHNWAZX" },
];

// YouTube thumbnail URL helper
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
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerIdRef = useRef<string>(`yt-player-${Date.now()}`);

  const onPlayerReady = useCallback(() => {
    setIsReady(true);
    if (playerRef.current) {
      const total = playerRef.current.getDuration();
      setDuration(formatTime(total));
      playerRef.current.playVideo();
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
      const newIndex = (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(newIndex);
      if (playerRef.current) {
        playerRef.current.loadVideoById(songs[newIndex].id);
        setProgress(0);
        setCurrentTime("0:00");
      }
    }
  }, [currentSongIndex]);

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
    }, 1000);
  }, []);

  useEffect(() => {
    if (playerContainerRef.current) {
      const playerDiv = document.createElement("div");
      playerDiv.id = playerIdRef.current;
      playerDiv.style.position = "absolute";
      playerDiv.style.width = "1px";
      playerDiv.style.height = "1px";
      playerDiv.style.overflow = "hidden";
      playerDiv.style.opacity = "0";
      playerDiv.style.pointerEvents = "none";
      document.body.appendChild(playerDiv);
    }

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
            autoplay: 1,
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
        } catch (e) {
          // Ignore cleanup errors
        }
        playerRef.current = null;
      }
      const playerDiv = document.getElementById(playerIdRef.current);
      if (playerDiv && playerDiv.parentNode) {
        playerDiv.parentNode.removeChild(playerDiv);
      }
    };
  }, [onPlayerReady, onPlayerStateChange]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
      <div ref={playerContainerRef} />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display text-gradient mb-4">
            SHNWAZX
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Immersive Audio Experience
          </p>
        </div>

        {/* 3D Music Player */}
        <div className="flex justify-center">
          <div 
            className="relative w-full max-w-lg perspective-1000"
            style={{ perspective: "1000px" }}
          >
            {/* Main Player Card - 3D Effect */}
            <div 
              className="relative bg-gradient-to-br from-card via-card to-secondary rounded-3xl p-6 md:p-8 border border-border shadow-2xl transform-gpu transition-transform duration-500 hover:scale-[1.02]"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 60px -10px hsl(355 70% 55% / 0.2)",
              }}
            >
              {/* Glow Effect Behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-transparent to-primary/30 rounded-3xl blur-xl opacity-50" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Album Art with YouTube Thumbnail */}
                <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary border border-border">
                  {/* YouTube Thumbnail Background */}
                  <img 
                    src={getThumbnail(songs[currentSongIndex].id)}
                    alt={songs[currentSongIndex].title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
                  />
                  
                  {/* 3D Vinyl Effect */}
                  <div 
                    className={`absolute inset-4 rounded-full bg-gradient-to-br from-muted to-background border-4 border-muted ${isPlaying ? 'animate-spin' : ''}`}
                    style={{ animationDuration: "3s" }}
                  >
                    {/* Center Thumbnail */}
                    <div className="absolute inset-[15%] rounded-full overflow-hidden border-2 border-muted">
                      <img 
                        src={getThumbnail(songs[currentSongIndex].id)}
                        alt={songs[currentSongIndex].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.3)_31%,transparent_32%,rgba(0,0,0,0.2)_50%,transparent_51%,rgba(0,0,0,0.2)_70%,transparent_71%)]" />
                    <div className="absolute inset-[40%] rounded-full bg-primary glow-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-background" />
                    </div>
                  </div>

                  {/* Visualizer Bars */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end justify-center gap-1 h-16">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div
                        key={i}
                        className={`w-2 md:w-3 bg-gradient-to-t from-primary to-red-400 rounded-t-full origin-bottom transition-transform ${isPlaying ? '' : 'scale-y-[0.2]'}`}
                        style={{
                          animation: isPlaying ? `visualizer 0.8s ease-in-out infinite` : 'none',
                          animationDelay: `${i * 0.1}s`,
                          height: "100%",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Song Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-display text-foreground mb-1">
                    {songs[currentSongIndex].title}
                  </h3>
                  <p className="text-muted-foreground">
                    {songs[currentSongIndex].artist}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-red-400 rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">{currentTime}</span>
                    <span className="text-sm text-muted-foreground">{duration}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 md:gap-6">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={prevSong}
                    className="p-3 text-foreground hover:text-primary transition-colors hover:scale-110 transform"
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-red-500 flex items-center justify-center hover:scale-110 transition-transform glow-primary"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 text-primary-foreground" />
                    ) : (
                      <Play className="w-7 h-7 text-primary-foreground ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={nextSong}
                    className="p-3 text-foreground hover:text-primary transition-colors hover:scale-110 transform"
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPlaylist ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Playlist - Collapsible */}
            <div 
              className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out ${
                showPlaylist ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border">
                <h4 className="text-lg font-display text-foreground mb-4">Playlist</h4>
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {songs.map((song, index) => (
                    <button
                      key={song.id}
                      onClick={() => selectSong(index)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                        currentSongIndex === index 
                          ? 'bg-primary/20 border border-primary/50' 
                          : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={getThumbnail(song.id)}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        {currentSongIndex === index && isPlaying && (
                          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                            <div className="flex items-end justify-center gap-[2px] h-4">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="w-[3px] bg-primary rounded-sm"
                                  style={{
                                    animation: 'visualizer 0.6s ease-in-out infinite',
                                    animationDelay: `${i * 0.15}s`,
                                    height: '100%',
                                  }}
                                />
                              ))}
                            </div>
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
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes visualizer {
          0%, 100% { transform: scaleY(0.3); }
          25% { transform: scaleY(0.8); }
          50% { transform: scaleY(1); }
          75% { transform: scaleY(0.5); }
        }
      `}</style>
    </section>
  );
};

export default MusicSection;
