import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['Customer']}>
      <div className="customer-app">
        {children}
      </div>
    </ProtectedRoute>
  );
}