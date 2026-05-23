'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useBuilderStore } from '@/store/builderStore';
import { createBuild, updateBuild, IBuildComponents } from '@/lib/api/buildApi';
import { IPart } from '@/lib/api/productApi';

// ─── Wattage thresholds ───────────────────────────────────────────────────────

function wattageColor(w: number): string {
  if (w < 400) return 'var(--neon-green)';
  if (w < 700) return '#f59e0b';
  return '#ef4444';
}

// ─── Build Summary ────────────────────────────────────────────────────────────

export default function BuildSummary() {
  const { data: session } = useSession();
  const {
    buildId, buildName, isPublic,
    slots, totalPrice, totalWattage,
    isSaving, lastSavedAt,
    setBuildId, setBuildName, setIsPublic,
    setIsSaving, setLastSaved, resetBuild,
  } = useBuilderStore();

  const [saveError, setSaveError] = useState<string | null>(null);

  // Count filled slots
  const filledSingle = (['cpu', 'gpu', 'motherboard', 'psu', 'case', 'cooler'] as const)
    .filter((s) => slots[s] !== null).length;
  const filledMulti = ([...slots.ram, ...slots.storage] as IPart[]).length;
  const totalFilled = filledSingle + filledMulti;
  const totalSlots = 8; // 6 single + 2 multi (each counts as 1 slot category)
  const filledCategories = filledSingle
    + (slots.ram.length > 0 ? 1 : 0)
    + (slots.storage.length > 0 ? 1 : 0);
  const progress = Math.round((filledCategories / totalSlots) * 100);

  // Build completeness: cpu + gpu + motherboard + psu as minimum
  const isBuildable = !!(slots.cpu && slots.gpu && slots.motherboard && slots.psu);

  // PSU check: psu wattage should exceed component draw by 20%
  const psuWattage = slots.psu?.wattage ?? 0;
  const componentDraw = totalWattage - psuWattage;
  const psuOk = psuWattage === 0 || psuWattage >= componentDraw * 1.2;

  async function handleSave() {
    if (!session) return;
    setSaveError(null);
    setIsSaving(true);

    const components: IBuildComponents = {
      cpu:         slots.cpu?._id,
      gpu:         slots.gpu?._id,
      motherboard: slots.motherboard?._id,
      ram:         slots.ram.map((p) => p._id),
      storage:     slots.storage.map((p) => p._id),
      psu:         slots.psu?._id,
      case:        slots.case?._id,
      cooler:      slots.cooler?._id,
    };
    // Strip undefined keys
    Object.keys(components).forEach((k) => {
      const key = k as keyof IBuildComponents;
      if (components[key] === undefined || (Array.isArray(components[key]) && (components[key] as string[]).length === 0)) {
        delete components[key];
      }
    });

    try {
      if (buildId) {
        await updateBuild(buildId, { name: buildName, components, isPublic });
      } else {
        const saved = await createBuild({ name: buildName, components, isPublic });
        setBuildId(saved._id);
      }
      setLastSaved(new Date());
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save build');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-divider)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          Build Summary
        </h2>
        {lastSavedAt && (
          <span style={{ fontSize: '10px', color: 'var(--neon-green)' }}>
            ✓ Saved {lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        {/* Build name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Build Name
          </label>
          <input
            type="text"
            value={buildName}
            onChange={(e) => setBuildName(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'var(--text-primary)',
              fontSize: '13px', outline: 'none',
              fontWeight: 600,
            }}
          />
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Completion</span>
            <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%', borderRadius: '2px',
                width: `${progress}%`,
                background: progress === 100
                  ? 'var(--neon-green)'
                  : 'linear-gradient(90deg, var(--cyan), var(--violet))',
                transition: 'width 0.4s ease',
                boxShadow: progress === 100 ? '0 0 8px var(--neon-green)' : '0 0 8px var(--cyan-glow)',
              }}
            />
          </div>
          <p style={{ margin: '5px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
            {filledCategories} of {totalSlots} slots filled
          </p>
        </div>

        {/* Price */}
        <div
          style={{
            padding: '12px 14px', borderRadius: '10px',
            background: 'rgba(0,212,255,0.05)',
            border: '1px solid rgba(0,212,255,0.12)',
            marginBottom: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Price</span>
          <span style={{ fontSize: '22px', fontWeight: 900, color: 'var(--cyan)', letterSpacing: '-0.02em' }}>
            ${totalPrice.toLocaleString()}
          </span>
        </div>

        {/* Wattage */}
        <div
          style={{
            padding: '12px 14px', borderRadius: '10px',
            background: 'rgba(249,115,22,0.05)',
            border: `1px solid ${psuOk ? 'rgba(249,115,22,0.15)' : 'rgba(239,68,68,0.3)'}`,
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: psuWattage > 0 ? '6px' : 0 }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Component Draw</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: wattageColor(componentDraw), letterSpacing: '-0.01em' }}>
              ⚡ {componentDraw}W
            </span>
          </div>
          {psuWattage > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PSU capacity</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: psuOk ? 'var(--neon-green)' : '#ef4444' }}>
                {psuWattage}W {psuOk ? '✓' : '⚠'}
              </span>
            </div>
          )}
          {!psuOk && (
            <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#fca5a5', lineHeight: 1.4 }}>
              PSU may be insufficient. Recommend {Math.ceil(componentDraw * 1.2 / 50) * 50}W+.
            </p>
          )}
        </div>

        {/* Minimum requirements warning */}
        {!isBuildable && totalFilled > 0 && (
          <div
            style={{
              padding: '10px 12px', borderRadius: '8px',
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.25)',
              marginBottom: '14px',
            }}
          >
            <p style={{ margin: 0, fontSize: '11px', color: '#fde68a', lineHeight: 1.5 }}>
              ⚠ Add CPU, GPU, Motherboard, and PSU to save your build.
            </p>
          </div>
        )}

        {/* Public toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Public build</span>
          <button
            onClick={() => setIsPublic(!isPublic)}
            style={{
              width: '36px', height: '20px', borderRadius: '10px', padding: 0, border: 'none',
              background: isPublic ? 'var(--neon-green)' : 'rgba(255,255,255,0.1)',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: '14px', height: '14px', borderRadius: '50%',
                background: '#fff', position: 'absolute', top: '3px',
                left: isPublic ? '19px' : '3px',
                transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}
            />
          </button>
        </div>

        {/* Save error */}
        {saveError && (
          <div
            style={{
              padding: '9px 12px', borderRadius: '8px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              marginBottom: '12px',
              fontSize: '12px', color: '#fca5a5',
            }}
          >
            {saveError}
          </div>
        )}

        {/* Save button */}
        {session ? (
          <button
            onClick={handleSave}
            disabled={isSaving || !isBuildable}
            style={{
              width: '100%', padding: '12px 0', borderRadius: '10px',
              background: isBuildable
                ? isSaving
                  ? 'rgba(0,212,255,0.3)'
                  : 'var(--cyan)'
                : 'rgba(255,255,255,0.06)',
              border: isBuildable ? 'none' : '1px solid rgba(255,255,255,0.1)',
              color: isBuildable ? '#020408' : 'var(--text-muted)',
              fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isBuildable && !isSaving ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: isBuildable && !isSaving ? '0 0 20px var(--cyan-glow)' : 'none',
            }}
          >
            {isSaving ? 'Saving…' : buildId ? 'Update Build' : 'Save Build'}
          </button>
        ) : (
          <div
            style={{
              padding: '12px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Sign in to save your build
            </p>
            <a
              href="/api/auth/signin"
              style={{
                display: 'inline-block', padding: '8px 20px', borderRadius: '8px',
                background: 'var(--cyan)', color: '#020408',
                fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em',
                textDecoration: 'none', textTransform: 'uppercase',
              }}
            >
              Sign in
            </a>
          </div>
        )}

        {/* Reset */}
        {totalFilled > 0 && (
          <button
            onClick={resetBuild}
            style={{
              width: '100%', marginTop: '8px', padding: '8px 0', borderRadius: '8px',
              background: 'transparent',
              border: '1px solid rgba(239,68,68,0.2)',
              color: 'rgba(239,68,68,0.7)',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(239,68,68,0.7)';
            }}
          >
            Reset Build
          </button>
        )}
      </div>
    </div>
  );
}
