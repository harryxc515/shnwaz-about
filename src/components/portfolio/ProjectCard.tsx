import { useRef, useCallback } from "react";
import { ExternalLink } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  technologies: string[] | null;
  link: string | null;
  featured: boolean | null;
}

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onImageClick: (imageUrl: string, title: string) => void;
}

const ProjectCard = ({ project, onSelect, onImageClick }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
        background: "linear-gradient(135deg, hsl(var(--card) / 0.9) 0%, hsl(var(--background) / 0.8) 100%)",
        boxShadow: "inset 0 1px hsl(0 0% 100% / 0.05), 0 20px 40px -20px hsl(0 0% 0% / 0.4)",
      }}
      className="group relative rounded-2xl overflow-hidden border border-foreground/5 hover:border-primary/30 will-change-transform"
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      {/* Glow effect on hover */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.08), transparent 40%)" }}
      />

      {project.image_url && (
        <div
          className="aspect-video overflow-hidden relative cursor-zoom-in"
          onClick={(e) => {
            e.stopPropagation();
            onImageClick(project.image_url!, project.title);
          }}
        >
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
            <div className="bg-background/60 backdrop-blur-md text-foreground px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-foreground/10">
              <ExternalLink size={12} />
              View Full Size
            </div>
          </div>
        </div>
      )}

      <div
        className="p-6 cursor-pointer relative"
        onClick={() => onSelect(project)}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-display text-foreground group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          {project.featured && (
            <span className="text-[10px] uppercase tracking-widest bg-primary/15 text-primary px-2.5 py-1 rounded-full font-medium border border-primary/20">
              Featured
            </span>
          )}
        </div>

        {project.category && (
          <span className="inline-block text-xs text-primary/80 bg-primary/10 px-2.5 py-1 rounded-full mb-3 border border-primary/10">
            {project.category}
          </span>
        )}

        {project.description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[11px] bg-foreground/5 text-muted-foreground px-2.5 py-1 rounded-full border border-foreground/5"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[11px] text-muted-foreground px-1">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bottom action hint */}
        <div className="mt-4 pt-3 border-t border-foreground/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-muted-foreground">View details</span>
          <ExternalLink size={14} className="text-primary" />
        </div>
      </div>
    </div>
  );
};

export { type Project };
export default ProjectCard;
