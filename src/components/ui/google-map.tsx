"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

interface GoogleMapComponentProps {
  address: string;
  name: string;
  className?: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 3.139, // Kuala Lumpur coordinates as default
  lng: 101.6869,
};

const mapOptions = {
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
  styles: [
    {
      featureType: "poi.business",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export default function GoogleMapComponent({
  address,
  name,
  className = "",
}: GoogleMapComponentProps) {
  const [coordinates, setCoordinates] = useState<LatLng | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Geocoding function to convert address to coordinates
  const geocodeAddress = useCallback(async (address: string) => {
    try {
      const geocoder = new google.maps.Geocoder();

      return new Promise<LatLng>((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
            });
          } else {
            reject(new Error("Geocoding failed"));
          }
        });
      });
    } catch (error) {
      throw new Error("Geocoding error");
    }
  }, []);

  // Fetch coordinates when address changes
  useEffect(() => {
    if (address && window.google && window.google.maps) {
      setIsLoading(true);
      setError(null);

      geocodeAddress(address)
        .then((coords) => {
          setCoordinates(coords);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Geocoding error:", err);
          setError("Unable to load map location");
          setCoordinates(defaultCenter);
          setIsLoading(false);
        });
    }
  }, [address, geocodeAddress]);

  // Fallback component when there's an error or no API key
  const FallbackMap = () => (
    <div className="bg-gray-200 rounded-2xl h-full flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Interactive map would be displayed here</p>
        <p className="text-gray-400 text-sm mt-1">{name}</p>
        <p className="text-gray-400 text-sm">{address}</p>
      </div>
    </div>
  );

  // Show fallback if no Google Maps API key is available
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`h-64 ${className}`}>
        <FallbackMap />
      </div>
    );
  }

  return (
    <div className={`h-64 ${className}`}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        onLoad={() => {
          if (address) {
            geocodeAddress(address)
              .then((coords) => {
                setCoordinates(coords);
                setIsLoading(false);
              })
              .catch(() => {
                setError("Unable to load map location");
                setCoordinates(defaultCenter);
                setIsLoading(false);
              });
          }
        }}
        onError={() => {
          setError("Failed to load Google Maps");
          setIsLoading(false);
        }}
      >
        {isLoading ? (
          <div className="bg-gray-100 rounded-2xl h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading map...</p>
            </div>
          </div>
        ) : error ? (
          <FallbackMap />
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={coordinates || defaultCenter}
            zoom={15}
            options={mapOptions}
          >
            {coordinates && (
              <Marker
                position={coordinates}
                title={name}
                icon={{
                  url:
                    "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#8B5CF6" stroke="#FFFFFF" stroke-width="2"/>
                      <circle cx="12" cy="10" r="3" fill="#FFFFFF"/>
                    </svg>
                  `),
                  scaledSize: new google.maps.Size(32, 32),
                  anchor: new google.maps.Point(16, 32),
                }}
              />
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
}
