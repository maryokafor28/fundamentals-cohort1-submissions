import { useNavigate } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import { CiGlobe } from "react-icons/ci";
import { IoHammerOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";

function LandingPage() {
  return (
    <div>
      <HeroSection />
      <About />
      <Community />
      <Join />
    </div>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="section-layout bg-[#12243a]">
      <p className="w-fit text-center mx-auto text-xs rounded-xl px-4 py-1 bg-[#152e47] text-[#38bdf8] border border-[#38bdf8]">
        Join 10,000+ developers building together
      </p>
      <h2 className="section-title">Build. Share. Collaborate.</h2>
      <p className="section-description">
        DevConnect is a lightweight platform where developers share ideas,
        explore projects, and collaborate on code.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => navigate("/register")}
          className="bg-[#38bdf8] rounded-lg px-4 py-2 text-slate-900 font-medium hover:bg-[#0ea5e9] transition"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate("/projects")}
          className="border border-[#38bdf8] text-slate-100 rounded-lg px-4 py-2 hover:bg-[#1e293b] transition"
        >
          Explore Projects
        </button>
      </div>

      <div>
        <img
          src="/landing2.jpg"
          alt="Developers collaborating"
          className="w-full max-h-[400px] object-cover rounded-xl mt-8"
        />
      </div>
    </div>
  );
}

function About() {
  return (
    <div>
      <div className="section-layout bg-[#161f32]">
        <h2 className="section-title">Everything you need to collaborate</h2>
        <p className="section-description">
          Built for developers, by developers. Simple, powerful, and free to
          use.
        </p>

        <div className="flex flex-col md:flex-row gap-4 max-w-6xl">
          <div className="about-card">
            <FiMessageSquare className="text-[#38bdf8] bg-[#1d334a] text-4xl p-1.5 rounded-md" />
            <h3 className="font-bold text-slate-100">Share Ideas</h3>
            <p className="text-slate-400">
              Post and discuss new projects with a passionate community of
              developers.
            </p>
          </div>

          <div className="about-card">
            <FiUsers className="text-[#38bdf8] bg-[#1d334a] text-4xl p-1.5 rounded-md" />
            <h3 className="font-bold text-slate-100">Collaborate</h3>
            <p className="text-slate-400">
              Find like-minded developers and work together on exciting
              projects.
            </p>
          </div>

          <div className="about-card">
            <IoHammerOutline className="text-[#38bdf8] bg-[#1d334a] text-4xl p-1.5 rounded-md" />
            <h3 className="font-bold text-slate-100">Build</h3>
            <p className="text-slate-400">
              Turn ideas into real code with support and feedback from the
              community.
            </p>
          </div>

          <div className="about-card">
            <CiGlobe className="text-[#38bdf8] bg-[#1d334a] text-4xl p-1.5 rounded-md" />
            <h3 className="font-bold text-slate-100">Connect</h3>
            <p className="text-slate-400">
              Grow your developer network and learn from others' experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Community() {
  return (
    <div className="bg-[#12243a] py-16">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
        <div className="space-y-6">
          <p className="bg-[#171e3e] border border-[#5559d1] text-[#5559d1] w-fit px-4 rounded-2xl">
            Community
          </p>
          <h2 className="section-title text-left">
            Join a growing community of builders and creators
          </h2>
          <p className="text-slate-400">
            Discover innovative projects, get feedback on your ideas, and
            connect with developers who share your passion for building.
          </p>

          <div className="flex gap-6">
            <div className="flex flex-col gap-6">
              <div className="community-card">
                <h2 className="text-4xl text-[#38bdf8]">10k+</h2>
                <p className="text-slate-400">Developers</p>
              </div>

              <div className="community-card">
                <h2 className="text-4xl text-[#38bdf8]">50k+</h2>
                <p className="text-slate-400">Comments</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="community-card">
                <h2 className="text-4xl text-[#6366f1]">5k+</h2>
                <p className="text-slate-400">Projects</p>
              </div>
              <div className="community-card">
                <h2 className="text-4xl text-[#6366f1]">100+</h2>
                <p className="text-slate-400">Countries</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <img
            src="/landing1.jpg"
            alt="Screenshot of a codebase"
            className="w-full h-[500px] object-cover rounded-2xl border border-[#49566e]"
          />
        </div>
      </div>
    </div>
  );
}

function Join() {
  const navigate = useNavigate();

  return (
    <div className="section-layout bg-[#161f32]">
      <h2 className="section-title">Join DevConnect Today</h2>
      <p className="section-description max-w-6xl">
        Start sharing your projects, collaborate with other developers, and
        bring your ideas to life.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-[#38bdf8] rounded-lg px-4 py-2 text-slate-900 font-medium hover:bg-[#0ea5e9] transition"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate("/register")}
          className="border border-[#38bdf8] text-slate-100 rounded-lg px-4 py-2 hover:bg-[#1e293b] transition"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
