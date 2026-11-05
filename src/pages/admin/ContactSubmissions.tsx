import { useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Mail, MessageSquareText, UserRound } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"];

export default function ContactSubmissions() {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { data: submissions = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-contact-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminLayout>
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <Inbox className="h-4 w-4" /> Contact inbox
            </p>
            <h1 className="text-2xl font-semibold">Contact messages</h1>
            <p className="mt-1 text-sm text-muted-foreground">Messages submitted through your website.</p>
          </div>
          <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
            {isFetching ? "Refreshing..." : "Refresh messages"}
          </Button>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">{submissions.length} saved {submissions.length === 1 ? "message" : "messages"}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-3 p-6" aria-label="Loading contact messages">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : isError ? (
              <div className="p-6">
                <Alert variant="destructive">
                  <AlertTitle>Messages could not be loaded</AlertTitle>
                  <AlertDescription>Refresh this page and try again. If it continues, check your admin sign-in.</AlertDescription>
                </Alert>
              </div>
            ) : submissions.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
                <MessageSquareText className="h-8 w-8 text-muted-foreground" />
                <h2 className="font-medium">No messages yet</h2>
                <p className="text-sm text-muted-foreground">New contact form submissions will appear here.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Received</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {format(new Date(submission.created_at), "MMM d, yyyy · h:mm a")}
                      </TableCell>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>
                        <a className="text-primary hover:underline" href={`mailto:${submission.email}`}>{submission.email}</a>
                      </TableCell>
                      <TableCell className="max-w-56 truncate">{submission.subject}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                          Read message
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <Dialog open={selectedSubmission !== null} onOpenChange={(open) => { if (!open) setSelectedSubmission(null); }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6">{selectedSubmission.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><UserRound className="h-4 w-4" />{selectedSubmission.name}</span>
                  <a className="flex items-center gap-2 text-primary hover:underline" href={`mailto:${selectedSubmission.email}`}>
                    <Mail className="h-4 w-4" />{selectedSubmission.email}
                  </a>
                  <span>{format(new Date(selectedSubmission.created_at), "MMMM d, yyyy 'at' h:mm a")}</span>
                </div>
                <div className="whitespace-pre-wrap break-words rounded-md border bg-muted/30 p-4 text-sm leading-relaxed">
                  {selectedSubmission.message}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}