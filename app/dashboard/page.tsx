import ProductChart from "@/components/productchart";
import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  const [totalProducts, lowStock, allProducts] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.count({
      where: {
        userId,
        lowStockAt: { not: null },
        quantity: { lte: 5 },
      },
    }),
    prisma.product.findMany({
      where: { userId },
      select: { price: true, quantity: true, createdAt: true },
    }),
  ]);

  const recent = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  console.log(recent);

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

  console.log(totalValue);

  const inStockCount = allProducts.filter((p) => Number(p.quantity) > 5).length;
  const lowStockCount = allProducts.filter(
    (p) => Number(p.quantity) <= 5 && Number(p.quantity) >= 5
  ).length;

  const outOfStockCount = allProducts.filter(
    (p) => Number(p.quantity) === 0
  ).length;

  // Calculate percentage of products in stock
  const inStockPercentage =
    totalProducts > 0 ? Math.round(inStockCount / totalProducts) * 100 : 0;
  const lowStockPercentage =
    totalProducts > 0 ? Math.round(lowStockCount / totalProducts) * 100 : 0;
  const outOfStockPercentage =
    totalProducts > 0 ? Math.round(outOfStockCount / totalProducts) * 100 : 0;

  /**
   * Generates a dataset of product creation counts for the past 12 weeks.
   * Used for populating the weekly performance chart.
   * * @returns {Array} weeklyProductsData - [{week: "MM/DD", products: count}, ...]
   */
  const now = new Date();
  const weeklyProductsData = [];

  // Loop backwards from 11 to 0 to generate weeks in chronological order
  // (11 weeks ago -> Current week)
  for (let i = 11; i >= 0; i--) {
    // 1. Define the Start Date (i weeks ago)
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0); // Start of the day (00:00)

    // 2. Define the End Date (6 days after start)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekStart.setHours(23, 59, 59, 999); // End of the day (23:59)

    // Format label as "MM/DD" for the chart axis
    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(weekStart.getDate()).padStart(2, "0")}`;

    // 3. Filter products created within this specific window
    const weekProducts = allProducts.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });
    weeklyProductsData.push({ week: weekLabel, products: weekProducts.length });
  }

  /**
   * Dashboard View Component
   * * The main landing page for the application. It aggregates key business metrics,
   * visualizes sales trends, and highlights inventory alerts.
   * * Dependencies:
   * - Sidebar: Main navigation component
   * - ProductChart: Visualization component for weekly data
   * * Data Requirements (Expected variables in scope):
   * @param {number} totalProducts - Total count of inventory items
   * @param {number} totalValue - Total monetary value of inventory
   * @param {number} lowStock - Count of items below threshold
   * @param {Array} weeklyProductsData - Data points for the trend graph
   * @param {Array} recent - List of recently updated/added products for the stock list
   */

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard" />
      <main className="ml-64 p-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome Back, Here is the Overview
              </p>
            </div>
          </div>
        </div>

        {/* --- TOP METRICS & CHART --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Key Metrics  CARDS */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 ">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 ">
              Key Metrics{" "}
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {/* Metric: Total Products */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {totalProducts}
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600 ">
                    {totalProducts}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>

              {/* Metric: Total Value (Formatted to currency) */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  ${Number(totalValue).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Total Value </div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600 ">
                    +${Number(totalValue).toFixed(0)}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>

              {/* Metric: Low Stock Alerts */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {lowStock}
                </div>
                <div className="text-sm text-gray-600">Low Stock</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600 ">{lowStock}</span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Graph Circle*/}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>New Products per week </h2>
            </div>
            <div className="h-48">
              <ProductChart data={weeklyProductsData} />
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTIONS: STOCK & EFFICIENCY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/*Stock Levels Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Stock Levels{" "}
              </h2>
            </div>

            <div className="space-y-3">
              {recent.map((product, key) => {
                const stocklevel =
                  product.quantity === 0
                    ? 0
                    : product.quantity <= (product.lowStockAt || 5)
                    ? 1
                    : 2;

                const bgColors = [
                  "bg-red-600",
                  "bg-yellow-600",
                  "bg-green-600",
                ];
                const textColors = [
                  "text-red-600",
                  "text-yellow-600",
                  "text-green-600",
                ];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3 ">
                      <div
                        className={`w-3 h-3 rounded-full ${bgColors[stocklevel]}`}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {product.name}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-medium ${textColors[stocklevel]}`}
                    >
                      {product.quantity} units left
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Efficiency */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Efficiency
              </h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-purple-600"
                  style={{
                    clipPath:
                      "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {inStockPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">In Stock</div>
                  </div>
                </div>
              </div>
            </div>

            {/* inStockPercentage legend */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-200" />
                  <span>In Stock ({inStockPercentage}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span>Low Stock ({lowStockPercentage}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <span>Out of Stock ({outOfStockPercentage}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
