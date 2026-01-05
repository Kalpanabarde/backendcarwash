import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DiscountInput from "./discountInput";

export default function PaymentPage() {
  const location = useLocation();
  const { service, data, price } = location.state;
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(
    location.state?.paymentStatus || ""
  );
  const [discount, setDiscount] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const originalTotal = price * data.quantity;
  const discountedTotal = Math.max(originalTotal - discount, 0);
  const paymentOptions = ["Card", "Cash", "Banking", "Credit"];

  const playVoice = () => {
    const msg = new SpeechSynthesisUtterance("Payment received");
    msg.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  const handleCompletedPayment = async (method) => {
    setPaymentMethod(method);
    setPaymentStatus("completed");
    setSuccessMessage("Payment completed successfully");
    playVoice();

    const payload = { service, data, TotalPrice: discountedTotal, paymentMethod: method, paymentStatus: "completed" };
    const response = await fetch("http://localhost:4000/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) return setSuccessMessage("Payment failed");

    const savedOrder = await response.json();
    setTimeout(() => {
      setSuccessMessage("");
      navigate("/billing", { state: { service, data, TotalPrice: discountedTotal, paymentMethod: method, paymentStatus: "completed", savedOrder } });
    }, 2000);
  };

  const handleCreditPayment = async () => {
    setPaymentMethod("Credit");
    setPaymentStatus("pending");
    setSuccessMessage("Payment added as credit (Pending)");

    const payload = { service, data, TotalPrice: discountedTotal, paymentMethod: "Credit", paymentStatus: "pending" };
    await fetch("http://localhost:4000/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/billing", { state: { service, data, TotalPrice: discountedTotal, paymentMethod: "Credit", paymentStatus: "pending" } });
    }, 2000);
  };

  const handlePayment = () => {
    if (!paymentMethod) return alert("Select a payment method");
    paymentMethod === "Credit" ? handleCreditPayment() : handleCompletedPayment(paymentMethod);
  };

  return (
    <div style={{ maxWidth: "520px", margin: "60px auto", padding: "28px", background: "#fff", borderRadius: "16px", boxShadow: "0 12px 28px rgba(0,0,0,0.12)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>💳 Payment</h2>

      <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "18px", marginBottom: "25px", border: "1px solid #e3e3e3" }}>
        <h3>🧾 Summary</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#28a745", color: "#fff" }}>
              <th style={{ padding: "14px", textAlign: "left" }}>Car Name</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Car Number</th>
            </tr>
          </thead>
          <tbody>
            {data.cars.map((car, idx) => (
              <tr key={idx}>
                <td style={{ padding: "12px" }}>{car.carName}</td>
                <td style={{ padding: "12px" }}>{car.carNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p><strong>Quantity:</strong> {data.quantity}</p>
        <p><strong>Service:</strong> {service}</p>
        <p><strong>Payment Type:</strong> {paymentMethod || "-"}</p>
        <div style={{ marginTop: "15px", paddingTop: "12px", borderTop: "1px dashed #ccc", display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", color: "#28a745" }}>
          <span>Total</span>
          <div style={{ textAlign: "right" }}>
            {discount > 0 && <div style={{ fontSize: "14px", color: "#dc3545" }}>Discount: -AED {discount}</div>}
            <div>AED {discountedTotal}</div>
          </div>
        </div>
      </div>

      {/* DiscountInput Component */}
      <DiscountInput onDiscountApplied={setDiscount}
 />

      <h3>Select Payment Method</h3>
      <div style={{ display: "flex", gap: "12px" }}>
        {paymentOptions.map((option) => (
          <div key={option} onClick={() => setPaymentMethod(option)} style={{ flex: 1, padding: "18px", textAlign: "center", borderRadius: "12px", cursor: "pointer", fontWeight: "600", backgroundColor: paymentMethod === option ? "#e6f4ea" : "#fff", border: paymentMethod === option ? "2px solid #28a745" : "1px solid #ccc" }}>
            {option}
          </div>
        ))}
      </div>

      <button onClick={handlePayment} disabled={paymentStatus === "completed"} style={{ marginTop: "30px", width: "100%", padding: "16px", fontSize: "17px", fontWeight: "bold", color: "#fff", background: paymentStatus === "completed" ? "#6c757d" : "linear-gradient(135deg, #28a745, #218838)", border: "none", borderRadius: "14px" }}>
        {paymentStatus === "completed" ? "Payment Done" : "Pay Now"}
      </button>
{successMessage && (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // ✅ fixed extra quote
      backgroundColor: "#28a745",
      color: "#fff",
      padding: "22px 36px",
      borderRadius: "16px",
      fontSize: "20px",
      fontWeight: "bold",
      zIndex: 9999,
      textAlign: "center",
    }}
  >
    ✅ {successMessage}
  </div>
)}

  </div>
)}















/**import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const location = useLocation();
  const { service, data, price } = location.state;
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(
    location.state?.paymentStatus || ""
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [showDiscountBox, setShowDiscountBox] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [securityKey, setSecurityKey] = useState("");


  // ✅ MISSING STATE (FIX)
  const [discountApplied, setDiscountApplied] = useState(false);

  const originalTotal = price * data.quantity;
  const discountedTotal = Math.max(originalTotal - discount, 0);

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
      setPaymentMethod(method);
      setPaymentStatus("completed");
      setSuccessMessage("Payment completed successfully");
      playVoice();

      const payload = {
        service,
        data,
        TotalPrice: discountedTotal,
        paymentMethod: method,
        paymentStatus: "completed",
      };

      const response = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save order on server");
      }

      const savedOrder = await response.json();

      setTimeout(() => {
        setSuccessMessage("");
        navigate("/billing", {
          state: {
            service,
            data,
            TotalPrice: discountedTotal,
            paymentMethod: method,
            paymentStatus: "completed",
            savedOrder,
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
      TotalPrice: discountedTotal,
      paymentMethod: "Credit",
      paymentStatus: "pending",
    };

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
          TotalPrice: discountedTotal,
          paymentMethod: "Credit",
          paymentStatus: "pending",
        },
      });
    }, 2000);
  };

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
    <div
      style={{
        maxWidth: "520px",
        margin: "60px auto",
        padding: "28px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
        position: "relative",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>💳 Payment</h2>

  
      <div
        style={{
          background: "#f8f9fa",
          borderRadius: "12px",
          padding: "18px",
          marginBottom: "25px",
          border: "1px solid #e3e3e3",
        }}
      >
        <h3>🧾 Summary</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#28a745", color: "#fff" }}>
              <th style={{ padding: "14px", textAlign: "left" }}>Car Name</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Car Number</th>
            </tr>
          </thead>
          <tbody>
            {data.cars.map((car, idx) => (
              <tr key={idx}>
                <td style={{ padding: "12px" }}>{car.carName}</td>
                <td style={{ padding: "12px" }}>{car.carNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p><strong>Quantity:</strong> {data.quantity}</p>
        <p><strong>Service:</strong> {service}</p>
        <p><strong>Payment Type:</strong> {paymentMethod || "-"}</p>

        <div
          style={{
            marginTop: "15px",
            paddingTop: "12px",
            borderTop: "1px dashed #ccc",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#28a745",
          }}
        >
          <span>Total</span>
          <div style={{ textAlign: "right" }}>
            {discount > 0 && (
              <div style={{ fontSize: "14px", color: "#dc3545" }}>
                Discount: -AED {discount}
              </div>
            )}
            <div>AED {discountedTotal}</div>
          </div>
        </div>
      </div>

   

      <div style={{ marginTop: "15px" }}>
   
        <button
          type="button"
          onClick={() => setShowDiscountBox(true)}
          style={{
            background: "#ffc107",
            border: "none",
            padding: "10px 16px",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          💸 Apply Discount
        </button>

   
        {showDiscountBox && (
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Discount amount"
              value={discount}
              disabled={discountApplied}
              onChange={(e) =>
                setDiscount(Number(e.target.value.replace(/\D/g, "")))
              }
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: discountApplied ? "#e9ecef" : "#fff",
              }}
            />

            {!discountApplied ? (
              <button
                onClick={() => discount > 0 && setShowSecurityDialog(true)}

                style={{
                  background: "#28a745",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Apply
              </button>
            ) : (
              <button
                onClick={() => {
                  setDiscount(0);
                  setDiscountApplied(false);
                  setShowDiscountBox(false); // optional UX
                }}
                style={{
                  background: "#dc3545",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>
      {showSecurityDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "10px", // ensures modal doesn't overflow small screens
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "340px",
              background: "#fff",
              padding: "28px 20px",
              borderRadius: "16px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
              textAlign: "center",
              overflow: "hidden", // ensures no child elements overflow
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔐</div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "22px" }}>Staff Verification</h2>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
              Enter your security key to apply the discount
            </p>

            <input
              type="password"
              placeholder="Security Key"
              value={securityKey}
              onChange={(e) => setSecurityKey(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                marginBottom: "20px",
                fontSize: "16px",
                boxSizing: "border-box", // ensures padding doesn't overflow
              }}
            />

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                style={{
                  flex: 1,
                  minWidth: "120px",
                  background: "#28a745",
                  color: "#fff",
                  padding: "12px 0",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Verify
              </button>

              <button
                onClick={() => {
                  setShowSecurityDialog(false);
                  setSecurityKey("");
                }}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  background: "#dc3545",
                  color: "#fff",
                  padding: "12px 0",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


  
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
              border:
                paymentMethod === option
                  ? "2px solid #28a745"
                  : "1px solid #ccc",
            }}
          >
            {option}
          </div>
        ))}
      </div>

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
          background:
            paymentStatus === "completed"
              ? "#6c757d"
              : "linear-gradient(135deg, #28a745, #218838)",
          border: "none",
          borderRadius: "14px",
        }}
      >
        {paymentStatus === "completed" ? "Payment Done" : "Pay Now"}
      </button>

      {successMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "22px 36px",
            borderRadius: "16px",
            fontSize: "20px",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            textAlign: "center",
          }}
        >
          ✅ {successMessage}
        </div>
      )}

    </div>
  );
}**/
