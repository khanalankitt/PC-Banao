'use client';

import { useState, useEffect, useCallback } from 'react';
import { IPart, listProducts } from '@/lib/api/productApi';
import { SlotKey, useBuilderStore } from '@/store/builderStore';

// ─── Slot metadata ────────────────────────────────────────────────────────────

const SLOT_META: Record<SlotKey, { label: string; emoji: string; accent: string; multi?: boolean }> = {
  cpu:         { label: 'CPU',         emoji: '🧠', accent: '#00d4ff' },
  gpu:         { label: 'GPU',         emoji: '🎮', accent: '#7c3aed' },
  motherboard: { label: 'Motherboard', emoji: '🔌', accent: '#f59e0b' },
  ram:         { label: 'RAM',         emoji: '💾', accent: '#10b981', multi: true },
  storage:     { label: 'Storage',     emoji: '💿', accent: '#3b82f6', multi: true },
  psu:         { label: 'PSU',         emoji: '⚡', accent: '#f97316' },
  case:        { label: 'Case',        emoji: '📦', accent: '#ec4899' },
  cooler:      { label: 'Cooler',      emoji: '❄️', accent: '#06b6d4' },
};

const SLOT_ORDER: SlotKey[] = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler'];

// ─── Part Picker Modal ────────────────────────────────────────────────────────

function PartPickerModal({
  slot,
  onClose,
}: {
  slot: SlotKey;
  onClose: () => void;
}) {
  const { setPart, setActiveSlot } = useBuilderStore();
  const meta = SLOT_META[slot];

  const [parts, setParts] = useState<IPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);

  const fetchParts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listProducts({ category: slot, limit: 50 });
      setParts(res.products);
    } catch {
      setParts([]);
    } finally {
      setLoading(false);
    }
  }, [slot]);

  useEffect(() => { fetchParts(); }, [fetchParts]);

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
          background: 'rgba(2,4,8,0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(680px, 96vw)',
          maxHeight: '82vh',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          display: 'flex', flexDirection: 'column',
          zIndex: 110,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border-divider)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}
        >
          <span style={{ fontSize: '22px' }}>{meta.emoji}</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Select {meta.label}
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              {filtered.length} component{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-secondary)',
              fontSize: '16px', cursor: 'pointer', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '14px 24px 0' }}>
          <div style={{ position: 'relative' }}>
            <svg
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
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
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '9px 14px 9px 34px',
                color: 'var(--text-primary)',
                fontSize: '13px', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Part list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 24px 20px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '72px', borderRadius: '10px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    animation: 'pulseGlow 1.5s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
              <p style={{ margin: 0, fontSize: '14px' }}>No parts match your search</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: isHov && inStock ? `rgba(${meta.accent === '#00d4ff' ? '0,212,255' : meta.accent === '#7c3aed' ? '124,58,237' : '255,255,255'},0.07)` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isHov && inStock ? meta.accent + '44' : 'rgba(255,255,255,0.06)'}`,
                      cursor: inStock ? 'pointer' : 'not-allowed',
                      opacity: inStock ? 1 : 0.45,
                      transition: 'all 0.15s',
                      textAlign: 'left', width: '100%',
                    }}
                  >
                    {/* Emoji icon */}
                    <div
                      style={{
                        width: '42px', height: '42px', borderRadius: '8px', flexShrink: 0,
                        background: `${meta.accent}18`,
                        border: `1px solid ${meta.accent}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px',
                      }}
                    >
                      {meta.emoji}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span
                          style={{
                            fontSize: '13px', fontWeight: 700,
                            color: 'var(--text-primary)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}
                        >
                          {part.name}
                        </span>
                        {!inStock && (
                          <span style={{ fontSize: '10px', color: '#ef4444', flexShrink: 0 }}>Out of stock</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: '11px', padding: '1px 6px', borderRadius: '4px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {part.brand}
                        </span>
                        {part.wattage && (
                          <span style={{ fontSize: '11px', color: '#f97316' }}>⚡ {part.wattage}W</span>
                        )}
                        {inStock && (
                          <span style={{ fontSize: '11px', color: 'var(--neon-green)' }}>{part.stock} in stock</span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '16px', fontWeight: 800,
                          color: isHov ? meta.accent : 'var(--cyan)',
                          letterSpacing: '-0.02em',
                          transition: 'color 0.15s',
                        }}
                      >
                        ${part.price.toLocaleString()}
                      </span>
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

function SlotRow({ slot }: { slot: SlotKey }) {
  const meta = SLOT_META[slot];
  const { slots, removePart, setActiveSlot, activeSlot } = useBuilderStore();
  const [hovered, setHovered] = useState(false);

  const isMulti = meta.multi;
  const selectedParts: IPart[] = isMulti
    ? (slots[slot] as IPart[])
    : slots[slot] ? [slots[slot] as IPart] : [];

  const isEmpty = selectedParts.length === 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '12px',
        border: `1px solid ${hovered ? meta.accent + '44' : isEmpty ? 'var(--border-subtle)' : meta.accent + '33'}`,
        background: isEmpty
          ? 'rgba(255,255,255,0.02)'
          : `${meta.accent}08`,
        transition: 'all 0.2s',
        overflow: 'hidden',
      }}
    >
      {/* Slot header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '12px 16px',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
            background: isEmpty ? 'rgba(255,255,255,0.04)' : `${meta.accent}18`,
            border: `1px solid ${isEmpty ? 'rgba(255,255,255,0.08)' : meta.accent + '33'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          {meta.emoji}
        </div>

        {/* Label */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {meta.label}
          </p>
          {isEmpty ? (
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              {isMulti ? 'No parts selected' : 'Not selected'}
            </p>
          ) : !isMulti ? (
            <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(slots[slot] as IPart).name}
            </p>
          ) : (
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: meta.accent }}>
              {selectedParts.length} part{selectedParts.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Price (single-slot) */}
        {!isMulti && !isEmpty && (
          <span style={{ fontSize: '15px', fontWeight: 800, color: meta.accent, letterSpacing: '-0.02em', marginRight: '8px', flexShrink: 0 }}>
            ${(slots[slot] as IPart).price.toLocaleString()}
          </span>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {!isEmpty && !isMulti && (
            <button
              onClick={() => removePart(slot)}
              style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#ef4444',
                fontSize: '12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
          )}
          <button
            onClick={() => setActiveSlot(activeSlot === slot ? null : slot)}
            style={{
              padding: '5px 12px', borderRadius: '6px',
              background: isEmpty ? `${meta.accent}18` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isEmpty ? meta.accent + '44' : 'rgba(255,255,255,0.1)'}`,
              color: isEmpty ? meta.accent : 'var(--text-secondary)',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
              cursor: 'pointer', textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
          >
            {isEmpty ? 'Select' : isMulti ? '+ Add' : 'Change'}
          </button>
        </div>
      </div>

      {/* Multi-slot selected parts list */}
      {isMulti && selectedParts.length > 0 && (
        <div
          style={{
            padding: '0 16px 12px',
            display: 'flex', flexDirection: 'column', gap: '6px',
          }}
        >
          {selectedParts.map((part) => (
            <div
              key={part._id}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '7px 10px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {part.name}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: meta.accent, flexShrink: 0 }}>
                ${part.price.toLocaleString()}
              </span>
              <button
                onClick={() => removePart(slot, part._id)}
                style={{
                  width: '22px', height: '22px', borderRadius: '4px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#ef4444',
                  fontSize: '10px', cursor: 'pointer', flexShrink: 0,
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

// ─── Part Selector (slot list + modal) ───────────────────────────────────────

export default function PartSelector() {
  const { activeSlot, setActiveSlot } = useBuilderStore();

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SLOT_ORDER.map((slot) => (
          <SlotRow key={slot} slot={slot} />
        ))}
      </div>

      {/* Modal */}
      {activeSlot && (
        <PartPickerModal
          slot={activeSlot}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </div>
  );
}
