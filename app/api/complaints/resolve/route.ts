import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { complaint_id } = await req.json()

    if (!complaint_id) {
      return NextResponse.json({ success: false, error: "Missing complaint_id" }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error("Resolve API: Unauthorized")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    console.log(`Resolving complaint ${complaint_id} for user ${user.id}`)

    // Update complaint status to "completed"
    const { data, error } = await supabase
      .from("complaints")
      .update({ status: "completed" })
      .eq("id", complaint_id)
      .eq("user_id", user.id) // Security: Ensure owner
      .select()

    if (error) {
      console.error("Supabase update error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      console.error(`Complaint ${complaint_id} not found or RLS prevented update for user ${user.id}`)
      return NextResponse.json({ 
        success: false, 
        error: "Complaint not found or you don't have permission to resolve it. (Check RLS policies)" 
      }, { status: 404 })
    }

    console.log(`Successfully resolved complaint ${complaint_id}`)

    return NextResponse.json({ 
      success: true, 
      status: "completed" 
    })
  } catch (err) {
    console.error("Resolve API error:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
