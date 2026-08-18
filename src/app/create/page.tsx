"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Box, CircleDot, Cylinder, Cone, Circle, Hexagon, Octagon, Pentagon,
  Trash2, RotateCcw, Sparkles,
} from "lucide-react";
import { useCreatorStore } from "@/stores/nft-store";
import type { Shape3D, Material3D } from "@/types";

const CreatorCanvas = dynamic(
  () => import("@/components/3d/CreatorCanvas").then((m) => m.CreatorCanvas),
  { ssr: false }
);

const shapeTypes: { type: Shape3D["type"]; icon: typeof Box; label: string }[] = [
  { type: "box", icon: Box, label: "Cube" },
  { type: "sphere", icon: CircleDot, label: "Sphere" },
  { type: "cylinder", icon: Cylinder, label: "Cylinder" },
  { type: "cone", icon: Cone, label: "Cone" },
  { type: "torus", icon: Circle, label: "Torus" },
  { type: "icosahedron", icon: Hexagon, label: "Icosa" },
  { type: "octahedron", icon: Octagon, label: "Octa" },
  { type: "dodecahedron", icon: Pentagon, label: "Dodeca" },
  { type: "knot", icon: Circle, label: "Knot" },
];

const materials: Material3D[] = ["standard", "physical", "glass", "metal", "neon"];
const colors = ["#8b5cf6", "#ec4899", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#6366f1", "#ffffff"];

export default function CreatePage() {
  const { scene, addShape, removeShape, selectedShapeId, setSelectedShapeId, updateShape, setScene } =
    useCreatorStore();
  const selectedShape = scene.shapes.find((s) => s.id === selectedShapeId);

  const addNewShape = (type: Shape3D["type"]) => {
    const shape: Shape3D = {
      id: Math.random().toString(36).slice(2),
      type,
      position: [(Math.random() - 0.5) * 4, Math.random() * 2, (Math.random() - 0.5) * 4],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: colors[Math.floor(Math.random() * colors.length)],
      material: "standard",
    };
    addShape(shape);
    setSelectedShapeId(shape.id);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            3D <span className="gradient-text">Creator Studio</span>
          </h1>
          <p className="text-white/40">Build your 3D masterpiece and mint it as an NFT</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] min-h-[560px]">
          <div className="glass rounded-xl p-4 border border-white/5 overflow-y-auto">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Shapes</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {shapeTypes.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => addNewShape(type)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 hover:bg-violet-500/20 border border-white/5 hover:border-violet-500/30 transition-all"
                >
                  <Icon className="w-5 h-5 text-white/60" />
                  <span className="text-[10px] text-white/40">{label}</span>
                </button>
              ))}
            </div>

            {selectedShape && (
              <>
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Material</h3>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {materials.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => updateShape(selectedShape.id, { material: mat })}
                      className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                        selectedShape.material === mat
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                          : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10"
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Color</h3>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateShape(selectedShape.id, { color: c })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        selectedShape.color === c ? "border-white scale-110" : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => removeShape(selectedShape.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete Shape
                </button>
              </>
            )}

            <div className="mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => setScene({ ...scene, shapes: [] })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 transition-all text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Clear All
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <CreatorCanvas />
          </div>
        </div>

        <div className="mt-6 glass rounded-xl p-4 border border-white/5 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <p className="text-white font-medium">{scene.shapes.length} shapes in scene</p>
            <p className="text-white/40 text-sm">
              {scene.shapes.length > 0 ? "Ready to mint as a 3D NFT" : "Add shapes to start building"}
            </p>
          </div>
          <Link
            href="/mint"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              scene.shapes.length > 0
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500"
                : "bg-white/5 text-white/30 pointer-events-none"
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Proceed to Mint
          </Link>
        </div>
      </div>
    </div>
  );
}
