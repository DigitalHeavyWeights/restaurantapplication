import React from 'react';
import { Header } from '../../components/layout/Header';
import { LoginForm } from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header title="Sign In" showBack />
      
      <div className="p-4 pt-8">
        <LoginForm />
      </div>
    </div>
  );
}