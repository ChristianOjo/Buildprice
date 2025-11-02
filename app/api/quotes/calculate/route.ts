import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { items } = await request.json()
    
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch latest prices for all materials
    const materialIds = items.map((item: any) => item.materialId)
    
    const { data: prices, error } = await supabase
      .from('prices')
      .select(`
        id,
        price,
        currency,
        material_id,
        supplier_id,
        valid_from,
        materials (id, name, unit),
        suppliers (id, name),
        supplier_locations (city, country)
      `)
      .in('material_id', materialIds)
      .order('valid_from', { ascending: false })

    if (error) throw error

    // Group prices by material
    const pricesByMaterial: { [key: string]: any[] } = {}
    prices?.forEach((price: any) => {
      if (!pricesByMaterial[price.material_id]) {
        pricesByMaterial[price.material_id] = []
      }
      pricesByMaterial[price.material_id].push(price)
    })

    // Calculate three quote options
    const options = []

    // OPTION 1: Single Best Supplier (convenience)
    const singleSupplierQuote = calculateSingleSupplierQuote(items, pricesByMaterial)
    options.push(singleSupplierQuote)

    // OPTION 2: Optimized Mix (best prices)
    const optimizedQuote = calculateOptimizedQuote(items, pricesByMaterial)
    options.push(optimizedQuote)

    // OPTION 3: All Local (Eswatini only)
    const localQuote = calculateLocalQuote(items, pricesByMaterial)
    options.push(localQuote)

    return NextResponse.json({ options })

  } catch (error) {
    console.error('Quote calculation error:', error)
    return NextResponse.json({ error: 'Failed to calculate quote' }, { status: 500 })
  }
}

function calculateSingleSupplierQuote(items: any[], pricesByMaterial: any) {
  // Find which supplier can provide the most items at reasonable prices
  const supplierScores: { [key: string]: { total: number; count: number; items: any[] } } = {}

  items.forEach((item: any) => {
    const prices = pricesByMaterial[item.materialId] || []
    
    prices.forEach((price: any) => {
      const supplierId = price.suppliers.id
      if (!supplierScores[supplierId]) {
        supplierScores[supplierId] = { 
          total: 0, 
          count: 0, 
          items: [],
        }
      }
      
      const subtotal = price.price * item.quantity
      supplierScores[supplierId].total += subtotal
      supplierScores[supplierId].count += 1
      supplierScores[supplierId].items.push({
        materialName: price.materials.name,
        quantity: item.quantity,
        unit: price.materials.unit,
        supplierName: price.suppliers.name,
        unitPrice: price.price,
        subtotal
      })
    })
  })

  // Find supplier with lowest total
  let bestSupplier = null
  let lowestTotal = Infinity

  Object.entries(supplierScores).forEach(([supplierId, data]) => {
    if (data.count === items.length && data.total < lowestTotal) {
      lowestTotal = data.total
      bestSupplier = data
    }
  })

  // Fallback if no single supplier has everything
  if (!bestSupplier) {
    const firstSupplier = Object.values(supplierScores)[0]
    bestSupplier = firstSupplier
    lowestTotal = firstSupplier.total
  }

  return {
    name: 'Single Supplier',
    description: 'Get everything from one supplier',
    total: lowestTotal,
    currency: 'ZAR',
    items: bestSupplier.items,
    pros: ['One delivery', 'Simplest logistics', 'Build supplier relationship'],
    cons: ['Not always cheapest', 'Limited to their stock']
  }
}

function calculateOptimizedQuote(items: any[], pricesByMaterial: any) {
  // Get best price for each material regardless of supplier
  const optimizedItems: any[] = []
  let total = 0

  items.forEach(item => {
    const prices = pricesByMaterial[item.materialId] || []
    
    if (prices.length > 0) {
      // Find lowest price
      const bestPrice = prices.reduce((min: any, p: any) => p.price < min.price ? p : min, prices[0])
      
      const subtotal = bestPrice.price * item.quantity
      total += subtotal

      optimizedItems.push({
        materialName: bestPrice.materials.name,
        quantity: item.quantity,
        unit: bestPrice.materials.unit,
        supplierName: bestPrice.suppliers.name,
        unitPrice: bestPrice.price,
        subtotal
      })
    }
  })

  // Calculate savings vs single supplier
  const singleSupplierTotal = calculateSingleSupplierQuote(items, pricesByMaterial).total
  const savings = singleSupplierTotal - total

  return {
    name: 'Optimized Mix',
    description: 'Best price for each material',
    total,
    currency: 'ZAR',
    savings: savings > 0 ? savings : 0,
    items: optimizedItems,
    pros: ['Lowest total cost', 'Best value', 'Maximize savings'],
    cons: ['Multiple deliveries', 'More coordination needed']
  }
}

function calculateLocalQuote(items: any[], pricesByMaterial: any) {
  // Only use Eswatini suppliers (SZ country code)
  const localItems: any[] = []
  let total = 0

  items.forEach(item => {
    const prices = pricesByMaterial[item.materialId] || []
    const localPrices = prices.filter((p: any) => p.supplier_locations?.country === 'SZ')
    
    if (localPrices.length > 0) {
      const bestLocalPrice = localPrices.reduce((min: any, p: any) => p.price < min.price ? p : min, localPrices[0])
      
      const subtotal = bestLocalPrice.price * item.quantity
      total += subtotal

      localItems.push({
        materialName: bestLocalPrice.materials.name,
        quantity: item.quantity,
        unit: bestLocalPrice.materials.unit,
        supplierName: bestLocalPrice.suppliers.name,
        unitPrice: bestLocalPrice.price,
        subtotal
      })
    }
  })

  // Calculate savings vs optimized
  const optimizedTotal = calculateOptimizedQuote(items, pricesByMaterial).total
  const extraCost = total - optimizedTotal

  return {
    name: 'All Local',
    description: 'Support Eswatini businesses',
    total,
    currency: 'SZL',
    savings: extraCost < 0 ? Math.abs(extraCost) : 0,
    items: localItems,
    pros: ['No import hassle', 'Support local economy', 'Faster delivery'],
    cons: extraCost > 0 ? [`Costs E${extraCost.toFixed(2)} more`] : []
  }
}