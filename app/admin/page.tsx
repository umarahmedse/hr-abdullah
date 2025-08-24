import { DataSeeder } from "@/components/admin/data-seeder"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-600 mt-2">Manage demo data and system settings for the HRMS application.</p>
      </div>

      <DataSeeder />
    </div>
  )
}
