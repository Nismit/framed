const fragmentMap: Record<string, Promise<string>> = {
  Polygon: import("../fragments/polygon.frag").then((f) => f.default),
  Polygon2: import("../fragments/polygon2.frag").then((f) => f.default),
  Polygon3: import("../fragments/polygon3.frag").then((f) => f.default),
  Polygon4: import("../fragments/polygon4.frag").then((f) => f.default),
  Polygon5: import("../fragments/polygon5.frag").then((f) => f.default),
  Polygon6: import("../fragments/polygon6.frag").then((f) => f.default),
  Polygon7: import("../fragments/polygon7.frag").then((f) => f.default),
  Polygon8: import("../fragments/polygon8.frag").then((f) => f.default),
  Polygon9: import("../fragments/polygon9.frag").then((f) => f.default),
  Polygon10: import("../fragments/polygon10.frag").then((f) => f.default),
  Circle: import("../fragments/circle.frag").then((f) => f.default),
  Circle2: import("../fragments/circle2.frag").then((f) => f.default),
  Circle3: import("../fragments/circle3.frag").then((f) => f.default),
  Circle4: import("../fragments/circle4.frag").then((f) => f.default),
  Circle5: import("../fragments/circle5.frag").then((f) => f.default),
  Circle6: import("../fragments/circle6.frag").then((f) => f.default),
  Circle7: import("../fragments/circle7.frag").then((f) => f.default),
  Circle8: import("../fragments/circle8.frag").then((f) => f.default),
  Circle9: import("../fragments/circle9.frag").then((f) => f.default),
  Circle10: import("../fragments/circle10.frag").then((f) => f.default),
  Rectangle: import("../fragments/rectangle.frag").then((f) => f.default),
  Rectangle2: import("../fragments/rectangle2.frag").then((f) => f.default),
  Rectangle3: import("../fragments/rectangle3.frag").then((f) => f.default),
  Rectangle4: import("../fragments/rectangle4.frag").then((f) => f.default),
  Rectangle5: import("../fragments/rectangle5.frag").then((f) => f.default),
  Rectangle6: import("../fragments/rectangle6.frag").then((f) => f.default),
  Rectangle7: import("../fragments/rectangle7.frag").then((f) => f.default),
  Rectangle8: import("../fragments/rectangle8.frag").then((f) => f.default),
  Rectangle9: import("../fragments/rectangle9.frag").then((f) => f.default),
  Rectangle10: import("../fragments/rectangle10.frag").then((f) => f.default),
  // Spring: import("../fragments/spring.frag").then((f) => f.default),
  Summer: import("../fragments/summer.frag").then((f) => f.default),
  Revise: import("../fragments/revise.frag").then((f) => f.default),
  Revise2: import("../fragments/revise2.frag").then((f) => f.default),
  Revise3: import("../fragments/revise3.frag").then((f) => f.default),
  Revise4: import("../fragments/revise4.frag").then((f) => f.default),
  Revise5: import("../fragments/revise5.frag").then((f) => f.default),
};

export const fragmentTimeMap: Record<string, number> = {
  Revise: 3.1,
  Revise2: 3.15,
  Revise3: 6,
  Revise5: 12.5,
};

export const pickRandomFragment = async (current: string) => {
  const keys = Object.keys(fragmentMap).filter((key) => key !== current);
  // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
  const pickKey = keys[(keys.length * Math.random()) << 0];
  const frag = await fragmentMap[pickKey];
  return { key: pickKey, fragment: frag };
};
