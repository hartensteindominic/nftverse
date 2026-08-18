import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreatorScene, Shape3D, MintRecord } from "@/types";

interface CreatorState {
  scene: CreatorScene;
  selectedShapeId: string | null;
  addShape: (shape: Shape3D) => void;
  removeShape: (id: string) => void;
  updateShape: (id: string, patch: Partial<Shape3D>) => void;
  setSelectedShapeId: (id: string | null) => void;
  setScene: (scene: CreatorScene) => void;
}

export const useCreatorStore = create<CreatorState>()(
  persist(
    (set) => ({
      scene: { shapes: [], background: "#050508" },
      selectedShapeId: null,
      addShape: (shape) =>
        set((s) => ({ scene: { ...s.scene, shapes: [...s.scene.shapes, shape] } })),
      removeShape: (id) =>
        set((s) => ({
          scene: { ...s.scene, shapes: s.scene.shapes.filter((x) => x.id !== id) },
          selectedShapeId: s.selectedShapeId === id ? null : s.selectedShapeId,
        })),
      updateShape: (id, patch) =>
        set((s) => ({
          scene: {
            ...s.scene,
            shapes: s.scene.shapes.map((x) => (x.id === id ? { ...x, ...patch } : x)),
          },
        })),
      setSelectedShapeId: (id) => set({ selectedShapeId: id }),
      setScene: (scene) => set({ scene }),
    }),
    { name: "nftverse-creator" }
  )
);

interface MintState {
  mints: MintRecord[];
  addMint: (mint: MintRecord) => void;
}

// Mint receipts persisted locally so the marketplace can show YOUR minted pieces.
export const useMintStore = create<MintState>()(
  persist(
    (set) => ({
      mints: [],
      addMint: (mint) => set((s) => ({ mints: [mint, ...s.mints] })),
    }),
    { name: "nftverse-mints" }
  )
);
