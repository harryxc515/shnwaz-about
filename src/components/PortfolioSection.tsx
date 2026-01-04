import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
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

const PortfolioSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))];
  
  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">Loading projects...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Portfolio
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore my latest projects and creative work
            </p>
          </div>
        </ScrollAnimationWrapper>

        {categories.length > 1 && (
          <ScrollAnimationWrapper delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category as string)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-primary/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </ScrollAnimationWrapper>
        )}

        {filteredProjects.length === 0 ? (
          <ScrollAnimationWrapper delay={0.2}>
            <div className="text-center text-muted-foreground py-12">
              No projects found. Add some projects to your portfolio!
            </div>
          </ScrollAnimationWrapper>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ScrollAnimationWrapper key={project.id} delay={0.1 * (index + 1)}>
                <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300">
                  {project.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-display text-foreground">
                        {project.title}
                      </h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink size={18} />
                        </a>
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
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
