interface Props {
    label: string
    placeholder?: string
    icon?: React.ReactNode
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputField({
    label,
    placeholder,
    icon,
    value,
    onChange,
}: Props) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--muted)] uppercase tracking-widest">
                {label}
            </label>

            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
                    {icon}
                </div>

                <input
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-[var(--glass)] border border-[var(--gb)] focus:border-[var(--a)] outline-none"
                />
            </div>
        </div>
    )
}