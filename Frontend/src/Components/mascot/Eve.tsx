import { useEffect, useRef } from "react";

type Mode = "idle" | "email" | "password";

interface EveBotProps {
    mode: Mode;
    className?: string;
}

export default function EveBot({ mode, className }: EveBotProps) {
    const botRef = useRef<SVGSVGElement | null>(null);

    // Eye tracking
    useEffect(() => {
        const bot = botRef.current;
        if (!bot) return;

        const eyes = bot.querySelectorAll<SVGGElement>(".eye-left, .eye-right");

        const handleMouseMove = (e: MouseEvent) => {
            if (mode === "password") return; // Eyes are hidden anyway

            const rect = bot.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const distance = Math.min(
                5,
                Math.hypot(e.clientX - centerX, e.clientY - centerY) / 40
            );

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            eyes.forEach((eye) => {
                const baseCx = parseFloat(eye.getAttribute("data-cx") || "0");
                const baseCy = parseFloat(eye.getAttribute("data-cy") || "0");
                const ellipses = eye.querySelectorAll<SVGEllipseElement>("ellipse");

                if (ellipses.length < 2) return;

                // Move both parts of each eye
                ellipses[0].setAttribute("cx", String(baseCx + x));
                ellipses[0].setAttribute("cy", String(baseCy + y));

                ellipses[1].setAttribute("cx", String(baseCx + x));
                ellipses[1].setAttribute("cy", String(baseCy + y - 3));
            });
        };

        const handleWindowMouseMove = (e: MouseEvent) => handleMouseMove(e);
        window.addEventListener("mousemove", handleWindowMouseMove);
        return () => window.removeEventListener("mousemove", handleWindowMouseMove);
    }, [mode]);

    // Mode reactions
    useEffect(() => {
        const bot = botRef.current;
        if (!bot) return;

        bot.classList.remove("email-mode", "password-mode", "excited");

        if (mode === "email") bot.classList.add("email-mode");
        if (mode === "password") bot.classList.add("password-mode");
    }, [mode]);

    // Blinking
    useEffect(() => {
        const bot = botRef.current;
        if (!bot) return;

        const eyes = bot.querySelectorAll<SVGGElement>(".eye-left, .eye-right");
        let blinkTimeout: ReturnType<typeof setTimeout>;
        let unmounted = false;

        const blink = () => {
            if (unmounted) return;
            
            eyes.forEach((eye) => {
                const ellipses = eye.querySelectorAll<SVGEllipseElement>("ellipse");
                if (ellipses.length < 2) return;
                ellipses[0].setAttribute("ry", "0.5"); // Close main eye
            });

            setTimeout(() => {
                if (unmounted) return;
                
                eyes.forEach((eye) => {
                    const ellipses = eye.querySelectorAll<SVGEllipseElement>("ellipse");
                    if (ellipses.length < 2) return;
                    ellipses[0].setAttribute("ry", "12"); // Open main eye
                });

                // Schedule next blink
                blinkTimeout = setTimeout(blink, 3000 + Math.random() * 3000);
            }, 200); // blink duration
        };

        blinkTimeout = setTimeout(blink, 3000 + Math.random() * 3000);

        return () => {
            unmounted = true;
            clearTimeout(blinkTimeout);
        };
    }, []);

    // Excited reaction on click
    const handleClick = () => {
        const bot = botRef.current;
        if (!bot) return;

        bot.classList.add("excited");
        setTimeout(() => bot.classList.remove("excited"), 1000);
    };

    // Amazed reaction on theme toggle (dark mode)
    useEffect(() => {
        const bot = botRef.current;
        if (!bot) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    bot.classList.add("amazed");
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        bot.classList.remove("amazed");
                    }, 1500); // Wait for the whole "wow" animation to finish
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"], // Only listen to theme (dark mode) class changes
        });

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div
            className={`eve-bot-wrapper relative z-50 overflow-visible flex items-center justify-center pointer-events-none ${className || ""} ${mode}`}
            onClick={handleClick}
        >
            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-16px); }
                }
                @keyframes excited {
                    0%, 100% { transform: scale(1) translateY(0); }
                    25% { transform: scale(1.1) translateY(-15px) rotate(5deg); }
                    50% { transform: scale(1.1) translateY(-15px) rotate(-5deg); }
                    75% { transform: scale(1.1) translateY(-15px) rotate(5deg); }
                }
                @keyframes amazedBounce {
                    0%, 100% { transform: scale(1) translateY(0); }
                    20% { transform: scale(1.05) translateY(-30px); }
                    40% { transform: scale(1) translateY(-10px); }
                    60% { transform: scale(1.05) translateY(-20px); }
                    80% { transform: scale(1) translateY(-10px); }
                }
                .eve-bot-wrapper {
                    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .bot-float-wrapper {
                    animation: float 5s ease-in-out infinite;
                }
                .excited .bot-float-wrapper {
                    animation: excited 0.5s ease-in-out 2;
                }
                .amazed .bot-float-wrapper {
                    animation: amazedBounce 1.5s ease-in-out forwards;
                }
                
                /* Mode specific styles */
                @keyframes passwordFloat {
                    0%, 100% { transform: translateY(-6px); }
                    50% { transform: translateY(-16px); }
                }
                .password-mode .bot-float-wrapper {
                    animation: passwordFloat 6s ease-in-out infinite;
                }
                .password-mode .eye-wrapper {
                   opacity: 0;
                   transform: scaleY(0); /* Hide eyes */
                }

                /* Amazed / Theme Toggle Mode: Wow! */
                .amazed .eye-left, .amazed .eye-right {
                    transform: scaleY(1.4) scaleX(1.4); /* Huge eyes! */
                }
                .amazed .left-arm {
                    transform: translateY(12px) rotate(80deg); /* Lowered and cheerful */
                }
                .amazed .right-arm {
                    transform: translateY(12px) rotate(-80deg); /* Lowered and cheerful */
                }
                
                /* Email/Name Mode: Curious & Cute */
                /* Moving the entire HTML wrapper down cleanly */
                .eve-bot-wrapper.email {
                    transform: translateY(40px) scale(1.05); /* Strong downward movement */
                }
                
                .email-mode .left-arm {
                    transform: rotate(10deg);
                }
                .email-mode .right-arm {
                    transform: rotate(-10deg);
                }
                
                /* 
                 * Move the eyes down as a single group to prevent the white circle
                 * from displacing or getting detached from the blue background!
                 */
                .email-mode #eyes {
                    transform: translateY(5px);
                }
                
                @keyframes curiousRead {
                    0%, 100% { transform: rotate(-3deg) translateX(-4px); }
                    50% { transform: rotate(3deg) translateX(4px); }
                }
                .email-mode #head {
                    animation: curiousRead 3s infinite ease-in-out;
                }
                
                .bot-group, #head, #eyes {
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transform-origin: center;
                    transform-box: fill-box;
                }
                .left-arm, .right-arm, .eye-wrapper, .eye-left, .eye-right {
                    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transform-box: fill-box; /* CRITICAL: Fixes SVG rotation/scale centers */
                }
                .left-arm {
                    transform-origin: top right;
                }
                .right-arm {
                    transform-origin: top left;
                }
                .eye-wrapper, .eye-left, .eye-right {
                    transform-origin: center;
                }
                `}
            </style>
            <svg
                ref={botRef}
                className="pointer-events-auto overflow-visible"
                width="200"
                height="240"
                viewBox="0 0 300 400"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <radialGradient id="bodyGrad" cx="40%" cy="15%" r="90%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="50%" stopColor="#f5f5f5" />
                        <stop offset="100%" stopColor="#d0d0d0" />
                    </radialGradient>

                    <radialGradient id="headGrad" cx="35%" cy="25%" r="80%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="60%" stopColor="#f0f0f0" />
                        <stop offset="100%" stopColor="#d5d5d5" />
                    </radialGradient>

                    <radialGradient id="screenGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#2a2a3a" />
                        <stop offset="100%" stopColor="#1a1a2a" />
                    </radialGradient>

                    <radialGradient id="eyeGrad" cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#5ecfff" />
                        <stop offset="100%" stopColor="#0099ff" />
                    </radialGradient>

                    <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f5f5f5" />
                        <stop offset="100%" stopColor="#c0c0c0" />
                    </linearGradient>

                    <filter id="softShadow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
                        <feOffset dx="0" dy="4" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.2" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Shadow */}
                <ellipse
                    className="shadow-ellipse"
                    cx="150"
                    cy="370"
                    rx="25"
                    ry="6"
                    fill="#000"
                    opacity="0.15"
                />

                <g className="bot-float-wrapper">
                <g className="bot-group">
                    {/* Left Arm */}
                    <g className="left-arm">
                        <path
                            d="M105 135 Q70 160, 60 210 Q55 240, 65 260 Q75 270, 85 255 Q95 230, 100 190 Q108 160, 115 140 Z"
                            fill="url(#armGrad)"
                        />
                        <ellipse cx="70" cy="265" rx="12" ry="10" fill="#e0e0e0" />
                    </g>

                    {/* Right Arm */}
                    <g className="right-arm">
                        <path
                            d="M195 135 Q230 160, 240 210 Q245 240, 235 260 Q225 270, 215 255 Q205 230, 200 190 Q192 160, 185 140 Z"
                            fill="url(#armGrad)"
                        />
                        <ellipse cx="230" cy="265" rx="12" ry="10" fill="#e0e0e0" />
                    </g>

                    {/* Body */}
                    <path
                        d="M120 130 C105 130, 95 150, 95 190 C95 240, 110 285, 150 290 C190 285, 205 240, 205 190 C205 150, 195 130, 180 130 Z"
                        fill="url(#bodyGrad)"
                    />
                    <ellipse cx="130" cy="160" rx="20" ry="35" fill="#fff" opacity="0.5" />
                    <rect x="140" y="118" width="20" height="14" rx="7" fill="#e8e8e8" />

                    {/* Head */}
                    <g id="head">
                        <ellipse cx="150" cy="85" rx="62" ry="52" fill="url(#headGrad)" />
                        <ellipse cx="128" cy="68" rx="25" ry="18" fill="#fff" opacity="0.7" />
                        <ellipse cx="150" cy="88" rx="42" ry="30" fill="url(#screenGrad)" />

                        {/* Eyes */}
                        <g id="eyes">
                            <g className="eye-wrapper">
                                <g className="eye-left" data-cx="138" data-cy="88">
                                    <ellipse
                                        cx="138"
                                        cy="88"
                                        rx="9"
                                        ry="12"
                                        fill="url(#eyeGrad)"
                                        filter="url(#glow)"
                                    />
                                    <ellipse cx="138" cy="85" rx="3" ry="4" fill="#fff" opacity="0.9" />
                                </g>
                            </g>
                            <g className="eye-wrapper">
                                <g className="eye-right" data-cx="162" data-cy="88">
                                    <ellipse
                                        cx="162"
                                        cy="88"
                                        rx="9"
                                        ry="12"
                                        fill="url(#eyeGrad)"
                                        filter="url(#glow)"
                                    />
                                    <ellipse cx="162" cy="85" rx="3" ry="4" fill="#fff" opacity="0.9" />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
            </svg>
        </div>
    );
}