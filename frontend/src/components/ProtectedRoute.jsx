import { Navigate, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { hasActiveSession } from '../auth/sessionController';

export default function ProtectedRoute({ children }) {
=======
import { getUserSession, hasActiveSession } from '../auth/sessionController';

export default function ProtectedRoute({ children, allowedRoles }) {
>>>>>>> c10e7d5074fee957e11486f5f75b3bb8cdb2b414
  const location = useLocation();

  if (!hasActiveSession()) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

<<<<<<< HEAD
=======
  if (allowedRoles) {
    const session = getUserSession();
    if (!session || !allowedRoles.includes(session.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

>>>>>>> c10e7d5074fee957e11486f5f75b3bb8cdb2b414
  return children;
}
