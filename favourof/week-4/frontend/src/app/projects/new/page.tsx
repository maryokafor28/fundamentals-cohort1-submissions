"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  tag: z.string().optional(),
});

type FormValues = z.input<typeof formSchema>;
type SubmitValues = {
  title: string;
  description: string;
  tag: string[];
};

export default function CreateProjectPage() {
  const { token } = useAuth();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tag: "",
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to create a project");
      router.push("/login");
    }
  }, [token, router]);

  const onSubmit = async (values: FormValues) => {
    try {
      const submitValues: SubmitValues = {
        ...values,
        tag: values.tag
          ? values.tag
              .split(",")
              .map((t) => t.trim().toLowerCase())
              .filter((t) => t)
          : [],
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/project/create`,
        submitValues,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Project created successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to create project");
      console.log(error);
    }
  };

  if (!token) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl">Create a New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project (at least 10 characters)"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tags (comma-separated, e.g., react, node)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Create Project
                  </Button>
                  <Link href="/">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
