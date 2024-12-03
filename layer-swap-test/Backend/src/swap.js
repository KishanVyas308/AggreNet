import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

// const API_KEY = "Dz1jVir9WUD0gBWoGbOmS1oe5K4985SGptaZXjF4z9VVrvO5nC9q55h8TE/3CIESRxWdYVpPnz/H2BogL2eG+A";
 const API_KEY = "NDBxG+aon6WlbgIA2LfwmcbLU52qUL9qTnztTuTRPNSohf/VnxXpRaJlA5uLSQVqP8YGIiy/0mz+mMeZhLY4/Q";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/create-swap", async (req, res) => {
  const data = req.body;
  try {
    const response = await createSwap(data);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/swaps/:id", async (req, res) => {
  const swapId = req.params.id;
  try {
    const status = await getSwapStatus(swapId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a swap transaction
async function createSwap(data) {
  console.log("Creating swap...", data);

  // "destination_address": "0x03d106c13b14e767b4a6c407bfb230dbdad053545fc6f10bda6516770223aca0",
  // "reference_id": null,
  // "source_network": "ETHEREUM_MAINNET",
  // "source_token": "ETH",
  // "destination_network": "STARKNET_MAINNET",
  // "destination_token": "ETH",
  // "refuel": false,
  // "use_deposit_address": false,
  // "use_new_deposit_address": null,
  // "amount": 0.03,
  // "source_address": null,
  // "slippage": null
  
  try {
    const response = await axios.post("https://api.layerswap.io/api/v2/swaps",data, {
      headers: {
        "x-ls-apikey": API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("Swap response:", response.data);
    
    
    const swapId = response.data.data.swap.id;
    console.log("Swap created successfully! Swap ID:", swapId);

    // Start monitoring swap status
    getSwapStatus(swapId);

    return swapId;
  } catch (error) {
    console.error("Error creating swap:", error.response?.data || error.message);
    throw error;
  }
}

// Monitor the status of the swap
async function getSwapStatus(swapId) {
  const MAX_RETRIES = 40;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log(`Checking swap status (Attempt ${retries + 1})...`);

      const response = await axios.get(`https://api.layerswap.io/api/v2/swaps/${swapId}?exclude_deposit_actions=true`, {
        headers: {
          "x-ls-apikey": API_KEY,
        },
      });

      const swap = response.data.data.swap;
      const transactions = swap.transactions || [];

      const firstStatus = transactions[0]?.status || "pending";
      const secondStatus = transactions[1]?.status || "pending";
      const transactionHash = transactions[1]?.transaction_hash || "No Hash Available";

      console.log(`First Transaction Status: ${firstStatus}`);
      console.log(`Second Transaction Status: ${secondStatus}`);
      console.log(`Transaction Hash: ${transactionHash}`);
      console.log(`Overall Swap Status: ${swap.status}`);

      // Check if both transactions are completed
      if (firstStatus === "completed" && secondStatus === "completed") {
        console.log("Swap completed successfully!");
        break;
      }

      if (swap.status !== "user_transfer_pending" && swap.status !== "ls_transfer_pending") {
        console.log("Swap status is no longer pending. Exiting...");
        break;
      }

      // Wait for 7 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 7000));
      retries++;

    } catch (error) {
      console.error("Error fetching swap status:", error.response?.data || error.message);
      retries++;
      if (retries >= MAX_RETRIES) {
        console.error("Max retries reached. Exiting status monitoring.");
      }
    }
  }
}

app.listen(3000, () => {
  console.log("Server running on http://localhost:4002");
});