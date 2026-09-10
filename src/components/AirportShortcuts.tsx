import { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { MapPin } from 'lucide-react';
import { readAirportPreferences, saveAirportPreference } from '@/lib/airportPreferences';
import { findNearbyAirports, type NearbyAirport } from '@/lib/nearbyAirports';

export function AirportShortcuts({ airport, onSelect }: { airport: string; onSelect: (code: string) => void }) {
  const [defaultAirport, setDefaultAirport] = useState(() => readAirportPreferences().defaultAirport);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [nearby, setNearby] = useState<NearbyAirport[]>([]);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function locate() {
    setBusy(true); setMessage(''); setNearby([]);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const position = await Promise.race([
        Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }),
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 20000); }),
      ]);
      if (!mounted.current) return;
      if (!Number.isFinite(position.coords.accuracy) || position.coords.accuracy > 50000) {
        setMessage('Location is too approximate. Search for your airport instead.'); return;
      }
      const results = findNearbyAirports(position.coords.latitude, position.coords.longitude);
      setNearby(results);
      setMessage(results.length ? 'Nearby supported airports — tap to choose yours.' : 'No supported airport within 200 km. Search manually; our airport list currently covers the US.');
    } catch (error) {
      if (!mounted.current) return;
      const code = (error as { code?: string | number })?.code;
      setMessage(code === 1 || code === 'OS-PLUG-GLOC-0003'
        ? 'Location permission was denied. You can still search or use your saved airport.'
        : 'Could not get your location. Try again, or search for your airport.');
    } finally {
      clearTimeout(timer);
      if (mounted.current) setBusy(false);
    }
  }
  function saveDefault(code: string) {
    if (saveAirportPreference('defaultAirport', code)) {
      setDefaultAirport(code);
      setMessage(code ? `${code} saved as your default.` : 'Default cleared. New plans will use your most recent airport.');
    } else setMessage('This device could not save your preference. You can still plan this trip.');
  }
  return <div className="space-y-3">
    <button type="button" onClick={locate} disabled={busy} className="flex items-center justify-center gap-2 w-full min-h-11 rounded-xl border border-border px-3 py-3 text-sm disabled:opacity-60">
      <MapPin className="w-4 h-4" />{busy ? 'Finding nearby airports…' : 'Use my location'}
    </button>
    <p className="text-xs text-muted-foreground">Optional, one-time location check. Your coordinates aren’t saved.</p>
    {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
    {nearby.length > 0 && <div aria-label="Nearby airports" className="space-y-2"><p className="text-xs text-muted-foreground">Straight-line distances, not driving distances.</p>{nearby.map(item =>
      <button key={item.code} type="button" aria-pressed={airport === item.code} onClick={() => onSelect(item.code)} className={`w-full rounded-xl border p-3 text-left text-sm ${airport === item.code ? "border-primary bg-primary/10" : "border-border"}`}>
        <strong>{item.code}</strong> · {item.name}<span className="block text-xs text-muted-foreground">About {Math.round(item.distanceKm)} km away</span>
      </button>)}</div>}
    {airport && <button type="button" onClick={() => saveDefault(defaultAirport === airport ? '' : airport)} aria-pressed={defaultAirport === airport} className="min-h-11 text-sm text-primary underline underline-offset-4">
      {defaultAirport === airport ? `Remove ${airport} as default` : `Make ${airport} my default`}
    </button>}
    {defaultAirport && defaultAirport !== airport && <p className="text-xs text-muted-foreground">Default: {defaultAirport}. <button type="button" onClick={() => saveDefault('')} className="min-h-11 underline">Clear default</button></p>}
  </div>;
}
