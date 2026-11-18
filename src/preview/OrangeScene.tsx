/**
 * STILTEST v2 – 3D-Szene «Orange» (three.js über @remotion/three).
 * Echte Lichtführung: Führungslicht, kühles Kantenlicht, warmes Gegenlicht
 * auf der Schnittfläche. Bewegungen langsam und ohne Überschwingen.
 */
import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { random, useCurrentFrame } from "remotion";
import { EASE } from "../design/theme";
import { mix, ramp } from "../motion/anim";
import { makeDotTexture, makeFaceTextures, makePeelTextures } from "./textures";
import { T } from "./timing";

/** Kameraposition und Blickziel – zentral, damit Text/Glanz-Ebenen synchron bleiben. */
export const orangeCamera = (f: number) => {
  const dollyA = mix(7.0, 6.3, ramp(f, 0, T.cutStart, EASE.soft));
  const dollyB = mix(0, 0.35, ramp(f, T.cutStart, 200, EASE.soft));
  const push = ramp(f, T.pushStart, T.pushEnd - T.pushStart, EASE.in);
  const group = orangeGroup(f);
  return {
    position: new THREE.Vector3(mix(-0.25, 0.1, ramp(f, 0, 400, EASE.soft)) + push * group.x * 0.8, 0.25 + push * 0.9, dollyA - dollyB - push * 3.3),
    target: new THREE.Vector3(group.x * 0.62 + push * group.x * 0.38, group.y * 0.6 + push * 0.25, 0),
    fov: 26,
  };
};

/** Position der Orange im Raum (rückt für den Titel ins rechte Drittel). */
export const orangeGroup = (f: number) => {
  const move = ramp(f, T.cutStart + 10, 100, EASE.inOut);
  return { x: mix(0, 1.12, move), y: mix(0, -0.12, move) };
};

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const cam = orangeCamera(frame);
  camera.position.copy(cam.position);
  camera.fov = cam.fov;
  camera.near = 0.05;
  camera.far = 60;
  camera.updateProjectionMatrix();
  camera.lookAt(cam.target);
  return null;
};

/** Staubteilchen im Licht – echte Tiefe durch Parallaxe bei Kamerabewegung. */
const Dust: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const dot = useMemo(() => makeDotTexture(), []);
  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const n = 220;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const x = (random(`dx${i}`) - 0.5) * 9;
    const y = (random(`dy${i}`) - 0.5) * 5;
    const z = (random(`dz${i}`) - 0.5) * 6 - 0.5;
    pos[i * 3] = x + Math.sin(frame / 140 + i) * 0.08;
    pos[i * 3 + 1] = y + frame * 0.0009 * (0.5 + random(`ds${i}`));
    pos[i * 3 + 2] = z;
  }
  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return (
    <points geometry={geom}>
      <pointsMaterial map={dot} size={0.035} sizeAttenuation transparent opacity={0.55 * opacity} depthWrite={false} blending={THREE.AdditiveBlending} color="#FFD9B0" />
    </points>
  );
};

/**
 * Halbkugel, deren UVs auf die passende Hälfte der Vollkugel-Textur zeigen –
 * so treffen sich die beiden Hälften ohne sichtbare Naht.
 */
const hemisphere = (top: boolean) => {
  const g = new THREE.SphereGeometry(1, 192, 96, 0, Math.PI * 2, top ? 0 : Math.PI / 2, Math.PI / 2);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) {
    const v = uv.getY(i);
    uv.setY(i, top ? 0.5 + v * 0.5 : v * 0.5);
  }
  uv.needsUpdate = true;
  return g;
};

export const OrangeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const peel = useMemo(() => makePeelTextures(), []);
  const topGeo = useMemo(() => hemisphere(true), []);
  const bottomGeo = useMemo(() => hemisphere(false), []);
  const face = useMemo(() => makeFaceTextures(), []);

  /* --- Licht --- */
  const keyIn = ramp(frame, 0, 100, EASE.inOut);
  const keySweep = ramp(frame, 0, 150, EASE.soft);
  const rimIn = ramp(frame, 30, 110, EASE.inOut);
  const faceLight = ramp(frame, T.cutStart + 30, 80, EASE.inOut);
  const push = ramp(frame, T.pushStart, T.pushEnd - T.pushStart, EASE.in);

  /* --- Bewegung --- */
  const g = orangeGroup(frame);
  const spin = frame * 0.0032 + 0.6;
  const cut = ramp(frame, T.cutStart, 90, EASE.inOut);
  const tilt = mix(0, 0.8, cut);
  const lift = ramp(frame, T.cutStart, 95, EASE.inOut);
  const topFade = 1 - ramp(frame, T.cutStart + 40, 50, EASE.inOut);
  const glow = 0.03 + faceLight * 0.2 + push * 1.0;

  return (
    <>
      <CameraRig />
      <hemisphereLight args={["#2B3140", "#050608", 0.35]} />
      <directionalLight position={[mix(-7, -3.2, keySweep), mix(1.5, 4.2, keySweep), mix(2, 5, keySweep)]} intensity={3.4 * keyIn} color="#FFF1E2" />
      <directionalLight position={[4.5, 2.2, -4]} intensity={2.2 * rimIn} color="#A9CBFF" />
      <directionalLight position={[2, -3, 2]} intensity={0.55 * keyIn} color="#FFB37A" />
      <pointLight position={[g.x + 0.6, g.y + 2.4, 0.4]} intensity={3 * faceLight} distance={5} decay={2} color="#FFC07A" />

      <group position={[g.x, g.y, 0]}>
        {/* untere Hälfte – kippt mit der Schnittfläche zur Kamera */}
        <group rotation={[tilt, 0, 0]}>
          <group rotation={[0, spin, 0]} scale={[1, 0.94, 1]}>
            <mesh geometry={bottomGeo}>
              <meshPhysicalMaterial map={peel.map} bumpMap={peel.bump} bumpScale={1.7} roughness={0.5} clearcoat={0.35} clearcoatRoughness={0.38} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0008, 0]}>
              <circleGeometry args={[0.999, 192]} />
              <meshPhysicalMaterial
                map={face.map}
                emissiveMap={face.glow}
                emissive="#FFFFFF"
                emissiveIntensity={glow}
                bumpMap={face.glow}
                bumpScale={1.4}
                roughness={0.45}
                clearcoat={0.85}
                clearcoatRoughness={0.24}
              />
            </mesh>
          </group>
        </group>

        {/* obere Hälfte – hebt sich und gleitet aus dem Bild */}
        {topFade > 0.001 ? (
          <group position={[0, lift * 2.3, -lift * 0.9]} rotation={[-lift * 0.95, 0, lift * 0.12]}>
            <group rotation={[0, spin, 0]} scale={[1, 0.94, 1]}>
              <mesh geometry={topGeo}>
                <meshPhysicalMaterial map={peel.map} bumpMap={peel.bump} bumpScale={1.7} roughness={0.5} clearcoat={0.35} clearcoatRoughness={0.38} transparent opacity={topFade} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.0008, 0]}>
                <circleGeometry args={[0.999, 192]} />
                <meshPhysicalMaterial map={face.map} emissiveMap={face.glow} emissive="#FFFFFF" emissiveIntensity={glow} roughness={0.45} clearcoat={0.85} clearcoatRoughness={0.24} transparent opacity={topFade} />
              </mesh>
              {/* Stielansatz */}
              <mesh position={[0, 0.995, 0]}>
                <cylinderGeometry args={[0.05, 0.065, 0.05, 24]} />
                <meshStandardMaterial color="#4E5F22" roughness={0.85} transparent opacity={topFade} />
              </mesh>
              <mesh position={[0, 0.985, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.11, 7]} />
                <meshStandardMaterial color="#6E7C2E" roughness={0.8} transparent opacity={topFade} side={THREE.DoubleSide} />
              </mesh>
            </group>
          </group>
        ) : null}
      </group>

      <Dust opacity={keyIn} />
    </>
  );
};
