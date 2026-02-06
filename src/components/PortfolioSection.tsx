import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import ProjectCard, { type Project } from "./portfolio/ProjectCard";
import ProjectDetailModal from "./portfolio/ProjectDetailModal";
import ImageLightbox from "./portfolio/ImageLightbox";

const PortfolioSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState<{ imageUrl: string; title: string } | null>(null);

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

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const handleImageClick = (imageUrl: string, title: string) => {
    setLightbox({ imageUrl, title });
  };

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
    <>
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
                  <ProjectCard
                    project={project}
                    onSelect={setSelectedProject}
                    onImageClick={handleImageClick}
                  />
                </ScrollAnimationWrapper>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onImageClick={handleImageClick}
      />

      {lightbox && (
        <ImageLightbox
          imageUrl={lightbox.imageUrl}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
};

export default PortfolioSection;
