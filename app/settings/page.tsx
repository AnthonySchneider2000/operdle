import { ThemeSettings } from '@/components/settings/theme-settings'

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your application preferences and appearance.
        </p>
      </div>
      
      <div className="grid gap-6">
        <ThemeSettings />
        
        {/* Future settings sections can be added here */}
        {/* <NotificationSettings /> */}
        {/* <AccountSettings /> */}
      </div>
    </div>
  )
}
