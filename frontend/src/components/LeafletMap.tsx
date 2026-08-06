import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

interface GeoLocation {
    lat: number;
    lng: number;
    numero: string;
    infraction: string;
    montant: number;
    date: string;
}

interface LeafletMapProps {
    locations?: GeoLocation[];
}

const LeafletMap = ({ locations = [] }: LeafletMapProps) => (
    <MapContainer center={[12.65, -8.0]} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        {locations.map((loc, i) => (
            <Marker key={i} position={[loc.lat, loc.lng]}>
                <Popup>
                    <b>{loc.numero}</b><br />
                    {loc.infraction}<br />
                    {parseFloat(loc.montant.toString()).toLocaleString('fr-FR')} FCFA<br />
                    {loc.date}
                </Popup>
            </Marker>
        ))}
    </MapContainer>
);

export default LeafletMap;
