export type Shape3DType =
  | "box" | "sphere" | "cylinder" | "cone" | "torus"
  | "icosahedron" | "octahedron" | "dodecahedron" | "knot";

export type Material3D = "standard" | "physical" | "glass" | "metal" | "neon";

export interface Shape3D {
  id: string;
  type: Shape3DType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  material: Material3D;
}

export interface CreatorScene {
  shapes: Shape3D[];
  background: string;
}

export interface MintRecord {
  tokenId: string;
  txHash: string;
  name: string;
  description: string;
  category: string;
  price: string;
  chainId: number;
  owner: string;
  createdAt: string;
}
