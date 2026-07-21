'use client'

import { useEffect, useRef, useState } from 'react'
import { SectionLabel } from './ui/SectionLabel'
import { MIELLERIE } from '@/lib/data'
import type { PointDeVente } from '@/lib/types'

export function PointsDeVente({ points }: { points: PointDeVente[] }) {
  const mapEl = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})
  const resizeObsRef = useRef<ResizeObserver | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    let tries = 0
    const timer = setInterval(() => {
      tries++
      const el = mapEl.current
      if (mapRef.current || tries > 100) { clearInterval(timer); return }
      if (el && el.clientHeight >= 50) {
        clearInterval(timer)
        initCarte()
      }
    }, 60)
    return () => {
      clearInterval(timer)
      resizeObsRef.current?.disconnect()
      resizeObsRef.current = null
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markersRef.current = {}
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function initCarte() {
    if (mapRef.current || !mapEl.current) return
    const L = (await import('leaflet')).default

    const map = L.map(mapEl.current, { scrollWheelZoom: false, attributionControl: true })
    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map)

    const mkIcon = (cls: string) =>
      L.divIcon({ className: '', html: `<div class="pin-miel ${cls}"></div>`, iconSize: [26, 26], iconAnchor: [13, 26], popupAnchor: [0, -26] })

    L.marker([MIELLERIE.lat, MIELLERIE.lng], { icon: mkIcon('pin-miellerie') })
      .addTo(map)
      .bindPopup(`<strong>${MIELLERIE.nom}</strong><br><span style="color:#5C4A35">${MIELLERIE.ville}</span>`)

    points.forEach(p => {
      const m = L.marker([p.lat, p.lng], { icon: mkIcon('') })
        .addTo(map)
        .bindPopup(
          `<strong>${p.nom}</strong><br><span style="color:#5C4A35">${p.ville}</span>` +
          (p.url ? `<br><a href="${p.url}" target="_blank" rel="noopener" style="color:#C96A00;font-weight:600">Voir le magasin</a>` : '')
        )
      m.on('click', () => setSelected(p.id))
      markersRef.current[p.id] = m
    })

    map.setView([43.98, 5.10], 10)
    map.invalidateSize()
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(mapEl.current!)
    resizeObsRef.current = ro
  }

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const el = m.getElement?.()
      if (el) {
        const pin = el.querySelector('.pin-miel')
        if (pin) pin.classList.toggle('is-active', id === selected)
      }
    })
  }, [selected])

  function focusPoint(p: PointDeVente) {
    setSelected(p.id)
    const map = mapRef.current
    const m = markersRef.current[p.id]
    if (map && m) {
      map.flyTo([p.lat, p.lng], 13, { duration: 0.8 })
      m.openPopup()
    }
  }

  return (
    <section id="points-de-vente" className="scroll-mt-20 bg-paper">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
        <div className="mb-10 max-w-2xl">
          <SectionLabel>En boutique</SectionLabel>
          <h2 className="mt-4 font-display text-3xl leading-tight text-ink md:text-5xl">
            Aussi près de chez vous
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-ink-soft">
            Vous préférez acheter en magasin ? Retrouvez mes miels dans une sélection de Biocoop
            et d&apos;épiceries bio de Provence et des Bouches-du-Rhône. Cliquez sur un magasin pour
            le situer sur la carte.
          </p>
        </div>

        <div className="isolate overflow-hidden rounded-3xl bg-cream shadow-soft ring-1 ring-ink/[0.06]">
          <div className="grid lg:grid-cols-[1.4fr_1fr]">
            {/* Carte */}
            <div className="relative order-1 h-[340px] sm:h-[420px] lg:h-[600px]">
              <div id="carte-pdv" ref={mapEl} className="absolute inset-0 h-full w-full" />
              <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex flex-col gap-1.5 rounded-xl bg-paper/90 px-3 py-2 backdrop-blur">
                <span className="flex items-center gap-2 font-body text-[11px] font-semibold text-ink-soft">
                  <span className="inline-block h-3 w-3 rounded-full bg-honey" /> Point de vente
                </span>
                <span className="flex items-center gap-2 font-body text-[11px] font-semibold text-ink-soft">
                  <span className="inline-block h-3 w-3 rounded-full bg-ink" /> La miellerie
                </span>
              </div>
            </div>

            {/* Liste */}
            <div className="order-2 flex flex-col border-t border-ink/[0.08] lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between px-5 pb-3 pt-5 md:px-6">
                <span className="font-body text-lg font-semibold text-ink">{points.length} points de vente</span>
              </div>
              <ul className="scroll-soft max-h-[340px] flex-1 overflow-y-auto px-3 pb-4 sm:max-h-[420px] md:px-4 lg:max-h-[535px]">
                {points.map(p => {
                  const actif = selected === p.id
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => focusPoint(p)}
                        className={
                          'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ' +
                          (actif ? 'bg-honey/10 ring-1 ring-honey/40' : 'hover:bg-paper')
                        }
                      >
                        <span className={'mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full transition-colors ' + (actif ? 'bg-honey-deep' : 'bg-honey/50')} />
                        <span className="min-w-0">
                          <span className="block truncate font-body text-sm font-semibold text-ink">{p.nom}</span>
                          <span className="block font-body text-xs text-ink-soft">{p.ville}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
