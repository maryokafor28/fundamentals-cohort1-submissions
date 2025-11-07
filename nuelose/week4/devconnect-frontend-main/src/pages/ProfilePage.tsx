import { useEffect, useState } from "react";
import { CiLocationOn, CiMail } from "react-icons/ci";
import { Project, type ProjectType } from "./ProjectsPage";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

interface UserType {
  _id: string;
  name: string;
  email: string;
  techStack: string[];
  createdAt?: string;
  updatedAt?: string;
}

function ProfilePage() {
  const { user, token } = useAuth();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user?.id) return; 
      try {
        setLoading(true);
        const res = await axios.get<ProjectType[]>(
          `https://devconnect-backend-delta.vercel.app/api/projects/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const projectsData = res.data;
        setProjects(projectsData);

        const firstAuthor = projectsData[0]?.author;

        if (
          firstAuthor &&
          typeof firstAuthor === "object" &&
          "_id" in firstAuthor
        ) {
          setUserData(firstAuthor as UserType);
        } else {
          const userRes = await axios.get<UserType>(
            `https://devconnect-backend-delta.vercel.app/api/users/${user.id}`
          );
          setUserData(userRes.data);
        }

        setError(null);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, [user?.id, token]);

  if (!user)
    return (
      <div className="text-center text-slate-400 mt-32">
        Please log in to view your profile.
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen text-center text-slate-300 mt-32 bg-[#0f172a]">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen text-center text-red-500 mt-32">{error}</div>
    );

  if (!userData)
    return (
      <div className="min-h-screen text-center text-slate-400 mt-32">
        No user data found.
      </div>
    );

  return (
    <div className="flex flex-col items-center bg-[#0f172a] min-h-screen">
      <div className="text-slate-400 bg-[#162033] w-md p-12 flex flex-col items-center rounded-2xl border border-[#38bdf8] mt-24">
        <p className="text-4xl font-bold text-slate-100 bg-[#38bdf8] w-fit py-6 px-8 rounded-full">
          {userData.name?.slice(0, 1).toUpperCase()}
        </p>
        <h2 className="my-5 text-slate-100">{userData.name?.toUpperCase()}</h2>
        {userData.techStack?.length > 0 && (
          <p>{userData.techStack.join(", ")}</p>
        )}
        <div className="flex items-center gap-2">
          <CiLocationOn />
          <p>Kaduna, NG</p>
        </div>
        <div className="flex items-center gap-2">
          <CiMail />
          <p>{userData.email}</p>
        </div>
      </div>

      <ul className="flex flex-col md:flex-row gap-5 mt-8">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Project key={project._id} project={project} />
          ))
        ) : (
          <p className="text-slate-400">No projects yet.</p>
        )}
      </ul>
    </div>
  );
}

export default ProfilePage;
