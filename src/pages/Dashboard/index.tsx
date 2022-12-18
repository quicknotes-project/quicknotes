import { useAuth } from "../../contexts/AuthContext";
import Form from "../../components/ui/Form";
import "./Dashboard.css";

export default function Dashboard() {
  const { username, fullname, tryUpdateUser } = useAuth();

  return (
    <main className="dashboard">
      <h1>
        {fullname} ({username})
      </h1>
    </main>
  );
}
