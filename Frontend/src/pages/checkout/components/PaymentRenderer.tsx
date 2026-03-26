interface Props {
    method: string
}
export default function PaymentRenderer({ method }: Props) {
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