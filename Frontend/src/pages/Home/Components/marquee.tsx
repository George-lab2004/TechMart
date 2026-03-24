import { motion } from 'framer-motion'

const Marquee = () => {
    const items = [
        "Free Shipping $99+",
        "2 Year Warranty",
        "Premium Tech",
        "Next Day Delivery",
        "Member Exclusive Deals",
        "Secure Payments",
        "24/7 Support",
        "Official Retailer"
    ]

    return (
        <div className="overflow-hidden border-y border-white/5 bg-white/50 dark:bg-[#0d0d1f]/50 backdrop-blur-sm py-4">
            <motion.div
                className='flex gap-16 w-max'
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    duration: 30,
                    ease: "linear"
                }}
            >
                {/* Double the items for seamless loop */}
                {[...items, ...items].map((text, i) => (
                    <div key={i} className="flex items-center gap-4  text-[10px] tracking-[4px] uppercase whitespace-nowrap text-text2/80 font-mono" >
                        <div className='w-1.5 h-1.5 rounded-full bg-a shadow-[0_0_8px_rgba(0,210,244,0.5)]' />
                        {text}
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

export default Marquee;