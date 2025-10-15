const express = require("express");
const axios = require("axios");
const cors = require("cors");
const activityLogger = require("./activityLogger");

const app = express();
app.set("trust proxy", true); // in case of proxy in future

app.use(cors());
app.use(express.static(__dirname));

// Attach logger BEFORE routes
app.use(activityLogger);

// Route: Live USDT → NGN rate
app.get("/api/rate", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn"
    );
    const rate = response.data.tether.ngn;
    res.json({ success: true, rate });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch rate" });
  }
});

// Route: Convert amount
app.get("/api/convert", async (req, res) => {
  const { amount } = req.query;
  if (!amount) return res.status(400).json({ error: "Please provide amount" });

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn"
    );
    const rate = response.data.tether.ngn;
    const result = rate * parseFloat(amount);
    res.json({
      success: true,
      amount_usdt: amount,
      converted_ngn: result.toFixed(2),
      rate,
    });
  } catch (error) {
    res.status(500).json({ error: "Conversion failed" });
  }
});

module.exports = app;
