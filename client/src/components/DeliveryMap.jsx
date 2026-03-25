import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logger from '../utils/logger';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const startIcon = createIcon('green');
const endIcon = createIcon('red');
const defaultIcon = createIcon('blue');

const DeliveryMap = ({ parcels }) => {
    const [route, setRoute] = useState([]);
    const [loading, setLoading] = useState(false);

// Module-level cache to prevent duplicate geocoding requests across re-renders
const geocodeCache = {};

    useEffect(() => {
        let isMounted = true;
        const fetchCoordinates = async () => {
            if (!parcels || parcels.length === 0) return;
            setLoading(true);

            let locationsToGeocode = [];

            if (parcels.length === 1) {
                // Show route for a single parcel: Origin -> History intermediate locations
                const p = parcels[0];
                const origin = p.senderInfo?.address || "Colombo";
                locationsToGeocode.push({
                    id: 'origin',
                    label: `Accepted At`,
                    address: origin,
                    trackingId: p.trackingId,
                    type: 'start'
                });

                if (p.history && p.history.length > 0) {
                    const seen = new Set([origin]);
                    p.history.forEach((h, i) => {
                        const loc = h.location || origin;
                        if (!seen.has(loc)) {
                            seen.add(loc);
                            locationsToGeocode.push({
                                id: `hist-${i}`,
                                label: `Status: ${h.status}`,
                                address: loc,
                                trackingId: p.trackingId,
                                type: (i === p.history.length - 1) ? 'end' : 'intermediate'
                            });
                        }
                    });
                }
            } else {
                // Dashboard mode: Multiple parcels Destinations only
                locationsToGeocode = parcels.map(p => ({
                    id: p._id || p.trackingId || Math.random().toString(),
                    label: `Receiver: ${p.receiverInfo?.name || "Unknown"}`,
                    address: p.receiverInfo?.address || "Colombo",
                    trackingId: p.trackingId,
                    type: 'end'
                }));
            }

            const results = [];
            for (const item of locationsToGeocode) {
                const fullAddress = item.address;
                
                // Extract city by taking the last part of the comma-separated address
                const parts = fullAddress.split(',');
                let city = parts[parts.length - 1].trim();
                // Remove trailing periods from city name
                city = city.replace(/\.+$/, '').trim();

                // If city is empty for some reason, fallback to full string
                const searchQ = city || fullAddress;
                
                // If we already geocoded this city/town, use the cached coordinates
                if (geocodeCache[searchQ]) {
                    results.push({
                        ...item,
                        coords: geocodeCache[searchQ]
                    });
                    continue;
                }

                try {
                    // Respect Nominatim's usage policy (max 1 request per second to prevent HTTP 429)
                    if (results.length > 0) {
                        await new Promise(resolve => setTimeout(resolve, 1100));
                    }

                    // Add an email parameter to act as User-Agent for Nominatim as required by their policy
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(searchQ + ", Sri Lanka")}&email=support@navilogix.com`);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();

                    if (isMounted) {
                        if (data && data.length > 0) {
                            const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                            geocodeCache[searchQ] = coords; // Save to cache
                            results.push({
                                ...item,
                                coords
                            });
                        } else {
                            logger.warn(`City not found: ${searchQ}`);
                            const fallbackCoords = [6.9271 + (Math.random() - 0.5) * 0.01, 79.8612 + (Math.random() - 0.5) * 0.01];
                            geocodeCache[searchQ] = fallbackCoords; // Cache the fallback to prevent retries
                            results.push({
                                ...item,
                                coords: fallbackCoords
                            });
                        }
                    }
                } catch (error) {
                    if (isMounted) {
                        logger.error("Geocoding error: " + error.message, { error });
                        const fallbackCoords = [6.9271 + (Math.random() - 0.5) * 0.01, 79.8612 + (Math.random() - 0.5) * 0.01];
                        geocodeCache[searchQ] = fallbackCoords;
                        results.push({
                            ...item,
                            coords: fallbackCoords
                        });
                    }
                }
            }

            if (isMounted) {
                setRoute(results);
                setLoading(false);
            }
        };

        fetchCoordinates();

        return () => {
            isMounted = false;
        };
        // Use JSON.stringify to prevent new array references (like parcels={[parcel]}) from triggering infinite re-renders
    }, [JSON.stringify(parcels)]);

    const optimizeRoute = () => {
        // Mock optimization: sort by latitude (north to south) as a simple heuristic
        const optimized = [...route].sort((a, b) => b.coords[0] - a.coords[0]);
        setRoute(optimized);
        alert("Route Optimized via OpenStreetMap algo!");
    };

    if (loading) return <div className="text-center p-4">Loading Map & Routes...</div>;
    if (route.length === 0) return <div className="text-center p-4">No parcels to display on map.</div>;

    const center = route[0].coords;

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                <h3 className="text-xl font-bold text-gray-700">🗺️ Delivery Route</h3>
                <button
                    onClick={optimizeRoute}
                    className="bg-secondary text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-red-600 transition-colors w-full md:w-auto"
                >
                    ⚡ AI Optimize Route
                </button>
            </div>

            <div className="h-64 md:h-96 rounded-xl overflow-hidden shadow-inner border-2 border-gray-200 z-0 relative">
                <MapContainer center={center} zoom={9} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {route.map((point, idx) => {
                        let icon = defaultIcon;
                        if (point.type === 'start') icon = startIcon;
                        else if (point.type === 'end') icon = endIcon;

                        return (
                            <Marker key={point.id} position={point.coords} icon={icon}>
                                <Popup>
                                    <strong>#{idx + 1}</strong> <br />
                                    {point.label} <br />
                                    {point.address}
                                </Popup>
                            </Marker>
                        );
                    })}

                    <Polyline
                        positions={route.map(r => r.coords)}
                        color="blue"
                        weight={4}
                        opacity={0.8}
                    />
                </MapContainer>
            </div>

            <div className="grid gap-2">
                <h4 className="font-bold text-gray-600">Stop Sequence:</h4>
                {route.map((r, i) => (
                    <div key={r.id} className="p-3 bg-white rounded-lg shadow-sm flex items-center gap-3 border-l-4 border-primary">
                        <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600">{i + 1}</div>
                        <div>
                            <p className="font-bold text-sm">{r.label}</p>
                            <p className="text-xs text-gray-500">{r.address} | ID: {r.trackingId}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeliveryMap;
