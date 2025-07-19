
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRegistrationProgress } from "@/hooks/use-registration-progress";
import RegistrationForm, { registerSchema } from "@/components/auth/RegistrationForm";
import PhoneVerificationForm, { phoneVerificationSchema } from "@/components/auth/PhoneVerificationForm";
import { z } from "zod";

const Register = () => {
  const { register: registerUser, verifyPhone, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { progress, updateProgress, resetProgress } = useRegistrationProgress();

  // Redirect if already fully authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    const success = await registerUser(values.username, values.email, values.password);
    setIsLoading(false);
    
    if (success) {
      updateProgress({ isRegistered: true });
    }
  };

  const handleSendVerificationCode = () => {
    updateProgress({
      isCodeSent: true
    });
  };

  const handleVerificationSubmit = async (values: z.infer<typeof phoneVerificationSchema>) => {
    setIsLoading(true);
    const success = await verifyPhone(values.phone, values.code);
    setIsLoading(false);
    
    if (success) {
      // Clear registration progress after successful completion
      resetProgress();
      navigate("/", { replace: true });
    }
  };

  const handleChangePhone = () => {
    updateProgress({ isCodeSent: false });
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className={`${isMobile ? 'w-full' : 'w-[450px]'} space-y-6`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {progress.isRegistered ? "Επιβεβαίωση τηλεφώνου" : "Δημιουργία λογαριασμού"}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {progress.isRegistered 
              ? "Επιβεβαιώστε το τηλέφωνό σας για να συνεχίσετε" 
              : "Συμπληρώστε τα στοιχεία σας για να δημιουργήσετε λογαριασμό"}
          </p>
        </div>

        {progress.isRegistered ? (
          <PhoneVerificationForm
            onSubmit={handleVerificationSubmit}
            isLoading={isLoading}
            phoneNumber={progress.phoneNumber}
            isCodeSent={progress.isCodeSent}
            onSendCode={handleSendVerificationCode}
            onChangePhone={handleChangePhone}
          />
        ) : (
          <RegistrationForm 
            onSubmit={handleRegisterSubmit}
            isLoading={isLoading}
          />
        )}

        <div className="text-center text-sm">
          {!progress.isRegistered && (
            <p>
              Έχετε ήδη λογαριασμό;{" "}
              <Link
                to="/login"
                className="font-medium text-strays-orange hover:underline"
              >
                Σύνδεση
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
