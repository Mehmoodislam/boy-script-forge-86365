import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, PenTool, Navigation as NavIcon } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [pages, posts, nav] = await Promise.all([
        supabase.from('cms_pages' as any).select('id', { count: 'exact', head: true }),
        supabase.from('cms_posts' as any).select('id', { count: 'exact', head: true }),
        supabase.from('cms_navigation' as any).select('id', { count: 'exact', head: true }),
      ]);
      return {
        pages: pages.count || 0,
        posts: posts.count || 0,
        nav: nav.count || 0,
      };
    }
  });

  const cards = [
    { title: "Total Pages", value: stats?.pages ?? 0, icon: <FileText className="w-8 h-8 text-blue-500" /> },
    { title: "Total Posts", value: stats?.posts ?? 0, icon: <PenTool className="w-8 h-8 text-green-500" /> },
    { title: "Menu Items", value: stats?.nav ?? 0, icon: <NavIcon className="w-8 h-8 text-purple-500" /> },
  ];

  return (
    <AdminLayout>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to CMS Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Yahan se aap apni website ke pages, blog posts aur navigation menu manage kar sakte hain. 
              Left sidebar se kisi bhi section pe jayen.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
