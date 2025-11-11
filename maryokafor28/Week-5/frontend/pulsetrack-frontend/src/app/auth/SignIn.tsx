import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const { signin, user } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Move navigation to useEffect
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signin(form.email, form.password);
      // ✅ Navigation will happen via useEffect above
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center text-primary mb-2">
            Welcome Back
          </h2>

          <p className="text-center mt-1 mb-6 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-secondary font-medium">
              Sign Up
            </Link>
          </p>

          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <Button
            className="w-full mt-6"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
