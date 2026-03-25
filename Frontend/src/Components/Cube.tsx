import React, { useEffect, useMemo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface CubeProps {
    name?: string;
    email?: string;
    addressTitle?: string;
}

// Optimization: Using constants for common speeds
const SPIN_SPEED = 30;
const FLOAT_SPEED = 5;
const FLIP_CYCLE = 50;

const Cube = React.memo(({ name, email, addressTitle }: CubeProps) => {
    const rotateY = useMotionValue(0);
    const rotateX = useMotionValue(0);

    // High-performance animation loop (GPU direct)
    useEffect(() => {
        const controlsY = animate(rotateY, [0, 360], { duration: SPIN_SPEED, repeat: Infinity, ease: "linear" });
        const controlsX = animate(rotateX, [0, 0, 90, 90, 0, 0, -90, -90, 0], { 
            duration: FLIP_CYCLE, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.4, 0.45, 0.5, 0.55, 0.9, 0.95, 0.98, 1] 
        });
        return () => { controlsY.stop(); controlsX.stop(); };
    }, [rotateY, rotateX]);

    const initials = useMemo(() => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'TM', [name]);

    const faceData = useMemo(() => [
        { title: "INIT",   value: initials, largeText: true, ry: 0, rx: 0 },
        { title: "SLOGAN", value: "Future of Shopping", smallText: true, ry: 180, rx: 0 },
        { title: "EMAIL",  value: email || 'No Email', smallText: true, ry: 90, rx: 0 },
        { title: "NAME",   value: name || 'Guest', ry: -90, rx: 0 },
        { title: "BRAND",  value: "TechMart", ry: 0, rx: 90 }, // Top
        { title: "HOME",   value: addressTitle || 'No Address', ry: 0, rx: -90 }, // Bottom
    ], [initials, name, email, addressTitle]);

    return (
        <div className='flex items-center justify-center perspective-[1200px] py-16 lg:py-24 pointer-events-none'>
            <motion.div 
                className='relative h-40 w-40 sm:h-48 sm:w-48 transform-3d will-change-transform'
                style={{ rotateY, rotateX }}
                animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                transition={{
                    y: { duration: FLOAT_SPEED, repeat: Infinity, ease: "easeInOut" },
                    x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                }}
            >
                {/* Simplified Space Glow: One single layer, no blurs on the cube itself */}
                <div className="absolute inset-0 bg-a/5 blur-[80px] rounded-full transform-[translateZ(-120px)] opacity-40" />
                
                {faceData.map((face, i) => (
                    <Face key={i} face={face} rotateY={rotateY} rotateX={rotateX} />
                ))}
            </motion.div>
        </div >
    )
});

// Optimized Face component: Red-hot performance by minimizing calculations
const Face = ({ face, rotateY, rotateX }: { face: any, rotateY: any, rotateX: any }) => {
    // Proximity logic: Detects when this specific face is viewing the user
    const weight = useTransform([rotateY, rotateX], ([y, x]: any) => {
        const ny = ((y % 360) + 360) % 360;
        const ty = ((face.ry % 360) + 360) % 360;
        const dy = Math.min(Math.abs(ny - ty), 360 - Math.abs(ny - ty));
        const dx = Math.abs(x - face.rx);
        return Math.max(0, 1 - Math.sqrt(dy * dy + dx * dx) / 45);
    });

    // Theme-aware styles (using single transform per property for max efficiency)
    const bg = useTransform(weight, [0, 1], ["rgba(255,255,255,0.05)", "rgba(59,130,246,0.15)"]);
    const border = useTransform(weight, [0, 1], ["rgba(0,0,0,0.1)", "rgba(59,130,246,0.5)"]);
    
    // Light mode text logic (Dark color by default, vibrant blue when active)
    const textColor = useTransform(weight, [0, 1], ["rgba(15,23,42,0.7)", "rgba(59,130,246,1)"]); 
    // Dark mode text logic (via CSS variables or just a smart default that handles both)
    
    return (
        <motion.div
            style={{ 
                transform: `rotateX(${face.rx}deg) rotateY(${face.ry}deg) translateZ(100px)`,
                backgroundColor: bg,
                borderColor: border,
            }}
            // PERFORMANCE: Removed backdrop-blur here as it's the #1 lag source
            className={`absolute inset-0 flex flex-col items-center justify-center border bg-white/95 dark:bg-black/40 text-center p-4 sm:p-6 rounded-[2.5rem] will-change-transform shadow-md dark:shadow-2xl transition-all duration-300`}
        >
            <div className="flex flex-col items-center w-full">
                <motion.span 
                    style={{ opacity: useTransform(weight, [0, 1], [0.5, 0.9]) }}
                    className='text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-a dark:text-blue-400 mb-1'
                >
                    {face.title}
                </motion.span>
                
                <motion.span 
                    className={`font-display uppercase tracking-widest w-full break-all px-1 line-clamp-2 leading-tight
                        ${face.largeText ? 'text-4xl sm:text-5xl font-black' : face.smallText ? 'text-[10px] sm:text-[11px]' : 'text-sm sm:text-base font-bold'}
                    `}
                    style={{ 
                        color: textColor,
                        backgroundImage: useTransform(weight, [0, 1], [
                            "linear-gradient(135deg, currentColor, currentColor)", 
                            "linear-gradient(135deg, #3b82f6, #9333ea)"
                        ]),
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: useTransform(weight, [0, 1], ["inherit", "transparent"]),
                    }}
                >
                    {face.value}
                </motion.span>
            </div>
        </motion.div>
    );
};

Cube.displayName = 'Cube';
export default Cube;