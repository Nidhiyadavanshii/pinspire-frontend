import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export default function MasonryPinFeed() {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/pins/all`);
      setPins(res.data);
    } catch (error) {
      console.log("Error fetching pins:", error);
    }
  };

  return (
    <div
      style={{
        columnCount: 4,
        columnGap: "16px",
        padding: "20px"
      }}
    >
      {pins.map((pin) => (
        <div
          key={pin.id}
          style={{
            breakInside: "avoid",
            marginBottom: "16px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            background: "#fff"
          }}
        >
          <img
            src={pin.imageUrl}
            alt={pin.title}
            style={{ width: "100%" }}
          />
          <div style={{ padding: "10px" }}>
            <h4>{pin.title}</h4>
            <p style={{ fontSize: "14px", color: "#666" }}>
              {pin.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}