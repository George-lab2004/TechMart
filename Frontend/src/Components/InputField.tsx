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
    const id = label.toLowerCase().replace(/\s+/g, '-') + "-input";

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-xs text-muted uppercase tracking-widest">
                {label}
            </label>

            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
                    {icon}
                </div>

                <input
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-glass border border-gb focus:border-a outline-none"
                />
            </div>
        </div>
    )
}