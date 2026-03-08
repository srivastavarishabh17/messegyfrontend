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
  const [loading,setLoading] = useState(true)
  const [processing,setProcessing] = useState(false)

  /* ---------------- FETCH PLANS ---------------- */

  const fetchPlans = async () => {
    try{

      const res = await api.get("/api/plans")

      setPlans(res.data.plans || [])
      setEnterprise(res.data.enterprise || null)

    }catch(err){

      toast.error("Failed to load plans")

    }finally{

      setLoading(false)

    }
  }

  useEffect(()=>{
    fetchPlans()
  },[])


  /* ---------------- CHECKOUT ---------------- */

  async function startCheckout(plan){

    if(processing) return

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
        amount:order.amount * 100,
        currency:"INR",
        name:"Messegy",
        description:plan.name,
        order_id:order.order_id,

        handler:async function (response){

          try{

            await api.post("/api/billing/verify",{
              razorpay_payment_id:response.razorpay_payment_id,
              razorpay_order_id:response.razorpay_order_id,
              plan_id:plan.id,
              project_id:project_key
            })

            toast.success("Subscription Activated")

          }catch(err){

            toast.error("Payment verification failed")

          }

        }

      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    }catch(err){

      toast.error("Checkout failed")

    }finally{

      setProcessing(false)

    }

  }


  /* ---------------- LOADING ---------------- */

  if(loading){

    return(
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-6 w-6"/>
      </div>
    )

  }


  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-2xl font-semibold mb-8">
        Plans & Pricing
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {plans.map((plan)=>(
          
          <div
            key={plan.id}
            className="border rounded-xl p-6 bg-white"
          >

            <h2 className="text-xl font-semibold mb-2">
              {plan.name}
            </h2>

            <p className="text-3xl font-bold mb-4">
              ₹{plan.price}
            </p>

            <ul className="text-sm mb-6 space-y-2">
              {(plan.features || []).map((f,i)=>(
                <li key={i}>✓ {f}</li>
              ))}
            </ul>

            <button
              disabled={processing}
              onClick={()=>startCheckout(plan)}
              className="w-full bg-green-600 text-white py-2 rounded-md disabled:opacity-50"
            >
              {processing ? "Processing..." : "Choose Plan"}
            </button>

          </div>

        ))}

      {enterprise && (

  <div className="border rounded-xl p-8 bg-white w-full md:col-span-3">

    <div className="grid md:grid-cols-2 gap-8 items-start">

      {/* LEFT SIDE */}
      <div>

        <h2 className="text-2xl font-semibold mb-2">
          {enterprise.name}
        </h2>

        <p className="text-4xl font-bold mb-6">
          Custom Pricing
        </p>

        <p className="text-sm text-muted-foreground mb-6">
          Built for high-scale teams needing unlimited access, integrations,
          and dedicated support.
        </p>

        <button
          className="bg-black text-white px-6 py-3 rounded-md"
          onClick={()=> window.location.href="mailto:sales@messegy.com"}
        >
          Contact Sales
        </button>

      </div>


      {/* RIGHT SIDE FEATURES */}

      <div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">

          {(enterprise.features || []).map((f,i)=>(
            <li key={i} className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              {f}
            </li>
          ))}

        </ul>

      </div>

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