export const heroTerrainVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying float vElevation;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    float a = hash(cell);
    float b = hash(cell + vec2(1.0, 0.0));
    float c = hash(cell + vec2(0.0, 1.0));
    float d = hash(cell + vec2(1.0, 1.0));

    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
  }

  void main() {
    vUv = uv;
    vec3 displaced = position;
    vec2 field = position.xy * 0.42;
    float broad = noise(field + vec2(uTime * 0.018, -uTime * 0.012));
    float detail = noise(field * 2.4 - vec2(uTime * 0.01));
    float pointerWave = exp(-distance(uv, uPointer) * 4.0) * 0.16;
    float edge = smoothstep(0.02, 0.22, uv.x) * smoothstep(0.02, 0.22, uv.y)
      * smoothstep(0.02, 0.22, 1.0 - uv.x) * smoothstep(0.02, 0.22, 1.0 - uv.y);

    vElevation = ((broad * 0.72) + (detail * 0.28) - 0.5) * edge + pointerWave;
    displaced.z += vElevation * 0.82;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

export const heroTerrainFragmentShader = /* glsl */ `
  uniform float uTime;

  varying vec2 vUv;
  varying float vElevation;

  float gridLine(float value, float density, float thickness) {
    float line = abs(fract(value * density) - 0.5);
    return 1.0 - smoothstep(thickness, thickness + 0.025, line);
  }

  void main() {
    float minorGrid = max(
      gridLine(vUv.x, 28.0, 0.465),
      gridLine(vUv.y, 22.0, 0.465)
    );
    float majorGrid = max(
      gridLine(vUv.x, 7.0, 0.478),
      gridLine(vUv.y, 5.5, 0.478)
    );
    float contour = 1.0 - smoothstep(0.025, 0.065, abs(fract((vElevation + 0.5) * 12.0) - 0.5));
    float scanner = smoothstep(0.06, 0.0, abs(vUv.x - fract(uTime * 0.035)));

    vec3 graphite = vec3(0.025, 0.043, 0.034);
    vec3 lime = vec3(0.56, 1.0, 0.16);
    vec3 blue = vec3(0.16, 0.64, 0.94);
    vec3 color = graphite;
    color += lime * minorGrid * 0.08;
    color += lime * majorGrid * 0.18;
    color += mix(blue, lime, smoothstep(-0.18, 0.38, vElevation)) * contour * 0.22;
    color += blue * scanner * 0.08;

    float vignette = smoothstep(0.72, 0.18, distance(vUv, vec2(0.5)));
    float alpha = (0.54 + minorGrid * 0.13 + contour * 0.18) * vignette;
    gl_FragColor = vec4(color, alpha);
  }
`;
