import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import axios from "axios";


export default function PersonalDetail() {
  const navigate = useNavigate();







  const [formData, setFormData] = useState({
    name: "",
    phone: "",
   
    quantity: ""
  });

  const [isExisting, setIsExisting] = useState(false);
  const [cars, setCars] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [carForm, setCarForm] = useState({ carName: "", carNumber: "" });
 
  const [selectedCars, setSelectedCars] = useState([]);



const checkPhoneNumber = async () => {
    if (formData.phone.length !== 10) return;

    try {
      const res = await axios.get(
        `http://localhost:4000/api/customer/by-phone?phone=${formData.phone}`
      );

      if (res.data.exists) {
        setIsExisting(true);
        setFormData(prev => ({
          ...prev,
          name: res.data.data.name
        }));
        setCars(res.data.data.cars || []);
     
      } else {
        setIsExisting(false);
        setFormData(prev => ({ ...prev, name: "" }));
        setCars([]);
      }

    } catch (err) {
      console.error(err);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check existing customer


  // Open Add Car Modal
  const openAddCar = () => {
    setCarForm({ carName: "", carNumber: "" });
    setEditIndex(null);
    setShowDialog(true);
  };

  // Open Edit Car Modal
  const openEditCar = (index) => {
    setCarForm(cars[index]);
    setEditIndex(index);
    setShowDialog(true);
  };

  // Save Car (Add or Update)
const saveCar = () => {
  if (!carForm.carName || !carForm.carNumber) {
    alert("Fill all fields");
    return;
  }

  if (editIndex !== null) {
    const updated = [...cars];
    updated[editIndex] = carForm;
    setCars(updated);
  } else {
    const updatedCars = [...cars, carForm];
    setCars(updatedCars);

    // ✅ IMPORTANT FIX
    if (!isExisting) {
      setSelectedCars([updatedCars.length - 1]);
    }
  }

  setShowDialog(false);
  setCarForm({ carName: "", carNumber: "" });
  setEditIndex(null);
};


  // Delete Car
  const deleteCar = () => {
    const updated = cars.filter((_, i) => i !== editIndex);
    setCars(updated);
    setShowDialog(false);
    setEditIndex(null);
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  await checkPhoneNumber();

  if (selectedCars.length === 0) {
    alert("Please select at least one car");
    return;
  }

  const selectedCarDetails = selectedCars.map((index) => ({
    carName: cars[index].carName,
    carNumber: cars[index].carNumber
  }));

  const finalData = {
    name: formData.name,
    phone: formData.phone,
    quantity: Number(formData.quantity),
    cars: selectedCarDetails
  };

  

  // ✅ NAVIGATE AFTER API SUCCESS
  navigate("/service", { state: finalData });
 

};


  return (
    <form className="personal-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Personal Details</h2>

      {/* PHONE */}
      
  

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
          onBlur={checkPhoneNumber}
          required
        />
        {formData.phone && (
          <small style={{ color: isExisting ? "green" : "gray" }}>
            {isExisting ? "✔ Existing Customer" : "➕ New Customer"}
          </small>
        )}
      </div>

      {/* NAME */}
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Customer name"
          onChange={handleChange}
          required
        />
      </div>

      {/* CAR SECTION */}
{/* CAR SECTION */}
<div className="form-group">
  <label>Car Details</label>

  {/* IF CAR EXISTS (NEW OR EXISTING CUSTOMER) */}
{cars.length > 0 && (
  <div className="car-list">
    {cars.map((car, index) => (
      <label key={index} className="car-checkbox">
        <input
          type="checkbox"
          checked={selectedCars.includes(index)}
          onChange={() => {
            setSelectedCars((prev) =>
              prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
            );
          }}
        />
        {car.carName} - {car.carNumber}
      </label>
    ))}

    <button
      type="button"
      onClick={openAddCar}
      className="submit-btn"
    >
      + Add Another Car
    </button>
  </div>
)}


  {/* IF NO CAR YET */}
  {cars.length === 0 && (
    <button
      type="button"
      onClick={openAddCar}
      className="submit-btn"
    >
      + Add Car
    </button>
  )}
</div>


      {/* QUANTITY */}
      <div className="form-group">
        <label>Quantity</label>
        <select
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        >
          <option value="">Select quantity</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="submit-btn">
        Continue
      </button>

      {/* CAR MODAL */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>{editIndex !== null ? "Edit Car" : "Add Car"}</h3>

            <input
              type="text"
              placeholder="Car Name"
              value={carForm.carName}
              onChange={(e) =>
                setCarForm({ ...carForm, carName: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Car Number"
              value={carForm.carNumber}
              onChange={(e) =>
                setCarForm({ ...carForm, carNumber: e.target.value })
              }
            />

            <div className="dialog-actions">
              <button type="button" onClick={saveCar} className="save-btn">
                {editIndex !== null ? "Update" : "Add"}
              </button>

              {editIndex !== null && (
                <button type="button" onClick={deleteCar} className="delete-btn">
                  Delete
                </button>
              )}

              <button type="button" onClick={() => setShowDialog(false)}  className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
