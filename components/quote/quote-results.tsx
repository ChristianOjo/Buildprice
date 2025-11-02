'use client'

type QuoteOption = {
  name: string
  description: string
  total: number
  currency: string
  savings?: number
  items: Array<{
    materialName: string
    quantity: number
    unit: string
    supplierName: string
    unitPrice: number
    subtotal: number
  }>
  pros: string[]
  cons: string[]
}

type QuoteResults = {
  options: QuoteOption[]
}

export function QuoteResults({ 
  results, 
  projectName 
}: { 
  results: QuoteResults
  projectName: string 
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quote Results {projectName && `- ${projectName}`}
        </h2>
        <p className="text-gray-600">
          We've analyzed prices from all suppliers. Here are your best options:
        </p>
      </div>

      {/* Quote Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {results.options.map((option, index) => {
          const isRecommended = index === 1 // Option 2 (optimized) is recommended
          
          return (
            <div 
              key={index}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                isRecommended ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {/* Header */}
              <div className={`p-6 ${
                isRecommended ? 'bg-green-50' : 'bg-gray-50'
              }`}>
                {isRecommended && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full mb-3">
                    ⭐ RECOMMENDED
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {option.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {option.description}
                </p>
                
                {/* Price */}
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-gray-900">
                    {option.currency === 'ZAR' ? 'R' : 'E'}
                    {option.total.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  {option.savings && option.savings > 0 && (
                    <div className="text-green-600 font-semibold">
                      💰 Save {option.currency === 'ZAR' ? 'R' : 'E'}
                      {option.savings.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="p-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Items:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {option.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm">
                      <div className="flex justify-between font-medium">
                        <span>{item.materialName}</span>
                        <span>
                          {option.currency === 'ZAR' ? 'R' : 'E'}{item.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs">
                        {item.quantity} {item.unit} × {option.currency === 'ZAR' ? 'R' : 'E'}
                        {item.unitPrice.toFixed(2)} from {item.supplierName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">PROS:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {option.pros.map((pro, i) => (
                        <li key={i}>✓ {pro}</li>
                      ))}
                    </ul>
                  </div>
                  {option.cons.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">CONS:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {option.cons.map((con, i) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Select This Option
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Ready to proceed?</h3>
            <p className="text-sm text-gray-600">Export your quote or save it to your account</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              Save Quote
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}