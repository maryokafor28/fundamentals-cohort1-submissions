import { Project } from "./ProjectsPage";
import { FaRegComment } from "react-icons/fa6";

const user = {
  name: "nuel",
  stack: "Full-stack developer",
  location: "Kaduna, NG",
  email: "nuel@gmail.com",
};

const project = {
  id: 1,
  title: "Real-time Collaborative Code Editor",
  description:
    "A browser-based code editor with real-time collaboration features, syntax",
  author: "Sarah Chen",
  techStack: ["React", "Node.js", "Socket.io", "TypeScript"],
  likes: ["12", "3", "4"],
};

function ProjectPage() {
  return (
    <div className="flex flex-col items-center bg-[#0f172a] h-screen">
      <div className="text-slate-400 bg-[#162033] w-md§§ p-12 flex flex-col  items-center rounded-2xl  border-[#38bdf8] mt-24">
        <div className="flex items-center gap-4">
          <p className="text-4xl font-bold text-slate-100 bg-[#38bdf8] w-fit py-6 px-8 rounded-full">
            {user.name.slice(0, 1).toUpperCase()}
          </p>
          <div>
            <h2 className=" text-slate-100">{user.name.toUpperCase()}</h2>
            <p>{user.stack}</p>
          </div>
        </div>
      </div>

      <Project project={project} />

      <div className="border bg-[#162033] border-[#656f80] ">
        <div className="flex gap-2 justify-center itmes-center text-slate-100">
          <FaRegComment />
          <p>Comments (2)</p>
        </div>
        <div>
          <textarea
            rows={5}
            cols={32}
            name="comment"
            id="comment"
            placeholder="Tell us more about your project, the technologies used, challenges faced, etc."
            className="border border-slate-400 rounded-lg p-1 "
          ></textarea>

          <button className="bg-[#38bdf8] w-3/4 rounded-lg py-2 text-slate-800">
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
