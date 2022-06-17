import { useRef, useEffect, useState, useCallback } from "preact/hooks";
import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import { useEventListener } from "./useEventListener";
import { boxObject } from "../utils/boxObject";

const scene = new Scene();
const camera = new PerspectiveCamera(75, 1, 0.1, 10);
const renderer = new WebGLRenderer();

// Config
camera.position.z = 3;
const cube = boxObject();

export const useThree = () => {
  const rafRef = useRef<number>();
  const [time, setTime] = useState(0);
  const threeRef = useRef<HTMLDivElement>(null);
  const totalFrames = 300;

  const resizeHandler = () => {
    if (threeRef.current) {
      const width = threeRef.current.clientWidth;
      const height = threeRef.current.clientHeight;

      // sketch.resolution = { x: width, y: height };

      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  };

  const render = (frame?: number) => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // sketch.time = frame ?? time;
    renderer.render(scene, camera);
  };

  useEventListener("resize", resizeHandler);

  useEffect(() => {
    if (threeRef.current) {
      resizeHandler();
      threeRef.current.appendChild(renderer.domElement);
      scene.add(cube);
      // scene.add(sketch.mesh);
    }

    return () => {
      if (threeRef.current) {
        // sketch.dispose();
        // scene.remove(sketch.mesh);
        scene.remove(cube);
        cube.remove();
        renderer.dispose();
        threeRef.current.removeChild(renderer.domElement);
      }
    };
  }, [threeRef]);

  useEffect(() => {
    render();
  }, [time]);

  const loop = useCallback(() => {
    rafRef.current = requestAnimationFrame(loop);
    setTime((prevCount) => {
      if (prevCount !== totalFrames) {
        return ++prevCount;
      }

      return 0;
    });
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [loop]);

  return { threeRef };
};
