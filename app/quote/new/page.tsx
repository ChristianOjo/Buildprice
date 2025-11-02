import { createClient } from '@/lib/supabase/server'
import { QuoteBuilder } from '@/components/quote/quote-builder'

export default async function NewQuotePage() {
  const supabase = await createClient()
  
  // Fetch all materials with their latest prices
  const { data: materials, error } = await supabase
    .from('materials')
    .select(`
      id,
      name,
      category,
      unit,
      description
    `)
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching materials:', error)
    return <div className="p-8">Error loading materials</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Quote</h1>
              <p className="text-sm text-gray-600">Compare prices across suppliers instantly</p>
            </div>
            <a 
              href="/dashboard"
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuoteBuilder materials={materials || []} />
      </main>
    </div>
  )
}