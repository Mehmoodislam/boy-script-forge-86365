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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash, MoveUp, MoveDown } from "lucide-react";

export default function NavManager() {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['admin-navigation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_navigation')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const upsertMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await supabase
        .from('cms_navigation')
        .upsert(formData)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      toast.success(editingItem ? "Menu item updated" : "Menu item created");
      setOpen(false);
      setEditingItem(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cms_navigation').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      toast.success("Menu item deleted");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingItem?.id,
      label: formData.get('label'),
      path: formData.get('path'),
      order_index: parseInt(formData.get('order_index') as string) || 0
    };
    upsertMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Navigation Menu</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) setEditingItem(null); }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Label</label>
                <Input name="label" defaultValue={editingItem?.label} placeholder="Home, Blog, etc." required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Path</label>
                <Input name="path" defaultValue={editingItem?.path} placeholder="/blog or /my-page" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Index</label>
                <Input name="order_index" type="number" defaultValue={editingItem?.order_index ?? 0} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={upsertMutation.isPending}>
                  Save Item
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
                <TableHead className="w-[100px]">Order</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Path</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : menuItems?.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No menu items found.</TableCell></TableRow>
              ) : menuItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.order_index}</TableCell>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell>{item.path}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => { setEditingItem(item); setOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive" onClick={() => {
                      if(confirm("Are you sure?")) deleteMutation.mutate(item.id);
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
