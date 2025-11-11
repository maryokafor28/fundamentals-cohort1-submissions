import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, CalendarDays, Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { HomeOption } from "@/lib/types";

const options: HomeOption[] = [
  { id: "user", label: "User", icon: <User size={28} />, path: "/users" },
  {
    id: "doctor",
    label: "Doctor",
    icon: <Stethoscope size={28} />,
    path: "/doctors",
  },
  {
    id: "appointment",
    label: "Appointment",
    icon: <CalendarDays size={28} />,
    path: "/appointments",
  },
  {
    id: "activity",
    label: "Activity",
    icon: <Activity size={28} />,
    path: "/activities",
  },
];

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleContinue = () => {
    const chosen = options.find((opt) => opt.id === selected);
    if (chosen) {
      // ✅ Check if user is logged in before navigating to protected routes
      if (!user) {
        navigate("/login");
      } else {
        navigate(chosen.path);
      }
    }
  };

  // ✅ Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // ✅ Allow access to home page regardless of auth status
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-background text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-primary">
          Welcome to PulseTrack
        </h1>
        <p className="text-muted-foreground mb-10">
          Monitor your health, track your progress, and stay connected.
        </p>

        {/* ✅ Show auth status */}
        {user && (
          <p className="text-sm text-muted-foreground mb-4">
            Logged in as: <span className="font-semibold">{user.name}</span> (
            {user.role === "user" ? "Patient" : "Doctor"})
          </p>
        )}
      </motion.div>

      {/* Animated cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl mb-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {options.map((opt) => (
          <motion.div
            key={opt.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Card
              onClick={() => setSelected(opt.id)}
              className={`cursor-pointer transition-all duration-300 border-2 ${
                selected === opt.id
                  ? "border-primary bg-primary/5 shadow-lg scale-[1.03]"
                  : "border-border hover:border-muted"
              }`}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-primary"
                >
                  {opt.icon}
                </motion.div>
                <span className="font-semibold text-lg">{opt.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          disabled={!selected}
          variant={"default"}
          onClick={handleContinue}
          className="px-10 py-2 text-base"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
