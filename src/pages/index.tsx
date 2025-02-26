import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { EmailAuthForm } from '@/components/auth/EmailAuthForm';

export default function Home() {
  const { user, error: authError, signInWithEmail, signInWithGoogle, registerWithEmail, logout, clearError } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleEmailAuth = async (values: { email: string; password: string }, { resetForm }: { resetForm: () => void }) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setLocalError('');
      clearError();

      let success;
      if (isRegistering) {
        success = await registerWithEmail(values.email, values.password);
      } else {
        success = await signInWithEmail(values.email, values.password);
      }

      if (success) {
        resetForm();
      }
    } catch (_error: unknown) {
      setLocalError('An unexpected error occurred');
      console.error('Email auth error:', _error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setLocalError('');
      clearError();
      await signInWithGoogle();
    } catch (_error: unknown) {
      setLocalError('An unexpected error occurred');
      console.error('Google sign in error:', _error);
    } finally {
      setIsLoading(false);
    }
  };

  const error = localError || authError;

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center p-4">
      <main className="w-full max-w-[400px] bg-white rounded-2xl shadow-sm p-8">

        {error && (
          <ErrorMessage 
            error={error} 
            onDismiss={() => {
              setLocalError('');
              clearError();
            }} 
          />
        )}

        {user ? (
          <div className="flex flex-col gap-4">
            <p className="text-center text-black">Welcome, {user.email}</p>
            <button
              onClick={logout}
              className="w-full bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <EmailAuthForm 
              isLoading={isLoading}
              isRegistering={isRegistering}
              onSubmit={handleEmailAuth}
            />

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with Google</span>
              </div>
            </div>

            <GoogleSignInButton 
              onClick={handleGoogleSignIn}
              isLoading={isLoading}
            />
          </>
        )}
      </main>
    </div>
  );
}
