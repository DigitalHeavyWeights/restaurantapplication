import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="manager-app">
        {children}
      </div>
    </ProtectedRoute>
  );
}