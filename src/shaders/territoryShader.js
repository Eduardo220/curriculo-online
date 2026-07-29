export const territoryVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const territoryFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uIntensity;
  uniform vec3 uLime;
  uniform vec3 uBlue;

  varying vec2 vUv;

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  void main() {
    float revealEdge = smoothstep(uReveal - 0.18, uReveal + 0.015, vUv.y);
    float revealed = 1.0 - revealEdge;
    float scan = 0.5 + 0.5 * sin((vUv.y * 34.0) - (uTime * 2.4));
    float gridX = smoothstep(0.93, 1.0, sin(vUv.x * 92.0) * 0.5 + 0.5);
    float gridY = smoothstep(0.95, 1.0, sin(vUv.y * 112.0) * 0.5 + 0.5);
    float grain = hash21(floor(vUv * 180.0) + floor(uTime * 5.0));
    float edge = smoothstep(0.0, 0.06, vUv.x)
      * smoothstep(0.0, 0.06, 1.0 - vUv.x)
      * smoothstep(0.0, 0.06, vUv.y)
      * smoothstep(0.0, 0.06, 1.0 - vUv.y);

    vec3 color = mix(uBlue, uLime, vUv.y + scan * 0.12);
    color += (gridX + gridY) * uLime * 0.12;
    color += grain * 0.025;

    float alpha = revealed * edge * (0.2 + scan * 0.12 + uIntensity * 0.28);
    if (alpha < 0.012) discard;

    gl_FragColor = vec4(color, alpha);
  }
`;
