import { useEffect, useState } from "react";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

export interface ProjectType {
  _id?: string;
  title: string;
  description: string;
  author:
     {
        _id: string;
        name: string;
        email: string;
        techStack: string[];
      }
    | string;
  techStack: string[];
  likes: string[];
}

interface ProjectProps {
  project: ProjectType;
}

function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://devconnect-backend-delta.vercel.app/api/projects"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="flex flex-col  min-h-screen bg-[#0f172a]">
      <div className="text-slate-200 max-w-[1200px] mx-auto my-12 text-center space-y-2">
        <h2 className="text-2xl font-bold">Explore Projects</h2>
        <p>Discover amazing projects from developers around the world</p>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-slate-400">No projects found.</p>
      ) : (
        <ul className="flex flex-col flex-wrap justify-center md:flex-row gap-8  max-w-[1200px] mx-auto ">
          {projects.map((project) => (
            <Project key={project._id} project={project} />
          ))}
        </ul>
      )}
    </div>
  );
}

export function Project({ project }: ProjectProps) {
  const { token, user } = useAuth();
  const [likes, setLikes] = useState<string[]>(project.likes || []);
  const [likesCount, setLikesCount] = useState(project.likes?.length || 0);
  const [loading, setLoading] = useState(false);

  const isLiked = likes.includes(user?.id || "");

  const handleLike = async () => {
    if (!token) {
      alert("You must be logged in to like a project");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://devconnect-backend-delta.vercel.app/api/projects/${project._id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to toggle like");

      setLikesCount(data.likesCount);

      setLikes((prevLikes) =>
        isLiked
          ? prevLikes.filter((id) => id !== user?.id)
          : [...prevLikes, user?.id as string]
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  const authorName =
    typeof project.author === "object" ? project.author.name : project.author;

  return (
    <li className="border w-md bg-[#162033] border-[#656f80] rounded-xl px-6 py-3 text-slate-100 space-y-6">
      <h3 className="font-bold text-lg">{project.title}</h3>
      <p className="text-slate-400">{project.description}</p>

      <ul className="flex gap-2 flex-wrap">
        {project.techStack.map((stack, index) => (
          <li key={index} className="bg-[#334155] px-2 py-1 rounded-lg text-sm">
            {stack}
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center">
        <p className="italic text-slate-400">{authorName}</p>

        <div className="flex gap-6 items-center">
          <button
            disabled={loading}
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-[#38bdf8] transition"
          >
            {isLiked ? (
              <IoIosHeart className="text-[#f43f5e]" />
            ) : (
              <IoIosHeartEmpty />
            )}
            <p>{likesCount}</p> {/* ✅ Display backend-synced count */}
          </button>

          <div className="flex items-center gap-1">
            <FaRegComment />
            <p>0</p>
          </div>
        </div>
      </div>
    </li>
  );
}


export default ProjectsPage;
