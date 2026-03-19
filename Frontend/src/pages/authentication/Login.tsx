import AnimatedDot from "@/Components/AnimatedDot";
import HeroHeadline from "@/Components/HeroHeadline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ThemeToggle from "@/Components/ui/themeToggle";
import { BadgeCent, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Card, CardContent} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import PasswordStrength from "./components/passwordStrength";

export default function login() {
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
                  className="pl-9 bg-glass border-gb text-text placeholder:text-muted
                             focus:border-a focus:ring-2 focus:ring-ag
                             transition-all duration-200 font-body"
                />
              </div>
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
                <button className="font-mono text-[9px] tracking-[1px] uppercase text-muted hover:text-a transition-colors">
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
                  className="pl-9 bg-glass border-gb text-text placeholder:text-muted
                             focus:border-a focus:ring-2 focus:ring-ag
                             transition-all duration-200 font-body"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              className="w-full h-12 bg-text text-bg font-body font-bold text-sm
                         hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                         transition-all duration-200 mt-1"
            >
              Sign In →
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
              <button className="flex-1 h-11 flex items-center justify-center gap-2
                                 bg-glass border border-gb rounded-xl
                                 font-body text-sm text-text2
                                 hover:border-a hover:text-text hover:bg-ag
                                 transition-all duration-200">
                🇬 Google
              </button>
              <button className="flex-1 h-11 flex items-center justify-center gap-2
                                 bg-glass border border-gb rounded-xl
                                 font-body text-sm text-text2
                                 hover:border-a hover:text-text hover:bg-ag
                                 transition-all duration-200">
                🍎 Apple
              </button>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-muted leading-relaxed">
              By signing in you agree to our{" "}
              <a href="#" className="text-a hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-a hover:underline">Privacy Policy</a>
            </p>

          </CardContent>
        </Card>
      </TabsContent>

      {/* ── CREATE ACCOUNT ── */}
      <TabsContent value="CreateAccount">
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
                  className="pl-9 bg-glass border-gb text-text placeholder:text-muted
                             focus:border-a focus:ring-2 focus:ring-ag
                             transition-all duration-200 font-body"
                />
              </div>
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
                  className="pl-9 bg-glass border-gb text-text placeholder:text-muted
                             focus:border-a focus:ring-2 focus:ring-ag
                             transition-all duration-200 font-body"
                />
              </div>
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
                  className="pl-9 bg-glass border-gb text-text placeholder:text-muted
                             focus:border-a focus:ring-2 focus:ring-ag
                             transition-all duration-200 font-body"
                />
              </div>

              {/* Password strength bars */}
              <PasswordStrength />
            </div>

            {/* Submit */}
            <Button
              className="w-full h-12 bg-text  font-body  font-bold text-sm
                         hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(79,142,255,0.4)]
                         transition-all duration-200 mt-1"
            >
              Create Account →
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
              <button className="flex-1 h-11 flex items-center justify-center gap-2
                                 bg-glass border border-gb rounded-xl
                                 font-body text-sm text-text2
                                 hover:border-a hover:text-text hover:bg-ag
                                 transition-all duration-200">
                🇬 Google
              </button>
              <button className="flex-1 h-11 flex items-center justify-center gap-2
                                 bg-glass border border-gb rounded-xl
                                 font-body text-sm text-text2
                                 hover:border-a hover:text-text hover:bg-ag
                                 transition-all duration-200">
                🍎 Apple
              </button>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-muted leading-relaxed">
              By creating an account you agree to our{" "}
              <a href="#" className="text-a hover:underline">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-a hover:underline">Privacy Policy</a>
            </p>

          </CardContent>
        </Card>
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
