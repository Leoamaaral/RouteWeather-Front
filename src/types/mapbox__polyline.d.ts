declare module "@mapbox/polyline" {
  export function decode(str: string): [number, number][];
  export function encode(coords: [number, number][]): string;
  const polyline: { decode: typeof decode; encode: typeof encode };
  export default polyline;
}
