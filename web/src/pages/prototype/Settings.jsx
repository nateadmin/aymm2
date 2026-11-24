import { Navigate, useLocation } from 'react-router-dom';

/** Single settings surface — live `/Profile/settings` (approved nav plan A5). */
export default function PrototypeSettingsRedirect() {
  const location = useLocation();
  return <Navigate to={`/Profile/settings${location.search}`} replace />;
}