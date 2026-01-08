import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, List, X } from "lucide-react";

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
];

const getThumbnail = (videoId: string) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
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

const MusicSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [waveformKey, setWaveformKey] = useState(0);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerIdRef = useRef<string>(`yt-player-${Date.now()}`);
  const animationRef = useRef<number>();

  // Animate waveform when playing
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setWaveformKey(prev => prev + 1);
        animationRef.current = requestAnimationFrame(animate);
      };
      const interval = setInterval(() => {
        setWaveformKey(prev => prev + 1);
      }, 150);
      return () => {
        clearInterval(interval);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [isPlaying]);

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
                </div>

                {/* Controls Section */}
                <div 
                  className="mt-6 flex items-center justify-between"
                  style={{ transform: "translateZ(10px)" }}
                >
                  {/* Playlist Button */}
                  <button
                    onClick={() => setShowPlaylist(true)}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                    style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    <List className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </button>

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

                  {/* Track Counter */}
                  <div className="w-11 text-right">
                    <span className="text-white/30 text-xs font-mono tracking-wider">
                      {songs.length} TRK
                    </span>
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