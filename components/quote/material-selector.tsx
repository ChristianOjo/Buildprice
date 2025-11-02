'use client'

import { useState } from 'react'

type Material = {
  id: string
  name: string
  category: string
  unit: string
  description: string | null
}

export function MaterialSelector({ 
  materials, 
  onAdd 
}: { 
  materials: Material[]
  onAdd: (material: Material) => void 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Get unique categories
  const categories = ['all', ...new Set(materials.map(m => m.category))]

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter
    const matchesSearch = searchTerm === '' || 
      material.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Material List */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredMaterials.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No materials found</p>
        ) : (
          filteredMaterials.map(material => (
            <div 
              key={material.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{material.name}</p>
                <p className="text-sm text-gray-500">
                  {material.category} • {material.unit}
                </p>
              </div>
              <button
                onClick={() => onAdd(material)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}