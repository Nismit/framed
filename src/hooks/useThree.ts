import { useRef, useEffect, useState, useCallback } from "preact/hooks";
import { Scene, PerspectiveCamera, WebGLRenderer, Vector2 } from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { useEventListener } from "./useEventListener";
import { boxObject } from "../utils/boxObject";
// import baseMesh from "../utils/baseMesh";
// import fragment1 from "../fragments/fbm.frag";

const scene = new Scene();
const camera = new PerspectiveCamera(75, 1, 0.1, 10);
const renderer = new WebGLRenderer({});
// const renderer = new WebGLRenderer({ antialias: true });
const stats = Stats();
document.body.appendChild(stats.dom);

// Config
camera.position.z = 3;
const cube = boxObject();

// const baseObject = new baseMesh({
//   fragment: fragment1,
//   uniform: {
//     pixelRatio: {
//       value: window.devicePixelRatio,
//     },
//     resolution: {
//       value: new Vector2(),
//     },
//     time: {
//       value: 0,
//     },
//     // offset: {
//     //   value: 0.75,
//     // },
//     seed: {
//       value: new Vector2(-0.345, 0.654),
//     },
//   },
// });

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
      // baseObject.resolution = { x: width, y: height };

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
    // baseObject.time = frame ?? time;
    renderer.render(scene, camera);
    stats.update();
  };

  useEventListener("resize", resizeHandler);

  useEffect(() => {
    if (threeRef.current) {
      resizeHandler();
      threeRef.current.appendChild(renderer.domElement);
      scene.add(cube);
      // scene.add(sketch.mesh);
      // scene.add(baseObject.mesh);
    }

    return () => {
      if (threeRef.current) {
        // sketch.dispose();
        // scene.remove(sketch.mesh);
        scene.remove(cube);
        // cube.remove();
        // baseObject.dispose();
        // scene.remove(baseObject.mesh);
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
  }, [time]);

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
