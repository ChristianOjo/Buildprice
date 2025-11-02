'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'

type Price = {
  id: string
  price: number
  currency: string
  unit: string
  valid_from: string
  verified: boolean
  materials: { id: string; name: string; category: string } | null
  suppliers: { id: string; name: string } | null
  supplier_locations: { city: string; country: string } | null
}

export function PriceTable({ prices }: { prices: Price[] }) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get unique categories
  const categories = ['all', ...new Set(prices.map(p => p.materials?.category).filter(Boolean))]

  // Filter prices
  const filteredPrices = prices.filter(price => {
    const matchesCategory = categoryFilter === 'all' || price.materials?.category === categoryFilter
    const matchesSearch = searchTerm === '' || 
      price.materials?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.suppliers?.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Group by material for better display
  const pricesByMaterial = filteredPrices.reduce((acc, price) => {
    const materialName = price.materials?.name || 'Unknown'
    if (!acc[materialName]) {
      acc[materialName] = []
    }
    acc[materialName].push(price)
    return acc
  }, {} as Record<string, Price[]>)

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search materials or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{Object.keys(pricesByMaterial).length}</span> materials
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(pricesByMaterial).map(([materialName, materialPrices]) => {
              // Find best (lowest) price for this material
              const bestPrice = Math.min(...materialPrices.map(p => p.price))
              
              return materialPrices.map((price, idx) => {
                const isBestPrice = price.price === bestPrice
                
                return (
                  <tr 
                    key={price.id}
                    className={isBestPrice ? 'bg-green-50' : 'hover:bg-gray-50'}
                  >
                    {/* Material Name - only show on first row */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {idx === 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {materialName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {price.materials?.category}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Supplier */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {price.suppliers?.name || 'Unknown'}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {price.supplier_locations?.city || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {price.supplier_locations?.country || ''}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${isBestPrice ? 'text-green-700' : 'text-gray-900'}`}>
                        {price.currency === 'ZAR' ? 'R' : 'E'}{price.price.toFixed(2)}
                        {isBestPrice && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Best
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        per {price.unit}
                      </div>
                    </td>

                    {/* Updated */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mounted ? formatDistanceToNow(new Date(price.valid_from), { addSuffix: true }) : 'Loading...'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {price.verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {Object.keys(pricesByMaterial).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No prices found matching your filters</p>
        </div>
      )}
    </div>
  )
}