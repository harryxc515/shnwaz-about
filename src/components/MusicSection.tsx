import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react";

const songs = [
  { id: "SmZpCs4QlY0", title: "Featured Track", artist: "SHNWAZX" },
  { id: "BBM57gr9fFU", title: "Track 1", artist: "SHNWAZX" },
  { id: "nNUYfQu7vCY", title: "Track 2", artist: "SHNWAZX" },
  { id: "UvmffFRojQA", title: "Track 3", artist: "SHNWAZX" },
  { id: "oQFNHR9U_hU", title: "Track 4", artist: "SHNWAZX" },
  { id: "l5sgIqzlPXc", title: "Track 5", artist: "SHNWAZX" },
];

const getThumbnail = (videoId: string) => `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

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
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerIdRef = useRef<string>(`yt-player-${Date.now()}`);
  const currentSongIndexRef = useRef(currentSongIndex);
  const progressBarRef = useRef<HTMLDivElement>(null);

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
        } catch (e) {}
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
    <section id="music" className="min-h-screen py-20 px-4 relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wider uppercase mb-4">
            Now Streaming
          </span>
          <h2 className="text-4xl md:text-6xl font-display text-foreground mb-3">
            Music Player
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Experience the sound. Listen to my latest tracks and productions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Main Player */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-red-500/20 to-primary/20 rounded-[2rem] blur-2xl opacity-60" />
            
            <div className="relative bg-card/95 backdrop-blur-2xl rounded-3xl p-8 border border-border/50 shadow-2xl">
              {/* Vinyl & Album Art */}
              <div className="relative flex justify-center mb-8">
                {/* Vinyl Record */}
                <div 
                  className={`absolute w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-2xl transition-transform duration-1000 ${
                    isPlaying ? "animate-spin" : ""
                  }`}
                  style={{ 
                    animationDuration: "3s",
                    right: "15%",
                    zIndex: 0
                  }}
                >
                  {/* Vinyl Grooves */}
                  <div className="absolute inset-4 rounded-full border border-zinc-700/50" />
                  <div className="absolute inset-8 rounded-full border border-zinc-700/30" />
                  <div className="absolute inset-12 rounded-full border border-zinc-700/30" />
                  <div className="absolute inset-16 rounded-full border border-zinc-700/30" />
                  {/* Center Label */}
                  <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-zinc-900" />
                  </div>
                </div>

                {/* Album Cover */}
                <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl group">
                  <img 
                    src={getThumbnail(songs[currentSongIndex].id)}
                    alt={songs[currentSongIndex].title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  
                  {/* Playing Indicator */}
                  {isPlaying && (
                    <div className="absolute bottom-4 left-4 flex items-end gap-1 h-5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-1 bg-primary rounded-full animate-bounce"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "0.5s",
                            height: `${Math.random() * 60 + 40}%`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Song Info */}
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-display text-foreground mb-1">
                  {songs[currentSongIndex].title}
                </h3>
                <p className="text-muted-foreground">{songs[currentSongIndex].artist}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div 
                  ref={progressBarRef}
                  className="relative w-full h-2 bg-muted/30 rounded-full overflow-hidden cursor-pointer group"
                >
                  {/* Progress Fill */}
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-red-500 to-primary rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Hover Thumb */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${progress}% - 8px)` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground font-mono">{currentTime}</span>
                  <span className="text-xs text-muted-foreground font-mono">{duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-3 rounded-full transition-all ${
                    isShuffled 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>
                
                <button
                  onClick={prevSong}
                  className="p-3 rounded-full text-foreground hover:text-primary hover:bg-secondary/50 transition-all hover:scale-110"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center hover:scale-105 transition-all shadow-xl shadow-primary/40 group"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-red-600 animate-ping opacity-20" />
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-primary-foreground relative z-10" />
                  ) : (
                    <Play className="w-7 h-7 text-primary-foreground ml-1 relative z-10" />
                  )}
                </button>
                
                <button
                  onClick={nextSong}
                  className="p-3 rounded-full text-foreground hover:text-primary hover:bg-secondary/50 transition-all hover:scale-110"
                >
                  <SkipForward className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setIsRepeating(!isRepeating)}
                  className={`p-3 rounded-full transition-all ${
                    isRepeating 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <Repeat className="w-5 h-5" />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center justify-center mt-6 gap-3">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="w-32 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-muted-foreground rounded-full transition-all ${isMuted ? 'w-0' : 'w-full'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-6 border border-border/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-display text-foreground">Playlist</h4>
              <span className="text-sm text-muted-foreground">{songs.length} tracks</span>
            </div>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {songs.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => selectSong(index)}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all group ${
                    currentSongIndex === index 
                      ? 'bg-gradient-to-r from-primary/20 to-red-500/10 border border-primary/30' 
                      : 'hover:bg-secondary/50 border border-transparent'
                  }`}
                >
                  {/* Track Number / Playing Indicator */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    currentSongIndex === index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary/50 text-muted-foreground group-hover:bg-secondary'
                  }`}>
                    {currentSongIndex === index && isPlaying ? (
                      <div className="flex items-end gap-0.5 h-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-primary-foreground rounded-full animate-bounce"
                            style={{
                              animationDelay: `${i * 0.15}s`,
                              animationDuration: "0.6s",
                              height: `${Math.random() * 50 + 50}%`,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={getThumbnail(song.id)}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Song Info */}
                  <div className="text-left flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      currentSongIndex === index ? 'text-primary' : 'text-foreground'
                    }`}>
                      {song.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  </div>
                  
                  {/* Play Icon on Hover */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    currentSongIndex === index 
                      ? 'bg-primary/20 text-primary'
                      : 'bg-transparent group-hover:bg-primary/10 text-transparent group-hover:text-primary'
                  }`}>
                    <Play className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
