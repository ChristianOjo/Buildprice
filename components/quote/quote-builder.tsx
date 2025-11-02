'use client'

import { useState } from 'react'
import { MaterialSelector } from './material-selector'
import { QuoteResults } from './quote-results'

type Material = {
  id: string
  name: string
  category: string
  unit: string
  description: string | null
}

type QuoteItem = {
  id: string
  material: Material
  quantity: number
}

export function QuoteBuilder({ materials }: { materials: Material[] }) {
  const [projectName, setProjectName] = useState('')
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [quoteResults, setQuoteResults] = useState<any>(null)

  const addItem = (material: Material) => {
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substr(2, 9),
      material,
      quantity: 1
    }
    setQuoteItems([...quoteItems, newItem])
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setQuoteItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setQuoteItems(items => items.filter(item => item.id !== itemId))
  }

  const generateQuote = async () => {
    if (quoteItems.length === 0) return

    setIsCalculating(true)
    
    try {
      // Call API to calculate quote
      const response = await fetch('/api/quotes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          items: quoteItems.map(item => ({
            materialId: item.material.id,
            quantity: item.quantity
          }))
        })
      })

      const results = await response.json()
      setQuoteResults(results)
    } catch (error) {
      console.error('Error generating quote:', error)
      alert('Failed to generate quote. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Material Selection */}
      <div className="lg:col-span-2 space-y-6">
        {/* Project Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
          <input
            type="text"
            placeholder="Project name (optional)"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Material Selector */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Materials</h2>
          <MaterialSelector materials={materials} onAdd={addItem} />
        </div>

        {/* Quote Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quote Items ({quoteItems.length})
          </h2>

          {quoteItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No items added yet</p>
              <p className="text-sm mt-2">Search and add materials above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {quoteItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.material.name}</p>
                    <p className="text-sm text-gray-500">{item.material.category}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    />
                    <span className="text-sm text-gray-600 w-24">{item.material.unit}</span>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Summary & Generate */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Summary</h2>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Items:</span>
              <span className="font-medium">{quoteItems.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Units:</span>
              <span className="font-medium">
                {quoteItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
          </div>

          <button
            onClick={generateQuote}
            disabled={quoteItems.length === 0 || isCalculating}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
          >
            {isCalculating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Calculating...
              </span>
            ) : (
              'Generate Quote'
            )}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Compare prices from 8+ suppliers instantly
          </p>
        </div>
      </div>

      {/* Quote Results (Full Width Below) */}
      {quoteResults && (
        <div className="lg:col-span-3">
          <QuoteResults results={quoteResults} projectName={projectName} />
        </div>
      )}
    </div>
  )
}