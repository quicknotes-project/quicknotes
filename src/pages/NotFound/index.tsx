import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./NotFound.css";

export default function NotFound() {
  const { username } = useAuth();
  const navigate = useNavigate();

  const authed = username !== null;

  return (
    <main className="not-found-page">
      <h1>404</h1>
      <div>
        <h2>Not Found</h2>
        <div>
          <span>
            Go to{" "}
            <span
              className="link"
              onClick={() => navigate(authed ? "/" : "/auth")}
            >
              {authed ? "homepage" : "/auth"}
            </span>
          </span>
        </div>
      </div>
    </main>
  );
}
