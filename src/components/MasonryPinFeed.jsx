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
    imageUrl: buildFallbackImage(`fallback-${Date.now()}-${index}`),
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

  useEffect(() => {
    fetchPins();

    const onPinsUpdated = () => {
      fetchPins();
    };

    window.addEventListener("pins:updated", onPinsUpdated);
    return () =>
      window.removeEventListener("pins:updated", onPinsUpdated);
  }, []);

  const fetchPins = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/api/pins/all");
      const backendPins = Array.isArray(data) ? data : [];
      setPins(backendPins);
    } catch (err) {
      console.error("Error fetching pins:", err);
      setPins([]);
    } finally {
      setLoading(false);
    }
  };

  const displayPins =
    pins.length < 8
      ? [...pins, ...buildFallbackPins(8 - pins.length)]
      : pins;

  if (loading) {
    return <p className="p-5 text-center">Loading pins...</p>;
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-5 space-y-4">
      {displayPins.map((pin, index) => (
        <div
          key={pin.id}
          className="break-inside-avoid rounded-xl overflow-hidden shadow-md bg-white"
        >
          <img
            src={getPinImage(pin, index)}
            alt={pin.title}
            className="w-full h-auto object-cover"
          />
          <div className="p-3">
            <h4 className="font-semibold text-gray-800">
              {pin.title}
            </h4>
            <p className="text-sm text-gray-500">
              {pin.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}