import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";

const registerSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include one uppercase letter")
      .regex(/[0-9]/, "Include one number"),
    confirmPassword: z.string()
  })
  .refine((data: { password: string; confirmPassword: string }) => {
    return data.password === data.confirmPassword;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = handleSubmit(async ({ confirmPassword, ...values }: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser(values);
      navigate("/", { replace: true });
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Unable to create account. Please try again."
      );
    }
  });

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-100 shadow-lg shadow-slate-950/30">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Create your DevConnect account</h1>
        <p className="text-sm text-slate-400">
          Showcase your projects and start collaborating with the community.
        </p>
      </div>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <Input
          label="Username"
          placeholder="alex-builds"
          error={errors.username?.message}
          disabled={loading || isSubmitting}
          {...register("username")}
        />
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
          helperText="Use at least 8 characters, including a number and uppercase letter."
          error={errors.password?.message}
          disabled={loading || isSubmitting}
          {...register("password")}
        />
        <Input
          type="password"
          label="Confirm password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={loading || isSubmitting}
          {...register("confirmPassword")}
        />
        {serverError ? <p className="text-sm text-red-400">{serverError}</p> : null}
        <Button type="submit" disabled={loading || isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link className="text-primary-400 hover:text-primary-300" to="/login">
          Sign in
        </Link>
      </p>
    </section>
  );
}
