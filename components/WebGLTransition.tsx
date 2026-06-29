"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useTransition } from "@/context/TransitionContext";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMeshScale;
  uniform vec2 uTextureScale;
  uniform float uAlpha;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float meshAspect = uMeshScale.x / uMeshScale.y;
    float textureAspect = uTextureScale.x / uTextureScale.y;

    vec2 scale = vec2(1.0);
    if (meshAspect > textureAspect) {
      scale.y = textureAspect / meshAspect;
    } else {
      scale.x = meshAspect / textureAspect;
    }

    uv = (uv - 0.5) * scale + 0.5;
    vec4 color = texture2D(uTexture, uv);
    gl_FragColor = vec4(color.rgb, uAlpha);
  }
`;

export default function WebGLTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { transitionData, setTransitionData } = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;

    // FIX: Globally disable Three.js automatic color conversions
    // This stops it from modifying your texture or output colors.
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

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: new THREE.Texture() },
        uMeshScale: { value: new THREE.Vector2(1, 1) },
        uTextureScale: { value: new THREE.Vector2(1, 1) },
        uAlpha: { value: 1.0 },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    meshRef.current = mesh;
    materialRef.current = material;

    let animationFrameId: number;
    const animate = () => {
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    if (
      !transitionData.isActive ||
      !meshRef.current ||
      !materialRef.current ||
      !transitionData.bounds
    )
      return;

    const { bounds, sourceImage, targetRoute } = transitionData;
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
    mat.uniforms.uMeshScale.value.set(initialWidth, initialHeight);
    mat.uniforms.uAlpha.value = 1.0;

    if (sourceImage) {
      const texture = new THREE.Texture(sourceImage);

      // FIX: Disable texture color management so raw sRGB colors go straight to the shader
      texture.colorSpace = THREE.NoColorSpace;

      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;

      mat.uniforms.uTexture.value = texture;
      mat.uniforms.uTextureScale.value.set(
        sourceImage.naturalWidth,
        sourceImage.naturalHeight,
      );
    }

    setTransitionData((prev) => ({ ...prev, isReady: true }));

    const scaleProxy = { x: initialWidth, y: initialHeight };
    const tl = gsap.timeline();

    tl.to(
      mesh.position,
      { x: 0, y: 0, duration: 0.8, ease: "power4.inOut" },
      0,
    ).to(
      scaleProxy,
      {
        x: viewWidth,
        y: viewHeight,
        duration: 0.8,
        ease: "power4.inOut",
        onUpdate: () => {
          mesh.scale.set(scaleProxy.x, scaleProxy.y, 1);
          mat.uniforms.uMeshScale.value.set(scaleProxy.x, scaleProxy.y);
        },
      },
      0,
    );

    tl.add(() => {
      if (targetRoute) {
        router.push(targetRoute);
      }
    });

    tl.to(
      mat.uniforms.uAlpha,
      {
        value: 0.0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          setTransitionData({
            isActive: false,
            isReady: false,
            bounds: null,
            styles: null,
            sourceImage: null,
            targetRoute: null,
          });
        },
      },
      "+=0.15",
    );
  }, [transitionData.isActive, setTransitionData, router]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
