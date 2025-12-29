import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ServicePage() {
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const customer = location.state;
  const navigate = useNavigate();

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/api/services");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSelect = () => {
    if (!selectedService) {
      alert("Please select a service first!");
      return;
    }

    navigate("/payment", {
      state: {
        data: customer,
        service: selectedService.label,
        price: selectedService.price,
      },
    });
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading services...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>{error}</div>;
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        padding: "25px",
        borderRadius: "16px",
        backgroundColor: "#fff",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Select Service</h2>

      {/* Selected Service Display */}
      {selectedService && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "25px",
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,128,0,0.2)",
            fontWeight: "bold",
          }}
        >
          {selectedService.icon && (
            <img
              src={`http://localhost:4000/icons/${selectedService.icon}`}
              alt={selectedService.label}
              style={{ width: "50px", marginRight: "15px" }}
            />
          )}
          <div>
            {selectedService.label} {selectedService.price && `- ${selectedService.price}`}
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {services.map((item) => (
          <ServiceCard
            key={item._id || item.label}
            label={item.label}
            icon={`http://localhost:4000/icons/${item.icon}`}
            price={item.price}
            selected={selectedService === item}
            onClick={() => setSelectedService(item)}
            style={{ width: "100%", height: "180px" }}
          />
        ))}
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleSelect}
        style={{
          marginTop: "35px",
          width: "100%",
          padding: "15px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0069d9")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Select & Proceed
      </button>
    </div>
  );
}
