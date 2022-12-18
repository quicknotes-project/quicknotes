import { useAppState } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { renderIf } from "../../utils";
import "./Header.css";

export default function Header() {
  const { appState } = useAppState();
  const { username, fullname, logout } = useAuth();

  return (
    <header>
      <div className="header-content">
        <div className="header-left">
          <h3 className="logo" onClick={() => window.location.reload()}>
            Quicknotes
          </h3>
          <span className="app-state">{appState}</span>
        </div>
        <div className="header-right">
          {renderIf(
            !!username,
            <>
              <span>logged in as {fullname}</span>
              <button className="button" onClick={logout}>
                logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
