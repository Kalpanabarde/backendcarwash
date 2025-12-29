
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import "./App.css";

import PersonalDetail from './PersonalDetail';
import ServicePage from "./ServicePage";
import PaymentPage from "./PaymentPage";
import RecieptPage from "./RecieptPage";
import CreditPage  from './CreditPage'




function App() {
  return (
    <Router>
      <Routes>
     <Route path="/" element={<PersonalDetail />} />
     <Route path="/service" element={<ServicePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/billing" element={<RecieptPage />} />
         <Route path="/creditbilling" element={<CreditPage />} />
     </Routes>
    </Router>
  );
}

export default App;













/**import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    date: "",
    company: "",
    description: "",
    serviceType: "",
    cash: "",
    card: "",
    bank: "",
    totalCR: "",
    expense: "",
    pending: "",
    balance: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <h2>Personal Detail</h2>

      <form className="form-grid">
        <div>
          <label>Date</label>
          <input type="date" name="date" onChange={handleChange} />
        </div>

        <div>
          <label>Person Name</label>
          <input type="text" name="company" onChange={handleChange} />
        </div>

        <div>
          <label>Car Name</label>
          <input type="text" name="description" onChange={handleChange} />
        </div>
        
        <div>
          <label>Car Number</label>
          <input type="text" name="description" onChange={handleChange} />
        </div>
            <div>
          <label>Phone number</label>
          <input type="text" name="description" onChange={handleChange} />
        </div>

      <button
  type="submit"
  style={{
    padding: "12px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  }}
>
  Submit
</button>
      </form>
        </div>
)}





      



export default App; **/
