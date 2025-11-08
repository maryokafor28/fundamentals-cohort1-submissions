"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { se } from "date-fns/locale";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });
  const { login } = useAuth();
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const res = await login(values.email, values.password);
      if (res.data.status) {
        console.log("Login successful");
        setLoading(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center  px-4">
      {/* Decorative background icons */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-10 left-10 w-24 h-24 text-emerald-200 opacity-30"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L15 8H9L12 2ZM12 22L9 16H15L12 22ZM2 12L8 15V9L2 12ZM22 12L16 9V15L22 12Z" />
        </svg>
        <svg
          className="absolute bottom-16 right-16 w-16 h-16 text-teal-200 opacity-30"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-semibold text-center mb-8">
          <span className="text-emerald-700">Pulse</span>
          <span className="text-pink-600">Track</span>
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Your email..."
                      className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your password..."
                      className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-gray-600 font-normal">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Link
                to="/auth/forgot-password"
                className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white text-md font-semibold transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Dont have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-emerald-700 hover:text-emerald-800 font-medium"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
export default LoginForm;
