import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { DEMO_ROUTE, sampleRoute } from "../../utils/wayperRoute.js";
import {
  territoryFragmentShader,
  territoryVertexShader,
} from "../../shaders/territoryShader.js";

const hudStates = [
  {
    label: "MAPA",
    status: "inicializando",
    distance: "0,00 km",
    time: "00:00",
    pace: "--:--",
  },
  {
    label: "GPS",
    status: "rota demonstrativa",
    distance: "0,42 km",
    time: "02:11",
    pace: "05:12",
  },
  {
    label: "ATIVIDADE",
    status: "registro local",
    distance: "1,84 km",
    time: "09:32",
    pace: "05:11",
  },
  {
    label: "TERRITÓRIO",
    status: "região fechada",
    distance: "3,20 km",
    time: "16:28",
    pace: "05:09",
  },
  {
    label: "SYNC",
    status: "fila demonstrativa",
    distance: "3,20 km",
    time: "16:28",
    pace: "05:09",
  },
  {
    label: "FLUXO",
    status: "dados sincronizados",
    distance: "3,20 km",
    time: "16:28",
    pace: "05:09",
  },
  {
    label: "WAYPER",
    status: "corrida concluída",
    distance: "3,20 km",
    time: "16:28",
    pace: "05:09",
  },
];

function mapPoint(point, z = 0.36) {
  return new THREE.Vector3((point.x - 0.5) * 2.42, (0.5 - point.y) * 4.82, z);
}

function makeTerritoryShape() {
  const corners = DEMO_ROUTE.slice(0, -1).map((point) => mapPoint(point, 0));
  const roundedCorners = corners.map((point, index) => {
    const previous = corners[(index - 1 + corners.length) % corners.length];
    const next = corners[(index + 1) % corners.length];
    const incoming = previous.clone().sub(point);
    const outgoing = next.clone().sub(point);
    const radius = Math.min(0.06, incoming.length() * 0.22, outgoing.length() * 0.22);

    return {
      point,
      entry: point.clone().add(incoming.normalize().multiplyScalar(radius)),
      exit: point.clone().add(outgoing.normalize().multiplyScalar(radius)),
    };
  });
  const shape = new THREE.Shape();

  roundedCorners.forEach((corner, index) => {
    if (index === 0) shape.moveTo(corner.entry.x, corner.entry.y);
    shape.quadraticCurveTo(
      corner.point.x,
      corner.point.y,
      corner.exit.x,
      corner.exit.y,
    );

    const nextCorner = roundedCorners[(index + 1) % roundedCorners.length];
    shape.lineTo(nextCorner.entry.x, nextCorner.entry.y);
  });
  shape.closePath();
  return shape;
}

function normalizeUvs(geometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const size = new THREE.Vector2(
    Math.max(box.max.x - box.min.x, 0.001),
    Math.max(box.max.y - box.min.y, 0.001),
  );
  const positions = geometry.getAttribute("position");
  const uv = new Float32Array(positions.count * 2);

  for (let index = 0; index < positions.count; index += 1) {
    uv[index * 2] = (positions.getX(index) - box.min.x) / size.x;
    uv[index * 2 + 1] = (positions.getY(index) - box.min.y) / size.y;
  }

  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geometry;
}

function ContextGuard({ onContextLost }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event) => {
      event.preventDefault();
      onContextLost?.();
    };

    canvas.addEventListener("webglcontextlost", handleLost, false);
    return () => canvas.removeEventListener("webglcontextlost", handleLost, false);
  }, [gl, onContextLost]);

  return null;
}

function MapBlocks() {
  const blocks = useMemo(() => {
    const result = [];
    for (let row = 0; row < 9; row += 1) {
      for (let column = 0; column < 5; column += 1) {
        result.push({
          x: -0.98 + column * 0.49,
          y: 2.02 - row * 0.5,
          height: 0.012 + ((row + column) % 3) * 0.006,
        });
      }
    }
    return result;
  }, []);

  return (
    <group position={[0, 0, 0.315]}>
      {blocks.map((block, index) => (
        <mesh position={[block.x, block.y, block.height / 2]} key={`${block.x}-${block.y}`}>
          <boxGeometry args={[0.38, 0.36, block.height]} />
          <meshStandardMaterial
            color={index % 6 === 0 ? "#143129" : "#102119"}
            emissive={index % 6 === 0 ? "#0b2420" : "#08140e"}
            emissiveIntensity={0.56}
            roughness={0.82}
          />
        </mesh>
      ))}
    </group>
  );
}

function RouteAndTerritory({ stateRef, quality }) {
  const routeSegmentRefs = useRef([]);
  const routeJointRefs = useRef([]);
  const markerRef = useRef(null);
  const markerRingRef = useRef(null);
  const territoryRef = useRef(null);
  const territoryMaterialRef = useRef(null);
  const territoryShaderRef = useRef(null);
  const burstRef = useRef(null);
  const burstMaterialRef = useRef(null);

  const routeSegments = useMemo(
    () =>
      DEMO_ROUTE.slice(0, -1).map((point, index) => {
        const start = mapPoint(point, 0.405);
        const end = mapPoint(DEMO_ROUTE[index + 1], 0.405);
        const direction = end.clone().sub(start);

        return {
          angle: Math.atan2(direction.y, direction.x),
          length: direction.length(),
          start,
        };
      }),
    [],
  );
  const routeJoints = useMemo(
    () => DEMO_ROUTE.slice(0, -1).map((point) => mapPoint(point, 0.405)),
    [],
  );
  const territoryShape = useMemo(() => makeTerritoryShape(), []);
  const territoryGeometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(territoryShape, {
        depth: 0.13,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.025,
        bevelThickness: 0.018,
        curveSegments: 16,
      }),
    [territoryShape],
  );
  const territoryTopGeometry = useMemo(
    () => normalizeUvs(new THREE.ShapeGeometry(territoryShape, 18)),
    [territoryShape],
  );
  const burstPositions = useMemo(() => {
    const count = quality === "high" ? 110 : 54;
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2;
      const radius = 0.28 + ((index * 29) % 80) / 100;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = Math.sin(angle) * radius;
      values[index * 3 + 2] = 0.5 + (index % 6) * 0.025;
    }
    return values;
  }, [quality]);

  useEffect(
    () => () => {
      territoryGeometry.dispose();
      territoryTopGeometry.dispose();
    },
    [territoryGeometry, territoryTopGeometry],
  );

  useFrame(({ clock }) => {
    const state = stateRef.current;
    const routeProgress = THREE.MathUtils.clamp(state.route, 0, 1);
    const completedSegments = routeProgress * routeSegments.length;

    routeSegmentRefs.current.forEach((segment, index) => {
      if (!segment) return;
      const reveal = THREE.MathUtils.clamp(completedSegments - index, 0, 1);
      segment.visible = reveal > 0.001;
      segment.scale.x = Math.max(reveal, 0.001);
    });

    routeJointRefs.current.forEach((joint, index) => {
      if (!joint) return;
      joint.visible = routeProgress > 0.001 && completedSegments >= index;
    });

    const markerPoint = mapPoint(sampleRoute(DEMO_ROUTE, routeProgress), 0.43);
    if (markerRef.current) markerRef.current.position.copy(markerPoint);
    if (markerRingRef.current) {
      markerRingRef.current.position.copy(markerPoint);
      const pulse = 1 + Math.sin(clock.elapsedTime * 4.2) * 0.16;
      markerRingRef.current.scale.setScalar(pulse);
    }

    if (territoryRef.current) {
      const reveal = THREE.MathUtils.clamp(state.territory, 0, 1);
      territoryRef.current.scale.z = Math.max(0.015, reveal);
      territoryRef.current.position.z = 0.34 + reveal * 0.055;
    }

    if (territoryMaterialRef.current) {
      territoryMaterialRef.current.opacity = state.territory * 0.6;
      territoryMaterialRef.current.emissiveIntensity = 1.1 + state.glow * 2.2;
    }

    if (territoryShaderRef.current) {
      territoryShaderRef.current.uniforms.uTime.value = clock.elapsedTime;
      territoryShaderRef.current.uniforms.uReveal.value = state.territory;
      territoryShaderRef.current.uniforms.uIntensity.value = state.glow;
    }

    if (burstRef.current) {
      const burst = THREE.MathUtils.clamp(state.burst, 0, 1);
      burstRef.current.scale.setScalar(0.25 + burst * 2.15);
      burstRef.current.rotation.z = clock.elapsedTime * 0.08;
    }
    if (burstMaterialRef.current) {
      burstMaterialRef.current.opacity = Math.sin(state.burst * Math.PI) * 0.78;
    }
  });

  return (
    <group>
      <group>
        {routeSegments.map((segment, index) => (
          <group
            key={`${segment.start.x}-${segment.start.y}`}
            position={segment.start}
            rotation={[0, 0, segment.angle]}
            ref={(node) => {
              routeSegmentRefs.current[index] = node;
            }}
            visible={false}
          >
            <mesh position={[segment.length / 2, 0, -0.008]}>
              <planeGeometry args={[segment.length, 0.105]} />
              <meshBasicMaterial
                color="#020604"
                opacity={0.88}
                transparent
                depthTest={false}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[segment.length / 2, 0, 0]}>
              <planeGeometry args={[segment.length, 0.045]} />
              <meshBasicMaterial
                color="#aeea63"
                opacity={0.84}
                transparent
                depthTest={false}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}

        {routeJoints.map((point, index) => (
          <group
            key={`${point.x}-${point.y}`}
            position={point}
            ref={(node) => {
              routeJointRefs.current[index] = node;
            }}
            visible={false}
          >
            <mesh position={[0, 0, -0.008]}>
              <circleGeometry args={[0.0525, 20]} />
              <meshBasicMaterial
                color="#020604"
                opacity={0.88}
                transparent
                depthTest={false}
                depthWrite={false}
              />
            </mesh>
            <mesh>
              <circleGeometry args={[0.0225, 20]} />
              <meshBasicMaterial
                color="#aeea63"
                opacity={0.84}
                transparent
                depthTest={false}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      <mesh ref={markerRingRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.075, 0.105, 24]} />
        <meshBasicMaterial color="#b8ff3d" opacity={0.3} transparent depthTest={false} />
      </mesh>
      <mesh ref={markerRef}>
        <circleGeometry args={[0.058, 24]} />
        <meshBasicMaterial color="#e8ffc0" depthTest={false} />
      </mesh>

      <group ref={territoryRef} scale={[1, 1, 0.015]}>
        <mesh geometry={territoryGeometry}>
          <meshStandardMaterial
            color="#83c831"
            emissive="#b8ff3d"
            emissiveIntensity={1.2}
            metalness={0.12}
            opacity={0}
            ref={territoryMaterialRef}
            roughness={0.42}
            transparent
          />
        </mesh>
        <mesh geometry={territoryTopGeometry} position={[0, 0, 0.154]}>
          <shaderMaterial
            ref={territoryShaderRef}
            vertexShader={territoryVertexShader}
            fragmentShader={territoryFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uReveal: { value: 0 },
              uIntensity: { value: 0 },
              uLime: { value: new THREE.Color("#b8ff3d") },
              uBlue: { value: new THREE.Color("#55c7f3") },
            }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <points ref={burstRef} position={[0, 0, 0.16]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[burstPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#caff71"
          depthWrite={false}
          opacity={0}
          ref={burstMaterialRef}
          size={quality === "high" ? 0.052 : 0.066}
          transparent
        />
      </points>
    </group>
  );
}

function DeviceHud({ activeChapter }) {
  const hud = hudStates[activeChapter] ?? hudStates.at(-1);

  return (
    <Html
      center
      position={[0, -0.02, 0.5]}
      wrapperClass="wayper-device-hud-anchor"
      zIndexRange={[4, 3]}
      style={{ pointerEvents: "none" }}
    >
      <div
        className="wayper-device-hud"
        data-chapter={activeChapter + 1}
        aria-hidden="true"
      >
        <header>
          <span className="wayper-demo-badge">DEMO</span>
          <i />
          <small>sinal GPS</small>
        </header>

        <div className="wayper-device-hud__dashboard">
          <div className="wayper-device-hud__readout">
            <small>{hud.label}</small>
            <strong>{hud.status}</strong>
          </div>
          <footer>
            <span><small>distância</small>{hud.distance}</span>
            <span><small>tempo</small>{hud.time}</span>
            <span><small>ritmo</small>{hud.pace}</span>
          </footer>
        </div>
      </div>
    </Html>
  );
}

function Phone({ stateRef, activeChapter, quality }) {
  const phoneRef = useRef(null);
  const keyLightRef = useRef(null);

  useFrame(({ camera }, delta) => {
    const state = stateRef.current;
    const phone = phoneRef.current;
    if (!phone) return;

    const pointerWeight = state.pointerInfluence ?? 0;
    phone.position.x = THREE.MathUtils.damp(
      phone.position.x,
      state.phoneX + state.pointerX * 0.16 * pointerWeight,
      5.5,
      delta,
    );
    phone.position.y = THREE.MathUtils.damp(phone.position.y, state.phoneY, 5.5, delta);
    phone.position.z = THREE.MathUtils.damp(phone.position.z, state.phoneZ, 5.5, delta);
    phone.rotation.x = THREE.MathUtils.damp(
      phone.rotation.x,
      state.phoneRotX + state.pointerY * 0.045 * pointerWeight,
      5.5,
      delta,
    );
    phone.rotation.y = THREE.MathUtils.damp(
      phone.rotation.y,
      state.phoneRotY + state.pointerX * 0.08 * pointerWeight,
      5.5,
      delta,
    );
    phone.rotation.z = THREE.MathUtils.damp(phone.rotation.z, state.phoneRotZ, 5.5, delta);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.cameraX, 4.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, state.cameraY, 4.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, state.cameraZ, 4.2, delta);
    camera.lookAt(0, 0, 0);

    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.damp(
        keyLightRef.current.intensity,
        3.2 + state.glow * 4.6,
        6,
        delta,
      );
    }
  });

  return (
    <>
      <pointLight ref={keyLightRef} position={[2.6, 3.8, 5]} color="#b8ff3d" intensity={3.2} />
      <group ref={phoneRef} position={[0, 0.15, 0]} rotation={[-0.04, -0.28, -0.03]}>
        <RoundedBox args={[3.08, 6.12, 0.44]} radius={0.34} smoothness={8} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#111713"
            clearcoat={0.82}
            clearcoatRoughness={0.17}
            metalness={0.72}
            roughness={0.24}
          />
        </RoundedBox>

        <RoundedBox args={[2.84, 5.86, 0.075]} radius={0.27} smoothness={8} position={[0, 0, 0.245]}>
          <meshPhysicalMaterial
            color="#07100b"
            clearcoat={1}
            clearcoatRoughness={0.08}
            emissive="#07170d"
            emissiveIntensity={0.72}
            metalness={0.05}
            roughness={0.14}
          />
        </RoundedBox>

        <mesh position={[0, 2.66, 0.31]}>
          <capsuleGeometry args={[0.075, 0.48, 4, 14]} />
          <meshStandardMaterial color="#020403" roughness={0.28} />
        </mesh>
        <mesh position={[-1.58, 1.12, 0]}>
          <boxGeometry args={[0.045, 0.68, 0.14]} />
          <meshStandardMaterial color="#56605b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[1.58, 0.84, 0]}>
          <boxGeometry args={[0.045, 0.9, 0.14]} />
          <meshStandardMaterial color="#56605b" metalness={0.9} roughness={0.2} />
        </mesh>

        <MapBlocks />
        <RouteAndTerritory stateRef={stateRef} quality={quality} />
        <DeviceHud activeChapter={activeChapter} />

        <mesh position={[0, 0, 0.48]}>
          <planeGeometry args={[2.72, 5.72]} />
          <meshPhysicalMaterial
            color="#b8ff3d"
            opacity={0.018}
            transparent
            roughness={0.05}
            clearcoat={1}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
}

function SyncSystem({ stateRef }) {
  const groupRef = useRef(null);
  const packetRefs = useRef([]);
  const nodeMaterialRefs = useRef([]);

  useFrame(({ clock }, delta) => {
    const state = stateRef.current;
    const sync = THREE.MathUtils.clamp(state.sync, 0, 1);
    const architecture = THREE.MathUtils.clamp(state.architecture, 0, 1);

    if (groupRef.current) {
      groupRef.current.visible = sync > 0.005 || architecture > 0.005;
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        1.15 + architecture * 0.42,
        5,
        delta,
      );
    }

    packetRefs.current.forEach((packet, index) => {
      if (!packet) return;
      const offset = (clock.elapsedTime * 0.24 + index / packetRefs.current.length) % 1;
      packet.position.x = -0.45 + offset * 3.5;
      packet.position.y = Math.sin(offset * Math.PI) * 0.62 + (index % 2 ? 0.16 : -0.16);
      packet.scale.setScalar(0.45 + sync * 0.55);
      packet.visible = sync > 0.03;
    });

    nodeMaterialRefs.current.forEach((material) => {
      if (!material) return;
      material.opacity = architecture * 0.82;
      material.emissiveIntensity = 0.5 + architecture * 1.4;
    });
  });

  return (
    <group ref={groupRef} visible={false} position={[1.15, 0, -0.3]}>
      {Array.from({ length: 8 }, (_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            packetRefs.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color={index % 2 ? "#55c7f3" : "#b8ff3d"} />
        </mesh>
      ))}

      {[[-0.65, -1.55], [0.45, 1.5], [1.55, -0.92], [2.65, 1.12]].map(
        ([x, y], index) => (
          <group position={[x, y, -0.1]} key={`${x}-${y}`}>
            <mesh>
              <ringGeometry args={[0.2, 0.225, 28]} />
              <meshStandardMaterial
                color={index % 2 ? "#55c7f3" : "#b8ff3d"}
                emissive={index % 2 ? "#55c7f3" : "#b8ff3d"}
                opacity={0}
                ref={(material) => {
                  nodeMaterialRefs.current[index] = material;
                }}
                transparent
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 0, -0.02]}>
              <circleGeometry args={[0.08, 20]} />
              <meshBasicMaterial color="#dfffb0" opacity={0.72} transparent />
            </mesh>
          </group>
        ),
      )}
    </group>
  );
}

function Scene({ stateRef, activeChapter, quality, onContextLost }) {
  return (
    <>
      <ContextGuard onContextLost={onContextLost} />
      <color attach="background" args={["#060a07"]} />
      <fog attach="fog" args={["#060a07", 8, 19]} />
      <ambientLight intensity={0.72} color="#b8c9ba" />
      <directionalLight
        castShadow={quality === "high"}
        color="#9adff8"
        intensity={2.8}
        position={[-5, 4, 6]}
        shadow-mapSize-width={quality === "high" ? 1024 : 512}
        shadow-mapSize-height={quality === "high" ? 1024 : 512}
      />
      <Phone stateRef={stateRef} activeChapter={activeChapter} quality={quality} />
      <SyncSystem stateRef={stateRef} />
    </>
  );
}

export default function WayperCanvas({
  stateRef,
  quality = "medium",
  dpr = 1,
  active = true,
  activeChapter = 0,
  onContextLost,
}) {
  const dprLimit = quality === "high" ? 1.8 : 1.35;
  const safeDpr = Math.min(Math.max(Number(dpr) || 1, 1), dprLimit);

  return (
    <Canvas
      aria-hidden="true"
      className="wayper-canvas"
      dpr={safeDpr}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 38, near: 0.1, far: 40, position: [0, 0.1, 9.4] }}
      gl={{
        alpha: false,
        antialias: quality === "high",
        powerPreference: "high-performance",
      }}
      performance={{ min: 0.55 }}
      shadows={quality === "high"}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.04;
      }}
    >
      <Scene
        stateRef={stateRef}
        activeChapter={activeChapter}
        quality={quality}
        onContextLost={onContextLost}
      />
    </Canvas>
  );
}
