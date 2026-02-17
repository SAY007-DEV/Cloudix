'use client'
import { useRef, useEffect } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshPhysicalMaterial,
  InstancedMesh,
  Object3D,
  AmbientLight,
  PointLight,
  Vector3,
  Clock,
  ACESFilmicToneMapping,
} from "three";

function createBallpit(canvas, options = {}) {
  const config = {
    count: 200,
    gravity: 0,
    friction: 0.995,
    wallBounce: 0.9,
    followCursor: false,
    ...options,
  };

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 20;

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = ACESFilmicToneMapping;

  const clock = new Clock();

  // Resize
  function resize() {
    const width = canvas.parentElement.offsetWidth;
    const height = canvas.parentElement.offsetHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  resize();

  // Lights
  const ambient = new AmbientLight(0xffffff, 1);
  scene.add(ambient);

  const light = new PointLight(0xffffff, 200);
  scene.add(light);

  // Geometry
  const geometry = new SphereGeometry(1, 32, 32);
  const material = new MeshPhysicalMaterial({
    roughness: 0.4,
    metalness: 0.2,
    clearcoat: 1,
  });

  const mesh = new InstancedMesh(geometry, material, config.count);
  scene.add(mesh);

  const dummy = new Object3D();

  const positions = [];
  const velocities = [];

  for (let i = 0; i < config.count; i++) {
    positions.push(
      new Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 4
      )
    );
    velocities.push(new Vector3());
  }

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    for (let i = 0; i < config.count; i++) {
      velocities[i].y -= config.gravity * delta;
      velocities[i].multiplyScalar(config.friction);
      positions[i].add(velocities[i]);

      // walls
      ["x", "y", "z"].forEach((axis) => {
        if (Math.abs(positions[i][axis]) > 8) {
          positions[i][axis] = Math.sign(positions[i][axis]) * 8;
          velocities[i][axis] *= -config.wallBounce;
        }
      });

      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();

  return {
    dispose() {
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}

const Ballpit = ({ className = "", ...props }) => {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    instanceRef.current = createBallpit(canvasRef.current, props);

    return () => {
      instanceRef.current?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default Ballpit;
