import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FaLightbulb } from 'react-icons/fa';
import LiveClockUpdate from '../../components/LiveClockUpdate/LiveClockUpdate';
import './home.css';
import { createNoise2D } from 'simplex-noise';

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const noise2D = createNoise2D();
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let splines: Spline[] = [];
    let isMouseDown = false;
    let offset = 0;
    let mouseJump = { x: 0, y: 0 };
    const length = 30;

    class Spline {
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      mesh: THREE.Line;
      speed: number;
      color: number;

      constructor() {
        this.geometry = new THREE.BufferGeometry();
        this.color = Math.floor(Math.random() * 80 + 180);
        const vertices = new Float32Array(180 * 3);
        const colors = new Float32Array(180 * 3);

        for (let j = 0; j < 180; j++) {
          vertices[j * 3] = (j / 180) * length * 2 - length;
          vertices[j * 3 + 1] = 0;
          vertices[j * 3 + 2] = 0;

          const color = new THREE.Color(`hsl(${j * 0.6 + this.color}, 70%, 70%)`);
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.material = new THREE.LineBasicMaterial({ vertexColors: true });
        this.mesh = new THREE.Line(this.geometry, this.material);
        this.speed = (Math.random() + 0.1) * 0.0002;
        scene.add(this.mesh);
      }

      update(a: number) {
        const positions = this.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j < 180; j++) {
          const vector = new THREE.Vector3(positions[j * 3], 0, 0);
          vector.y = noise2D(j * 0.05 + splines.indexOf(this) - offset, a * this.speed) * 8;
          vector.z = noise2D(vector.x * 0.05 + splines.indexOf(this), a * this.speed) * 8;
          vector.y *= 1 - Math.abs(vector.x / length);
          vector.z *= 1 - Math.abs(vector.x / length);
          positions[j * 3 + 1] = vector.y;
          positions[j * 3 + 2] = vector.z;
        }
        this.geometry.attributes.position.needsUpdate = true;
      }
    }

    const init = () => {
      if (!renderer) {
        const newRenderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, antialias: true });
        newRenderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
        newRenderer.setSize(window.innerWidth, window.innerHeight);
        setRenderer(newRenderer);
      }

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x131313);
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 60;

      for (let i = 0; i < 12; i++) splines.push(new Spline());

      window.addEventListener('resize', onResize);
      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchstart', onMouseDown);
      window.addEventListener('touchend', onMouseUp);

      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render(performance.now());
    };

    const render = (a: number) => {
      if (!renderer) return;

      for (const spline of splines) {
        spline.update(a);
      }

      scene.rotation.x = a * 0.0003;

      if (isMouseDown) {
        mouseJump.x += 0.001;
      } else {
        mouseJump.x -= 0.001;
      }
      mouseJump.x = Math.max(0, Math.min(0.07, mouseJump.x));
      offset += mouseJump.x;

      renderer.render(scene, camera);
    };

    const onResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    init();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchend', onMouseUp);
      renderer?.dispose();
    };
  }, [renderer]);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, cursor: 'pointer' }} />
      <div className="hero-header">
        <h1 className="unselectable">Light Works</h1>
        <h1 className="unselectable">By Niklas Decker</h1>
      </div>
      <div className="home-logo">
        <FaLightbulb size="16px" style={{ color: "#fff" }} />
      </div>
      <div className="live-clock">
        <LiveClockUpdate />
      </div>
    </>
  );
};

export default Home;