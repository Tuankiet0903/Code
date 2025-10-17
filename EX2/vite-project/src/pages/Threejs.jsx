import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default function ThreejsPage() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let mixer;
    let controls;
    let stats;
    let pmremGenerator;
    let model; // 👈 thêm biến model để có thể xoay trong animate()

    const CANVAS_WIDTH = 1360;
    const CANVAS_HEIGHT = 800;

    const clock = new THREE.Clock();

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    mountRef.current.appendChild(renderer.domElement);

    // Scene setup
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3dd);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x87cefa, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x87cefa, 2);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      40,
      CANVAS_WIDTH / CANVAS_HEIGHT,
      1,
      100
    );
    camera.position.set(-7, 7, -7);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.update();

    // Stats
    stats = new Stats();
    mountRef.current.appendChild(stats.dom);

    // Load model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      "/models/gltf/LittlestTokyo.glb",
      (gltf) => {
        model = gltf.scene;
        model.position.set(1, 1, 0);
        model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();

        renderer.setAnimationLoop(animate);
      },
      undefined,
      (err) => {
        console.error("Error loading model:", err);
      }
    );

    // Animation loop
    const animate = () => {
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      // 👇 Model tự quay quanh trục Y
      if (model) {
        model.rotation.y += 0.005; // điều chỉnh tốc độ xoay ở đây
      }

      controls.update();
      stats.update();
      renderer.render(scene, camera);
    };

    return () => {
      renderer.setAnimationLoop(null);
      if (controls) controls.dispose();
      if (pmremGenerator) pmremGenerator.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "1360px",
        height: "800px",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          width: "100%",
          textAlign: "center",
          color: "#000",
        }}
      >
        <a href="https://threejs.org" target="_blank" rel="noopener noreferrer">
          three.js
        </a>{" "}
        animation - keyframes | Model:{" "}
        <a
          href="https://artstation.com/artwork/1AGwX"
          target="_blank"
          rel="noopener noreferrer"
        >
          Littlest Tokyo
        </a>
      </div>
    </div>
  );
}
