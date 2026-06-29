"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "@/context/TransitionContext";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uEffectType;
  uniform float uScaleProgress;
  uniform vec2 uClickUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Effect 3: Vertex Grid Wave - shockwave from click point
    if (uEffectType > 2.5 && uEffectType < 3.5) {
      float dist = distance(uv, uClickUv);
      float wavePeak = sin(uScaleProgress * 3.14159);
      float wave = sin(dist * 25.0 - uScaleProgress * 15.0) * wavePeak * 0.15;
      pos.z += wave;
    }

    // Effect 5: Page Flip - cylindrical curl from left edge
    if (uEffectType > 4.5 && uEffectType < 5.5) {
      float curlPeak = sin(uScaleProgress * 3.14159);
      float curlAmount = curlPeak * 2.8;
      float localX = position.x + 0.5; // 0 at left, 1 at right
      float angle = localX * curlAmount;
      pos.z += sin(angle) * localX * 0.4;
      pos.x -= (1.0 - cos(angle)) * localX * 0.3;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform sampler2D uNoiseTex;
  uniform vec2 uMeshScale;
  uniform vec2 uTextureScale;
  uniform float uAlpha;
  uniform float uScaleProgress;
  uniform float uFadeProgress;
  uniform float uEffectType;

  varying vec2 vUv;

  vec2 getCoverUv(vec2 uvIn) {
    vec2 uv = uvIn;
    if (uMeshScale.x <= 0.0 || uMeshScale.y <= 0.0 ||
        uTextureScale.x <= 0.0 || uTextureScale.y <= 0.0) {
      return uv;
    }
    float meshAspect = uMeshScale.x / uMeshScale.y;
    float textureAspect = uTextureScale.x / uTextureScale.y;
    vec2 scale = vec2(1.0);
    if (meshAspect > textureAspect) {
      scale.y = textureAspect / meshAspect;
    } else {
      scale.x = meshAspect / textureAspect;
    }
    uv = (uv - 0.5) * scale + 0.5;
    return uv;
  }

  void main() {
    vec2 baseUv = getCoverUv(vUv);
    vec4 finalColor = vec4(0.0);
    float finalAlpha = uAlpha;

    if (baseUv.x < 0.0 || baseUv.x > 1.0 || baseUv.y < 0.0 || baseUv.y > 1.0) {
      discard;
    }

    // Effect 0: Default (original smooth)
    if (uEffectType < 0.5) {
      finalColor = texture2D(uTexture, baseUv);
    }
    // Effect 1: Liquid Displacement
    else if (uEffectType < 1.5) {
      float peak = sin(uScaleProgress * 3.14159);
      vec4 noise = texture2D(uNoiseTex, vUv * 3.0);
      vec2 distortedUv = baseUv + (noise.xy - 0.5) * peak * 0.12;
      finalColor = texture2D(uTexture, distortedUv);
    }
    // Effect 2: Chromatic Aberration
    else if (uEffectType < 2.5) {
      float peak = sin(uScaleProgress * 3.14159);
      float shift = peak * 0.025;
      float r = texture2D(uTexture, baseUv + vec2(shift, 0.0)).r;
      float g = texture2D(uTexture, baseUv).g;
      float b = texture2D(uTexture, baseUv - vec2(shift, 0.0)).b;
      finalColor = vec4(r, g, b, 1.0);
    }
    // Effect 3: Vertex Grid Wave (vertex did the work)
    else if (uEffectType < 3.5) {
      finalColor = texture2D(uTexture, baseUv);
    }
    // Effect 4: Motion Blur
    else if (uEffectType < 4.5) {
      float peak = sin(uScaleProgress * 3.14159);
      vec4 acc = vec4(0.0);
      float samples = 24.0;
      float intensity = peak * 0.07;
      vec2 dir = normalize(vec2(vUv.x - 0.5, 0.0));
      if (length(dir) < 0.01) dir = vec2(1.0, 0.0);
      for (float i = 0.0; i < 24.0; i++) {
        vec2 offset = dir * intensity * (i / samples - 0.5);
        acc += texture2D(uTexture, baseUv + offset);
      }
      finalColor = acc / samples;
    }
    // Effect 5: Page Flip
    else if (uEffectType < 5.5) {
      finalColor = texture2D(uTexture, baseUv);
      float curlPeak = sin(uScaleProgress * 3.14159);
      finalColor.rgb *= 1.0 - curlPeak * 0.25;
    }
    // Effect 6: Dynamic Pixelation
    else if (uEffectType < 6.5) {
      float peak = sin(uScaleProgress * 3.14159);
      float pxSize = mix(1.0, 64.0, peak);
      vec2 pixUv = baseUv;
      if (pxSize > 1.5) {
        pixUv.x = floor(pixUv.x * pxSize) / pxSize + 0.5 / pxSize;
        pixUv.y = floor(pixUv.y * pxSize) / pxSize + 0.5 / pxSize;
      }
      finalColor = texture2D(uTexture, pixUv);
    }
    // Effect 7: Perlin Noise Dissolve
    else if (uEffectType < 7.5) {
      finalColor = texture2D(uTexture, baseUv);
      vec4 noise = texture2D(uNoiseTex, vUv * 2.0);
      if (noise.r < uFadeProgress) {
        discard;
      }
      float edge = smoothstep(uFadeProgress - 0.08, uFadeProgress, noise.r);
      float glowAmount = (1.0 - edge)
                       * step(0.01, uFadeProgress)
                       * step(uFadeProgress, 0.99);
      finalColor.rgb += vec3(1.0, 0.55, 0.1) * glowAmount * 3.0;
      finalAlpha = 1.0;
    }
    // Effect 8: Radial Zoom & Exposure Flare
    else if (uEffectType < 8.5) {
      float peak = sin(uScaleProgress * 3.14159);
      vec2 center = vec2(0.5);
      vec2 dir = baseUv - center;
      vec4 acc = vec4(0.0);
      float samples = 24.0;
      float intensity = peak * 0.12;
      for (float i = 0.0; i < 24.0; i++) {
        vec2 sampleUv = baseUv - dir * intensity * (i / samples);
        acc += texture2D(uTexture, sampleUv);
      }
      finalColor = acc / samples;
      finalColor.rgb *= 1.0 + peak * 0.35;
      float dist = length(dir);
      finalColor.rgb += vec3(1.0, 0.95, 0.85) * peak * 0.25
                       * max(0.0, 1.0 - dist * 2.5);
    }
    // Effect 9: Staggered Slices
    else if (uEffectType < 9.5) {
      float strips = 12.0;
      float stripIdx = floor(vUv.x * strips);
      float delay = stripIdx / strips * 0.5;
      float stripProgress = clamp((uScaleProgress - delay) / 0.5, 0.0, 1.0);
      float peak = sin(stripProgress * 3.14159);
      float dirSign = mod(stripIdx, 2.0) * 2.0 - 1.0;
      vec2 offset = vec2(
        peak * 0.04 * dirSign,
        peak * 0.02 * sin(stripIdx * 1.3)
      );
      finalColor = texture2D(uTexture, baseUv + offset);
    }
    // Effect 10: Kaleidoscopic Mirror
    else {
      float peak = sin(uScaleProgress * 3.14159);
      vec2 kuv = vUv - 0.5;
      kuv = mix(kuv, abs(kuv), peak);
      float angle = peak * 1.5707;
      float s = sin(angle);
      float c = cos(angle);
      kuv = mat2(c, -s, s, c) * kuv;
      kuv = kuv + 0.5;
      vec2 finalUv = getCoverUv(kuv);
      if (finalUv.x < 0.0 || finalUv.x > 1.0 ||
          finalUv.y < 0.0 || finalUv.y > 1.0) {
        discard;
      }
      finalColor = texture2D(uTexture, finalUv);
    }

    gl_FragColor = vec4(finalColor.rgb, finalAlpha);
  }
`;

function generateNoiseTexture(size = 256): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);

  const gridSize = 8;
  const grid: number[][] = [];
  for (let y = 0; y < gridSize; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSize; x++) {
      grid[y][x] = Math.random();
    }
  }

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const smooth = (t: number) => t * t * (3 - 2 * t);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = (x / size) * gridSize;
      const gy = (y / size) * gridSize;
      const x0 = Math.floor(gx) % gridSize;
      const y0 = Math.floor(gy) % gridSize;
      const x1 = (x0 + 1) % gridSize;
      const y1 = (y0 + 1) % gridSize;
      const tx = smooth(gx - Math.floor(gx));
      const ty = smooth(gy - Math.floor(gy));

      const v00 = grid[y0][x0];
      const v10 = grid[y0][x1];
      const v01 = grid[y1][x0];
      const v11 = grid[y1][x1];

      const vx0 = lerp(v00, v10, tx);
      const vx1 = lerp(v01, v11, tx);
      const v = lerp(vx0, vx1, ty);

      const i = (y * size + x) * 4;
      const val = Math.floor(v * 255);
      imageData.data[i] = val;
      imageData.data[i + 1] = val;
      imageData.data[i + 2] = val;
      imageData.data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export default function WebGLTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const noiseTextureRef = useRef<THREE.Texture | null>(null);
  const { transitionData, setTransitionData } = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Setup Three.js scene, camera, renderer
  useEffect(() => {
    if (!containerRef.current) return;

    THREE.ColorManagement.enabled = false;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000,
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Generate tileable noise for liquid/dissolve effects
    const noiseCanvas = generateNoiseTexture(256);
    const noiseTexture = new THREE.Texture(noiseCanvas);
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;
    noiseTexture.minFilter = THREE.LinearFilter;
    noiseTexture.magFilter = THREE.LinearFilter;
    noiseTexture.generateMipmaps = false;
    noiseTexture.needsUpdate = true;
    noiseTextureRef.current = noiseTexture;

    // 64x64 segments to support vertex-based effects (wave, page flip)
    const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: new THREE.Texture() },
        uNoiseTex: { value: noiseTexture },
        uMeshScale: { value: new THREE.Vector2(1, 1) },
        uTextureScale: { value: new THREE.Vector2(1, 1) },
        uAlpha: { value: 1.0 },
        uScaleProgress: { value: 0.0 },
        uFadeProgress: { value: 0.0 },
        uEffectType: { value: 0.0 },
        uClickUv: { value: new THREE.Vector2(0.5, 0.5) },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.visible = false;
    meshRef.current = mesh;
    materialRef.current = material;

    renderer.compile(scene, camera);

    let animationFrameId: number;
    const animate = () => {
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.left = w / -2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = h / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      noiseTexture.dispose();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  // 2. Handle transition trigger and scale-up
  useEffect(() => {
    if (
      !transitionData.isActive ||
      transitionData.isReady ||
      !meshRef.current ||
      !materialRef.current ||
      !transitionData.bounds
    )
      return;

    const { bounds, sourceImage, targetRoute, effectType, clickUv } =
      transitionData;
    const mesh = meshRef.current;
    const mat = materialRef.current;
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    const initialWidth = bounds.width;
    const initialHeight = bounds.height;
    const initialX = bounds.left - viewWidth / 2 + bounds.width / 2;
    const initialY = -(bounds.top - viewHeight / 2 + bounds.height / 2);

    mesh.scale.set(initialWidth, initialHeight, 1);
    mesh.position.set(initialX, initialY, 0);
    mesh.visible = true;

    mat.uniforms.uMeshScale.value.set(initialWidth, initialHeight);
    mat.uniforms.uAlpha.value = 1.0;
    mat.uniforms.uScaleProgress.value = 0.0;
    mat.uniforms.uFadeProgress.value = 0.0;
    mat.uniforms.uEffectType.value = effectType ?? 0;
    mat.uniforms.uClickUv.value.set(clickUv?.x ?? 0.5, clickUv?.y ?? 0.5);

    if (sourceImage) {
      const canvas = document.createElement("canvas");
      canvas.width = sourceImage.naturalWidth || sourceImage.width;
      canvas.height = sourceImage.naturalHeight || sourceImage.height;
      const ctx = canvas.getContext("2d");
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
      }
      const texture = new THREE.Texture(canvas);
      texture.colorSpace = THREE.NoColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      mat.uniforms.uTexture.value = texture;
      mat.uniforms.uTextureScale.value.set(canvas.width, canvas.height);
    }

    setTransitionData((prev) => ({ ...prev, isReady: true }));

    const scaleProxy = { progress: 0 };
    const tl = gsap.timeline();

    tl.to(
      mesh.position,
      { x: 0, y: 0, duration: 0.8, ease: "power4.inOut" },
      0,
    ).to(
      scaleProxy,
      {
        progress: 1,
        duration: 0.8,
        ease: "power4.inOut",
        onUpdate: () => {
          const p = scaleProxy.progress;
          const w = initialWidth + (viewWidth - initialWidth) * p;
          const h = initialHeight + (viewHeight - initialHeight) * p;
          mesh.scale.set(w, h, 1);
          mat.uniforms.uMeshScale.value.set(w, h);
          mat.uniforms.uScaleProgress.value = p;
        },
      },
      0,
    );

    tl.add(() => {
      if (targetRoute) {
        router.push(targetRoute);
      }
    });
  }, [
    transitionData.isActive,
    transitionData.isReady,
    setTransitionData,
    router,
  ]);

  // 3. Handle fade-out after Next.js route change
  useEffect(() => {
    if (
      transitionData.isActive &&
      transitionData.isReady &&
      pathname === transitionData.targetRoute
    ) {
      const mat = materialRef.current;
      if (mat) {
        const effectType = transitionData.effectType ?? 0;
        const onComplete = () => {
          if (meshRef.current) meshRef.current.visible = false;
          setTransitionData({
            isActive: false,
            isReady: false,
            bounds: null,
            styles: null,
            sourceImage: null,
            targetRoute: null,
            effectType: 0,
            clickUv: null,
          });
        };

        if (effectType === 7) {
          // Dissolve uses uFadeProgress (discard-based) instead of uAlpha
          gsap.to(mat.uniforms.uFadeProgress, {
            value: 1.0,
            duration: 0.7,
            ease: "power2.in",
            onComplete,
          });
        } else {
          gsap.to(mat.uniforms.uAlpha, {
            value: 0.0,
            duration: 0.4,
            ease: "power2.out",
            onComplete,
          });
        }
      }
    }
  }, [
    pathname,
    transitionData.isActive,
    transitionData.isReady,
    transitionData.targetRoute,
    setTransitionData,
  ]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
