import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, List, X, Volume2, VolumeX, Shuffle, Repeat, Repeat1 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const songs = [
  { id: "47mUgngp3bk", title: "Featured Track", artist: "SHNWAZX" },
  { id: "MVuX0FrR-hA", title: "Track 1", artist: "SHNWAZX" },
  { id: "MU-kqztMG5M", title: "Track 2", artist: "SHNWAZX" },
  { id: "Gf5yYICFJMg", title: "Track 3", artist: "SHNWAZX" },
  { id: "SmZpCs4QlY0", title: "Track 4", artist: "SHNWAZX" },
  { id: "BBM57gr9fFU", title: "Track 5", artist: "SHNWAZX" },
  { id: "nNUYfQu7vCY", title: "Track 6", artist: "SHNWAZX" },
  { id: "UvmffFRojQA", title: "Track 7", artist: "SHNWAZX" },
  { id: "oQFNHR9U_hU", title: "Track 8", artist: "SHNWAZX" },
  { id: "l5sgIqzlPXc", title: "Track 9", artist: "SHNWAZX" },
  { id: "MsGhyzKml5U", title: "Track 10", artist: "SHNWAZX" },
  { id: "NhWKTo6U0cQ", title: "Track 11", artist: "SHNWAZX" },
  { id: "mEM0KWhQp44", title: "Track 12", artist: "SHNWAZX" },
];

const getThumbnail = (videoId: string) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

// Waveform visualizer component
const WaveformVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  const bars = 40;
  return (
    <div className="flex items-end justify-center gap-[2px] h-16 w-full">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-1 bg-white/90 rounded-full transition-all duration-150"
          style={{
            height: isPlaying 
              ? `${Math.random() * 60 + 20}%` 
              : `${Math.sin(i * 0.3) * 20 + 25}%`,
            animationDelay: `${i * 20}ms`,
            transition: isPlaying ? 'height 0.15s ease' : 'height 0.5s ease',
          }}
        />
      ))}
    </div>
  );
};

type RepeatMode = 'off' | 'all' | 'one';

const MusicSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [waveformKey, setWaveformKey] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerIdRef = useRef<string>(`yt-player-${Date.now()}`);
  const animationRef = useRef<number>();
  const currentIndexRef = useRef(0);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const previousVolumeRef = useRef(80);
  const isShuffledRef = useRef(false);
  const repeatModeRef = useRef<RepeatMode>('off');
  const shuffledIndicesRef = useRef<number[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    currentIndexRef.current = currentSongIndex;
  }, [currentSongIndex]);

  useEffect(() => {
    isShuffledRef.current = isShuffled;
    shuffledIndicesRef.current = shuffledIndices;
  }, [isShuffled, shuffledIndices]);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  // Generate shuffled indices
  const generateShuffledIndices = useCallback(() => {
    const indices = Array.from({ length: songs.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, []);

  const toggleShuffle = () => {
    if (!isShuffled) {
      const newIndices = generateShuffledIndices();
      setShuffledIndices(newIndices);
    }
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  // Animate waveform and track progress when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setWaveformKey(prev => prev + 1);
      }, 150);
      
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const time = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          setCurrentTime(time);
          if (dur && dur > 0) setDuration(dur);
        }
      }, 500);
      
      return () => {
        clearInterval(interval);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
  }, [isPlaying]);

  // Volume control
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    playerRef.current?.setVolume(newVolume);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolumeRef.current);
      playerRef.current?.setVolume(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
      setIsMuted(true);
      setVolume(0);
      playerRef.current?.setVolume(0);
    }
  };

  // Seek functionality
  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    setCurrentTime(seekTime);
    playerRef.current?.seekTo(seekTime, true);
  };

  // Play next song function
  const playNextSong = useCallback(() => {
    // Handle repeat one mode
    if (repeatModeRef.current === 'one') {
      playerRef.current?.seekTo(0, true);
      playerRef.current?.playVideo();
      return;
    }

    let newIndex: number;
    
    if (isShuffledRef.current && shuffledIndicesRef.current.length > 0) {
      const currentShuffledPos = shuffledIndicesRef.current.indexOf(currentIndexRef.current);
      const nextShuffledPos = (currentShuffledPos + 1) % shuffledIndicesRef.current.length;
      newIndex = shuffledIndicesRef.current[nextShuffledPos];
    } else {
      newIndex = (currentIndexRef.current + 1) % songs.length;
    }

    // Handle repeat all or stop at end
    if (repeatModeRef.current === 'off' && newIndex === 0 && !isShuffledRef.current) {
      setIsPlaying(false);
      return;
    }

    currentIndexRef.current = newIndex;
    setCurrentSongIndex(newIndex);
    setCurrentTime(0);
    setDuration(0);
    playerRef.current?.loadVideoById(songs[newIndex].id);
  }, []);

  useEffect(() => {
    const playerDiv = document.createElement("div");
    playerDiv.id = playerIdRef.current;
    playerDiv.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
    document.body.appendChild(playerDiv);

    const onStateChange = (event: { data: number }) => {
      const YT = (window as any).YT;
      if (!YT) return;
      if (event.data === YT.PlayerState.PLAYING) {
        setIsPlaying(true);
      } else if (event.data === YT.PlayerState.PAUSED) {
        setIsPlaying(false);
      } else if (event.data === YT.PlayerState.ENDED) {
        // Auto-play next song
        playNextSong();
      }
    };

    const createPlayer = () => {
      if ((window as any).YT?.Player && !playerRef.current) {
        playerRef.current = new (window as any).YT.Player(playerIdRef.current, {
          height: "1",
          width: "1",
          videoId: songs[0].id,
          playerVars: { autoplay: 0, controls: 0 },
          events: {
            onStateChange: onStateChange,
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
      playerRef.current = null;
      document.getElementById(playerIdRef.current)?.remove();
    };
  }, [playNextSong]);

  const togglePlay = useCallback(() => {
    if (!isReady) return;
    isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo();
  }, [isReady, isPlaying]);

  const nextSong = useCallback(() => {
    let newIndex: number;
    
    if (isShuffled && shuffledIndices.length > 0) {
      const currentShuffledPos = shuffledIndices.indexOf(currentSongIndex);
      const nextShuffledPos = (currentShuffledPos + 1) % shuffledIndices.length;
      newIndex = shuffledIndices[nextShuffledPos];
    } else {
      newIndex = (currentSongIndex + 1) % songs.length;
    }

    currentIndexRef.current = newIndex;
    setCurrentSongIndex(newIndex);
    setCurrentTime(0);
    setDuration(0);
    playerRef.current?.loadVideoById(songs[newIndex].id);
  }, [isShuffled, shuffledIndices, currentSongIndex]);

  const prevSong = useCallback(() => {
    let newIndex: number;
    
    if (isShuffled && shuffledIndices.length > 0) {
      const currentShuffledPos = shuffledIndices.indexOf(currentSongIndex);
      const prevShuffledPos = (currentShuffledPos - 1 + shuffledIndices.length) % shuffledIndices.length;
      newIndex = shuffledIndices[prevShuffledPos];
    } else {
      newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }

    currentIndexRef.current = newIndex;
    setCurrentSongIndex(newIndex);
    setCurrentTime(0);
    setDuration(0);
    playerRef.current?.loadVideoById(songs[newIndex].id);
  }, [isShuffled, shuffledIndices, currentSongIndex]);

  const adjustVolume = useCallback((delta: number) => {
    const newVolume = Math.max(0, Math.min(100, volume + delta));
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    playerRef.current?.setVolume(newVolume);
  }, [volume]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowright':
          if (e.shiftKey) {
            nextSong();
          }
          break;
        case 'arrowleft':
          if (e.shiftKey) {
            prevSong();
          }
          break;
        case 'arrowup':
          e.preventDefault();
          adjustVolume(10);
          break;
        case 'arrowdown':
          e.preventDefault();
          adjustVolume(-10);
          break;
        case 'm':
          toggleMute();
          break;
        case 's':
          toggleShuffle();
          break;
        case 'r':
          toggleRepeat();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextSong, prevSong, adjustVolume]);

  const selectSong = (index: number) => {
    currentIndexRef.current = index;
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setDuration(0);
    playerRef.current?.loadVideoById(songs[index].id);
    setShowPlaylist(false);
  };

  return (
    <section id="music" className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Music</h2>
          <p className="text-muted-foreground">Listen to my latest tracks</p>
        </div>

        {/* Ultra-Minimalist 3D Player */}
        <div className="flex justify-center" style={{ perspective: "1200px" }}>
          <div 
            className="relative w-full max-w-2xl"
            style={{ 
              transformStyle: "preserve-3d",
              transform: "rotateX(8deg) rotateY(-3deg)",
            }}
          >
            {/* Main Player Body - Matte Black Aluminum */}
            <div 
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #0a0a0a 100%)",
                boxShadow: `
                  30px 30px 60px rgba(0,0,0,0.6),
                  -10px -10px 30px rgba(40,40,40,0.1),
                  inset 0 1px 0 rgba(255,255,255,0.05),
                  inset 0 -1px 0 rgba(0,0,0,0.3)
                `,
                transform: "translateZ(0)",
              }}
            >
              {/* Precision-Cut Edge Highlight */}
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, transparent 100%)",
                }}
              />

              {/* OLED Display Area */}
              <div className="p-6 md:p-8">
                {/* Screen Bezel */}
                <div 
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    background: "#000",
                    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.8)",
                    transform: "translateZ(5px)",
                  }}
                >
                  {/* Album Art with Waveform Overlay */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={getThumbnail(songs[currentSongIndex].id)}
                      alt={songs[currentSongIndex].title}
                      className="w-full h-full object-cover opacity-40"
                    />
                    
                    {/* Waveform Visualizer Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center px-8">
                      <WaveformVisualizer key={waveformKey} isPlaying={isPlaying} />
                    </div>

                    {/* Song Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-white font-medium text-lg tracking-wide">
                            {songs[currentSongIndex].title}
                          </h3>
                          <p className="text-white/60 text-sm tracking-widest uppercase">
                            {songs[currentSongIndex].artist}
                          </p>
                        </div>
                        <div className="text-white/40 text-xs font-mono">
                          {String(currentSongIndex + 1).padStart(2, '0')} / {songs.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-xs font-mono w-10">
                        {formatTime(currentTime)}
                      </span>
                      <Slider
                        value={[currentTime]}
                        min={0}
                        max={duration || 100}
                        step={1}
                        onValueChange={handleSeek}
                        className="flex-1 cursor-pointer [&>span:first-child]:h-1 [&>span:first-child]:bg-white/20 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&>span:first-child>span]:bg-white"
                      />
                      <span className="text-white/40 text-xs font-mono w-10 text-right">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls Section */}
                <div 
                  className="mt-6 flex items-center justify-between"
                  style={{ transform: "translateZ(10px)" }}
                >
                  {/* Left Controls - Shuffle & Playlist */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleShuffle}
                      className={`p-3 rounded-lg transition-all duration-200 group ${
                        isShuffled ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
                      }`}
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                      }}
                      title="Shuffle (S)"
                    >
                      <Shuffle className={`w-4 h-4 transition-colors ${
                        isShuffled ? 'text-white' : 'text-white/60 group-hover:text-white'
                      }`} />
                    </button>
                    <button
                      onClick={() => setShowPlaylist(true)}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                      }}
                      title="Playlist"
                    >
                      <List className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                    </button>
                  </div>

                  {/* Main Controls */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={prevSong} 
                      className="p-2 text-white/50 hover:text-white transition-colors"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={togglePlay}
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                      style={{
                        background: "linear-gradient(145deg, #ffffff 0%, #e0e0e0 100%)",
                        boxShadow: `
                          0 4px 15px rgba(0,0,0,0.3),
                          inset 0 2px 0 rgba(255,255,255,0.8),
                          inset 0 -2px 0 rgba(0,0,0,0.1)
                        `,
                      }}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-black" />
                      ) : (
                        <Play className="w-5 h-5 text-black ml-0.5" />
                      )}
                    </button>
                    
                    <button 
                      onClick={nextSong} 
                      className="p-2 text-white/50 hover:text-white transition-colors"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Right Controls - Repeat & Volume */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleRepeat}
                      className={`p-3 rounded-lg transition-all duration-200 group ${
                        repeatMode !== 'off' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
                      }`}
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                      }}
                      title={`Repeat: ${repeatMode} (R)`}
                    >
                      {repeatMode === 'one' ? (
                        <Repeat1 className="w-4 h-4 text-white" />
                      ) : (
                        <Repeat className={`w-4 h-4 transition-colors ${
                          repeatMode === 'all' ? 'text-white' : 'text-white/60 group-hover:text-white'
                        }`} />
                      )}
                    </button>
                    <div className="flex items-center gap-1 w-28">
                      <button
                        onClick={toggleMute}
                        className="p-2 text-white/50 hover:text-white transition-colors"
                        title="Mute (M)"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <Slider
                        value={[volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="flex-1 cursor-pointer [&>span:first-child]:h-1 [&>span:first-child]:bg-white/20 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&>span:first-child>span]:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Edge Detail */}
              <div 
                className="h-1 w-full"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
                }}
              />
            </div>

            {/* 3D Shadow Layer */}
            <div 
              className="absolute -bottom-8 left-4 right-4 h-8 rounded-full blur-2xl"
              style={{
                background: "rgba(0,0,0,0.4)",
                transform: "translateZ(-20px) rotateX(90deg)",
              }}
            />
          </div>
        </div>

        {/* Playlist Modal */}
        {showPlaylist && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowPlaylist(false)}
          >
            <div 
              className="w-full max-w-md rounded-2xl overflow-hidden animate-scale-in"
              style={{
                background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h4 className="text-white font-medium tracking-wide">Playlist</h4>
                <button
                  onClick={() => setShowPlaylist(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Track List */}
              <div className="max-h-96 overflow-y-auto">
                {songs.map((song, index) => (
                  <button
                    key={song.id}
                    onClick={() => selectSong(index)}
                    className={`w-full flex items-center gap-4 p-4 transition-all duration-200 ${
                      currentSongIndex === index
                        ? "bg-white/10"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getThumbnail(song.id)}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      {currentSongIndex === index && isPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="flex items-end gap-0.5 h-4">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-1 bg-white rounded-full animate-bounce"
                                style={{ 
                                  animationDelay: `${i * 0.1}s`, 
                                  height: `${50 + i * 15}%` 
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        currentSongIndex === index ? "text-white" : "text-white/80"
                      }`}>
                        {song.title}
                      </p>
                      <p className="text-white/40 text-sm truncate">{song.artist}</p>
                    </div>
                    <span className="text-white/20 text-xs font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
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