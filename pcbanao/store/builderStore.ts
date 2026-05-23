import { create } from 'zustand';
import { IPart } from '@/lib/api/productApi';

export type SlotKey = 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooler';

export interface CompatibilityResult {
  isCompatible: boolean;
  issues: string[];
  warnings: string[];
  totalWattage: number;
}

export interface BuilderState {
  // The in-progress build (null = not yet saved to backend)
  buildId: string | null;
  buildName: string;
  isPublic: boolean;

  // Selected parts — single-slot categories hold one IPart, multi-slot hold array
  slots: {
    cpu:         IPart | null;
    gpu:         IPart | null;
    motherboard: IPart | null;
    ram:         IPart[];
    storage:     IPart[];
    psu:         IPart | null;
    case:        IPart | null;
    cooler:      IPart | null;
  };

  // Derived
  totalPrice: number;
  totalWattage: number;
  compatibility: CompatibilityResult | null;

  // UI state
  activeSlot: SlotKey | null;
  isSaving: boolean;
  lastSavedAt: Date | null;

  // Actions
  setBuildId:   (id: string | null) => void;
  setBuildName: (name: string) => void;
  setIsPublic:  (v: boolean) => void;
  setPart:      (slot: SlotKey, part: IPart) => void;
  removePart:   (slot: SlotKey, partId?: string) => void;
  setActiveSlot:(slot: SlotKey | null) => void;
  setCompatibility: (result: CompatibilityResult | null) => void;
  setIsSaving:  (v: boolean) => void;
  setLastSaved: (d: Date) => void;
  resetBuild:   () => void;
}

const MULTI_SLOT: SlotKey[] = ['ram', 'storage'];

function computeTotals(slots: BuilderState['slots']): { totalPrice: number; totalWattage: number } {
  const allParts: IPart[] = [
    slots.cpu, slots.gpu, slots.motherboard, slots.psu, slots.case, slots.cooler,
    ...slots.ram, ...slots.storage,
  ].filter((p): p is IPart => p !== null);

  return {
    totalPrice:   allParts.reduce((s, p) => s + p.price, 0),
    totalWattage: allParts.reduce((s, p) => s + (p.wattage ?? 0), 0),
  };
}

const EMPTY_SLOTS: BuilderState['slots'] = {
  cpu: null, gpu: null, motherboard: null, ram: [], storage: [],
  psu: null, case: null, cooler: null,
};

export const useBuilderStore = create<BuilderState>((set) => ({
  buildId:       null,
  buildName:     'My Build',
  isPublic:      false,
  slots:         { ...EMPTY_SLOTS },
  totalPrice:    0,
  totalWattage:  0,
  compatibility: null,
  activeSlot:    null,
  isSaving:      false,
  lastSavedAt:   null,

  setBuildId:    (id) => set({ buildId: id }),
  setBuildName:  (name) => set({ buildName: name }),
  setIsPublic:   (v) => set({ isPublic: v }),

  setPart: (slot, part) =>
    set((state) => {
      let newSlots: BuilderState['slots'];
      if (MULTI_SLOT.includes(slot)) {
        const arr = state.slots[slot] as IPart[];
        // replace if same _id already present, else append (max 4 ram, 8 storage)
        const max = slot === 'ram' ? 4 : 8;
        const existing = arr.findIndex((p) => p._id === part._id);
        const next = existing >= 0
          ? arr.map((p, i) => (i === existing ? part : p))
          : arr.length < max ? [...arr, part] : arr;
        newSlots = { ...state.slots, [slot]: next };
      } else {
        newSlots = { ...state.slots, [slot]: part };
      }
      return { slots: newSlots, compatibility: null, ...computeTotals(newSlots) };
    }),

  removePart: (slot, partId) =>
    set((state) => {
      let newSlots: BuilderState['slots'];
      if (MULTI_SLOT.includes(slot)) {
        const arr = state.slots[slot] as IPart[];
        newSlots = { ...state.slots, [slot]: partId ? arr.filter((p) => p._id !== partId) : [] };
      } else {
        newSlots = { ...state.slots, [slot]: null };
      }
      return { slots: newSlots, compatibility: null, ...computeTotals(newSlots) };
    }),

  setActiveSlot:    (slot) => set({ activeSlot: slot }),
  setCompatibility: (result) => set({ compatibility: result }),
  setIsSaving:      (v) => set({ isSaving: v }),
  setLastSaved:     (d) => set({ lastSavedAt: d }),

  resetBuild: () =>
    set({
      buildId: null, buildName: 'My Build', isPublic: false,
      slots: { ...EMPTY_SLOTS }, totalPrice: 0, totalWattage: 0,
      compatibility: null, activeSlot: null, isSaving: false, lastSavedAt: null,
    }),
}));
