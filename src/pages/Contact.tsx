import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const contactSchema = z.object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(100, { message: "Name must be 100 characters or fewer" }),
    email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be 255 characters or fewer" }),
    subject: z.string().trim().min(1, { message: "Subject is required" }).max(200, { message: "Subject must be 200 characters or fewer" }),
    message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(5000, { message: "Message must be 5000 characters or fewer" })
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
    const submissionMutation = useMutation({
        mutationFn: async (values: ContactFormValues) => {
            const validatedValues = contactSchema.parse(values);
            const { error } = await supabase.from("contact_submissions").insert(validatedValues);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Your message was received successfully.");
            form.reset();
        },
        onError: () => {
            toast.error("Your message could not be saved. Please try again.");
        },
    });

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", subject: "", message: "" }
    });

    const onSubmit = (data: ContactFormValues) => submissionMutation.mutate(data);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead title="Contact Us – FreeImagePrompt" description="Get in touch with FreeImagePrompt. We're happy to help with any questions about our free online image tools." canonicalUrl="https://freeimageprompt.com/contact" />
            <Navigation />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Contact Us</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-xl border">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Name</FormLabel><FormControl><Input maxLength={100} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" maxLength={255} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="subject" render={({ field }) => (
                                <FormItem><FormLabel>Subject</FormLabel><FormControl><Input maxLength={200} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="message" render={({ field }) => (
                                <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea className="min-h-[150px]" maxLength={5000} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" disabled={submissionMutation.isPending} className="w-full bg-gradient-to-r from-primary to-primary-glow">
                                {submissionMutation.isPending ? "Saving..." : "Send Message"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
