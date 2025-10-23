import Sidebar from "@/components/sidebar"; 

export default function DashboardPage() {
  return (<div className="min-h-screen bg-gray-50">
    <Sidebar currentPath="/dashboard"/>
    <main className="ml-64 p-8">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center justify-between" >
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome Back, Here is the Overview</p>
            </div>
        </div>
      </div>
    </main>

  </div>
  );
}
