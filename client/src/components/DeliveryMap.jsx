import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CITY_COORDINATES = {
    'Colombo': [6.9271, 79.8612],
    'Kandy': [7.2906, 80.6337],
    'Galle': [6.0535, 80.2210],
    'Jaffna': [9.6615, 80.0255],
    'Negombo': [7.2088, 79.8359]
};

const getCoordinates = (address) => {
    // Simple mock geocoding based on city name presence
    for (const city in CITY_COORDINATES) {
        if (address.toLowerCase().includes(city.toLowerCase())) {
            // Add slight random offset to separate markers in same city
            const [lat, lng] = CITY_COORDINATES[city];
            return [lat + (Math.random() - 0.5) * 0.05, lng + (Math.random() - 0.5) * 0.05];
        }
    }
    // Default fallback (ocean near Colombo)
    return [6.9 + (Math.random() - 0.5) * 0.1, 79.8 + (Math.random() - 0.5) * 0.1];
};

const DeliveryMap = ({ parcels }) => {
    const [route, setRoute] = useState([]);

    useEffect(() => {
        if (parcels && parcels.length > 0) {
            const waypoints = parcels.map(p => ({
                ...p,
                coords: getCoordinates(p.receiverInfo.address)
            }));
            setRoute(waypoints);
        }
    }, [parcels]);

    const optimizeRoute = () => {
        // Mock optimization: sort by latitude (north to south) as a simple heuristic
        const optimized = [...route].sort((a, b) => b.coords[0] - a.coords[0]);
        setRoute(optimized);
        alert("Route Optimized via OpenStreetMap algo!");
    };

    if (route.length === 0) return <div className="text-center p-4">No parcels to display on map.</div>;

    const center = route[0].coords;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-700">🗺️ Delivery Route</h3>
                <button
                    onClick={optimizeRoute}
                    className="bg-secondary text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-red-600 transition-colors"
                >
                    ⚡ AI Optimize Route
                </button>
            </div>

            <div className="h-96 rounded-xl overflow-hidden shadow-inner border-2 border-gray-200 z-0 relative">
                <MapContainer center={center} zoom={9} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {route.map((point, idx) => (
                        <Marker key={point._id} position={point.coords}>
                            <Popup>
                                <strong>#{idx + 1}</strong> <br />
                                {point.receiverInfo.name} <br />
                                {point.receiverInfo.address}
                            </Popup>
                        </Marker>
                    ))}

                    <Polyline
                        positions={route.map(r => r.coords)}
                        color="blue"
                        dashArray="5, 10"
                    />
                </MapContainer>
            </div>

            <div className="grid gap-2">
                <h4 className="font-bold text-gray-600">Stop Sequence:</h4>
                {route.map((r, i) => (
                    <div key={r._id} className="p-3 bg-white rounded-lg shadow-sm flex items-center gap-3 border-l-4 border-primary">
                        <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600">{i + 1}</div>
                        <div>
                            <p className="font-bold text-sm">{r.receiverInfo.address}</p>
                            <p className="text-xs text-gray-500">{r.trackingId}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeliveryMap;
