
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResultsStore } from "@/hooks/use-results-store";
import Image from "next/image";
import { ArrowRight, Bot } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useResultsStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormValues) {
    login({
        username: data.username,
        email: data.email,
    });
    router.push("/");
  }

  const handleDemoLogin = () => {
    form.setValue("username", "rahul");
    form.setValue("email", "demo@gmail.com");
    form.setValue("password", "12345678");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
             <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <Image src="/icons/icon.png" alt="EduVisor Logo" width={60} height={60} />
                    <h1 className="text-5xl font-bold font-headline">EduVisor</h1>
                </div>
                <p className="text-xl text-muted-foreground mt-4">
                   Your personalized guide to a brighter future. Let's find the perfect career and college path for you.
                </p>
            </div>
            <Card className="w-full max-w-md mx-auto shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Welcome!</CardTitle>
                <CardDescription>
                  Create an account to start your journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. alexdoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="alex.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={handleDemoLogin} className="w-full">
                           <Bot className="mr-2" /> Fill Demo Data
                        </Button>
                        <Button type="submit" className="w-full">
                          Start My Journey <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
        </div>
    </div>
  );
}
