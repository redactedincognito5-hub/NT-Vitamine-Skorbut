/**
 * STILTEST v2 – 3D-Szene «Kollagen» (schematische Dreifach-Helix).
 * Molekülmodell-Optik: feine Stränge mit aufgereihten Kugeln.
 * Tiefe entsteht durch Nebel, Bewegungsparallaxe und weitere Helices im Hintergrund
 * (viele Kollagenmoleküle bilden zusammen Fasern).
 */
import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { random, useCurrentFrame } from "remotion";
import { COLORS, EASE } from "../design/theme";
import { mix, ramp } from "../motion/anim";
import { makeDotTexture } from "./textures";

/** Nebelfarbe = mittlerer Hintergrundton → ferne Objekte lösen sich weich auf. */
const FOG = "#10131A";

class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private length: number,
    private radius: number,
    private turns: number,
    private phase: number,
  ) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const a = t * this.turns * Math.PI * 2 + this.phase;
    return target.set((t - 0.5) * this.length, Math.cos(a) * this.radius, Math.sin(a) * this.radius);
  }
}

const STRANDS = [
  { color: COLORS.orange, emissive: "#3A1700", phase: 0 },
  { color: "#EFE8DE", emissive: "#000000", phase: (Math.PI * 2) / 3 },
  { color: "#98A4B7", emissive: "#000000", phase: (Math.PI * 4) / 3 },
];

const LENGTH = 11;
const RADIUS = 0.3;
const TURNS = LENGTH / 1.9;

/** Hauptmolekül: feiner Strang + Kugeln (Instanced Mesh → schnell). */
const BeadHelix: React.FC = () => {
  const objects = useMemo(() => {
    return STRANDS.map((s) => {
      const curve = new HelixCurve(LENGTH, RADIUS, TURNS, s.phase);
      const material = new THREE.MeshPhysicalMaterial({ color: s.color, emissive: s.emissive, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.18 });
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 900, 0.03, 10, false), material);
      const count = 104;
      const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.074, 24, 16), material, count);
      const m = new THREE.Matrix4();
      const p = new THREE.Vector3();
      for (let k = 0; k < count; k++) {
        curve.getPoint((k + 0.5) / count, p);
        m.makeTranslation(p.x, p.y, p.z);
        beads.setMatrixAt(k, m);
      }
      beads.instanceMatrix.needsUpdate = true;
      return { tube, beads };
    });
  }, []);
  return (
    <>
      {objects.map((o, i) => (
        <React.Fragment key={i}>
          <primitive object={o.tube} />
          <primitive object={o.beads} />
        </React.Fragment>
      ))}
    </>
  );
};

/** Einfachere Helix für den Hintergrund. */
const TubeHelix: React.FC = () => {
  const meshes = useMemo(
    () =>
      STRANDS.map(
        (s) =>
          new THREE.Mesh(
            new THREE.TubeGeometry(new HelixCurve(LENGTH, RADIUS, TURNS, s.phase), 420, 0.06, 10, false),
            new THREE.MeshPhysicalMaterial({ color: s.color, roughness: 0.35, clearcoat: 0.6 }),
          ),
      ),
    [],
  );
  return (
    <>
      {meshes.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </>
  );
};

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const p = ramp(frame, 0, 210, EASE.soft);
  camera.position.set(mix(-2.95, -2.25, p), mix(0.62, 0.42, p), mix(2.75, 2.4, p));
  camera.fov = 30;
  camera.near = 0.05;
  camera.far = 60;
  camera.updateProjectionMatrix();
  camera.lookAt(mix(1.0, 1.35, p), 0.05, 0);
  return null;
};

const Motes: React.FC = () => {
  const frame = useCurrentFrame();
  const dot = useMemo(() => makeDotTexture(), []);
  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const n = 240;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (random(`hx${i}`) - 0.3) * 14 - frame * 0.002;
    pos[i * 3 + 1] = (random(`hy${i}`) - 0.5) * 6 + Math.sin(frame / 120 + i) * 0.05;
    pos[i * 3 + 2] = (random(`hz${i}`) - 0.6) * 10;
  }
  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return (
    <points geometry={geom}>
      <pointsMaterial map={dot} size={0.032} sizeAttenuation transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} color="#FFD7B0" />
    </points>
  );
};

export const HelixScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = useThree((s) => s.scene);
  if (!scene.fog) scene.fog = new THREE.Fog(FOG, 2.6, 12.5);
  const twist = frame * 0.006;
  const lightIn = ramp(frame, 0, 40, EASE.inOut);
  // nur unten/rechts und weit hinten → oben links bleibt ruhig für den Text
  const background = [
    { p: [6.5, -2.4, -7.5], r: -0.12 },
    { p: [0.5, -3.0, -10], r: 0.3 },
    { p: [11, -0.4, -12], r: 0.08 },
  ];
  return (
    <>
      <CameraRig />
      <hemisphereLight args={["#2B3140", "#050608", 0.45]} />
      <directionalLight position={[-4, 5, 4]} intensity={3.0} color="#FFF1E2" />
      <directionalLight position={[5, 1.5, -4]} intensity={2.4 * lightIn} color="#A9CBFF" />
      <pointLight position={[0.2, 1.2, 1.4]} intensity={3.5} distance={6} decay={2} color="#FFB36B" />

      <group position={[0, -0.22, 0]} rotation={[twist, 0, 0.05]}>
        <BeadHelix />
      </group>
      {background.map((b, i) => (
        <group key={i} position={b.p as [number, number, number]} rotation={[twist * (0.85 + i * 0.05) + i, 0, b.r]}>
          <TubeHelix />
        </group>
      ))}
      <Motes />
    </>
  );
};
