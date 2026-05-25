'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useBuilderStore } from '@/store/builderStore';
import { IBuildComponents } from '@/lib/api/buildApi';
import { IPart } from '@/lib/api/productApi';
import { useCompatibilityCheck, useCreateBuild, useUpdateBuild } from '@/lib/queries/buildQueries';

function wattageColor(w: number): string {
  if (w < 400) return '#34d399';
  if (w < 700) return '#fbbf24';
  return '#f87171';
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
      marginBottom: '8px',
    }}>
      {children}
    </div>
  );
}

// ─── Build Summary ────────────────────────────────────────────────────────────

export default function BuildSummary() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    buildId, buildName, isPublic,
    slots, totalPrice, totalWattage,
    lastSavedAt,
    setBuildId, setBuildName, setIsPublic,
    setLastSaved, resetBuild,
  } = useBuilderStore();

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveWarn, setSaveWarn] = useState<string | null>(null);

  // Debounce the component IDs so the compat query only fires 600 ms after slots settle
  const [debouncedIds, setDebouncedIds] = useState<Record<string, unknown>>({});
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const ids: Record<string, unknown> = {};
    if (slots.cpu)         ids.cpu         = slots.cpu._id;
    if (slots.gpu)         ids.gpu         = slots.gpu._id;
    if (slots.motherboard) ids.motherboard = slots.motherboard._id;
    if (slots.psu)         ids.psu         = slots.psu._id;
    if (slots.case)        ids.case        = slots.case._id;
    if (slots.cooler)      ids.cooler      = slots.cooler._id;
    if (slots.ram.length)     ids.ram     = slots.ram.map((p) => p._id);
    if (slots.storage.length) ids.storage = slots.storage.map((p) => p._id);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedIds(ids), 600);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [slots]);

  const filledCount = Object.keys(debouncedIds).length;
  const { data: compatData, isFetching: compatLoading } = useCompatibilityCheck(
    debouncedIds,
    filledCount >= 2,
  );
  const compatIssues = compatData?.issues ?? [];
  const compatWarnings = compatData?.warnings ?? [];

  const createBuildMutation = useCreateBuild();
  const updateBuildMutation = useUpdateBuild();
  const isSaving = createBuildMutation.isPending || updateBuildMutation.isPending;

  const filledSingle = (['cpu', 'gpu', 'motherboard', 'psu', 'case', 'cooler'] as const)
    .filter((s) => slots[s] !== null).length;
  const filledMulti = ([...slots.ram, ...slots.storage] as IPart[]).length;
  const totalFilled = filledSingle + filledMulti;
  const totalSlots = 8;
  const filledCategories = filledSingle
    + (slots.ram.length > 0 ? 1 : 0)
    + (slots.storage.length > 0 ? 1 : 0);
  const progress = Math.round((filledCategories / totalSlots) * 100);

  const isBuildable = !!(slots.cpu && slots.gpu && slots.motherboard && slots.psu);

  // totalWattage = sum of non-PSU component draw (PSU excluded in store).
  // psuCapacity = rated output of the selected PSU.
  const psuCapacity = slots.psu?.wattage ?? 0;
  const componentDraw = totalWattage;
  const psuOk = psuCapacity === 0 || psuCapacity >= componentDraw * 1.2;

  function saveLocally(name: string, id: string | null): string {
    const localId = id ?? `local_${Date.now()}`;
    const record = {
      _id: localId, name,
      slots: JSON.parse(JSON.stringify(slots)),
      totalPrice, totalWattage, isPublic,
      savedAt: new Date().toISOString(),
    };
    try {
      const existing: Record<string, unknown>[] = JSON.parse(
        localStorage.getItem('pcbanao_builds') ?? '[]',
      );
      const idx = existing.findIndex((b) => (b as { _id: string })._id === localId);
      if (idx >= 0) existing[idx] = record; else existing.push(record);
      localStorage.setItem('pcbanao_builds', JSON.stringify(existing));
    } catch { /* storage unavailable */ }
    return localId;
  }

  function buildComponents(): IBuildComponents {
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
    Object.keys(components).forEach((k) => {
      const key = k as keyof IBuildComponents;
      if (
        components[key] === undefined ||
        (Array.isArray(components[key]) && (components[key] as string[]).length === 0)
      ) delete components[key];
    });
    return components;
  }

  async function handleSave() {
    if (!session) return;
    setSaveError(null);
    setSaveWarn(null);

    const components = buildComponents();

    try {
      if (buildId) {
        await updateBuildMutation.mutateAsync({ id: buildId, payload: { name: buildName, components, isPublic } });
        setLastSaved(new Date());
        router.push(`/builds/${buildId}`);
      } else {
        const saved = await createBuildMutation.mutateAsync({ name: buildName, components, isPublic });
        setBuildId(saved._id);
        setLastSaved(new Date());
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; errors?: { field: string; message: string }[] } }; code?: string };
      if (axiosErr?.response) {
        const { message, errors } = axiosErr.response.data ?? {};
        const detail = errors?.map(e => `${e.field}: ${e.message}`).join('; ');
        setSaveError(detail ? `${message ?? 'Save failed'} — ${detail}` : (message ?? 'Save failed'));
      } else {
        const localId = saveLocally(buildName, buildId);
        if (!buildId) setBuildId(localId);
        setLastSaved(new Date());
        setSaveWarn('Server unreachable — saved locally on this device.');
      }
    }
  }

  const progressColor = progress === 100
    ? '#34d399'
    : progress > 50
    ? 'var(--cyan)'
    : 'rgba(0,212,255,0.6)';

  return (
    <div style={{
      background: 'linear-gradient(160deg, #0c1420 0%, #080d14 100%)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>

      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
          Summary
        </span>
        {lastSavedAt && (
          <span style={{ fontSize: '10px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 6px #34d399' }} />
            Saved {lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div style={{ padding: '18px' }}>

        {/* Build name */}
        <div style={{ marginBottom: '18px' }}>
          <SectionLabel>Build name</SectionLabel>
          <input
            type="text"
            value={buildName}
            onChange={(e) => setBuildName(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'var(--text-primary)',
              fontSize: '13px', outline: 'none',
              fontWeight: 600, transition: 'border-color 0.15s',
            }}
          />
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <SectionLabel>Completion</SectionLabel>
            <span style={{ fontSize: '12px', fontWeight: 800, color: progressColor, letterSpacing: '-0.01em' }}>
              {filledCategories}/{totalSlots}
            </span>
          </div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px',
              width: `${progress}%`,
              background: progress === 100
                ? '#34d399'
                : 'linear-gradient(90deg, var(--cyan) 0%, #a78bfa 100%)',
              transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', margin: '0 -18px 18px' }} />

        {/* Price + Wattage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <div style={{
            padding: '12px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '6px' }}>
              Total
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              ${totalPrice.toLocaleString()}
            </div>
          </div>
          <div style={{
            padding: '12px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${psuOk ? 'rgba(255,255,255,0.05)' : 'rgba(248,113,113,0.2)'}`,
          }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '6px' }}>
              Draw
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: wattageColor(componentDraw), letterSpacing: '-0.03em', lineHeight: 1 }}>
              {componentDraw}W
            </div>
            {psuCapacity > 0 && (
              <div style={{ fontSize: '10px', color: psuOk ? 'rgba(52,211,153,0.7)' : '#f87171', marginTop: '4px' }}>
                {psuOk ? `${psuCapacity}W PSU — ok` : `Need ${Math.ceil(componentDraw * 1.2 / 50) * 50}W+`}
              </div>
            )}
          </div>
        </div>

        {/* Compatibility */}
        {(compatIssues.length > 0 || compatWarnings.length > 0) && (
          <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {compatIssues.map((issue, i) => (
              <div key={i} style={{
                padding: '8px 10px', borderRadius: '7px',
                background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.18)',
                fontSize: '11px', color: '#fca5a5', lineHeight: 1.5,
                display: 'flex', gap: '8px',
              }}>
                <span style={{ flexShrink: 0, opacity: 0.7 }}>✕</span>
                {issue}
              </div>
            ))}
            {compatWarnings.map((warn, i) => (
              <div key={i} style={{
                padding: '8px 10px', borderRadius: '7px',
                background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)',
                fontSize: '11px', color: '#fde68a', lineHeight: 1.5,
                display: 'flex', gap: '8px',
              }}>
                <span style={{ flexShrink: 0, opacity: 0.7 }}>!</span>
                {warn}
              </div>
            ))}
          </div>
        )}

        {compatLoading && (
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginBottom: '12px', letterSpacing: '0.05em' }}>
            Checking compatibility…
          </div>
        )}

        {/* Minimum requirements hint */}
        {!isBuildable && totalFilled > 0 && (
          <div style={{
            padding: '9px 11px', borderRadius: '8px',
            background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)',
            marginBottom: '14px', fontSize: '11px', color: '#fde68a', lineHeight: 1.5,
          }}>
            CPU, GPU, Motherboard, and PSU are required to save.
          </div>
        )}

        {/* Public toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '16px', padding: '10px 12px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Public build</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: '1px' }}>
              {isPublic ? 'Anyone can view this build' : 'Only you can see this'}
            </div>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            style={{
              width: '38px', height: '22px', borderRadius: '11px', padding: 0, border: 'none',
              background: isPublic ? '#34d399' : 'rgba(255,255,255,0.1)',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%',
              background: '#fff', position: 'absolute', top: '3px',
              left: isPublic ? '19px' : '3px',
              transition: 'left 0.18s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }} />
          </button>
        </div>

        {/* Alerts */}
        {saveWarn && (
          <div style={{
            padding: '9px 11px', borderRadius: '8px',
            background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)',
            marginBottom: '10px', fontSize: '11px', color: '#fde68a',
          }}>
            {saveWarn}
          </div>
        )}
        {saveError && (
          <div style={{
            padding: '9px 11px', borderRadius: '8px',
            background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.18)',
            marginBottom: '10px', fontSize: '11px', color: '#fca5a5',
          }}>
            {saveError}
          </div>
        )}

        {/* Save button */}
        {session ? (
          <button
            onClick={handleSave}
            disabled={isSaving || !isBuildable}
            style={{
              width: '100%', padding: '11px 0', borderRadius: '9px',
              background: isBuildable
                ? isSaving
                  ? 'rgba(0,212,255,0.25)'
                  : 'linear-gradient(135deg, var(--cyan) 0%, #38bdf8 100%)'
                : 'rgba(255,255,255,0.04)',
              border: isBuildable ? 'none' : '1px solid rgba(255,255,255,0.07)',
              color: isBuildable ? '#020408' : 'rgba(255,255,255,0.25)',
              fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: isBuildable && !isSaving ? 'pointer' : 'not-allowed',
              transition: 'all 0.18s',
              boxShadow: isBuildable && !isSaving ? '0 4px 20px rgba(0,212,255,0.25)' : 'none',
            }}
          >
            {isSaving ? 'Saving…' : buildId ? 'Update Build' : 'Save Build'}
          </button>
        ) : (
          <div style={{
            padding: '14px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            textAlign: 'center',
          }}>
            <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Sign in to save and share your build
            </p>
            <a
              href="/api/auth/signin"
              style={{
                display: 'inline-block', padding: '8px 22px', borderRadius: '7px',
                background: 'linear-gradient(135deg, var(--cyan) 0%, #38bdf8 100%)',
                color: '#020408', fontSize: '11px', fontWeight: 800,
                letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase',
                boxShadow: '0 4px 16px rgba(0,212,255,0.2)',
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
              background: 'transparent', border: '1px solid rgba(248,113,113,0.15)',
              color: 'rgba(248,113,113,0.5)',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.12s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(248,113,113,0.06)';
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(248,113,113,0.5)';
              e.currentTarget.style.borderColor = 'rgba(248,113,113,0.15)';
            }}
          >
            Clear Build
          </button>
        )}
      </div>
    </div>
  );
}
