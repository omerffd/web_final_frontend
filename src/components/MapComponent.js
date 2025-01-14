import React, { useEffect, useRef } from "react";

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 39.92077, lng: 32.85411 }, // Örnek koordinatlar (Ankara)
      zoom: 12,
    });
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default MapComponent;
