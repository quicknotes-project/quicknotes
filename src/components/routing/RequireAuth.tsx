import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { StrictNestable } from '../../types';
import { renderIf } from '../../utils';

export default function RequireAuth({ children }: StrictNestable) {
  const { username, tryFetch } = useAuth();

  const location = useLocation();

  const [loaded, setLoaded] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setAuthed(false);
    if (username !== null) {
      setLoaded(true);
      setAuthed(true);
      return;
    }
    tryFetch().then((res) => {
      setLoaded(true);
      setAuthed(res.success);
    });
  }, [username, tryFetch]);

  return renderIf(
    !loaded,
    <div />,
    renderIf(
      authed,
      children,
      <Navigate to="/auth" state={{ from: location }} replace />
    )
  );
}
