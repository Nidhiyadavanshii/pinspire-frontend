import { useEffect, useState } from "react";
import { apiGet } from "../config/api";

export default function MasonryPinFeed() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/api/pins/all");
      setPins(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching pins:", err);
      setError("Failed to load pins");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading pins...</p>;
  }

  if (error) {
    return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  }

  return (
    <div
      style={{
        columnCount: 4,
        columnGap: "16px",
        padding: "20px"
      }}
    >
      {pins.length === 0 && (
        <p style={{ padding: "20px" }}>No pins available</p>
      )}

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