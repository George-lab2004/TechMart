import AnimatedDot from "@/Components/AnimatedDot";
import HeroHeadline from "@/Components/HeroHeadline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ThemeToggle from "@/Components/ui/themeToggle";
import { BadgeCent, Shield, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import PasswordStrength from "./components/passwordStrength";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "@/slices/usersApiSlice";
import { setCredentials } from "@/slices/authSlice";
import type { RootState } from "@/store/store";
import { useEffect } from "react";

export default function login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  // React Hook Form for Sign In
  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: { errors: errorsSignIn },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const onSignInSubmit = async (data: any) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || err.error || "Login failed");
    }
  };

  // React Hook Form for Create Account
  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: errorsSignUp },
    watch: watchSignUp,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSignUpSubmit = async (data: any) => {
    try {
      const res = await register(data).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || err.error || "Login failed");
    }
  };

  return (
    <>
      <div className="relative  flex items-center min-h-screen">

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full min-h-screen">
          <section className="flex flex-col mt-7 ms-7  justify-center space-y-6">
            <Link
              to="/"
              className="font-mono text-[15px] md:text-[17px] font-medium tracking-[8px] uppercase text-text flex items-center gap-3"
            >
              <AnimatedDot color="a" size="lg" />
              TECHMART
            </Link>

            <div>
              <HeroHeadline
                line1="Premium"
                line2="Tech"
                line3="Await"
                size="text-6xl md:text-7xl lg:text-8xl"
              />

              <p className="text-body max-w-md">
                Sign in to access exclusive deals, track your orders,
                and experience the future of electronics shopping.
              </p>
            </div>
            <div className="flex text-sm gap-3 w-fit px-3 py-1 rounded-lg border-ag border-2 items-center hover:ms-2 hover:border-blue-800 transition-all">
              <Zap size={20} />
              <div className="flex flex-col">
                <h1 className="font-bold">Lightining Fast Delivery</h1>
                <span className="uppercase text-muted text-xs">48hr to Your Door</span>
              </div>
            </div>
            <div className="flex text-sm gap-3 w-fit px-3 py-1 rounded-lg border-ag border-2 items-center hover:ms-2 hover:border-blue-800 transition-all">
              <Shield size={20} />
              <div className="flex flex-col">
                <h1 className="font-bold">2- year Waaranty</h1>
                <span className="uppercase text-muted text-xs">ON every product</span>
              </div>
            </div>
            <div className="flex text-sm gap-3 w-fit px-3 py-1 rounded-lg border-ag border-2 items-center hover:ms-2 hover:border-blue-800 transition-all">
              <BadgeCent size={20} />
              <div className="flex flex-col">
                <h1 className="font-bold">
                  Member Exclusive Deals
                </h1>
                <span className="uppercase text-muted text-xs">Up to 40% Off</span>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center w-full min-h-screen bg-surf border-l border-gb px-8">
            <div className="w-full max-w-md flex flex-col gap-6">

              {/* Header */}
              <div className="flex flex-col gap-1">
                <p className="font-mono text-[10px] tracking-[3px] uppercase text-muted">
                  // Account
                </p>
                <h2 className="font-display text-4xl tracking-wide">
                  Welcome Back
                </h2>
                <p className="text-text2 text-sm">
                  Sign in to your TechMart account
                </p>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="signIn" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="signIn" className="flex-1 font-mono text-xs tracking-widest uppercase">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="CreateAccount" className="flex-1 font-mono text-xs tracking-widest uppercase">
                    Create Account
                  </TabsTrigger>
                </TabsList>

                {/* ── SIGN IN ── */}
                <TabsContent value="signIn">
                  <form onSubmit={handleSubmitSignIn(onSignInSubmit)}>
                    <Card className="border-gb bg-card backdrop-blur-xl shadow-none mt-4">
                      <CardContent className="flex flex-col gap-5 pt-6">

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="email"
                            className="font-mono text-[9px] tracking-[3px] uppercase text-muted"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
                              ✉️
                            </span>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              {...registerSignIn("email", {
                                required: "Email is required",
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Invalid email address",
                                },
                              })}
                              className={`pl-9 bg-glass border-gb text-text placeholder:text-muted
                                focus:border-a focus:ring-2 focus:ring-ag
                                transition-all duration-200 font-body ${errorsSignIn.email ? "border-red-500" : ""
                                }`}
                            />
                          </div>
                          {errorsSignIn.email && (
                            <p className="text-[10px] text-red-500 uppercase tracking-wider font-mono">
                              {errorsSignIn.email.message}
                            </p>
                          )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="password"
                              className="font-mono text-[9px] tracking-[3px] uppercase text-muted"
                            >
                              Password
                            </Label>
                            <button
                              type="button"
                              className="font-mono text-[9px] tracking-[1px] uppercase text-muted hover:text-a transition-colors"
                            >
                              Forgot password?
                            </button>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
                              🔒
                            </span>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Enter your password"
                              {...registerSignIn("password", {
                                required: "Password is required",
                                minLength: {
                                  value: 6,
                                  message: "Password too short",
                                },
                              })}
                              className={`pl-9 bg-glass border-gb text-text placeholder:text-muted
                                focus:border-a focus:ring-2 focus:ring-ag
                                transition-all duration-200 font-body ${errorsSignIn.password ? "border-red-500" : ""
                                }`}
                            />
                          </div>
                          {errorsSignIn.password && (
                            <p className="text-[10px] text-red-500 uppercase tracking-wider font-mono">
                              {errorsSignIn.password.message}
                            </p>
                          )}
                          <div className="flex justify-end -mt-2">
                            <Link to="/forget-password" className="text-[10px] uppercase tracking-wider font-mono text-muted hover:text-a transition-colors">Forget Password?</Link>
                          </div>
                        </div>

                        {/* Submit */}
                        <Button
                          disabled={isLoginLoading}
                          type="submit"
                          className="w-full h-12 bg-text text-bg font-body font-bold text-sm
                           hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                           transition-all duration-200 mt-1"
                        >
                          {isLoginLoading ? "Signing In..." : "Sign In →"}
                        </Button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-gb" />
                          <span className="font-mono text-[9px] tracking-[2px] uppercase text-muted">
                            or continue with
                          </span>
                          <div className="flex-1 h-px bg-gb" />
                        </div>

                        {/* Social */}
                        <div className="flex gap-3">
                          <button
                            type="button"
                            className="flex-1 h-11 flex items-center justify-center gap-2
                                 bg-glass border border-gb rounded-xl
                                 font-body text-sm text-text2
                                 hover:border-a hover:text-text hover:bg-ag
                                 transition-all duration-200"
                          >
                            🇬 Google
                          </button>
                          <button
                            type="button"
                            className="flex-1 h-11 flex items-center justify-center gap-2
                                 bg-glass border border-gb rounded-xl
                                 font-body text-sm text-text2
                                 hover:border-a hover:text-text hover:bg-ag
                                 transition-all duration-200"
                          >
                            🍎 Apple
                          </button>
                        </div>

                        {/* Terms */}
                        <p className="text-center text-xs text-muted leading-relaxed">
                          By signing in you agree to our{" "}
                          <a href="#" className="text-a hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-a hover:underline">
                            Privacy Policy
                          </a>
                        </p>
                      </CardContent>
                    </Card>
                  </form>
                </TabsContent>

                {/* ── CREATE ACCOUNT ── */}
                <TabsContent value="CreateAccount">
                  <form onSubmit={handleSubmitSignUp(onSignUpSubmit)}>
                    <Card className="border-gb bg-card backdrop-blur-xl shadow-none mt-4">
                      <CardContent className="flex flex-col gap-5 pt-6">
                        {/* Name */}
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="name"
                            className="font-mono text-[9px] tracking-[3px] uppercase text-muted"
                          >
                            Full Name
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
                              👤
                            </span>
                            <Input
                              id="name"
                              type="text"
                              placeholder="Ahmed Mohamed"
                              {...registerSignUp("name", {
                                required: "Full name is required",
                              })}
                              className={`pl-9 bg-glass border-gb text-text placeholder:text-muted
                             focus:border-a focus:ring-2 focus:ring-ag
                             transition-all duration-200 font-body ${errorsSignUp.name ? "border-red-500" : ""
                                }`}
                            />
                          </div>
                          {errorsSignUp.name && (
                            <p className="text-[10px] text-red-500 uppercase tracking-wider font-mono">
                              {errorsSignUp.name.message}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="reg-email"
                            className="font-mono text-[9px] tracking-[3px] uppercase text-muted"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
                              ✉️
                            </span>
                            <Input
                              id="reg-email"
                              type="email"
                              placeholder="you@example.com"
                              {...registerSignUp("email", {
                                required: "Email is required",
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Invalid email address",
                                },
                              })}
                              className={`pl-9 bg-glass border-gb text-text placeholder:text-muted
                             focus:border-a focus:ring-2 focus:ring-ag
                             transition-all duration-200 font-body ${errorsSignUp.email ? "border-red-500" : ""
                                }`}
                            />
                          </div>
                          {errorsSignUp.email && (
                            <p className="text-[10px] text-red-500 uppercase tracking-wider font-mono">
                              {errorsSignUp.email.message}
                            </p>
                          )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="reg-password"
                            className="font-mono text-[9px] tracking-[3px] uppercase text-muted"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
                              🔒
                            </span>
                            <Input
                              id="reg-password"
                              type="password"
                              placeholder="Min. 8 characters"
                              {...registerSignUp("password", {
                                required: "Password is required",
                                minLength: {
                                  value: 8,
                                  message: "Minimum 8 characters",
                                },
                              })}
                              className={`pl-9 bg-glass border-gb text-text placeholder:text-muted
                             focus:border-a focus:ring-2 focus:ring-ag
                             transition-all duration-200 font-body ${errorsSignUp.password ? "border-red-500" : ""
                                }`}
                            />
                          </div>
                          {errorsSignUp.password && (
                            <p className="text-[10px] text-red-500 uppercase tracking-wider font-mono">
                              {errorsSignUp.password.message}
                            </p>
                          )}

                          {/* Password strength bars */}
                          <PasswordStrength
                            value={watchSignUp("password") || ""}
                          />
                        </div>

                        {/* Submit */}
                        <Button
                          disabled={isRegisterLoading}
                          type="submit"
                          className="w-full h-12 bg-text  font-body  font-bold text-sm
                         hover:-translate-y-0.5 hover:shadow-[0_8px_32_rgba(79,142,255,0.4)]
                         transition-all duration-200 mt-1"
                        >
                          {isRegisterLoading ? "Creating Account..." : "Create Account →"}
                        </Button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-gb" />
                          <span className="font-mono text-[9px] tracking-[2px] uppercase text-muted">
                            or sign up with
                          </span>
                          <div className="flex-1 h-px bg-gb" />
                        </div>

                        {/* Social */}
                        <div className="flex gap-3">
                          <button
                            type="button"
                            className="flex-1 h-11 flex items-center justify-center gap-2
                                 bg-glass border border-gb rounded-xl
                                 font-body text-sm text-text2
                                 hover:border-a hover:text-text hover:bg-ag
                                 transition-all duration-200"
                          >
                            🇬 Google
                          </button>
                          <button
                            type="button"
                            className="flex-1 h-11 flex items-center justify-center gap-2
                                 bg-glass border border-gb rounded-xl
                                 font-body text-sm text-text2
                                 hover:border-a hover:text-text hover:bg-ag
                                 transition-all duration-200"
                          >
                            🍎 Apple
                          </button>
                        </div>

                        {/* Terms */}
                        <p className="text-center text-xs text-muted leading-relaxed">
                          By creating an account you agree to our{" "}
                          <a href="#" className="text-a hover:underline">
                            Terms
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-a hover:underline">
                            Privacy Policy
                          </a>
                        </p>
                      </CardContent>
                    </Card>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Back to store */}
              <Link
                to="/"
                className="text-center font-mono text-[10px] tracking-[2px] uppercase
                 text-muted hover:text-a transition-colors duration-200"
              >
                ← Back to Store
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
