"use client";

import { Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stars, ContactShadows } from "@react-three/drei";

export function Scene3D({
  children,
  variant = "hero",
  autoRotate = true,
  onPointerMissed,
}: {
  children: ReactNode;
  variant?: "hero" | "nft" | "creator";
  autoRotate?: boolean;
  onPointerMissed?: () => void;
}) {
  return (
    <Canvas
      camera={{ position: variant === "hero" ? [0, 0, 7] : [0, 1, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={onPointerMissed}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <pointLight position={[8, 8, 8]} intensity={1.2} color="#a78bfa" />
        <pointLight position={[-8, -4, -4]} intensity={0.8} color="#22d3ee" />
        <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={0.8} color="#e879f9" />
        {variant === "hero" && (
          <Stars radius={60} depth={40} count={2500} factor={4} saturation={0.6} fade speed={1} />
        )}
        {children}
        {variant !== "hero" && (
          <ContactShadows position={[0, -2, 0]} opacity={0.5} blur={2.5} color="#8b5cf6" />
        )}
        <Environment preset="city" />
        <OrbitControls
          enableZoom={variant !== "hero"}
          enablePan={variant === "creator"}
          autoRotate={autoRotate && variant !== "creator"}
          autoRotateSpeed={0.8}
        />
      </Suspense>
    </Canvas>
  );
}
