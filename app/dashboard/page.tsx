import Sidebar from "@/components/sidebar"; 
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
   
  const user = await getCurrentUser()
  const userId = user.id;

  const totalProducts = await prisma.product.count({where: {userId} }) 
  const lowStock = await prisma.product.count({
    where: {
      userId,

    },  
  })
  const recent = await prisma.product.findMany({
    where: {userId},
    orderBy: { createdAt: "desc"}, 
    take: 5,
  })
  console.log(recent);

  const allProducts = await prisma.product.findMany({
    where: {userId},
    select: {price: true, quantity: true, createdAt: true}
  
  
  })

  const totalValue = allProducts.reduce((sum, product) => sum + Number(product.price) * Number (product.quantity),0)
  
console.log(totalValue);

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

      {/* Key Metrics  CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 ">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 ">Key Metrics </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div>{totalProducts}</div>
              <div>Total Products</div> 
              <div></div>
            </div>

          </div>
        </div>

      </div>
    </main>

  </div>
  );
}
