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

export default function PageManager() {
  const [open, setOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: pages, isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('cms_pages' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any);
      if (error) throw error;
      return data;
    }
  });

  const upsertMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await supabase
        .from('cms_pages')
        .upsert(formData)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      toast.success(editingPage ? "Page updated" : "Page created");
      setOpen(false);
      setEditingPage(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cms_pages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      toast.success("Page deleted");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingPage?.id, // undefined for new ones
      title: formData.get('title'),
      slug: formData.get('slug'),
      content: formData.get('content'),
      meta_title: formData.get('meta_title'),
      meta_description: formData.get('meta_description'),
      is_published: formData.get('is_published') === 'on'
    };
    upsertMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) setEditingPage(null); }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPage ? "Edit Page" : "Add New Page"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input name="title" defaultValue={editingPage?.title} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input name="slug" defaultValue={editingPage?.slug} placeholder="my-custom-page" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content (HTML/Text)</label>
                <Textarea name="content" defaultValue={editingPage?.content} rows={10} />
              </div>
              <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/20">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Title</label>
                  <Input name="meta_title" defaultValue={editingPage?.meta_title} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Description</label>
                  <Input name="meta_description" defaultValue={editingPage?.meta_description} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch name="is_published" defaultChecked={editingPage?.is_published} />
                <label className="text-sm font-medium">Published</label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={upsertMutation.isPending}>
                  {upsertMutation.isPending ? "Saving..." : "Save Page"}
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
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : pages?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No pages found.</TableCell></TableRow>
              ) : pages?.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>/{page.slug}</TableCell>
                  <TableCell>
                    {page.is_published ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <Globe className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Lock className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(page.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => { setEditingPage(page); setOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive" onClick={() => {
                      if(confirm("Are you sure?")) deleteMutation.mutate(page.id);
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
