"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const contactSchema = z.object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    email: z.string().trim().email({ message: "Invalid email address" }),
    subject: z.string().trim().min(1, { message: "Subject is required" }),
    message: z.string().trim().min(10, { message: "Message must be at least 10 characters" })
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", subject: "", message: "" }
    });

    const onSubmit = (data: ContactFormValues) => {
        toast.success("Message sent successfully!");
        form.reset();
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-xl border">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="subject" render={({ field }) => (
                                <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="message" render={({ field }) => (
                                <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" className="w-full">Send Message</Button>
                        </form>
                    </Form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
