'use client';

import { useState, useEffect, ReactElement } from 'react';
import { IPart } from '@/lib/api/productApi';
import { useProducts } from '@/lib/queries/productQueries';
import { SlotKey, useBuilderStore } from '@/store/builderStore';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconCPU({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 6V3M12 6V3M15 6V3M9 21v-3M12 21v-3M15 21v-3M6 9H3M6 12H3M6 15H3M21 9h-3M21 12h-3M21 15h-3" />
      <rect x="9" y="9" width="6" height="6" rx="0.5" fill={color} opacity="0.2" />
    </svg>
  );
}

function IconGPU({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="12" rx="2" />
      <path d="M6 7V5M10 7V5M14 7V5M18 7V5" />
      <circle cx="8" cy="13" r="2" />
      <circle cx="14" cy="13" r="2" />
      <path d="M18 13h1M4 13h1" />
    </svg>
  );
}

function IconMotherboard({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <rect x="5" y="5" width="6" height="6" rx="1" />
      <rect x="13" y="5" width="6" height="3" rx="0.5" />
      <rect x="13" y="10" width="6" height="3" rx="0.5" />
      <path d="M5 14h4M5 17h4M5 20h14" strokeWidth="1" />
    </svg>
  );
}

function IconRAM({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M7 5V3M10 5V3M14 5V3M17 5V3" />
      <path d="M7 9h2M11 9h2M15 9h2" strokeWidth="1.2" />
      <path d="M7 13h2M11 13h2M15 13h2" strokeWidth="1.2" />
    </svg>
  );
}

function IconStorage({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="20" height="8" rx="2" />
      <circle cx="18" cy="12" r="1.5" fill={color} opacity="0.4" />
      <path d="M5 10h8M5 14h5" strokeWidth="1.2" />
    </svg>
  );
}

function IconPSU({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l2-8z" fill={color} opacity="0.15" />
      <path d="M13 2L4 14h7l-1 8 9-12h-7l2-8z" />
    </svg>
  );
}

function IconCase({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 6h6M9 10h6M9 14h6" strokeWidth="1.2" />
      <circle cx="12" cy="18" r="1" fill={color} opacity="0.5" />
    </svg>
  );
}

function IconCooler({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

// ─── Slot metadata ────────────────────────────────────────────────────────────

const SLOT_META: Record<SlotKey, {
  label: string;
  sublabel: string;
  Icon: ({ color }: { color: string }) => ReactElement;
  accent: string;
  bg: string;
  multi?: boolean;
}> = {
  cpu:         { label: 'CPU',         sublabel: 'Processor',        Icon: IconCPU,         accent: '#22d3ee', bg: 'rgba(34,211,238,0.06)',   multi: false },
  gpu:         { label: 'GPU',         sublabel: 'Graphics Card',    Icon: IconGPU,         accent: '#a78bfa', bg: 'rgba(167,139,250,0.06)',  multi: false },
  motherboard: { label: 'Motherboard', sublabel: 'Main Board',       Icon: IconMotherboard, accent: '#f59e0b', bg: 'rgba(245,158,11,0.06)',   multi: false },
  ram:         { label: 'RAM',         sublabel: 'Memory',           Icon: IconRAM,         accent: '#34d399', bg: 'rgba(52,211,153,0.06)',   multi: true  },
  storage:     { label: 'Storage',     sublabel: 'SSD / NVMe',       Icon: IconStorage,     accent: '#60a5fa', bg: 'rgba(96,165,250,0.06)',   multi: true  },
  psu:         { label: 'PSU',         sublabel: 'Power Supply',     Icon: IconPSU,         accent: '#fb923c', bg: 'rgba(251,146,60,0.06)',   multi: false },
  case:        { label: 'Case',        sublabel: 'Chassis',          Icon: IconCase,        accent: '#f472b6', bg: 'rgba(244,114,182,0.06)',  multi: false },
  cooler:      { label: 'Cooler',      sublabel: 'CPU Cooling',      Icon: IconCooler,      accent: '#67e8f9', bg: 'rgba(103,232,249,0.06)',  multi: false },
};

const SLOT_ORDER: SlotKey[] = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler'];

// ─── Part Picker Modal ────────────────────────────────────────────────────────

function PartPickerModal({ slot, onClose }: { slot: SlotKey; onClose: () => void }) {
  const { setPart, setActiveSlot } = useBuilderStore();
  const meta = SLOT_META[slot];

  const [search, setSearch] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);

  const { data, isLoading } = useProducts({ category: slot, limit: 50 });
  const parts: IPart[] = data?.products ?? [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const filtered = search
    ? parts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase()),
      )
    : parts;

  function handleSelect(part: IPart) {
    setPart(slot, part);
    setActiveSlot(null);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(2,4,8,0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(700px, 96vw)',
          maxHeight: '84vh',
          background: 'linear-gradient(160deg, #0a1018 0%, #080d14 100%)',
          border: `1px solid ${meta.accent}30`,
          borderRadius: '16px',
          display: 'flex', flexDirection: 'column',
          zIndex: 110,
          overflow: 'hidden',
          boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px ${meta.accent}15, inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        {/* Top gradient bar */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${meta.accent}cc 0%, ${meta.accent}33 60%, transparent 100%)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          padding: '18px 22px 16px', flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
            background: meta.bg, border: `1px solid ${meta.accent}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <meta.Icon color={meta.accent} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Select {meta.label}
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              {meta.sublabel} · {isLoading ? 'Loading…' : `${filtered.length} available`}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '14px 22px 0', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <svg
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
              width="14" height="14" viewBox="0 0 16 16" fill="none"
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder={`Search ${meta.label.toLowerCase()}s…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                padding: '9px 14px 9px 36px', color: 'var(--text-primary)',
                fontSize: '13px', outline: 'none', transition: 'border-color 0.15s',
              }}
            />
          </div>
        </div>

        {/* Part list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 20px' }}>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ height: '68px', borderRadius: '10px', background: 'rgba(255,255,255,0.025)', animation: 'pulseGlow 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px', opacity: 0.4 }}>
                <meta.Icon color="currentColor" />
              </div>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {search ? `No parts match "${search}"` : `No ${meta.label} parts available`}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
              {filtered.map((part) => {
                const isHov = hovered === part._id;
                const inStock = part.stock > 0;
                return (
                  <button
                    key={part._id}
                    onClick={() => inStock && handleSelect(part)}
                    onMouseEnter={() => setHovered(part._id)}
                    onMouseLeave={() => setHovered(null)}
                    disabled={!inStock}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '11px 14px', borderRadius: '10px',
                      background: isHov && inStock ? meta.bg : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isHov && inStock ? meta.accent + '40' : 'rgba(255,255,255,0.05)'}`,
                      cursor: inStock ? 'pointer' : 'not-allowed',
                      opacity: inStock ? 1 : 0.4,
                      transition: 'all 0.12s',
                      textAlign: 'left', width: '100%',
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '8px', flexShrink: 0,
                      background: isHov ? `${meta.accent}18` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isHov ? meta.accent + '30' : 'rgba(255,255,255,0.06)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.12s',
                    }}>
                      <meta.Icon color={isHov ? meta.accent : 'rgba(255,255,255,0.3)'} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{
                          fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {part.name}
                        </span>
                        {!inStock && (
                          <span style={{ fontSize: '10px', color: '#f87171', flexShrink: 0, padding: '1px 6px', borderRadius: '4px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
                            Out of stock
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '11px', padding: '1px 7px', borderRadius: '4px',
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                          color: 'var(--text-muted)',
                        }}>
                          {part.brand}
                        </span>
                        {Object.entries(part.specs).slice(0, 2).map(([k, v]) => (
                          <span key={k} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                            {String(v)}
                          </span>
                        ))}
                        {part.wattage && (
                          <span style={{ fontSize: '11px', color: '#fb923c' }}>
                            {part.wattage}W
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price + Stock */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{
                        fontSize: '16px', fontWeight: 800,
                        color: isHov ? meta.accent : 'var(--text-primary)',
                        letterSpacing: '-0.02em', transition: 'color 0.12s',
                      }}>
                        ${part.price.toLocaleString()}
                      </div>
                      {inStock && (
                        <div style={{ fontSize: '10px', color: 'rgba(52,211,153,0.7)', marginTop: '2px' }}>
                          {part.stock} in stock
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Slot Row ─────────────────────────────────────────────────────────────────

function SlotRow({ slot, index }: { slot: SlotKey; index: number }) {
  const meta = SLOT_META[slot];
  const { slots, removePart, setActiveSlot, activeSlot } = useBuilderStore();
  const [hovered, setHovered] = useState(false);

  const isMulti = meta.multi;
  const selectedParts: IPart[] = isMulti
    ? (slots[slot] as IPart[])
    : slots[slot] ? [slots[slot] as IPart] : [];
  const isEmpty = selectedParts.length === 0;
  const isActive = activeSlot === slot;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '12px',
        border: `1px solid ${
          isActive
            ? meta.accent + '50'
            : !isEmpty
            ? meta.accent + '25'
            : hovered
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(255,255,255,0.05)'
        }`,
        background: !isEmpty
          ? meta.bg
          : hovered
          ? 'rgba(255,255,255,0.02)'
          : 'transparent',
        transition: 'all 0.18s',
        overflow: 'hidden',
        animationDelay: `${index * 40}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px' }}>
        {/* Slot number + icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.15)',
            width: '16px', textAlign: 'right', letterSpacing: '0.02em',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
            background: isEmpty ? 'rgba(255,255,255,0.03)' : meta.bg,
            border: `1px solid ${isEmpty ? 'rgba(255,255,255,0.07)' : meta.accent + '30'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s',
          }}>
            <meta.Icon color={isEmpty ? 'rgba(255,255,255,0.2)' : meta.accent} />
          </div>
        </div>

        {/* Label + selected info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: isEmpty ? 'var(--text-muted)' : 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {meta.label}
            </span>
            {isMulti && (
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
                multi
              </span>
            )}
          </div>

          {isEmpty ? (
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>
              {meta.sublabel}
            </p>
          ) : !isMulti ? (
            <p style={{
              margin: '2px 0 0', fontSize: '13px', fontWeight: 600,
              color: 'var(--text-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {(slots[slot] as IPart).name}
            </p>
          ) : (
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: meta.accent }}>
              {selectedParts.length} {selectedParts.length === 1 ? 'module' : 'modules'} selected
            </p>
          )}
        </div>

        {/* Price (single slot) */}
        {!isMulti && !isEmpty && (
          <span style={{
            fontSize: '14px', fontWeight: 800, color: meta.accent,
            letterSpacing: '-0.02em', marginRight: '6px', flexShrink: 0,
          }}>
            ${(slots[slot] as IPart).price.toLocaleString()}
          </span>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {!isEmpty && !isMulti && (
            <button
              onClick={() => removePart(slot)}
              title="Remove"
              style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)',
                color: '#f87171', fontSize: '12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.12s',
              }}
            >
              ✕
            </button>
          )}
          <button
            onClick={() => setActiveSlot(activeSlot === slot ? null : slot)}
            style={{
              padding: '5px 14px', borderRadius: '6px',
              background: isEmpty
                ? `${meta.accent}15`
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isEmpty ? meta.accent + '40' : 'rgba(255,255,255,0.08)'}`,
              color: isEmpty ? meta.accent : 'var(--text-muted)',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
              cursor: 'pointer', textTransform: 'uppercase',
              transition: 'all 0.12s',
            }}
          >
            {isEmpty ? 'Choose' : isMulti ? '+ Add' : 'Swap'}
          </button>
        </div>
      </div>

      {/* Multi-slot selected items */}
      {isMulti && selectedParts.length > 0 && (
        <div style={{ padding: '0 14px 12px', marginLeft: '26px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {selectedParts.map((part) => (
            <div
              key={part._id}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '7px 10px', borderRadius: '7px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <span style={{
                flex: 1, fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {part.name}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: meta.accent, flexShrink: 0 }}>
                ${part.price.toLocaleString()}
              </span>
              <button
                onClick={() => removePart(slot, part._id)}
                style={{
                  width: '20px', height: '20px', borderRadius: '4px',
                  background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)',
                  color: '#f87171', fontSize: '10px', cursor: 'pointer', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Group header ─────────────────────────────────────────────────────────────

function GroupLabel({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0 8px' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
    </div>
  );
}

// ─── Part Selector ────────────────────────────────────────────────────────────

const GROUPS: { label: string; slots: SlotKey[] }[] = [
  { label: 'Core',    slots: ['cpu', 'gpu', 'motherboard'] },
  { label: 'Memory',  slots: ['ram', 'storage'] },
  { label: 'Power & Cooling', slots: ['psu', 'cooler'] },
  { label: 'Chassis', slots: ['case'] },
];

// Flat ordered list with group boundaries
const SLOT_INDEX: Record<SlotKey, number> = Object.fromEntries(
  SLOT_ORDER.map((slot, i) => [slot, i])
) as Record<SlotKey, number>;

export default function PartSelector() {
  const { activeSlot, setActiveSlot } = useBuilderStore();

  return (
    <div>
      {GROUPS.map((group) => (
        <div key={group.label}>
          <GroupLabel label={group.label} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {group.slots.map((slot) => (
              <SlotRow key={slot} slot={slot} index={SLOT_INDEX[slot]} />
            ))}
          </div>
        </div>
      ))}

      {activeSlot && (
        <PartPickerModal slot={activeSlot} onClose={() => setActiveSlot(null)} />
      )}
    </div>
  );
}
