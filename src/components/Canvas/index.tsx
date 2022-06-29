import { useThree } from "../../hooks/useThree";

export const Canvas = () => {
  const { threeRef } = useThree();
  return <div ref={threeRef} className="canvasContainer" />;
};
