import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, X } from "lucide-react";

const songs = [
  { id: "BBM57gr9fFU", title: "Song 1", artist: "YouTube" },
  { id: "nNUYfQu7vCY", title: "Song 2", artist: "YouTube" },
  { id: "UvmffFRojQA", title: "Song 3", artist: "YouTube" },
  { id: "oQFNHR9U_hU", title: "Song 4", artist: "YouTube" },
  { id: "l5sgIqzlPXc", title: "Song 5", artist: "YouTube" },
];

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

const MusicPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        createPlayer();
      }
    };

    (window as any).onYouTubeIframeAPIReady = initPlayer;

    // Check if API is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      createPlayer();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const createPlayer = () => {
    playerRef.current = new (window as any).YT.Player("youtube-player", {
      height: "0",
      width: "0",
      videoId: songs[currentSongIndex].id,
      playerVars: {
        autoplay: 0,
        controls: 0,
      },
      events: {
        onStateChange: onPlayerStateChange,
        onReady: onPlayerReady,
      },
    });
  };

  const onPlayerReady = () => {
    setIsReady(true);
    updateDuration();
  };

  const onPlayerStateChange = (event: { data: number }) => {
    const YT = (window as any).YT;
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressInterval();
    } else if (event.data === YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else if (event.data === YT.PlayerState.ENDED) {
      nextSong();
    }
  };

  const startProgressInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        setProgress((current / total) * 100);
        setCurrentTime(formatTime(current));
      }
    }, 1000);
  };

  const updateDuration = () => {
    if (playerRef.current) {
      const total = playerRef.current.getDuration();
      setDuration(formatTime(total));
    }
  };

  const formatTime = (seconds: number) => {
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

  return (
    <>
      <div id="youtube-player" className="hidden" />
      
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1db954] hover:bg-[#1ed760] transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-110"
        aria-label="Toggle music player"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <Music2 className="w-6 h-6 text-black" />
        )}
      </button>

      {/* Music Player Card */}
      <div
        className={`fixed bottom-24 right-6 z-40 transition-all duration-300 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="relative w-[280px] h-[140px] bg-[#191414] rounded-xl p-3 shadow-2xl border border-[#282828]">
          {/* Top Section */}
          <div className="flex gap-3 items-start">
            {/* Album Art / Visualizer */}
            <div className="relative w-12 h-12 bg-gradient-to-br from-[#1db954] to-[#191414] rounded-lg flex items-center justify-center overflow-hidden">
              {isPlaying ? (
                <div className="flex items-end justify-center gap-[2px] h-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-[3px] bg-[#1db954] rounded-sm origin-bottom"
                      style={{
                        animation: `playing 1s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`,
                        height: "100%",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Music2 className="w-6 h-6 text-[#1db954]" />
              )}
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-bold text-sm truncate">
                Track {currentSongIndex + 1}
              </p>
              <p className="text-muted-foreground text-xs truncate">
                Now Playing
              </p>
            </div>

            {/* Volume */}
            <div className="flex items-center">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <button
              onClick={prevSong}
              className="text-foreground hover:text-[#1db954] transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-background" />
              ) : (
                <Play className="w-5 h-5 text-background ml-0.5" />
              )}
            </button>
            <button
              onClick={nextSong}
              className="text-foreground hover:text-[#1db954] transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="w-full bg-[#5e5e5e] h-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1db954] rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">{currentTime}</span>
              <span className="text-[10px] text-muted-foreground">{duration}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes playing {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
};

export default MusicPlayer;
