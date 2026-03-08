"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import Script from "next/script"

export default function PlansPage() {

const { project_key } = useParams()

const [plans,setPlans] = useState([])
const [enterprise,setEnterprise] = useState(null)
const [currentPlan,setCurrentPlan] = useState(null)

const [loading,setLoading] = useState(true)
const [processing,setProcessing] = useState(false)

/* ---------------- FETCH PLANS ---------------- */

async function fetchPlans(){

const res = await api.get("/api/plans")

setPlans(res.data.plans || [])
setEnterprise(res.data.enterprise || null)

}

/* ---------------- FETCH CURRENT PLAN ---------------- */

async function fetchMyPlan(){

try{


const res = await api.get("/api/billing/my-plan")

setCurrentPlan(res.data.plan)


}catch{


console.log("Unable to load current plan")


}

}

/* ---------------- INITIAL LOAD ---------------- */

useEffect(()=>{

async function init(){


try{

  await Promise.all([
    fetchPlans(),
    fetchMyPlan()
  ])

}catch{

  toast.error("Failed to load plans")

}finally{

  setLoading(false)

}


}

init()

},[])

/* ---------------- CHECKOUT ---------------- */

async function startCheckout(plan){

if(processing || currentPlan === plan.name) return

try{

setProcessing(true)

const res = await api.post("/api/billing/order",{
  plan_id:plan.id,
  project_id:project_key
})

const order = res.data

if(!window.Razorpay){
  toast.error("Payment gateway not loaded")
  return
}

const options = {

  key:process.env.NEXT_PUBLIC_RAZORPAY_KEY,
  amount:order.amount,
  currency:"INR",
  name:"Messegy",
  description:plan.name,
  order_id:order.order_id,

  handler:async function (response){

    try{

      await api.post("/api/billing/verify",{
        razorpay_payment_id:response.razorpay_payment_id,
        razorpay_order_id:response.razorpay_order_id,
        razorpay_signature:response.razorpay_signature,
        plan_id:plan.id,
        project_id:project_key
      })

      toast.success("Subscription Activated")

      setCurrentPlan(plan.name)

    }catch{

      toast.error("Payment verification failed")

    }

  }

}

const rzp = new window.Razorpay(options)
rzp.open()


}catch{


toast.error("Checkout failed")


}finally{


setProcessing(false)


}

}

/* ---------------- LOADING ---------------- */

if(loading){

return( <div className="flex justify-center py-24"> <Loader2 className="animate-spin h-6 w-6"/> </div>
)

}

/* ---------------- UI ---------------- */

return (

<div className="max-w-5xl mx-auto px-6 py-10">

<h1 className="text-3xl font-semibold mb-10">
Plans & Pricing
</h1>

<div className="space-y-6">

{plans.map(plan=>{

const isCurrent = currentPlan === plan.name

return(

<div
key={plan.id}
className={`border rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6
${isCurrent ? "border-green-600 bg-green-50" : "bg-white"}
`}
>

{/* PLAN INFO */}

<div>

<h2 className="text-xl font-semibold mb-1">

{plan.name}

{isCurrent && ( <span className="ml-3 text-xs bg-green-600 text-white px-2 py-1 rounded">
Current </span>
)}

</h2>

<p className="text-3xl font-bold">
₹{plan.price}
</p>

</div>

{/* FEATURES */}

<ul className="text-sm space-y-1">

{(plan.features || []).map((f,i)=>(

<li key={i}>✓ {f}</li>
))}

</ul>

{/* BUTTON */}

<div>

<button
disabled={processing || isCurrent}
onClick={()=>startCheckout(plan)}
className={`px-6 py-2 rounded-md text-white
${isCurrent ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
`}

>

{isCurrent ? "Current Plan" : processing ? "Processing..." : "Choose Plan"}

</button>

</div>

</div>

)

})}

{/* ENTERPRISE */}

{enterprise && (

<div className="border rounded-xl p-8 bg-white">

<div className="grid md:grid-cols-2 gap-8">

<div>

<h2 className="text-2xl font-semibold mb-2">
{enterprise.name}
</h2>

<p className="text-4xl font-bold mb-6">
Custom Pricing
</p>

<p className="text-sm text-gray-500 mb-6">
Built for high scale teams needing unlimited access,
advanced automation and dedicated support.
</p>

<button
className="bg-black text-white px-6 py-3 rounded-md"
onClick={()=> window.location.href="mailto:sales@messegy.com"}

>

Contact Sales </button>

</div>

<ul className="text-sm space-y-2">

{(enterprise.features || []).map((f,i)=>(

<li key={i}>✓ {f}</li>
))}

</ul>

</div>

</div>

)}

</div>

<Script
src="https://checkout.razorpay.com/v1/checkout.js"
strategy="afterInteractive"
/>

</div>

)

}
