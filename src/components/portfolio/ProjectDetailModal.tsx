import { Github, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "./ProjectCard";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onImageClick: (imageUrl: string, title: string) => void;
}

const ProjectDetailModal = ({ project, onClose, onImageClick }: ProjectDetailModalProps) => {
  return (
    <Dialog open={!!project} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {project && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-display flex items-center gap-3">
                {project.title}
                {project.featured && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            {project.image_url && (
              <div
                className="aspect-video overflow-hidden rounded-lg mt-4 cursor-zoom-in group"
                onClick={() => onImageClick(project.image_url!, project.title)}
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {project.category && (
              <div className="mt-4">
                <span className="inline-block text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  {project.category}
                </span>
              </div>
            )}

            {project.description && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-foreground mb-2">About</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-sm bg-secondary text-foreground px-3 py-1.5 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.link && (
              <div className="mt-6 flex gap-3">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Github size={18} />
                  View Source
                </a>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
