import { useEffect, useRef, useState } from 'react';

interface GeoLocation {
    lat: number;
    lng: number;
    numero: string;
    infraction: string;
    montant: number;
    date: string;
    statut?: string;
}

interface GoogleMapProps {
    locations?: GeoLocation[];
}

declare global {
    interface Window {
        google?: any;
        initGoogleMaps?: () => void;
    }
}

let googleMapsPromise: Promise<void> | null = null;

const loadGoogleMaps = (apiKey: string) => {
    if (window.google?.maps) return Promise.resolve();
    if (googleMapsPromise) return googleMapsPromise;

    googleMapsPromise = new Promise((resolve, reject) => {
        window.initGoogleMaps = () => resolve();

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;
        script.onerror = () => reject(new Error('Impossible de charger Google Maps.'));
        document.head.appendChild(script);
    });

    return googleMapsPromise;
};

const GoogleMap = ({ locations = [] }: GoogleMapProps) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState('');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

    useEffect(() => {
        if (!mapRef.current) return;
        if (!apiKey) {
            setError('Cle Google Maps manquante. Ajoutez VITE_GOOGLE_MAPS_API_KEY dans frontend/.env.local.');
            return;
        }

        let cancelled = false;

        loadGoogleMaps(apiKey)
            .then(() => {
                if (cancelled || !mapRef.current || !window.google?.maps) return;

                const bamako = { lat: 12.6392, lng: -8.0029 };
                const map = new window.google.maps.Map(mapRef.current, {
                    center: bamako,
                    zoom: 12,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                });
                const bounds = new window.google.maps.LatLngBounds();
                const infoWindow = new window.google.maps.InfoWindow();
                let markerCount = 0;

                locations.forEach((loc) => {
                    const position = { lat: Number(loc.lat), lng: Number(loc.lng) };
                    if (Number.isNaN(position.lat) || Number.isNaN(position.lng)) return;

                    const marker = new window.google.maps.Marker({
                        position,
                        map,
                        title: `PV ${loc.numero}`,
                    });

                    marker.addListener('click', () => {
                        infoWindow.setContent(`
                            <div style="min-width:190px">
                                <strong>PV: ${loc.numero}</strong><br>
                                ${loc.infraction}<br>
                                <span>${Number(loc.montant).toLocaleString('fr-FR')} FCFA</span><br>
                                <small>${loc.date}${loc.statut ? ` - ${loc.statut}` : ''}</small>
                            </div>
                        `);
                        infoWindow.open(map, marker);
                    });

                    bounds.extend(position);
                    markerCount += 1;
                });

                if (markerCount > 0) {
                    map.fitBounds(bounds);
                }
            })
            .catch((err: Error) => setError(err.message));

        return () => {
            cancelled = true;
        };
    }, [apiKey, locations]);

    if (error) {
        return <div className="flex h-full items-center justify-center px-4 text-center text-sm font-medium text-amber-700">{error}</div>;
    }

    return <div ref={mapRef} className="h-full w-full" />;
};

export default GoogleMap;