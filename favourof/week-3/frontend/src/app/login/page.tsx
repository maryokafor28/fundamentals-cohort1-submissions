import { LoginForm } from "@/components/login-form";
import { CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">TaskFlow</span>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-pretty">
              Sign in to your account to continue managing your tasks
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>
      </div>

      {/* Right side - Visual/Branding */}
      <div className="hidden lg:flex flex-1 bg-muted items-center justify-center p-8">
        <div className="max-w-md space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-balance">
              Organize your work, amplify your productivity
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Join thousands of teams using TaskFlow to streamline their
              workflow and achieve more together.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid gap-4 pt-8">
            {[
              {
                title: "Smart Task Management",
                desc: "Organize and prioritize with ease",
              },
              { title: "Team Collaboration", desc: "Work together seamlessly" },
              {
                title: "Real-time Updates",
                desc: "Stay in sync with your team",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 text-left p-4 rounded-lg bg-background/50"
              >
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
