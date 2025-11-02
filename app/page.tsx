import { createClient } from '@/lib/supabase/server'
import { PriceTable } from '@/components/dashboard/price-table'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch latest prices with material and supplier info
  const { data: prices, error } = await supabase
    .from('prices')
    .select(`
      id,
      price,
      currency,
      unit,
      valid_from,
      verified,
      materials (
        id,
        name,
        category
      ),
      suppliers (
        id,
        name
      ),
      supplier_locations (
        city,
        country
      )
    `)
    .order('valid_from', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching prices:', error)
    return <div className="p-8">Error loading prices</div>
  }

  // Get unique materials for stats
  const uniqueMaterials = new Set(prices?.map((p: any) => p.materials?.name))
  const uniqueSuppliers = new Set(prices?.map((p: any) => p.suppliers?.name))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BuildPrice</h1>
              <p className="text-sm text-gray-600">Real-time construction material prices</p>
            </div>
            <Link 
              href="/quote/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              New Quote
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <DashboardStats 
          totalMaterials={uniqueMaterials.size}
          totalSuppliers={uniqueSuppliers.size}
          totalPrices={prices?.length || 0}
        />

        {/* Price Table */}
        <div className="mt-8">
        <PriceTable prices={(prices || []) as any} />
        </div>
      </main>
    </div>
  )
}