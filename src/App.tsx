import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { username, fullname, signout } = useAuth();

  return (
    <div>
      <div>Hello {fullname}!</div>
      <div>You are logged in as {username}</div>
      <button onClick={signout}>logout</button>
    </div>
  );
}
