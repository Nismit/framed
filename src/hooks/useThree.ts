import { useRef, useEffect, useState, useCallback } from "preact/hooks";
import { Scene, PerspectiveCamera, WebGLRenderer, Vector2 } from "three";
// import Stats from "three/examples/jsm/libs/stats.module";
import { useEventListener } from "./useEventListener";
import baseMesh from "../utils/baseMesh";
import { pickRandomFragment } from "../fragments";
// import circle9 from "../fragments/circle9.frag";

// ms * sec * min * hour
const INTERVAL_TIME = 1000 * 60 * 60 * 1;

const scene = new Scene();
const camera = new PerspectiveCamera(75, 1, 0.1, 10);
const renderer = new WebGLRenderer({});

// Stats
// const stats = Stats();
// document.body.appendChild(stats.dom);

// Config
camera.position.z = 3;
const randomFragment = pickRandomFragment("Triangle");
const baseObject = new baseMesh({
  fragment: randomFragment.fragment,
  fragmentKey: randomFragment.key,
  uniform: {
    pixelRatio: {
      value: window.devicePixelRatio.toFixed(1),
    },
    resolution: {
      value: new Vector2(),
    },
    time: {
      value: 0,
    },
  },
});

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
      baseObject.resolution = { x: width, y: height };

      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  };

  const render = (frame?: number) => {
    // sketch.time = frame ?? time;
    baseObject.time = frame ?? time;
    renderer.render(scene, camera);
    // stats.update();
  };

  useEventListener("resize", resizeHandler);

  useEffect(() => {
    let interval: number;
    if (threeRef.current) {
      resizeHandler();
      threeRef.current.appendChild(renderer.domElement);
      scene.add(baseObject.mesh);

      interval = setInterval(() => {
        const pickKey = pickRandomFragment(baseObject.key);
        baseObject.key = pickKey.key;
        baseObject.fragment = pickKey.fragment;
        scene.remove(baseObject.mesh);
        baseObject.reGenerate();
        scene.add(baseObject.mesh);
      }, INTERVAL_TIME);
    }

    return () => {
      if (threeRef.current) {
        baseObject.dispose();
        scene.remove(baseObject.mesh);
        renderer.dispose();
        threeRef.current.removeChild(renderer.domElement);
        interval && clearInterval(interval);
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
