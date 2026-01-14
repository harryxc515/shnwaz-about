import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, LogOut, ArrowLeft, Shield } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  technologies: string[] | null;
  link: string | null;
  featured: boolean | null;
  display_order: number | null;
}

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [link, setLink] = useState('');
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState('0');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load projects.',
        variant: 'destructive',
      });
    } else {
      setProjects(data || []);
    }
    setLoadingProjects(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setCategory('');
    setTechnologies('');
    setLink('');
    setFeatured(false);
    setDisplayOrder('0');
    setEditingProject(null);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || '');
    setImageUrl(project.image_url || '');
    setCategory(project.category || '');
    setTechnologies(project.technologies?.join(', ') || '');
    setLink(project.link || '');
    setFeatured(project.featured || false);
    setDisplayOrder(project.display_order?.toString() || '0');
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You need admin privileges to manage projects.',
        variant: 'destructive',
      });
      return;
    }

    const projectData = {
      title,
      description: description || null,
      image_url: imageUrl || null,
      category: category || null,
      technologies: technologies ? technologies.split(',').map(t => t.trim()) : null,
      link: link || null,
      featured,
      display_order: parseInt(displayOrder) || 0,
    };

    if (editingProject) {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingProject.id);
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update project.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Project updated successfully.',
        });
        fetchProjects();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('projects')
        .insert([projectData]);
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to create project.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Project created successfully.',
        });
        fetchProjects();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You need admin privileges to delete projects.',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Deleted',
        description: 'Project deleted successfully.',
      });
      fetchProjects();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-display">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-display text-primary tracking-wider">
              ADMIN DASHBOARD
            </h1>
            {isAdmin && (
              <span className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                <Shield size={12} />
                Admin
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut size={18} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {!isAdmin ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Shield className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h2 className="text-xl font-display text-foreground mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-4">
              You need admin privileges to manage projects. Please contact the site owner to get admin access.
            </p>
            <p className="text-sm text-muted-foreground">
              Logged in as: {user?.email}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display text-foreground">Manage Projects</h2>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus size={18} className="mr-2" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-display text-primary">
                      {editingProject ? 'Edit Project' : 'Add New Project'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="e.g., Web, Mobile, Design"
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="bg-secondary border-border"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="bg-secondary border-border"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                      <Input
                        id="technologies"
                        value={technologies}
                        onChange={(e) => setTechnologies(e.target.value)}
                        placeholder="React, TypeScript, Tailwind"
                        className="bg-secondary border-border"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="link">Project Link</Label>
                        <Input
                          id="link"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          placeholder="https://..."
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="displayOrder">Display Order</Label>
                        <Input
                          id="displayOrder"
                          type="number"
                          value={displayOrder}
                          onChange={(e) => setDisplayOrder(e.target.value)}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="rounded border-border"
                      />
                      <Label htmlFor="featured">Featured Project</Label>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        {editingProject ? 'Update Project' : 'Create Project'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Projects table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {loadingProjects ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No projects yet. Click "Add Project" to create one.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id} className="border-border">
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>{project.category || '-'}</TableCell>
                        <TableCell>{project.featured ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{project.display_order ?? 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(project)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(project.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
