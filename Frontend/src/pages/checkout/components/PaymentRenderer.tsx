interface Props {
    method: string
    total: number
}
export default function PaymentRenderer({ method, total }: Props) {
    if (method === "paypal") {
        return <div>paypal Button Here</div>
    }
    if (method === "stripe") {
        return <div>stripe Button Here</div>
    }
    if (method === "cash") {
        return <div>cash Button Here</div>
    }
}