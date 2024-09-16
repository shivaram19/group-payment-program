import express from "express";
const router = express.Router();
import { createGroup, createUserInfo, sendPayment } from "./web3";

// Route to create user info
router.post("/create-user", async (req, res) => {
  const { username, walletAddress } = req.body;
  try {
    const tx = await createUserInfo(username, walletAddress);
    res.json({ success: true, transaction: tx });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a group
router.post("/create-group", async (req, res) => {
  const { title, recipient, members, admin } = req.body;
  try {
    const tx = await createGroup(title, recipient, members, admin);
    res.json({ success: true, transaction: tx });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

// Route to send payment
router.post("/send-payment", async (req, res) => {
  const { amount, payer, groupInfo } = req.body;
  try {
    const tx = await sendPayment(amount, payer, groupInfo);
    res.json({ success: true, transaction: tx });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
