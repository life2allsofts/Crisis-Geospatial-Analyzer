// tests/llm.test.ts
import { generateReasoning } from '../backend/core/llm_service.js';

try {
  const mockAnalysis = {
    latitude: 5.55,
    longitude: -0.20,
    floodRisk: "HIGH",
    populationExposed: 15423,
    buildingsAffected: 892,
    distanceToRisk: 0.5,
    floodZone: "Odaw River Basin"
  };
  
  const result = await generateReasoning(mockAnalysis);
  console.log(`✅ LLM reasoning generated: ${result.substring(0, 50)}...`);
} catch (e: any) {
  console.error(`❌ LLM service test failed: ${e.message}`);
  process.exit(1);
}

console.log("✅ LLM SERVICE TESTS PASSED!");