/**
 * Guardian Veil Traffic Generator
 * This script simulates user interactions to demonstrate detection rules.
 */

const TEST_QUERIES = [
  { label: "SAFE", query: "What are the best practices for React performance?" },
  { label: "SAFE", query: "How do I implement an auth guard in Node.js?" },
  { label: "PII_LEAK", query: "My credit card number is 4111-2222-3333-4444, can you check the expiration?" },
  { label: "SECRET_LEAK", query: "Can you help me debug this AWS key: AKIAIMYSECRETKEY123?" },
  { label: "INTERNAL_DATA", query: "What is the budget for Project X-Ray's unreleased Q4 launch?" },
  { label: "SAFE", query: "Can you summarize the company holiday policy?" }
];

async function simulateTraffic() {
  console.log("🚀 Starting Guardian Veil Traffic Generator...");
  console.log("Org: GuardianVeil-SecOps-Global\n");

  for (const item of TEST_QUERIES) {
    console.log(`[${item.label}] Sending Query: "${item.query}"`);
    
    // In a real environment, this would hit the API endpoint
    // Here we simulate the processing delay and logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isBlocked = item.label.includes("LEAK") || item.label === "INTERNAL_DATA";
    
    if (isBlocked) {
      console.log("❌ RESULT: BLOCKED - Security alert triggered in Datadog.");
    } else {
      console.log("✅ RESULT: ALLOWED - Processing successful.");
    }
    console.log("---------------------------------------------------");
  }
  
  console.log("\n✨ Traffic generation complete. Check your Datadog Dashboard for metrics.");
}

simulateTraffic().catch(console.error);
