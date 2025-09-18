import React, { useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'

export default function GlobeBackground() {
  const globeRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!globeRef.current) return
    const controls = globeRef.current.controls?.()
    if (controls) {
      controls.autoRotate = true
      controls.autoRotateSpeed = 1.0
      controls.enableDamping = true
      controls.dampingFactor = 0.05
    }
    try {
      const g = globeRef.current
      g.showAtmosphere(true)
      g.atmosphereColor('#ffffff')
      g.atmosphereAltitude(0.08)
    } catch {}
  }, [])

  const points = useMemo(() => {
    // Lightweight decorative points
    return [
      { lat: 12.97, lng: 77.59, size: 0.6, color: 'rgba(0,255,136,0.9)' },
      { lat: 28.61, lng: 77.20, size: 0.6, color: 'rgba(0,212,255,0.9)' },
      { lat: 19.07, lng: 72.87, size: 0.6, color: 'rgba(255,215,0,0.9)' }
    ]
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 0, pointerEvents: 'none' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere
        atmosphereColor="#ffffff"
        atmosphereAltitude={0.08}
        width={dimensions.width || undefined}
        height={dimensions.height || undefined}
        pointsData={points}
        pointColor={(p) => p.color}
        pointAltitude={0.02}
        pointRadius={0.55}
        pointResolution={6}
        enablePointerInteraction={false}
      />
    </div>
  )
}


