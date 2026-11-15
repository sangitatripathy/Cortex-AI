import { PLANS } from "../config/Plan.js";
import razorpay from "../config/razorpay.js";
import Payment from "../model/payment.model.js";
import crypto from "crypto";
import axios from "axios";

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.headers["x-user-id"];
    const selectedPlan = PLANS[plan];

    if (!selectedPlan) {
      return res.status(404).json({ message: "plan not found" });
    }

    if (selectedPlan.amount <= 0) {
      return res.status(400).json({ message: "Free plan does not require payment" });
    }

    const order = await razorpay.orders.create({
      amount: selectedPlan.amount * 100,
      currency: "INR",
      receipt: `receipt-${Date.now()}`,
    });

    await Payment.create({
      userId,
      orderId: order.id,
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      plan: selectedPlan.id,
      currency: order.currency,
      status: "created",
    });

    return res.status(200).json({
      order,
      plan: selectedPlan,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        message: error.error?.description || "Razorpay order creation failed",
      });
    }
    const unreachable = error instanceof TypeError && /reading 'status'/.test(error.message);
    return res.status(unreachable ? 502 : 500).json({
      message: unreachable
        ? "Could not reach Razorpay (network error). Please try again."
        : `Error occurred while placing order: ${error?.message || error}`,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generateSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generateSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    payment.status = "paid";
    payment.paymentId = razorpay_payment_id;

    await payment.save();

    await axios.post(`${process.env.AUTH_SERVICE_URI}/update-plan`, {
      userId: payment.userId,
      plan: payment.plan,
      credits: payment.credits,
      sessionId: req.headers["x-session-id"],
    });
    return res.status(200).json({message:"Payment verified"});
  } catch (error) {
    return res.status(500).json({message:`Verify payment error ${error}`});
  }
};
                                                                                                                                                  