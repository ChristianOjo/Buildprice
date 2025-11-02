// seed-data.ts - Run this script to populate demo data
// Usage: npx tsx seed-data.ts (or node --loader ts-node/esm seed-data.ts)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for seeding

const supabase = createClient(supabaseUrl, supabaseKey);

// Seed materials
const materials = [
  // Cement
  { name: 'PPC Cement 42.5N', category: 'cement', unit: '50kg bag', description: 'High strength general purpose cement', hs_code: '2523.29', typical_application: 'Foundations, columns, beams' },
  { name: 'PPC Cement 32.5R', category: 'cement', unit: '50kg bag', description: 'Rapid hardening cement', hs_code: '2523.29', typical_application: 'Plastering, brickwork' },
  { name: 'Sureflow Cement', category: 'cement', unit: '50kg bag', description: 'Self-leveling cement', hs_code: '2523.29', typical_application: 'Floor screeding' },
  { name: 'Surebuild Cement', category: 'cement', unit: '50kg bag', description: 'Masonry cement', hs_code: '2523.29', typical_application: 'General building' },
  
  // Steel
  { name: 'Y10 Steel Bar (10mm)', category: 'steel', unit: '6m bar', description: 'Deformed reinforcing bar', hs_code: '7214.20', typical_application: 'Slab reinforcement' },
  { name: 'Y12 Steel Bar (12mm)', category: 'steel', unit: '6m bar', description: 'Deformed reinforcing bar', hs_code: '7214.20', typical_application: 'Beams, columns' },
  { name: 'Y16 Steel Bar (16mm)', category: 'steel', unit: '6m bar', description: 'Heavy duty reinforcing bar', hs_code: '7214.20', typical_application: 'Heavy structures' },
  { name: 'BRC Mesh A193', category: 'steel', unit: 'sheet', description: '6m x 2.4m mesh', hs_code: '7314.20', typical_application: 'Slab reinforcement' },
  
  // Bricks
  { name: 'Stock Brick (Standard)', category: 'bricks', unit: 'each', description: 'Clay stock brick', hs_code: '6904.10', typical_application: 'Walls, general building' },
  { name: 'Face Brick (Smooth)', category: 'bricks', unit: 'each', description: 'Smooth face brick', hs_code: '6904.10', typical_application: 'Exterior walls' },
  { name: 'Cement Block 190mm', category: 'bricks', unit: 'each', description: 'Hollow cement block', hs_code: '6810.11', typical_application: 'Walls, partitions' },
  
  // Aggregates
  { name: 'Building Sand', category: 'aggregates', unit: 'm³', description: 'Washed building sand', hs_code: '2505.10', typical_application: 'Concrete, mortar' },
  { name: 'Plaster Sand', category: 'aggregates', unit: 'm³', description: 'Fine plaster sand', hs_code: '2505.10', typical_application: 'Plastering' },
  { name: '13mm Stone', category: 'aggregates', unit: 'm³', description: 'Crushed stone aggregate', hs_code: '2517.10', typical_application: 'Concrete' },
  { name: '19mm Stone', category: 'aggregates', unit: 'm³', description: 'Crushed stone aggregate', hs_code: '2517.10', typical_application: 'Concrete, drainage' },
  
  // Timber
  { name: 'Pine 38x114mm (3.6m)', category: 'timber', unit: 'length', description: 'Treated pine timber', hs_code: '4407.11', typical_application: 'Roof trusses' },
  { name: 'Pine 38x152mm (3.6m)', category: 'timber', unit: 'length', description: 'Treated pine timber', hs_code: '4407.11', typical_application: 'Roof rafters' },
  
  // Roofing
  { name: 'IBR 0.5mm Galvanized', category: 'roofing', unit: 'sheet', description: 'Corrugated iron sheet', hs_code: '7210.61', typical_application: 'Roof covering' },
  { name: 'Roof Tile (Concrete)', category: 'roofing', unit: 'each', description: 'Standard concrete tile', hs_code: '6810.19', typical_application: 'Roof covering' },
  
  // Paint
  { name: 'Interior PVA Paint 20L', category: 'paint', unit: '20L', description: 'White PVA paint', hs_code: '3209.10', typical_application: 'Interior walls' },
  { name: 'Exterior Acrylic 20L', category: 'paint', unit: '20L', description: 'Weather resistant paint', hs_code: '3209.10', typical_application: 'Exterior walls' },
];

// Seed suppliers
const suppliers = [
  {
    name: 'Builders Warehouse',
    type: 'retailer',
    website: 'https://www.builderswarehouse.co.za',
    contact_email: 'info@builderswarehouse.co.za',
    countries_served: ['ZA'],
    payment_terms: 'Cash, Card, Account (30 days)',
    bulk_discount_info: { tiers: [{ quantity: 100, discount: 5 }, { quantity: 500, discount: 10 }] }
  },
  {
    name: 'Cashbuild',
    type: 'retailer',
    website: 'https://www.cashbuild.co.za',
    contact_email: 'info@cashbuild.co.za',
    countries_served: ['ZA', 'SZ', 'BW'],
    payment_terms: 'Cash, Card, Account (30 days)',
    bulk_discount_info: { tiers: [{ quantity: 50, discount: 3 }, { quantity: 200, discount: 8 }] }
  },
  {
    name: 'Build It',
    type: 'retailer',
    website: 'https://www.buildit.co.za',
    contact_email: 'info@buildit.co.za',
    countries_served: ['ZA'],
    payment_terms: 'Cash, Card',
    bulk_discount_info: { tiers: [{ quantity: 100, discount: 5 }] }
  },
  {
    name: 'Buildmart Manzini',
    type: 'retailer',
    website: null,
    contact_email: 'info@buildmart.sz',
    countries_served: ['SZ'],
    payment_terms: 'Cash, EFT',
    bulk_discount_info: { tiers: [{ quantity: 50, discount: 5 }] }
  },
  {
    name: 'Buildmart Mbabane',
    type: 'retailer',
    website: null,
    contact_email: 'mbabane@buildmart.sz',
    countries_served: ['SZ'],
    payment_terms: 'Cash, EFT',
    bulk_discount_info: { tiers: [{ quantity: 50, discount: 5 }] }
  },
  {
    name: 'Swaziland Builders',
    type: 'wholesaler',
    website: null,
    contact_email: 'info@swazbuilders.sz',
    countries_served: ['SZ'],
    payment_terms: 'Cash, Account (14 days)',
    bulk_discount_info: { tiers: [{ quantity: 100, discount: 8 }] }
  },
  {
    name: 'Builders Express JHB',
    type: 'wholesaler',
    website: null,
    contact_email: 'sales@buildersexpress.co.za',
    countries_served: ['ZA', 'SZ', 'BW'],
    payment_terms: 'Account only (30 days)',
    bulk_discount_info: { tiers: [{ quantity: 200, discount: 12 }, { quantity: 1000, discount: 18 }] }
  },
  {
    name: 'Local Hardware Mbabane',
    type: 'retailer',
    website: null,
    contact_email: 'info@localhardware.sz',
    countries_served: ['SZ'],
    payment_terms: 'Cash only',
    bulk_discount_info: null
  },
];

// Seed locations
const locations = [
  // Builders Warehouse
  { supplier_name: 'Builders Warehouse', branch_name: 'Nelspruit', city: 'Nelspruit', country: 'ZA', latitude: -25.4653, longitude: 30.9700 },
  { supplier_name: 'Builders Warehouse', branch_name: 'Johannesburg North', city: 'Johannesburg', country: 'ZA', latitude: -26.0579, longitude: 28.1097 },
  
  // Cashbuild
  { supplier_name: 'Cashbuild', branch_name: 'Nelspruit', city: 'Nelspruit', country: 'ZA', latitude: -25.4705, longitude: 30.9812 },
  { supplier_name: 'Cashbuild', branch_name: 'Manzini', city: 'Manzini', country: 'SZ', latitude: -26.4956, longitude: 31.3712 },
  
  // Build It
  { supplier_name: 'Build It', branch_name: 'Nelspruit', city: 'Nelspruit', country: 'ZA', latitude: -25.4602, longitude: 30.9785 },
  
  // Buildmart
  { supplier_name: 'Buildmart Manzini', branch_name: 'Main Branch', city: 'Manzini', country: 'SZ', latitude: -26.4879, longitude: 31.3745 },
  { supplier_name: 'Buildmart Mbabane', branch_name: 'Main Branch', city: 'Mbabane', country: 'SZ', latitude: -26.3208, longitude: 31.1617 },
  
  // Others
  { supplier_name: 'Swaziland Builders', branch_name: 'Manzini', city: 'Manzini', country: 'SZ', latitude: -26.4920, longitude: 31.3680 },
  { supplier_name: 'Builders Express JHB', branch_name: 'Johannesburg', city: 'Johannesburg', country: 'ZA', latitude: -26.2041, longitude: 28.0473 },
  { supplier_name: 'Local Hardware Mbabane', branch_name: 'Main', city: 'Mbabane', country: 'SZ', latitude: -26.3186, longitude: 31.1410 },
];

// Function to generate realistic price with variations
function generatePrice(basePrice: number, variance: number = 0.15): number {
  const variation = (Math.random() - 0.5) * 2 * variance;
  return Math.round((basePrice * (1 + variation)) * 100) / 100;
}

// Base prices (in ZAR) - realistic South African prices
const basePrices: { [key: string]: number } = {
  'PPC Cement 42.5N': 95,
  'PPC Cement 32.5R': 88,
  'Sureflow Cement': 105,
  'Surebuild Cement': 82,
  'Y10 Steel Bar (10mm)': 48,
  'Y12 Steel Bar (12mm)': 68,
  'Y16 Steel Bar (16mm)': 115,
  'BRC Mesh A193': 385,
  'Stock Brick (Standard)': 2.50,
  'Face Brick (Smooth)': 4.20,
  'Cement Block 190mm': 12.50,
  'Building Sand': 420,
  'Plaster Sand': 380,
  '13mm Stone': 340,
  '19mm Stone': 350,
  'Pine 38x114mm (3.6m)': 95,
  'Pine 38x152mm (3.6m)': 125,
  'IBR 0.5mm Galvanized': 165,
  'Roof Tile (Concrete)': 18,
  'Interior PVA Paint 20L': 420,
  'Exterior Acrylic 20L': 580,
};

// Currency multipliers for Eswatini (SZL ≈ ZAR, but local prices slightly higher)
const eswatiniMultiplier = 1.08;

async function seed() {
  try {
    console.log('🌱 Starting seed...');

    // 1. Insert materials
    console.log('📦 Seeding materials...');
    const { data: insertedMaterials, error: materialsError } = await supabase
      .from('materials')
      .insert(materials)
      .select();
    
    if (materialsError) throw materialsError;
    console.log(`✅ Inserted ${insertedMaterials?.length} materials`);

    // 2. Insert suppliers
    console.log('🏢 Seeding suppliers...');
    const { data: insertedSuppliers, error: suppliersError } = await supabase
      .from('suppliers')
      .insert(suppliers)
      .select();
    
    if (suppliersError) throw suppliersError;
    console.log(`✅ Inserted ${insertedSuppliers?.length} suppliers`);

    // 3. Insert locations
    console.log('📍 Seeding locations...');
    const locationsWithIds = locations.map(loc => {
      const supplier = insertedSuppliers?.find(s => s.name === loc.supplier_name);
      return {
        supplier_id: supplier?.id,
        branch_name: loc.branch_name,
        address: `${loc.branch_name}, ${loc.city}`,
        city: loc.city,
        country: loc.country,
        latitude: loc.latitude,
        longitude: loc.longitude,
        delivery_available: true,
        delivery_radius_km: loc.country === 'SZ' ? 50 : 100,
      };
    });

    const { data: insertedLocations, error: locationsError } = await supabase
      .from('supplier_locations')
      .insert(locationsWithIds)
      .select();
    
    if (locationsError) throw locationsError;
    console.log(`✅ Inserted ${insertedLocations?.length} locations`);

    // 4. Generate prices (current + 30 days historical)
    console.log('💰 Seeding prices...');
    const pricesData = [];
    const now = new Date();

    for (const material of insertedMaterials || []) {
      const basePrice = basePrices[material.name];
      if (!basePrice) continue;

      for (const location of insertedLocations || []) {
        // Apply Eswatini multiplier for local suppliers
        const priceMultiplier = location.country === 'SZ' ? eswatiniMultiplier : 1;
        const currentPrice = generatePrice(basePrice * priceMultiplier, 0.12);

        // Current price
        pricesData.push({
          material_id: material.id,
          supplier_id: location.supplier_id,
          location_id: location.id,
          price: currentPrice,
          currency: location.country === 'SZ' ? 'SZL' : 'ZAR',
          unit: material.unit,
          valid_from: now,
          verified: Math.random() > 0.3, // 70% verified
        });

        // Historical prices (past 30 days, every 7 days)
        for (let daysAgo = 7; daysAgo <= 30; daysAgo += 7) {
          const historicalDate = new Date(now);
          historicalDate.setDate(historicalDate.getDate() - daysAgo);
          
          // Simulate price trends (slight random walk)
          const trendFactor = 1 + (Math.random() - 0.5) * 0.05;
          const historicalPrice = generatePrice(basePrice * priceMultiplier * trendFactor, 0.08);

          pricesData.push({
            material_id: material.id,
            supplier_id: location.supplier_id,
            location_id: location.id,
            price: historicalPrice,
            currency: location.country === 'SZ' ? 'SZL' : 'ZAR',
            unit: material.unit,
            valid_from: historicalDate,
            verified: true,
          });
        }
      }
    }

    // Insert in batches (Supabase has limits)
    const batchSize = 500;
    for (let i = 0; i < pricesData.length; i += batchSize) {
      const batch = pricesData.slice(i, i + batchSize);
      const { error: pricesError } = await supabase
        .from('prices')
        .insert(batch);
      
      if (pricesError) throw pricesError;
      console.log(`✅ Inserted price batch ${Math.floor(i/batchSize) + 1}`);
    }

    console.log(`✅ Total prices inserted: ${pricesData.length}`);
    console.log('🎉 Seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

// Run the seed
seed();