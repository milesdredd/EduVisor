"use client";

import { useState } from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export default function AuthPage() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-57px)] items-center justify-center">
      <div className="w-full max-w-md">
        <AuthForm type={showSignIn ? 'signin' : 'signup'} onToggle={() => setShowSignIn(!showSignIn)} />
      </div>
    </div>
  );
}
