<template>
  <div class="planet-container" ref="containerRef">
    <canvas ref="canvasRef" @click="handleClick" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createNoise2D } from "simplex-noise";
import { gameState, clickPlanet, planetPhase } from "../stores/gameStore";

const containerRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let planet: THREE.Mesh;
let atmosphere: THREE.Mesh;
let clouds: THREE.Mesh;
let controls: OrbitControls;
let animationId: number;

const PLANET_RADIUS = 2;
const ATMOSPHERE_RADIUS = 2.1;
const CLOUDS_RADIUS = 2.13;

// Calcul précis pour que la planète touche presque les bords sans être coupée
function getCameraZToFitSphere(radius: number, aspect: number, fov: number) {
  // fov en degrés -> radians
  const fovRad = (fov * Math.PI) / 180;
  // On prend le plus petit angle (vertical ou horizontal) pour ne jamais couper
  const fitHeightDistance = radius / Math.sin(fovRad / 2);
  const fitWidthDistance =
    radius / Math.sin(Math.atan(Math.tan(fovRad / 2) * aspect));
  return Math.max(fitHeightDistance, fitWidthDistance) * 1.05; // 5% de marge
}

const generatePlanetGeometry = () => {
  const segments = 64;
  const noise2D = createNoise2D();
  const geometry = new THREE.SphereGeometry(PLANET_RADIUS, segments, segments);
  const positions = geometry.attributes.position;
  const vertices = positions.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];
    // Léger relief, très subtil
    const noise = noise2D(x * 0.5, y * 0.5) * 0.15;
    const scale = 1 + noise * 0.04;
    vertices[i] = x * scale;
    vertices[i + 1] = y * scale;
    vertices[i + 2] = z * scale;
  }
  geometry.computeVertexNormals();
  return geometry;
};

const createPlanetMaterial = () => {
  const textureLoader = new THREE.TextureLoader();
  // Textures réalistes NASA
  const earthTexture = textureLoader.load(
    "https://raw.githubusercontent.com/ilyesdev/earth-textures/main/2k_earth_daymap.jpg"
  );
  const bumpMap = textureLoader.load(
    "https://raw.githubusercontent.com/ilyesdev/earth-textures/main/2k_earth_bump.jpg"
  );
  const specularMap = textureLoader.load(
    "https://raw.githubusercontent.com/ilyesdev/earth-textures/main/2k_earth_specular_map.jpg"
  );
  const material = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: bumpMap,
    bumpScale: 0.08, // Léger relief
    specularMap: specularMap,
    specular: new THREE.Color(0x222222),
    shininess: 10,
  });
  return material;
};

const createClouds = () => {
  const textureLoader = new THREE.TextureLoader();
  const cloudsTexture = textureLoader.load(
    "https://raw.githubusercontent.com/ilyesdev/earth-textures/main/2k_earth_clouds.png"
  );
  const geometry = new THREE.SphereGeometry(CLOUDS_RADIUS, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geometry, material);
};

const createAtmosphere = () => {
  const geometry = new THREE.SphereGeometry(ATMOSPHERE_RADIUS, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.25,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Mesh(geometry, material);
};

const resizeRenderer = () => {
  if (!containerRef.value || !renderer || !camera) return;
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  camera.position.z = getCameraZToFitSphere(
    CLOUDS_RADIUS,
    camera.aspect,
    camera.fov
  );
  if (controls) controls.update();
};

const initThreeJS = () => {
  if (!containerRef.value || !canvasRef.value) return;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = getCameraZToFitSphere(
    CLOUDS_RADIUS,
    camera.aspect,
    camera.fov
  );
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(window.devicePixelRatio);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = PLANET_RADIUS * 2.5;
  controls.maxDistance = PLANET_RADIUS * 8;
  controls.target.set(0, 0, 0);
  controls.update();
  const geometry = generatePlanetGeometry();
  const material = createPlanetMaterial();
  planet = new THREE.Mesh(geometry, material);
  scene.add(planet);
  clouds = createClouds();
  scene.add(clouds);
  atmosphere = createAtmosphere();
  scene.add(atmosphere);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    planet.rotation.y += 0.001;
    planet.rotation.x += 0.0005;
    clouds.rotation.y += 0.0012;
    atmosphere.rotation.y += 0.001;
    atmosphere.rotation.x += 0.0005;
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
};

const updatePlanetAppearance = () => {
  if (!planet || !atmosphere) return;
  const phase = planetPhase.value;
  const pollution = gameState.pollution;
  atmosphere.material.opacity = 0.25 + (pollution / 100) * 0.4;
  switch (phase) {
    case "healthy":
      atmosphere.material.color.setHex(0x88ccff);
      break;
    case "polluted":
      atmosphere.material.color.setHex(0xccaa88);
      break;
    case "destroyed":
      atmosphere.material.color.setHex(0x994444);
      break;
  }
};

const handleResize = () => {
  resizeRenderer();
};

const handleClick = (event: MouseEvent) => {
  clickPlanet();
};

watch(() => gameState.pollution, updatePlanetAppearance);

onMounted(() => {
  nextTick(() => {
    initThreeJS();
    window.addEventListener("resize", handleResize);
    resizeRenderer();
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (renderer) {
    renderer.dispose();
  }
  if (controls) {
    controls.dispose();
  }
});
</script>

<style scoped>
.planet-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}
canvas {
  width: 100vw !important;
  height: 100vh !important;
  display: block;
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain;
  background: transparent;
  touch-action: none;
}
</style>
