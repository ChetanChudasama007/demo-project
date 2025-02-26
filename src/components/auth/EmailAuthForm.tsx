import { Formik, Form, Field } from 'formik';
import clsx from 'clsx';
import { loginValidationSchema } from '@/validations/auth';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface EmailAuthFormProps {
  isLoading: boolean;
  isRegistering: boolean;
  onSubmit: (values: { email: string; password: string }, { resetForm }: { resetForm: () => void }) => Promise<void>;
}

export function EmailAuthForm({ isLoading, isRegistering, onSubmit }: EmailAuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginValidationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isValid, dirty }) => (
        <Form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                disabled={isLoading}
                className={clsx(
                  'w-full pl-10 pr-4 py-3 border rounded-lg text-black',
                  'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.email && touched.email 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                )}
              />
            </div>
            {errors.email && touched.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                disabled={isLoading}
                className={clsx(
                  'w-full pl-10 pr-12 py-3 border rounded-lg text-black',
                  'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.password && touched.password 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid || !dirty}
            className="w-full bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : (isRegistering ? 'Register' : 'Sign In')}
          </button>
        </Form>
      )}
    </Formik>
  );
} 