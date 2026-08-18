"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

type ModelType = "crystal" | "cube" | "helix" | "sphere";

export function NFTModel({
  type = "crystal",
  color = "#8b5cf6",
  secondaryColor = "#ec4899",
  scale = 1,
}: {
  type?: ModelType;
  color?: string;
  secondaryColor?: string;
  scale?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={group} scale={scale}>
        {type === "crystal" && (
          <>
            <mesh>
              <octahedronGeometry args={[1, 0]} />
              <meshPhysicalMaterial
                color={color}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
                emissive={secondaryColor}
                emissiveIntensity={0.25}
              />
            </mesh>
            <mesh scale={1.35}>
              <octahedronGeometry args={[1, 0]} />
              <meshBasicMaterial color={secondaryColor} wireframe transparent opacity={0.25} />
            </mesh>
          </>
        )}
        {type === "cube" && (
          <mesh>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshStandardMaterial
              color={color}
              metalness={0.8}
              roughness={0.2}
              emissive={secondaryColor}
              emissiveIntensity={0.3}
            />
          </mesh>
        )}
        {type === "sphere" && (
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <meshPhysicalMaterial
              color={color}
              metalness={0.6}
              roughness={0.05}
              transmission={0.6}
              thickness={1.5}
              emissive={secondaryColor}
              emissiveIntensity={0.15}
            />
          </mesh>
        )}
        {type === "helix" && (
          <mesh>
            <torusKnotGeometry args={[0.8, 0.28, 180, 24]} />
            <meshStandardMaterial
              color={color}
              metalness={0.9}
              roughness={0.15}
              emissive={secondaryColor}
              emissiveIntensity={0.35}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}
