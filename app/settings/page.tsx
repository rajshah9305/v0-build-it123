import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/settings/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user API keys (without decrypted values for security)
  const { data: apiKeys } = await supabase
    .from("user_api_keys")
    .select("id, provider, key_name, created_at")
    .eq("user_id", user.id)

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-montserrat">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your account and API configurations</p>
      </div>

      <SettingsForm user={user} profile={profile} apiKeys={apiKeys || []} />
    </div>
  )
}
