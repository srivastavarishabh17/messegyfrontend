"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { CreditCard, Link, Copy } from "lucide-react"

export default function WAPayIntegrationPage(){

const { project_key } = useParams()

const [status,setStatus] = useState(null)
const [payments,setPayments] = useState([])

const [key,setKey] = useState("")
const [secret,setSecret] = useState("")

const [amount,setAmount] = useState("")
const [name,setName] = useState("")
const [phone,setPhone] = useState("")

/* STATUS */

const fetchStatus = async () => {

try{

const res = await api.get("/api/wa-pay/status")
setStatus(res.data.data)

}catch(e){
console.log(e)
}

}

/* PAYMENTS */

const fetchPayments = async () => {

try{

const res = await api.get("/api/wa-pay/payments")
setPayments(res.data.data.data || [])

}catch(e){
console.log(e)
}

}

useEffect(()=>{
fetchStatus()
fetchPayments()
},[])

/* CONNECT */

const connect = async () => {

try{

await api.post("/api/wa-pay/connect",{
razorpay_key:key,
razorpay_secret:secret
})

toast.success("Razorpay Connected")

fetchStatus()

}catch(e){

toast.error("Connection failed")

}

}

/* CREATE PAYMENT */

const createPayment = async () => {

try{

const res = await api.post("/api/wa-pay/payment",{
amount,
name,
phone
})

toast.success("Payment Link Created")

setAmount("")
setName("")
setPhone("")

fetchPayments()

window.open(res.data.data.short_url)

}catch(e){

toast.error("Payment failed")

}

}

/* COPY LINK */

const copyLink = (url) => {

navigator.clipboard.writeText(url)
toast.success("Link copied")

}

return (

<div className="max-w-full mx-auto space-y-8">

{/* HEADER */}

<div className="bg-[#0F5132] text-white rounded-xl p-6 flex items-center justify-between">

<div>

<h1 className="text-2xl font-semibold">
WhatsApp Pay
</h1>

<p className="text-sm text-white/80">
Accept payments directly from WhatsApp chats
</p>

</div>

<CreditCard className="h-10 w-10 opacity-80"/>

</div>

{/* STATUS */}

<div className="border rounded-xl p-6 bg-white flex items-center justify-between">

<div>

<h3 className="font-semibold">
Razorpay Integration
</h3>

<p className="text-sm text-gray-500">

{status?.status === "connected"
? "Your payment gateway is connected"
: "Connect Razorpay to start receiving payments"}

</p>

</div>

<span
className={`px-3 py-1 rounded text-sm ${
status?.status === "connected"
? "bg-green-100 text-green-700"
: "bg-gray-100 text-gray-600"
}`}
>

{status?.status === "connected"
? "Connected"
: "Not Connected"}

</span>

</div>

{/* CONNECT FORM */}

{status?.status !== "connected" && (

<div className="border rounded-xl p-6 bg-white space-y-5">

<h2 className="font-semibold text-lg">
Connect Razorpay
</h2>

<div className="grid md:grid-cols-2 gap-4">

<input
placeholder="Razorpay Key"
className="border rounded-md p-3 text-sm"
value={key}
onChange={(e)=>setKey(e.target.value)}
/>

<input
placeholder="Razorpay Secret"
className="border rounded-md p-3 text-sm"
value={secret}
onChange={(e)=>setSecret(e.target.value)}
/>

</div>

<button
onClick={connect}
className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm"
>

Connect Gateway

</button>

</div>

)}

{/* CREATE PAYMENT */}

{status?.status === "connected" && (

<div className="border rounded-xl p-6 bg-white space-y-5">

<div className="flex items-center gap-2">

<Link className="h-5 w-5"/>

<h2 className="font-semibold text-lg">
Create Payment Link
</h2>

</div>

<div className="grid md:grid-cols-3 gap-4">

<input
placeholder="Customer Name"
className="border rounded-md p-3 text-sm"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Phone"
className="border rounded-md p-3 text-sm"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<input
placeholder="Amount ₹"
className="border rounded-md p-3 text-sm"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>

</div>

<button
onClick={createPayment}
className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm"
>

Generate Payment Link

</button>

</div>

)}

{/* PAYMENT HISTORY */}

{status?.status === "connected" && (

<div className="border rounded-xl bg-white">

<div className="p-6 border-b font-semibold">
Payment Links
</div>

<table className="w-full text-sm">

<thead className="bg-gray-50 text-left">

<tr>

<th className="p-3">Customer</th>
<th className="p-3">Phone</th>
<th className="p-3">Amount</th>
<th className="p-3">Status</th>
<th className="p-3">Link</th>

</tr>

</thead>

<tbody>

{payments.map((p)=>(
<tr key={p.id} className="border-t">

<td className="p-3">
{p.customer_name}
</td>

<td className="p-3">
{p.contact_phone}
</td>

<td className="p-3">
₹{p.amount}
</td>

<td className="p-3">

<span className="bg-gray-100 px-2 py-1 rounded text-xs">
{p.status}
</span>

</td>

<td className="p-3 flex gap-3">

<button
onClick={()=>window.open(p.payment_url)}
className="text-blue-600 text-xs"
>
Open
</button>

<button
onClick={()=>copyLink(p.payment_url)}
className="text-gray-600"
>
<Copy size={14}/>
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

)}

</div>

)

}