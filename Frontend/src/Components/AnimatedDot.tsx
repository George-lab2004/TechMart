interface AnimatedDotProps {
  color?: string   // Tailwind color token e.g. "a", "a2", "a3" — defaults to "a"
  size?: 'sm' | 'md' | 'lg'
}

export default function AnimatedDot({ color = 'a', size = 'md' }: AnimatedDotProps) {
  const sizeClass = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2 md:w-2.25 md:h-2.25',
    lg: 'w-3 h-3',
  }[size]

  return (
    <span
      className={`${sizeClass} rounded-full bg-${color} shadow-[0_0_10px_var(--${color})] animate-pip`}
    />
  )
}
