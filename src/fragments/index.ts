// import fbm from "../fragments/fbm.frag";
import Triangle from "../fragments/triangle.frag";
import Circle from "../fragments/circle.frag";
import Circle2 from "../fragments/circle2.frag";
import Circle3 from "../fragments/circle3.frag";
import Circle4 from "../fragments/circle4.frag";
import Circle5 from "../fragments/circle5.frag";
import Circle6 from "../fragments/circle6.frag";
import Circle7 from "../fragments/circle7.frag";
import Circle8 from "../fragments/circle8.frag";
import Circle9 from "../fragments/circle9.frag";
import Circle10 from "../fragments/circle10.frag";
import Rectangle from "../fragments/rectangle.frag";
import Rectangle2 from "../fragments/rectangle2.frag";

const fragmentMap: Record<string, string> = {
  Triangle: Triangle,
  Circle: Circle,
  Circle2: Circle2,
  Circle3: Circle3,
  Circle4: Circle4,
  Circle5: Circle5,
  Circle6: Circle6,
  Circle7: Circle7,
  Circle8: Circle8,
  Circle9: Circle9,
  Circle10: Circle10,
  Rectangle: Rectangle,
  Rectangle2: Rectangle2,
};

export const pickRandomFragment = (current: string) => {
  const keys = Object.keys(fragmentMap).filter((key) => key !== current);
  // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
  const pickKey = keys[(keys.length * Math.random()) << 0];
  return { key: pickKey, fragment: fragmentMap[pickKey] };
};
