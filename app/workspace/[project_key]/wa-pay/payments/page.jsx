"use client"

import { useEffect,useState } from "react"
import { api } from "@/lib/api"
import { DollarSign, CreditCard, AlertCircle } from "lucide-react"

export default function PaymentsDashboard(){

const [overview,setOverview]=useState({})
const [customers,setCustomers]=useState([])

const fetchData=async()=>{

const res1=await api.get("/api/wa-pay/analytics/overview")
const res2=await api.get("/api/wa-pay/analytics/customers")

setOverview(res1.data.data)
setCustomers(res2.data.data)

}

useEffect(()=>{
fetchData()
},[])

return(

<div className="space-y-8">

<h1 className="text-2xl font-semibold">
Payments Dashboard
</h1>

{/* METRIC CARDS */}

<div className="grid md:grid-cols-4 gap-6">

<div className="border rounded-xl p-6 bg-white">
<div className="flex items-center gap-3">
<DollarSign className="h-6 w-6 text-green-600"/>
<div>
<p className="text-sm text-gray-500">Revenue</p>
<p className="text-xl font-semibold">
₹{overview.revenue || 0}
</p>
</div>
</div>
</div>

<div className="border rounded-xl p-6 bg-white">
<div className="flex items-center gap-3">
<CreditCard className="h-6 w-6 text-blue-600"/>
<div>
<p className="text-sm text-gray-500">Payments</p>
<p className="text-xl font-semibold">
{overview.payments || 0}
</p>
</div>
</div>
</div>

<div className="border rounded-xl p-6 bg-white">
<div className="flex items-center gap-3">
<AlertCircle className="h-6 w-6 text-yellow-600"/>
<div>
<p className="text-sm text-gray-500">Pending</p>
<p className="text-xl font-semibold">
{overview.pending || 0}
</p>
</div>
</div>
</div>

<div className="border rounded-xl p-6 bg-white">
<div className="flex items-center gap-3">
<AlertCircle className="h-6 w-6 text-red-600"/>
<div>
<p className="text-sm text-gray-500">Failed</p>
<p className="text-xl font-semibold">
{overview.failed || 0}
</p>
</div>
</div>
</div>

</div>

{/* TOP CUSTOMERS */}

<div className="border rounded-xl bg-white">

<div className="p-6 border-b font-semibold">
Top Customers
</div>

<table className="w-full text-sm">

<thead className="bg-gray-50">

<tr>
<th className="p-3 text-left">Customer</th>
<th className="p-3 text-left">Phone</th>
<th className="p-3 text-left">Total Paid</th>
</tr>

</thead>

<tbody>

{customers.map(c=>(
<tr key={c.contact_phone} className="border-t">

<td className="p-3">
{c.customer_name}
</td>

<td className="p-3">
{c.contact_phone}
</td>

<td className="p-3 font-medium">
₹{c.total}
</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

)

}