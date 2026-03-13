'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false })
const CircleMarker = dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), { ssr: false })

interface HeatMapProps {
  complaints: any[]
  mode?: 'citizen' | 'government'
}

export default function HeatMap({ complaints, mode = 'citizen' }: HeatMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    // Import leaflet for icon handling on the client side
    import('leaflet').then((leaflet) => {
      setL(leaflet)
    })
  }, [])

  // Filter for real geotagged complaints
  const realGeotagged = complaints.filter(c => c.latitude !== null && c.longitude !== null)
  
  // Debug logging
  console.log(`[HeatMap] Mode: ${mode}, Total complaints: ${complaints.length}, Geotagged: ${realGeotagged.length}`)

  // Fallback demo data if nothing exists in database
  const demoData = realGeotagged.length === 0 ? [{
    id: 'demo-1',
    title: 'Demo civic issue (Majestic)',
    latitude: 12.9716,
    longitude: 77.5946,
    severity: 'high',
    category: 'Infrastructure',
    description: 'This is a demo civic issue for visualization purposes.',
    location: 'Majestic, Bangalore',
    isDemo: true,
    votes: 24
  }] : []

  const displayComplaints = [...realGeotagged, ...demoData]

  if (!isClient) {
    return (
      <Card className="w-full h-[400px] bg-card border-border flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Initializing Map...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[500px] bg-card border-border overflow-hidden relative group shadow-2xl">
      <div className="absolute top-4 left-4 z-[1000] pointer-events-none flex flex-col gap-2">
        <Badge className={`${mode === 'government' ? 'bg-amber-500 text-black' : 'bg-accent/90 text-accent-foreground'} backdrop-blur-sm border-0 text-[10px] font-bold uppercase tracking-wider py-1 px-3 shadow-lg w-fit`}>
          {mode === 'government' ? '🏢 City Surveillance Map' : 'Live Problem Hotspots'}
        </Badge>
        {realGeotagged.length === 0 && (
          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-accent/30 text-accent text-[9px] uppercase font-bold px-2 py-0.5 shadow-sm w-fit">
            Demo Mode Enabled
          </Badge>
        )}
      </div>

      {realGeotagged.length === 0 && (
        <div className="absolute top-4 right-4 z-[1000] pointer-events-none max-w-[250px]">
          <div className="bg-background/80 backdrop-blur-md border border-border p-2 rounded-md shadow-xl">
             <p className="text-[10px] text-muted-foreground font-bold leading-tight">
               No geotagged civic issues yet.
             </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-14 z-[1000] pointer-events-none flex flex-col gap-1">
         <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md p-1.5 px-3 rounded-full border border-border/50 shadow-lg">
            <div className="size-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] font-bold text-foreground">CRITICAL</span>
            <div className="size-2 rounded-full bg-orange-500 ml-2" />
            <span className="text-[9px] font-bold text-foreground">HIGH</span>
            <div className="size-2 rounded-full bg-yellow-500 ml-2" />
            <span className="text-[9px] font-bold text-foreground">MEDIUM</span>
         </div>
      </div>

      <MapContainer 
        center={[12.9716, 77.5946]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        className="z-0"
        maxBounds={[[12.7, 77.3], [13.2, 77.9]]}
        minZoom={10}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {displayComplaints.map((complaint) => (
          <CircleMarker
            key={complaint.id}
            center={[complaint.latitude, complaint.longitude]}
            pathOptions={{
              fillColor: complaint.severity === 'critical' ? '#ff0000' : 
                         complaint.severity === 'high' ? '#ff6600' : 
                         complaint.severity === 'medium' ? '#ffcc00' : '#00ff00',
              fillOpacity: mode === 'government' ? 0.8 : 0.7,
              color: mode === 'government' ? 'white' : 'white',
              weight: mode === 'government' ? 1.5 : 0.5,
              className: 'glow-marker'
            }}
            radius={mode === 'government' ? 8 : 7}
          >
            <Popup className="custom-popup">
              <div className="p-1 space-y-2 min-w-[220px]">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-sm text-foreground m-0 leading-tight">{complaint.title}</h4>
                  <Badge className={`text-[9px] px-1 py-0 border-0 shadow-sm ${
                    complaint.severity === 'critical' ? 'bg-red-500' :
                    complaint.severity === 'high' ? 'bg-orange-500' :
                    complaint.severity === 'medium' ? 'bg-yellow-500 text-black' : 'bg-green-500'
                  }`}>
                    {complaint.severity}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="bg-secondary/50 px-1.5 py-0.5 rounded uppercase font-bold text-[9px] text-muted-foreground">{complaint.category}</span>
                  {mode === 'government' && (
                    <Badge variant="outline" className={`text-[8px] uppercase border-0 font-extrabold ${
                      complaint.status === 'resolved' || complaint.status === 'completed' ? 'text-green-400 bg-green-400/10' :
                      complaint.status === 'in_progress' ? 'text-yellow-400 bg-yellow-400/10' : 'text-blue-400 bg-blue-400/10'
                    }`}>
                      {complaint.status?.replace('_', ' ')}
                    </Badge>
                  )}
                </div>

                <p className="text-[11px] text-foreground/80 line-clamp-2 italic border-l-2 border-accent/30 pl-2">"{complaint.description}"</p>
                
                <div className="flex flex-col gap-1.5 pt-1 border-t border-border/50">
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="text-accent">📍</span> {complaint.location}
                  </div>
                  {(complaint.votes > 0 || mode === 'government') && (
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-blue-400 font-bold flex items-center gap-1">
                        👥 {complaint.votes || 0} Citizens Affected
                      </span>
                      {mode === 'government' && (
                        <span className="text-[8px] font-mono text-muted-foreground/50">#{complaint.id.slice(0, 8)}</span>
                      )}
                    </div>
                  )}
                </div>
                
                {mode === 'government' && (
                  <div className="pt-2">
                    <button className="w-full bg-accent/10 hover:bg-accent/20 text-accent text-[10px] font-bold py-1.5 rounded transition-colors border border-accent/20">
                      DISPATCH INVESTIGATION
                    </button>
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .leaflet-container {
          background: #09090b !important;
        }
        .leaflet-popup-content-wrapper {
          background: #18181b !important;
          color: white !important;
          border-radius: 8px !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
        }
        .leaflet-popup-tip {
          background: #18181b !important;
        }
        .leaflet-popup-content {
          margin: 12px !important;
        }
        .glow-marker {
          filter: drop-shadow(0 0 5px currentColor);
          animation: pulse 2.5s infinite;
        }
        @keyframes pulse {
          0% { stroke-width: 0.5; stroke-opacity: 1; }
          50% { stroke-width: 15; stroke-opacity: 0; }
          100% { stroke-width: 0.5; stroke-opacity: 1; }
        }
      `}</style>
    </Card>
  )
}
