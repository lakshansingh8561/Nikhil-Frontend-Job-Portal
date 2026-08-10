import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

interface SocialLoginProps {
  label?: string;
  onSuccess: (credential: string) => void;
  isLoading?: boolean;
}

const SocialLogin: React.FC<SocialLoginProps> = ({
  onSuccess,
  isLoading = false,
}) => {
  return (
    <div className="w-full flex justify-center my-1">
      <div className={`w-full ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              onSuccess(credentialResponse.credential);
            } else {
              toast.error("No Google token received.");
            }
          }}
          onError={() => {
            toast.error("Google Authentication Failed.");
          }}
          useOneTap={false}
          theme="outline"
          shape="rectangular"
          size="large"
          width="350"
        />
      </div>
    </div>
  );
};

export default SocialLogin;