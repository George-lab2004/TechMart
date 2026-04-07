import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Ghost } from "lucide-react";
import GridBackground from "@/Components/GridBackground";
import { Button } from "@/Components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg p-6">
      <GridBackground />

      {/* ── Background Glow ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-a/10 blur-[120px] rounded-full pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        
        {/* Animated Ghost Icon */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-3xl bg-surf border border-gb shadow-2xl flex items-center justify-center">
            <Ghost size={48} className="text-a2" />
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-display text-[12rem] leading-none tracking-tighter text-text/10 select-none"
        >
          404
        </motion.h1>

        {/* Error Message */}
        <div className="-mt-16 mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-text mb-4"
          >
            Lost in the <span className="text-a">Tech Void?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-text2 text-lg max-w-md mx-auto"
          >
            The page you're looking for has been discontinued, recycled, or never existed in this dimension.
          </motion.p>
        </div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/">
            <Button className="bg-a text-white px-8 h-12 rounded-xl flex items-center gap-2 shadow-[0_4px_20px_var(--ag)] hover:shadow-[0_8px_32px_var(--ag)] transition-all">
              <Home size={18} />
              Return Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-gb bg-surf/50 backdrop-blur-sm text-text px-8 h-12 rounded-xl flex items-center gap-2 hover:bg-surf transition-all"
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>
        </motion.div>

        {/* Terminal Decoration */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
          className="mt-16 font-mono text-[10px] text-muted space-y-1"
        >
          <p>ERROR_CODE: PAGE_NOT_FOUND_404</p>
          <p>LOCATION: {window.location.pathname}</p>
          <p>STATUS: DISCONNECTED_FROM_SERVER</p>
        </motion.div>
      </div>

      {/* ── Background Decoration ── */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-a animate-pulse" />
        <div className="absolute bottom-20 right-20 w-3 h-3 rounded-full bg-a2 animate-pulse delay-700" />
        <div className="absolute top-1/3 right-10 w-2 h-2 rounded-full bg-a3 animate-pulse delay-300" />
      </div>
    </div>
  );
}
