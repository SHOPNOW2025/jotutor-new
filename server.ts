import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route to get Mastercard Session ID
  app.post("/api/payment/session", async (req, res) => {
    const { amount, currency, orderId } = req.body;
    const GATEWAY_URL = process.env.MASTERCARD_GATEWAY_URL || "https://ap-gateway.mastercard.com";
    const MERCHANT_ID = (process.env.MASTERCARD_MERCHANT_ID || "").trim();
    const API_PASSWORD = (process.env.MASTERCARD_API_PASSWORD || "").trim();

    if (!MERCHANT_ID || !API_PASSWORD) {
      return res.status(500).json({ 
        error: "Mastercard configuration missing",
        message: "Please ensure MASTERCARD_MERCHANT_ID and MASTERCARD_API_PASSWORD are set."
      });
    }

    try {
      const auth = Buffer.from(`merchant.${MERCHANT_ID}:${API_PASSWORD}`).toString('base64');
      
      console.log(`[Mastercard] Creating Session (v63 + CREATE_CHECKOUT_SESSION) for Merchant: ${MERCHANT_ID}`);
      
      const response = await fetch(
        `${GATEWAY_URL}/api/rest/version/63/merchant/${MERCHANT_ID}/session`,
        {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            apiOperation: "CREATE_CHECKOUT_SESSION"
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.session && data.session.id) {
        res.json({ 
          sessionId: data.session.id, 
          merchantId: MERCHANT_ID,
          successIndicator: data.successIndicator 
        });
      } else {
        console.error("Mastercard Session Error (v63):", data);
        res.status(response.status || 500).json({ 
          error: "Failed to create session", 
          details: data
        });
      }
    } catch (error: any) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  });

  // API Route to verify Mastercard Payment
  app.get("/api/payment/verify", async (req, res) => {
    const { orderId, resultIndicator, successIndicator } = req.query;
    const GATEWAY_URL = process.env.MASTERCARD_GATEWAY_URL || "https://ap-gateway.mastercard.com";
    const MERCHANT_ID = (process.env.MASTERCARD_MERCHANT_ID || "9547143225EP").trim();
    const API_PASSWORD = (process.env.MASTERCARD_API_PASSWORD || "").trim();

    if (!orderId || !resultIndicator || !successIndicator) {
      return res.status(400).json({ error: "Missing required verification parameters" });
    }

    if (resultIndicator !== successIndicator) {
      return res.status(400).json({ 
        success: false, 
        error: "Security mismatch: resultIndicator does not match successIndicator" 
      });
    }

    try {
      const auth = Buffer.from(`merchant.${MERCHANT_ID}:${API_PASSWORD}`).toString('base64');
      
      const response = await fetch(
        `${GATEWAY_URL}/api/rest/version/100/merchant/${MERCHANT_ID}/order/${orderId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      // Check if the order was successfully processed
      if (response.ok && (data.status === 'CAPTURED' || data.status === 'AUTHORIZED')) {
        res.json({ 
          success: true, 
          status: data.status,
          amount: data.amount,
          currency: data.currency,
          transactionId: data.transaction?.[0]?.transaction?.id
        });
      } else {
        res.status(400).json({ 
          success: false, 
          error: "Payment verification failed or order not completed", 
          details: data 
        });
      }
    } catch (error) {
      console.error("Verification Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
