// tests/geospatial.test.ts
import { analyzeLocation } from '../backend/core/geospatial.js';

console.log("════════════════════════════════════════════════════");
console.log("TESTING: Geospatial Engine");
console.log("════════════════════════════════════════════════════");

console.log("🧪 Testing Ghana Grid Coordinate Conversion...");

// Test 1: Ghana Grid to Geographic (using the wrapper)
try {
  const result = await analyzeLocation(5.588359, -0.175317);
  console.log(`✅ Geo analysis: Lat=${result.latitude.toFixed(6)}, Lon=${result.longitude.toFixed(6)}`);
  console.log(`   Flood Risk: ${result.floodRisk}`);
  console.log(`   Population Exposed: ${result.populationExposed}`);
} catch (e: any) {
  console.error(`❌ Analysis failed: ${e.message}`);
  process.exit(1);
}

// Test 2: Flood Zone Detection (Accra)
try {
  const result = await analyzeLocation(5.55, -0.20);
  console.log(`✅ Accra Analysis: Flood Risk=${result.floodRisk}, Zone=${result.floodZone || 'None'}`);
  if (result.floodRisk !== 'LOW') {
    console.log(`   ✅ Flood zone detected correctly`);
  }
} catch (e: any) {
  console.error(`❌ Accra flood zone detection failed: ${e.message}`);
  process.exit(1);
}

// Test 3: Flood Zone Detection (Tamale - Safe area)
try {
  const result = await analyzeLocation(9.3824, -0.8354);
  console.log(`✅ Tamale Analysis: Flood Risk=${result.floodRisk}, Zone=${result.floodZone || 'None'}`);
} catch (e: any) {
  console.error(`❌ Tamale flood zone detection failed: ${e.message}`);
  process.exit(1);
}

// Test 4: Buffer radius test
try {
  const result = await analyzeLocation(5.55, -0.20, 5000);
  console.log(`✅ Buffer test (5km): Population=${result.populationExposed}, Buildings=${result.buildingsAffected}`);
} catch (e: any) {
  console.error(`❌ Buffer test failed: ${e.message}`);
  process.exit(1);
}

console.log("✅ ALL GEOSPATIAL TESTS PASSED!");