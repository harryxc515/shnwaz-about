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
      style={{ transformStyle: "preserve-3d", transition: "transform 0.15s ease-out" }}
      className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 will-change-transform"
    >
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
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
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <ExternalLink size={12} />
              View Full Size
            </div>
          </div>
        </div>
      )}
      <div
        className="p-5 cursor-pointer"
        onClick={() => onSelect(project)}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-display text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.featured && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
              Featured
            </span>
          )}
        </div>
        {project.category && (
          <span className="inline-block text-xs text-primary bg-primary/10 px-2 py-1 rounded mb-3">
            {project.category}
          </span>
        )}
        {project.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {project.description}
          </p>
        )}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { type Project };
export default ProjectCard;
