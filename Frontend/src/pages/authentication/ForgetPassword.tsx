import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForgetPasswordMutation, useVerifyOTPMutation, useResetPasswordMutation } from "@/slices/authApiSlice";
import AnimatedDot from "@/Components/AnimatedDot";
import HeroHeadline from "@/Components/HeroHeadline";
import ThemeToggle from "@/Components/ui/themeToggle";
import PasswordStrength from "./components/passwordStrength";

type Step = "EMAIL" | "OTP" | "RESET";

export default function ForgetPassword() {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const [forgetPassword, { isLoading: isForgetLoading }] = useForgetPasswordMutation();
  const [verifyOTP, { isLoading: isVerifyLoading }] = useVerifyOTPMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

  // Step 1: Send OTP
  const { register: regEmail, handleSubmit: handleEmail, formState: { errors: errorsEmail } } = useForm({
    defaultValues: { email: "" }
  });

  const onEmailSubmit = async (data: { email: string }) => {
    console.log("Submit Forget Password Email:", data.email);
    try {
      await forgetPassword(data).unwrap();
      setEmail(data.email);
      setStep("OTP");
      toast.success("OTP sent to your email!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  // Step 2: Verify OTP
  const { register: regOtp, handleSubmit: handleOtp, formState: { errors: errorsOtp } } = useForm({
    defaultValues: { otp: "" }
  });

  const onOtpSubmit = async (data: { otp: string }) => {
    try {
      await verifyOTP({ email, otp: data.otp }).unwrap();
      setOtp(data.otp);
      setStep("RESET");
      toast.success("OTP verified!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  // Step 3: Reset Password
  const { register: regReset, handleSubmit: handleReset, formState: { errors: errorsReset }, watch } = useForm({
    defaultValues: { password: "", confirmPassword: "" }
  });

  const onResetSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      await resetPassword({ email, otp, newPassword: data.password }).unwrap();
      toast.success("Password reset successfully! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="relative flex items-center min-h-screen">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full min-h-screen">
        <section className="flex flex-col mt-7 ms-7 justify-center space-y-6">
          <Link to="/" className="font-mono text-[15px] md:text-[17px] font-medium tracking-[8px] uppercase text-text flex items-center gap-3">
            <AnimatedDot color="a" size="lg" />
            TECHMART
          </Link>
          <div>
            <HeroHeadline line1="Reset" line2="Your" line3="Key" size="text-6xl md:text-7xl lg:text-8xl" />
            <p className="text-body max-w-md">Recover your access to the most premium tech store. We'll help you get back in no time.</p>
          </div>
        </section>

        <section className="flex items-center justify-center w-full min-h-screen bg-surf border-l border-gb px-8">
          <div className="w-full max-w-md flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="font-mono text-[10px] tracking-[3px] uppercase text-muted">// Security</p>
              <h2 className="font-display text-4xl tracking-wide">
                {step === "EMAIL" && "Forget Password?"}
                {step === "OTP" && "Verify OTP"}
                {step === "RESET" && "New Password"}
              </h2>
              <p className="text-text2 text-sm">
                {step === "EMAIL" && "Enter your email to receive a reset code."}
                {step === "OTP" && `We sent a code to ${email}`}
                {step === "RESET" && "Create a strong and secure password."}
              </p>
            </div>

            <Card className="border-gb bg-card backdrop-blur-xl shadow-none">
              <CardContent className="pt-6">

                {/* ── STEP 1: EMAIL ── */}
                {step === "EMAIL" && (
                  <form onSubmit={handleEmail(onEmailSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="font-mono text-[9px] tracking-[3px] uppercase text-muted">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...regEmail("email", { required: "Email is required" })}
                        className={`bg-glass border-gb text-text placeholder:text-muted ${errorsEmail.email ? "border-red-500" : ""}`}
                      />
                      {errorsEmail.email && <p className="text-[10px] text-red-500 font-mono uppercase">{errorsEmail.email.message}</p>}
                    </div>
                    <Button disabled={isForgetLoading} type="submit" className="w-full h-12 bg-text text-bg font-bold">
                      {isForgetLoading ? "Sending Code..." : "Send OTP →"}
                    </Button>
                  </form>
                )}

                {/* ── STEP 2: OTP ── */}
                {step === "OTP" && (
                  <form onSubmit={handleOtp(onOtpSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="otp" className="font-mono text-[9px] tracking-[3px] uppercase text-muted">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 4-digit code"
                        maxLength={4}
                        {...regOtp("otp", { required: "OTP is required" })}
                        className={`bg-glass border-gb text-text text-center tracking-[10px] text-xl ${errorsOtp.otp ? "border-red-500" : ""}`}
                      />
                      {errorsOtp.otp && <p className="text-[10px] text-red-500 font-mono uppercase">{errorsOtp.otp.message}</p>}
                    </div>
                    <Button disabled={isVerifyLoading} type="submit" className="w-full h-12 bg-text text-bg font-bold">
                      {isVerifyLoading ? "Verifying..." : "Verify OTP →"}
                    </Button>
                    <button type="button" onClick={() => setStep("EMAIL")} className="text-xs text-muted hover:text-text mx-auto font-mono">Resend Code?</button>
                  </form>
                )}

                {/* ── STEP 3: RESET ── */}
                {step === "RESET" && (
                  <form onSubmit={handleReset(onResetSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="pass" className="font-mono text-[9px] tracking-[3px] uppercase text-muted">New Password</Label>
                      <Input
                        id="pass"
                        type="password"
                        placeholder="Min. 8 characters"
                        {...regReset("password", { required: "Password is required", minLength: 8 })}
                        className={`bg-glass border-gb text-text ${errorsReset.password ? "border-red-500" : ""}`}
                      />
                      <PasswordStrength value={watch("password")} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="confirm" className="font-mono text-[9px] tracking-[3px] uppercase text-muted">Confirm Password</Label>
                      <Input
                        id="confirm"
                        type="password"
                        placeholder="Repeat password"
                        {...regReset("confirmPassword", { required: "Please confirm your password" })}
                        className={`bg-glass border-gb text-text ${errorsReset.confirmPassword ? "border-red-500" : ""}`}
                      />
                    </div>
                    <Button disabled={isResetLoading} type="submit" className="w-full h-12 bg-text text-bg font-bold">
                      {isResetLoading ? "Resetting..." : "Reset Password →"}
                    </Button>
                  </form>
                )}

              </CardContent>
            </Card>
            <Link to="/login" className="text-center font-mono text-[10px] tracking-[2px] uppercase text-muted hover:text-a">← Back to Login</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
