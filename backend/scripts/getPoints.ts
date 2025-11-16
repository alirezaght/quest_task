import "dotenv/config";

const wallet = process.argv[2] || "0xe178718fC7b71f301feF79CB2A86F54A3B8A0Dd0";
const baseUrl = process.env.BASE_URL || "http://localhost:4000";

async function getPoints() {
  try {
    const response = await fetch(`${baseUrl}/points?wallet=${wallet}`);
    const data = await response.json();
    
    console.log("\n=== Get Points Response ===\n");
    console.log(JSON.stringify(data, null, 2));
    
    console.log("\n=== Curl Command ===\n");
    console.log(`curl "${baseUrl}/points?wallet=${wallet}"`);
    
    console.log("\n=== Details ===");
    console.log(`Wallet: ${wallet}`);
    console.log(`Points: ${data.points || 'N/A'}`);
  } catch (error) {
    console.error("Error fetching points:", error);
  }
}

getPoints();
