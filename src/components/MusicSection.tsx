const songs = [
  { id: "SmZpCs4QlY0", title: "Featured Track" },
  { id: "BBM57gr9fFU", title: "Track 1" },
  { id: "nNUYfQu7vCY", title: "Track 2" },
  { id: "UvmffFRojQA", title: "Track 3" },
  { id: "oQFNHR9U_hU", title: "Track 4" },
  { id: "l5sgIqzlPXc", title: "Track 5" },
];

const MusicSection = () => {
  return (
    <section id="music" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
            Music
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Listen to my latest tracks
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${song.id}`}
                  title={song.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-foreground">{song.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
