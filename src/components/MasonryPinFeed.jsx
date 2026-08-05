import { useEffect, useState } from "react";
import { apiGet } from "../config/api";

function buildFallbackImage(seed) {
  return `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/400/600`;
}

function buildFallbackPins(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `fallback-${Date.now()}-${index}`,
    title: "Beautiful inspiration",
    description: "Curated from a fresh random image feed",
    image: buildFallbackImage(`fallback-${Date.now()}-${index}`),
    user: "Curated",
  }));
}

function getPinImage(pin, index) {
  if (pin.imageUrl) return pin.imageUrl;
  if (pin.image) return pin.image;
  return buildFallbackImage(pin.id || `pin-${index}`);
}

export default function MasonryPinFeed() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPins();

    const onPinsUpdated = () => {
      fetchPins();
    };

    window.addEventListener('pins:updated', onPinsUpdated);
    return () => window.removeEventListener('pins:updated', onPinsUpdated);
  }, []);

  const fetchPins = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/api/pins/all");
      const backendPins = Array.isArray(data) ? data : [];
      setPins(backendPins);
      setError(null);
    } catch (err) {
      console.error("Error fetching pins:", err);
      setPins([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const displayPins = pins.length < 8 ? [...pins, ...buildFallbackPins(8 - pins.length)] : pins;

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading pins...</p>;
  }

  return (
    <div
      style={{
        columnCount: 4,
        columnGap: "16px",
        padding: "20px"
      }}
    >
      {displayPins.length === 0 && (
        <p style={{ padding: "20px" }}>No pins available</p>
      )}

      {displayPins.map((pin, index) => (
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
            src={getPinImage(pin, index)}
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