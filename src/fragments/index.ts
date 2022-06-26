// import fbm from "../fragments/fbm.frag";
import Triangle from "../fragments/triangle.frag";
import Circle from "../fragments/circle.frag";
import Circle2 from "../fragments/circle2.frag";
import Circle3 from "../fragments/circle3.frag";

const fragmentMap: Record<string, string> = {
  Triangle: Triangle,
  Circle: Circle,
  Circle2: Circle2,
  Circle3: Circle3,
};

export const pickRandomFragment = (current: string) => {
  const keys = Object.keys(fragmentMap).filter((key) => key !== current);
  // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
  const pickKey = keys[(keys.length * Math.random()) << 0];
  return { key: pickKey, fragment: fragmentMap[pickKey] };
};
