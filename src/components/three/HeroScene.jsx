import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  heroTerrainFragmentShader,
  heroTerrainVertexShader,
} from "../../shaders/heroTerrain.js";

const routeControlPoints = [
  [-4.4, 0.1, 2.2],
  [-3.2, 0.16, 1.1],
  [-2.4, 0.23, -0.4],
  [-1.1, 0.3, -1.2],
  [0.1, 0.42, -0.35],
  [1.25, 0.52, 0.45],
  [2.45, 0.38, -0.2],
  [3.65, 0.22, -1.15],
  [4.45, 0.16, -0.45],
];

function seededValue(index, salt) {
  return Math.abs(Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1;
}

function Terrain({ quality }) {
  const materialRef = useRef(null);
  const segments = quality === "high" ? [96, 72] : [64, 48];
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uPointer.value.set(
      state.pointer.x * 0.5 + 0.5,
      state.pointer.y * 0.5 + 0.5,
    );
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, -0.08]} position={[0, -1.25, 0]}>
      <planeGeometry args={[11, 8.2, ...segments]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={heroTerrainVertexShader}
        fragmentShader={heroTerrainFragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function RouteSignal() {
  const signalRef = useRef(null);
  const route = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      routeControlPoints.map((point) => new THREE.Vector3(...point)),
    );
    return { curve, points: curve.getPoints(128) };
  }, []);

  useFrame(({ clock }) => {
    if (!signalRef.current) return;
    const progress = (clock.elapsedTime * 0.075) % 1;
    signalRef.current.position.copy(route.curve.getPointAt(progress));
  });

  return (
    <group>
      <Line
        points={route.points}
        color="#a9ff35"
        lineWidth={1.5}
        transparent
        opacity={0.72}
      />
      <Line
        points={route.points.map((point) => [point.x, point.y - 0.025, point.z])}
        color="#43bce9"
        lineWidth={4.5}
        transparent
        opacity={0.08}
      />
      <mesh ref={signalRef}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color="#d8ff8a" toneMapped={false} />
        <pointLight color="#b8ff3d" intensity={1.8} distance={1.2} />
      </mesh>
    </group>
  );
}

function CartographicCore() {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const ringRef = useRef(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = 0.62 + Math.sin(clock.elapsedTime * 0.65) * 0.09;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = clock.elapsedTime * 0.12;
      coreRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.14;
    }
    if (ringRef.current) ringRef.current.rotation.z = -clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef} position={[1.25, 0.62, 0.2]}>
      <group rotation={[0.08, -0.25, -0.04]}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.82, 2]} />
          <meshBasicMaterial
            color="#b8ff3d"
            wireframe
            toneMapped={false}
          />
        </mesh>
        <mesh scale={0.72}>
          <icosahedronGeometry args={[0.82, 2]} />
          <meshPhysicalMaterial
            color="#17351d"
            emissive="#74d92b"
            emissiveIntensity={0.78}
            roughness={0.34}
            metalness={0.46}
            transparent
            opacity={0.88}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.08, 0.018, 8, 96]} />
          <meshBasicMaterial color="#b8ff3d" transparent opacity={0.72} />
        </mesh>
        <mesh ref={ringRef} rotation={[1.2, 0.2, 0.5]}>
          <torusGeometry args={[1.34, 0.014, 8, 96]} />
          <meshBasicMaterial color="#55c7f3" transparent opacity={0.56} />
        </mesh>
        <pointLight color="#a8ff3a" intensity={3.2} distance={4.8} />
      </group>
    </group>
  );
}

function FieldParticles({ quality }) {
  const pointsRef = useRef(null);
  const count = quality === "high" ? 180 : 90;
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3;
      values[cursor] = (seededValue(index, 1) - 0.5) * 10;
      values[cursor + 1] = seededValue(index, 2) * 2.8 - 0.7;
      values[cursor + 2] = (seededValue(index, 3) - 0.5) * 7;
    }
    return values;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.06) * 0.045;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8ee9ff"
        size={0.026}
        transparent
        opacity={0.44}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function CameraRig({ progressRef }) {
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const progress = progressRef?.current ?? 0;
    const pointerWeight = 1 - Math.min(1, progress * 3.4);
    target.set(
      state.pointer.x * 0.28 * pointerWeight - progress * 0.4,
      2.25 + state.pointer.y * 0.16 * pointerWeight + progress * 0.65,
      6.9 + progress * 2.25,
    );
    state.camera.position.lerp(target, 1 - Math.exp(-delta * 2.8));
    state.camera.lookAt(0, -0.25 + progress * 0.18, 0);
  });

  return null;
}

export default function HeroScene({ quality, progressRef }) {
  return (
    <>
      <color attach="background" args={["#050806"]} />
      <fog attach="fog" args={["#050806", 6.5, 13]} />
      <ambientLight intensity={0.42} color="#ccdfcf" />
      <directionalLight position={[-4, 6, 4]} intensity={1.2} color="#d9ffe2" />
      <pointLight position={[-4, 1, 2]} intensity={1.1} color="#55c7f3" distance={7} />
      <Terrain quality={quality} />
      <RouteSignal />
      <CartographicCore />
      <FieldParticles quality={quality} />
      <CameraRig progressRef={progressRef} />
    </>
  );
}
