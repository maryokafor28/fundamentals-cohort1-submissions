import { useAuth } from "../context/AuthContextObject";

function Header() {
  const { user } = useAuth();
  return (
    <nav className="flex justify-around py-4 border-b border-slate-400">
      <h1>TaskFlow</h1>
      {user && (
        <div className="flex gap-4">
          <p>{user.email.split("@")[0]}</p>
          <p
            className={`${
              user.role === "admin" ? "bg-red-500" : "bg-blue-500"
            } text-slate-50 rounded-lg px-2 text-sm capitalize`}
          >
            {user.role}
          </p>
        </div>
      )}
    </nav>
  );
}

export default Header;
