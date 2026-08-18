"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { Scene3D } from "./Scene3D";
import { useCreatorStore } from "@/stores/nft-store";
import type { Shape3D } from "@/types";

function ShapeMesh({ shape }: { shape: Shape3D }) {
  const { selectedShapeId, setSelectedShapeId, updateShape } = useCreatorStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const selected = selectedShapeId === shape.id;

  useFrame((_, delta) => {
    if (meshRef.current && !selected) meshRef.current.rotation.y += delta * 0.15;
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedShapeId(shape.id);
  };

  const materialProps = { color: shape.color };
  let material: JSX.Element;
  switch (shape.material) {
    case "physical":
      material = <meshPhysicalMaterial {...materialProps} metalness={0.7} roughness={0.2} clearcoat={1} />;
      break;
    case "glass":
      material = <meshPhysicalMaterial {...materialProps} transmission={0.9} thickness={1} roughness={0.05} />;
      break;
    case "metal":
      material = <meshStandardMaterial {...materialProps} metalness={1} roughness={0.1} />;
      break;
    case "neon":
      material = <meshStandardMaterial {...materialProps} emissive={shape.color} emissiveIntensity={1.2} />;
      break;
    default:
      material = <meshStandardMaterial {...materialProps} metalness={0.3} roughness={0.4} />;
  }

  let geometry: JSX.Element;
  switch (shape.type) {
    case "sphere": geometry = <sphereGeometry args={[0.7, 48, 48]} />; break;
    case "cylinder": geometry = <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />; break;
    case "cone": geometry = <coneGeometry args={[0.6, 1.2, 32]} />; break;
    case "torus": geometry = <torusGeometry args={[0.6, 0.24, 24, 72]} />; break;
    case "icosahedron": geometry = <icosahedronGeometry args={[0.7, 0]} />; break;
    case "octahedron": geometry = <octahedronGeometry args={[0.7, 0]} />; break;
    case "dodecahedron": geometry = <dodecahedronGeometry args={[0.7, 0]} />; break;
    case "knot": geometry = <torusKnotGeometry args={[0.5, 0.18, 140, 20]} />; break;
    default: geometry = <boxGeometry args={[0.9, 0.9, 0.9]} />;
  }

  return (
    <>
      <mesh
        ref={meshRef}
        position={shape.position}
        rotation={shape.rotation}
        scale={shape.scale}
        onClick={onClick}
      >
        {geometry}
        {material}
        {selected && (
          <mesh scale={1.15}>
            {geometry}
            <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.5} />
          </mesh>
        )}
      </mesh>
      {selected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode="translate"
          onObjectChange={() => {
            if (meshRef.current) {
              const p = meshRef.current.position;
              updateShape(shape.id, { position: [p.x, p.y, p.z] });
            }
          }}
        />
      )}
    </>
  );
}

export function CreatorCanvas() {
  const { scene, setSelectedShapeId } = useCreatorStore();
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-[#050508] grid-bg"
    >
      <Scene3D variant="creator" onPointerMissed={() => setSelectedShapeId(null)}>
        <gridHelper args={[20, 20, "#7c3aed", "#1e1b4b"]} position={[0, -2, 0]} />
        {scene.shapes.map((s) => (
          <ShapeMesh key={s.id} shape={s} />
        ))}
      </Scene3D>
      <div className="absolute bottom-3 left-3 text-xs text-white/30 pointer-events-none px-3">
        Click a shape to select · drag arrows to move · right-drag to pan
      </div>
    </div>
  );
}
