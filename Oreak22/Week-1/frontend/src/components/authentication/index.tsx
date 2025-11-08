import axios from "axios";
import { useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";

const Auth: FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = new URLSearchParams({
    path: window.location.pathname,
  }).toString();
  useEffect(() => {
    const token = localStorage.getItem("brave_token");
    if (!token) {
      navigate(`/auth/login/${location}`);
    } else {
      try {
        if (!token) {
          localStorage.removeItem("brave_token");
          navigate(`/auth/login/${location}`);
        }
        axios
          .get("http://localhost:3001/api/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.status !== 200) {
              localStorage.removeItem("brave_token");
              localStorage.removeItem("braveCart");
              localStorage.removeItem("brave_user");
              navigate(`/auth/login/${location}`);
            }
          })
          .catch(() => {
            // localStorage.removeItem("brave_token");
            localStorage.removeItem("brave_token");
            localStorage.removeItem("braveCart");
            localStorage.removeItem("brave_user");
            navigate(`/auth/login/${location}`);
          });
      } catch (error) {
        // localStorage.removeItem("brave_token");
        localStorage.removeItem("brave_token");
        localStorage.removeItem("braveCart");
        localStorage.removeItem("brave_user");
        navigate(`/auth/login/${location}`);
      }
    }
  }, []);

  return <>{children}</>;
};

export default Auth;
