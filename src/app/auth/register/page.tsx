"use client"
import React from 'react';
import { Header } from '../../components/layout/Header';
import { RegisterForm } from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header title="Create Account" showBack />
      
      <div className="p-4 pt-8">
        <RegisterForm />
      </div>
    </div>
  );
}