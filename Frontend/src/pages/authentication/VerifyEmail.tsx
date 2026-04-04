import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useVerifyEmailMutation } from "@/slices/usersApiSlice";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";
import Loader from "@/Components/Loader";

const VerifyEmail = () => {
  const { email } = useParams();
  const [verifyEmail, { isLoading, isSuccess, isError }] = useVerifyEmailMutation();

  useEffect(() => {
    if (email) {
      verifyEmail(email);
    }
  }, [email, verifyEmail]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      {isLoading && (
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-400">Verifying your email address...</p>
        </div>
      )}

      {isSuccess && (
        <div className="text-center animate-in fade-in zoom-in duration-300">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Email Verified!</h1>
          <p className="text-gray-400 mb-8">
            Your email has been successfully verified. You can now access all features of TechMart.
          </p>
          <Link to="/login">
            <Button size="lg" className="px-8 capitalize">
              Go to Login
            </Button>
          </Link>
        </div>
      )}

      {isError && (
        <div className="text-center animate-in fade-in zoom-in duration-300">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Verification Failed</h1>
          <p className="text-gray-400 mb-8">
            We couldn't verify your email. The link might be expired or invalid.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button variant="outline" className="capitalize">
                Back to Login
              </Button>
            </Link>
            <Link to="/">
              <Button className="capitalize">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
