import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const location = useLocation();
  const { service, data, price } = location.state;
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(location.state?.paymentStatus || "");
  const [successMessage, setSuccessMessage] = useState("");

  const TotalPrice = price * data.quantity;
  const paymentOptions = ["Card", "Cash", "Banking", "Credit"];

  const playVoice = () => {
    const msg = new SpeechSynthesisUtterance("Payment received");
    msg.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  // 🔹 Handle payment for Card, Cash, Banking
const handleCompletedPayment = async (method) => {
  try {
    // Update state immediately
    setPaymentMethod(method);
    setPaymentStatus("completed");
    setSuccessMessage("Payment completed successfully");
    playVoice();

    // Prepare payload for backend
    const payload = {
      service,
      data,
      TotalPrice,
      paymentMethod: method,
      paymentStatus: "completed",
    };

    // Send data to backend
    const response = await fetch("http://localhost:4000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save order on server");
    }

    // Optional: get the saved order from response
    const savedOrder = await response.json();
    console.log("Saved order:", savedOrder);

    // Navigate to billing page after 2 seconds
    setTimeout(() => {
      setSuccessMessage(""); // clear success message
      navigate("/billing", {
        state: { 
          service,
          data,
          TotalPrice,
          paymentMethod: method,
          paymentStatus: "completed",
          savedOrder, // pass saved order if needed
        },
      });
    }, 2000);

  } catch (error) {
    console.error("Payment handling error:", error);
    setSuccessMessage("Payment failed. Please try again.");
  }
};


  // 🔹 Handle Credit payment
  const handleCreditPayment = async () => {
    setPaymentMethod("Credit");
    setPaymentStatus("pending");
    setSuccessMessage("Payment added as credit (Pending)");

    const payload = {
      service,
      data,
      TotalPrice,
      paymentMethod: "Credit",
      paymentStatus: "pending",
    };

    // Send to backend
    await fetch("http://localhost:4000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/billing", {
        state: {
          service,
          data,
          TotalPrice,
          paymentMethod: "Credit",
          paymentStatus: "pending",
        },
      });
    }, 2000);
  };

  // 🔹 Map selected option to handler
  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method!");
      return;
    }
    if (paymentMethod === "Credit") {
      handleCreditPayment();
    } else {
      handleCompletedPayment(paymentMethod);
    }
  };

  return (
    <div style={{ maxWidth: "520px", margin: "60px auto", padding: "28px", background: "#fff", borderRadius: "16px", boxShadow: "0 12px 28px rgba(0,0,0,0.12)", position: "relative" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>💳 Payment</h2>

      {/* Summary */}
      <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "18px", marginBottom: "25px", border: "1px solid #e3e3e3" }}>
        <h3>🧾 Summary</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
          <thead>
            <tr style={{ backgroundColor: "#28a745", color: "#fff" }}>
              <th style={{ padding: "14px", textAlign: "left" }}>Car Name</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Car Number</th>
            </tr>
          </thead>
          <tbody>
            {data.cars.map((car, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={{ padding: "12px 14px", borderBottom: "1px solid #e5e5e5" }}>{car.carName}</td>
                <td style={{ padding: "12px 14px", borderBottom: "1px solid #e5e5e5" }}>{car.carNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p><strong>Quantity:</strong> {data.quantity}</p>
        <p><strong>Service:</strong> {service}</p>
        <p><strong>Payment Type:</strong> {paymentMethod || "-"}</p>

        {paymentStatus && (
          <div style={{ marginTop: "10px" }}>
            <strong>Status:</strong>{" "}
            <span style={{
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              marginLeft: "8px",
              backgroundColor: paymentStatus === "completed" ? "#d4edda" : "#f1e7c7ff",
              color: paymentStatus === "completed" ? "#155724" : "#725e21ff",
            }}>
              {paymentMethod === "Credit" && paymentStatus === "pending"
                ? "Pending"
                : paymentStatus === "completed"
                  ? "Payment Done"
                  : "Pay Now"}
            </span>
          </div>
        )}

        <div style={{ marginTop: "15px", paddingTop: "12px", borderTop: "1px dashed #ccc", display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", color: "#28a745" }}>
          <span>Total</span>
          <span>AED {TotalPrice}</span>
        </div>
      </div>

      {/* Payment Options */}
      <h3>Select Payment Method</h3>
      <div style={{ display: "flex", gap: "12px" }}>
        {paymentOptions.map((option) => (
          <div
            key={option}
            onClick={() => setPaymentMethod(option)}
            style={{
              flex: 1,
              padding: "18px",
              textAlign: "center",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              backgroundColor: paymentMethod === option ? "#e6f4ea" : "#fff",
              border: paymentMethod === option ? "2px solid #28a745" : "1px solid #ccc",
            }}
          >
            {option}
          </div>
        ))}
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={paymentStatus === "completed"}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "16px",
          fontSize: "17px",
          fontWeight: "bold",
          color: "#fff",
          background: paymentStatus === "completed" ? "#6c757d" : "linear-gradient(135deg, #28a745, #218838)",
          border: "none",
          borderRadius: "14px",
          cursor: paymentStatus === "completed" ? "not-allowed" : "pointer",
        }}
      >
        {paymentStatus === "completed" ? "Payment Done" : "Pay Now"}
      </button>

      {/* Success Toast */}
      {successMessage && (
        <div style={{
          position: "absolute",
          top: "-55px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#28a745",
          color: "#fff",
          padding: "12px 22px",
          borderRadius: "10px",
          fontWeight: "bold",
        }}>
          {successMessage}
        </div>
      )}
    </div>
  );
}
