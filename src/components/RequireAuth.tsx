import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StrictNestable } from '../types';

export default function RequireAuth({ children }: StrictNestable) {
  const { username } = useAuth();
  const location = useLocation();

  if (username === null) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
