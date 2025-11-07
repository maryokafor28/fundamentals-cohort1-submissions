import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { BASE_URL } from "../api/api";

function NewProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/projects/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          techStack: techStack.split(",").map((t) => t.trim()),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      navigate("/projects");
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
      else console.error("Unknown error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0f172a] text-slate-100">
      <button
        onClick={() => navigate(-1)}
        className=" ml-10 mb-4 text-slate-50  hover:bg-violet-400  px-3 py-1 rounded-lg"
      >
        ← Back
      </button>

      <div className="bg-[#1b2537] flex flex-col items-center p-8 rounded-2xl border border-[#49566e] gap-8 text-center w-[90%] md:w-[30%]">
        <div className="bg-[#38bdf8] p-1 rounded-lg text-slate-800 w-fit">
          &lt;/&gt;
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <h2 className="text-xl font-semibold">Create New Project</h2>
            <p>Share your project with the DevConnect community</p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="title" className="text-left">
              Project Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="My Awesome Project"
              className="border border-slate-400 rounded-sm p-2 "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-left">
              Description
            </label>
            <textarea
              rows={8}
              id="description"
              placeholder="Tell us more about your project..."
              className="border border-slate-400 rounded-sm p-2 "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label htmlFor="techStack" className="text-left">
              Tech Stack
            </label>
            <input
              type="text"
              id="techStack"
              placeholder="react, typescript, tailwind"
              className="border border-slate-400 rounded-sm p-2"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
            />
            <p className="text-left text-sm text-slate-400">
              Add tags to help others discover your project
            </p>
          </div>

          {error && <p className="text-red-400">{error}</p>}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#38bdf8] w-3/4 rounded-lg py-2 text-slate-800 font-semibold hover:bg-[#0ea5e9] transition-colors disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Project"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="text-slate-100 bg-slate-900 py-2 border border-[#264b5b] rounded-lg w-1/4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewProject;
