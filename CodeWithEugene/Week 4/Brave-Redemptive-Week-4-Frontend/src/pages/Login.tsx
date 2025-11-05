import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = (location.state as { from?: Location })?.from ?? {
        pathname: "/"
      };
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const onSubmit = handleSubmit(async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Unable to login. Please try again."
      );
    }
  });

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-100 shadow-lg shadow-slate-950/30">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="text-sm text-slate-400">Sign in to continue collaborating on DevConnect.</p>
      </div>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <Input
          type="email"
          label="Email"
          placeholder="alex@devconnect.io"
          error={errors.email?.message}
          disabled={loading || isSubmitting}
          {...register("email")}
        />
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={loading || isSubmitting}
          {...register("password")}
        />
        {serverError ? <p className="text-sm text-red-400">{serverError}</p> : null}
        <Button type="submit" disabled={loading || isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-400">
        New to DevConnect?{" "}
        <Link className="text-primary-400 hover:text-primary-300" to="/register">
          Create an account
        </Link>
      </p>
    </section>
  );
}
