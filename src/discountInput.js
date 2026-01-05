import React, { useState } from "react";
import SecurityKeyModal from "./securityKeyModal";

export default function DiscountInput({ onDiscountApplied }) {
  const [showInput, setShowInput] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");


  // key is now received from SecurityKeyModal
 const handleVerifyKey = async (securityKey) => {
  try {
    const res = await fetch("http://localhost:4000/api/discount/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key: securityKey
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Verification failed");
      return;
    }
if (res.ok && data.success) {
  setDiscountApplied(true);
  setShowSecurityModal(false);
    console.log("VERIFIED:", data);
  setSuccessMsg("✅ Security key verified. Discount unlocked!");

  onDiscountApplied(discount);

  // auto-hide popup after 2 sec
  setTimeout(() => setSuccessMsg(""), 2000);
}

    

    // ✅ VERIFIED



  } catch (err) {
    console.error("FRONTEND VERIFY ERROR:", err);
    alert("Server error");
  }
};


  return (
    <div style={{ marginTop: "15px" }}>
      <button
        onClick={() => setShowInput(true)}
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

      {showInput && (
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="number"
            placeholder="Discount amount"
            value={discount}
            disabled={discountApplied}
            onChange={(e) =>
              setDiscount(Math.max(0, Number(e.target.value)))
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
              onClick={() => discount > 0 && setShowSecurityModal(true)}
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
                onDiscountApplied(0);
                setShowInput(false);
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

      <SecurityKeyModal
        open={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        onVerify={handleVerifyKey} // passes the key from modal
      />
      {successMsg && (
  <div
    style={{
      background: "#d4edda",
      color: "#155724",
      padding: "10px 14px",
      borderRadius: "8px",
      marginBottom: "10px",
      fontWeight: "bold",
      textAlign: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
    }}
  >
    {successMsg}
  </div>
)}

    </div>
  );
}
