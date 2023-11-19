import { useRef, useEffect, useState, useCallback } from "preact/hooks";
import { Scene, PerspectiveCamera, WebGLRenderer, Vector2, Clock } from "three";
import baseMesh from "../utils/baseMesh";
import fragmentCode from "../fragments/revise5.frag";
import { pickRandomFragment, fragmentTimeMap } from "../fragments";
import { useURLParams } from "./useURLParams";
import { useEventListener } from "./useEventListener";

// ms * sec * min * hour
const INTERVAL_TIME = 1000 * 60 * 30; // every 30 mins

const scene = new Scene();
const camera = new PerspectiveCamera(75, 1, 0.1, 10);
const renderer = new WebGLRenderer({});
let clock = new Clock(false);

// Config
camera.position.z = 3;
const defaultKey = "Revise5";
const baseObject = new baseMesh({
  fragment: fragmentCode,
  fragmentKey: defaultKey,
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
    elapsedTime: {
      value: 0,
    },
  },
});

export const useThree = () => {
  const rafRef = useRef<number>();
  const [time, setTime] = useState(0);
  const [isRunning, setRunning] = useState(true);
  const threeRef = useRef<HTMLDivElement>(null);
  const totalFrames = 300;
  const isRandom = useURLParams("random")
    ? useURLParams("random") === "true"
    : false;

  const keyHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "KeyS") {
        setRunning(false);
        render(time);
        renderer.domElement.toBlob((blob) => {
          if (blob === null) {
            return;
          }

          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style.display = "none";
          a.href = URL.createObjectURL(blob);
          a.download = "capture.png";
          a.click();
          document.body.removeChild(a);
        });
      }

      if (event.code === "Space") {
        setRunning(!isRunning);
      }

      if (event.code === "ArrowRight") {
        if (isRunning) {
          setRunning(false);
        }

        setTime((prevCount) => {
          if (prevCount !== totalFrames) {
            return ++prevCount;
          }

          return 0;
        });
      }

      if (event.code === "ArrowLeft") {
        if (isRunning) {
          setRunning(false);
        }

        setTime((prevCount) => {
          if (prevCount !== 0) {
            return --prevCount;
          }

          return totalFrames;
        });
      }
    },
    [isRunning, time]
  );

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
    const localTime = frame ?? time;
    if (localTime) {
      baseObject.time = localTime;
    }
    baseObject.elapsedTime = clock.getElapsedTime();
    renderer.render(scene, camera);
  };

  const loop = useCallback(() => {
    if (isRunning) {
      rafRef.current = requestAnimationFrame(loop);

      let elapsedTime = clock.getElapsedTime();
      if (
        elapsedTime >
        (fragmentTimeMap[baseObject.key] ? fragmentTimeMap[baseObject.key] : 5)
      ) {
        clock = new Clock();
      }

      setTime((prevCount) => {
        if (prevCount !== totalFrames) {
          return ++prevCount;
        }

        return 0;
      });
    }
  }, [isRunning]);

  const onChangeToRandomFragment = useCallback(async () => {
    const pickKey = await pickRandomFragment(baseObject.key);
    baseObject.key = pickKey.key;
    baseObject.fragment = pickKey.fragment;
    scene.remove(baseObject.mesh);
    baseObject.reGenerate();
    scene.add(baseObject.mesh);
  }, []);

  useEffect(() => {
    window.addEventListener("click", onChangeToRandomFragment);
    return () => {
      window.removeEventListener("click", onChangeToRandomFragment);
    };
  }, [onChangeToRandomFragment]);

  useEffect(() => {
    let interval: number;
    if (threeRef.current) {
      resizeHandler();
      threeRef.current.appendChild(renderer.domElement);
      (async () => {
        if (isRandom) {
          const pickKey = await pickRandomFragment(baseObject.key);
          baseObject.key = pickKey.key;
          baseObject.fragment = pickKey.fragment;
          baseObject.reGenerate();
        }
        scene.add(baseObject.mesh);
      })();

      interval = setInterval(async () => {
        const pickKey = await pickRandomFragment(baseObject.key);
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
        clearInterval(interval);
        clock = new Clock(false);
      }
    };
  }, [threeRef]);

  useEffect(() => {
    render();
  }, [time]);

  useEffect(() => {
    clock.start();
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [loop]);

  useEventListener("resize", resizeHandler);
  useEventListener("keydown", keyHandler);

  return { threeRef };
};
