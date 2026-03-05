"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

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

          <div className="border rounded-xl p-6 bg-white">

            <h2 className="text-xl font-semibold mb-2">
              Enterprise
            </h2>

            <p className="text-lg mb-4">
              Custom Pricing
            </p>

            <p className="text-sm mb-6">
              Contact our team for enterprise solutions.
            </p>

            <button
              className="w-full bg-black text-white py-2 rounded-md"
              onClick={()=> window.location.href="mailto:sales@messegy.com"}
            >
              Contact Sales
            </button>

          </div>

        )}

      </div>

    </div>
  )
}"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

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

          <div className="border rounded-xl p-6 bg-white">

            <h2 className="text-xl font-semibold mb-2">
              Enterprise
            </h2>

            <p className="text-lg mb-4">
              Custom Pricing
            </p>

            <p className="text-sm mb-6">
              Contact our team for enterprise solutions.
            </p>

            <button
              className="w-full bg-black text-white py-2 rounded-md"
              onClick={()=> window.location.href="mailto:sales@messegy.com"}
            >
              Contact Sales
            </button>

          </div>

        )}

      </div>

    </div>
  )
}