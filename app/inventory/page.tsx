import Sidebar from "@/components/sidebar";

/**
 * Inventory Page Component
 * * This component renders the main layout for the inventory management section of the application.
 * It utilizes a fixed sidebar layout with a responsive main content area.
 * * @component
 * @example
 * return (
 * <InventoryPage />
 * )
 * * @returns {JSX.Element} The rendered inventory page layout with sidebar and header.
 */


export default async function InventoryPage() {

    return <div className="min-h-screen bg-gray-50">
        <Sidebar currentPath="/inventory"/>
        <main className="ml-64 p-8 ">
            <div className="mb-8"> 
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                        <p className="text-sm text-gray-500 ">Manage your product and track inventory levels.</p>
                    </div>
                    
                </div>
            </div>


            <div className="space-y-6">


                {/* Products Table  */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50"> 
                            <tr> 
                                <th>Name</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Low Stock At</th>
                                <th>Actions</th>
                                
                            </tr>

                        </thead>
                    </table>
                </div>

            </div>


        </main>
        
        </div>;
  }