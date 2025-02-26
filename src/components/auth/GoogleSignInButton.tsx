import { GoogleLogo } from "@/components/common/GoogleLogo";

interface GoogleSignInButtonProps {
    onClick: () => void;
    isLoading: boolean;
  }
  
  export function GoogleSignInButton({ onClick, isLoading }: GoogleSignInButtonProps) {
    return (
      <button
        onClick={onClick}
        disabled={isLoading}
        className="w-full h-[40px] mb-6 flex items-center justify-center border border-gray-300 rounded-[4px] hover:bg-gray-50 transition-colors"
        style={{ boxShadow: '0 1px 1px rgba(0,0,0,0.16)' }}
      >
        <div className="flex items-center justify-center w-5 mr-2">
          <GoogleLogo />
        </div>
        <span className="text-[14px] font-medium text-[#3c4043]">
          Sign in with Google
        </span>
      </button>
    );
  } 