"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import type { UserProfile } from "@/types";
import { useRouter } from "next/navigation";
import { UserAPI } from "@/api/user";

interface UserProfileProps {
  user: UserProfile;
  editable?: boolean;
}

export default function UserProfile({
  user,
  editable = false,
}: UserProfileProps) {
  const [form, setForm] = useState<UserProfile>(user);
  const [isEditing, setIsEditing] = useState(false); // ✅ Always start in view mode
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const updatedUser = await UserAPI.updateProfile(form);
      setForm(updatedUser);
      console.log("✅ Profile updated:", updatedUser);
    } catch (err) {
      console.error("❌ Update failed:", err);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setForm(user); // ✅ Reset form to original data
    setIsEditing(false);
  };

  // ✅ Fields are readonly if: not editable OR not currently editing
  const isReadOnly = !editable || !isEditing;

  return (
    <div>
      <Button
        variant={"link"}
        className="cursor-pointer text-2xl mb-5"
        onClick={() => router.push("/projects")}
      >
        ← Back
      </Button>

      <div className="min-h-screen text-white px-6 py-12 flex justify-center items-center">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20 shadow-2xl space-y-8">
          {/* Header */}
          <div className="text-center border-b border-white/10 pb-6">
            <h2 className="text-3xl font-bold mb-2">{form.fullName}</h2>
            <p className="text-gray-300 text-sm">
              {form.techStack || "Add your specialization"}
            </p>
            <div className="flex justify-center gap-4 mt-3">
              {form.github && (
                <a
                  href={form.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition"
                >
                  <ExternalLink size={22} />
                </a>
              )}
              {form.linkedin && (
                <a
                  href={form.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition"
                >
                  <ExternalLink size={22} />
                </a>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="bg-transparent border border-gray-500 text-white placeholder-gray-400 mt-4"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={form.email}
                readOnly
                className="bg-transparent border border-gray-500 text-white mt-4"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="techStack">Tech Stack</Label>
              <Input
                id="techStack"
                name="techStack"
                placeholder="Frontend, Backend..."
                value={form.techStack || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="bg-transparent border border-gray-500 text-white placeholder-gray-400 mt-4"
              />
            </div>

            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                name="github"
                placeholder="https://github.com/username"
                value={form.github || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="bg-transparent border border-gray-500 text-white placeholder-gray-400 mt-4"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={form.linkedin || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="bg-transparent border border-gray-500 text-white placeholder-gray-400 mt-4"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                value={form.bio || ""}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="w-full rounded-lg bg-transparent border border-gray-500 text-white p-3 resize-none h-28 placeholder-gray-400 mt-4"
              />
            </div>
          </div>

          {/* Buttons - Only show if profile is editable */}
          {editable && (
            <div className="pt-4 flex justify-center gap-6">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-blue-700 hover:bg-blue-800 px-8 py-2"
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 px-8 py-2"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-700 hover:bg-blue-800 px-10 py-2"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
