import React, { useEffect, useRef, useState } from 'react';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  ACESFilmicToneMapping,
  MathUtils,
  CanvasTexture,
  EquirectangularReflectionMapping,
  SRGBColorSpace,
} from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import StaticLogo from './StaticLogo';
import logoFont from './logo-font.json'; // Merriweather Bold, "J" and "S" only (see scripts/make-logo-font.mjs)

const SPIN_SECONDS = 5; // one full turn
const FOV = 18; // narrow lens keeps perspective distortion low as the letters turn

// What the chrome reflects: a mostly dark studio with a few crisp light strips.
// Dark surroundings plus sharp highlights is what makes it read as black chrome
// rather than flat grey. (The logo's size comes from --logo-h in index.css.)
const makeChromeEnvironment = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#4a4a4a');
  sky.addColorStop(0.45, '#1e1e1e');
  sky.addColorStop(0.5, '#3c3c3c');
  sky.addColorStop(0.505, '#080808'); // horizon
  sky.addColorStop(1, '#030303');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 62, canvas.width, 8);
  ctx.fillRect(0, 104, canvas.width, 3);
  ctx.fillStyle = '#9a9a9a';
  ctx.fillRect(0, 172, canvas.width, 2);

  const texture = new CanvasTexture(canvas);
  texture.mapping = EquirectangularReflectionMapping;
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

const ChromeLogo = () => {
  const mountRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;

    let renderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return undefined; // no WebGL: keep the static logo
    }

    // Extruded, beveled letters so the chrome has edges to catch highlights
    const font = new FontLoader().parse(logoFont);
    const geometry = new TextGeometry('JS', {
      font,
      size: 1,
      depth: 0.3,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.025,
      bevelSegments: 5,
    });
    geometry.center();
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const textWidth = box.max.x - box.min.x;
    const textHeight = box.max.y - box.min.y;

    // Black chrome: fully metallic and mirror-smooth; the darkness comes from the environment
    const material = new MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.05 });
    const mesh = new Mesh(geometry, material);

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    const envSource = makeChromeEnvironment();
    const envTexture = pmrem.fromEquirectangular(envSource).texture;
    envSource.dispose();
    scene.environment = envTexture;
    scene.add(mesh);

    // Size the canvas and camera so the letters fill it with a little room to spin
    const margin = 1.25; // room for the near edge, which looks bigger as it swings toward the camera
    const aspect = textWidth / textHeight;
    const camera = new PerspectiveCamera(FOV, aspect, 0.1, 100);
    camera.position.z = ((textHeight / 2) * margin) / Math.tan(MathUtils.degToRad(FOV / 2));

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = ACESFilmicToneMapping;

    // Match the canvas to the container's CSS height, which grows on larger screens
    let lastHeight = 0;
    const sizeToContainer = () => {
      const height = Math.round(mount.clientHeight) || 32;
      if (height === lastHeight) return;
      lastHeight = height;
      renderer.setSize(Math.ceil(height * aspect), height);
    };
    sizeToContainer();
    // Resizing the canvas changes the container's width, so apply it on the next frame
    // rather than inside the observer callback (avoids a ResizeObserver loop)
    let resizeFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(sizeToContainer);
    });
    resizeObserver.observe(mount);
    mount.appendChild(renderer.domElement);
    setReady(true);

    // Rotation is driven by elapsed time, so the spin speed stays constant
    renderer.setAnimationLoop((time) => {
      mesh.rotation.y = ((time / 1000) / SPIN_SECONDS) * Math.PI * 2;
      renderer.render(scene, camera);
    });

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(resizeFrame);
      renderer.setAnimationLoop(null);
      geometry.dispose();
      material.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <span ref={mountRef} className="chrome-logo" role="img" aria-label="JS">
      {!ready && <StaticLogo />}
    </span>
  );
};

export default ChromeLogo;
