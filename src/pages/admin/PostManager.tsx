import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash, Globe, Lock } from "lucide-react";

export default function PostManager() {
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('cms_posts' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any);
      if (error) throw error;
      return data;
    }
  });

  const upsertMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await supabase
        .from('cms_posts')
        .upsert(formData)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success(editingPost ? "Post updated" : "Post created");
      setOpen(false);
      setEditingPost(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cms_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success("Post deleted");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingPost?.id,
      title: formData.get('title'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      featured_image: formData.get('featured_image'),
      is_published: formData.get('is_published') === 'on'
    };
    upsertMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) setEditingPost(null); }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit Post" : "Add New Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input name="title" defaultValue={editingPost?.title} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input name="slug" defaultValue={editingPost?.slug} placeholder="blog-post-title" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Featured Image URL</label>
                <Input name="featured_image" defaultValue={editingPost?.featured_image} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt (Short Summary)</label>
                <Textarea name="excerpt" defaultValue={editingPost?.excerpt} rows={2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content (HTML/Markdown/Text)</label>
                <Textarea name="content" defaultValue={editingPost?.content} rows={12} />
              </div>
              <div className="flex items-center gap-2">
                <Switch name="is_published" defaultChecked={editingPost?.is_published} />
                <label className="text-sm font-medium">Published</label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={upsertMutation.isPending}>
                  {upsertMutation.isPending ? "Saving..." : "Save Post"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : posts?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No posts found.</TableCell></TableRow>
              ) : posts?.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
                  <TableCell>/{post.slug}</TableCell>
                  <TableCell>
                    {post.is_published ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <Globe className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Lock className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => { setEditingPost(post); setOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive" onClick={() => {
                      if(confirm("Are you sure?")) deleteMutation.mutate(post.id);
                    }}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
