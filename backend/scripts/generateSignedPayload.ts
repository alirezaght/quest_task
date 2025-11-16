import "dotenv/config";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
const account = privateKeyToAccount(privateKey);
const baseUrl = process.env.BASE_URL || "http://localhost:4000";

const message = {
  wallet: account.address,
  quest_id: "daily-login-004",
  quest_type: "daily",
  timestamp: Date.now(),
};

// Create message string (must match what the server expects)
const messageString = JSON.stringify(message);

// Sign the message
async function signMessage() {
  const signature = await account.signMessage({
    message: messageString,
  });

  const payload = {
    signature,
    message,
  };

  console.log("\n=== Signed Payload ===\n");
  console.log(JSON.stringify(payload, null, 2));
  
  console.log("\n=== Account Address ===");
  console.log(account.address);

  // Make the POST request
  console.log("\n=== Sending POST Request ===\n");
  try {
    const response = await fetch(`${baseUrl}/points`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("\n❌ Request failed");
    } else {
      console.log("\n✅ Request successful");
    }
  } catch (error) {
    console.error("\n❌ Error making request:", error);
  }

  console.log("\n=== Curl Command (for reference) ===\n");
  console.log(`curl -X POST ${baseUrl}/points \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '${JSON.stringify(payload)}'`);
}

signMessage().catch(console.error);
