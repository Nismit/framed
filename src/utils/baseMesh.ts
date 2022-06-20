import {
  IUniform,
  PlaneBufferGeometry,
  RawShaderMaterial,
  Mesh,
  Vector2,
} from "three";

const vertexTemplate = `
precision highp float;
attribute vec2 uv;
attribute vec3 position;

void main() {
  vec4 retinaPos = vec4(position, 1.0);
  retinaPos.xy = retinaPos.xy * 2.0 - 1.0;
  gl_Position = retinaPos;
}
`;

export default class baseMesh {
  private _mesh: Mesh;
  private _geometry: PlaneBufferGeometry;
  private _material: RawShaderMaterial;
  private _uniform: { [key: string]: IUniform<any> };

  constructor(props: {
    vertex?: string;
    fragment: string;
    uniform: { [key: string]: IUniform<any> };
  }) {
    const { vertex, fragment, uniform } = props;
    this._uniform = uniform;
    this._geometry = new PlaneBufferGeometry(2, 2);
    this._material = new RawShaderMaterial({
      uniforms: this._uniform,
      vertexShader: vertex ?? vertexTemplate,
      fragmentShader: fragment,
      transparent: true,
    });
    this._mesh = new Mesh(this._geometry, this._material);
  }

  get mesh() {
    return this._mesh;
  }

  set resolution(value: { x: number; y: number }) {
    this._uniform.resolution.value = new Vector2(value.x, value.y);
  }

  set time(value: number) {
    this._uniform.time.value = value;
  }

  dispose() {
    console.log("dispose");
    this._uniform = {};
    this.mesh.clear();
    this._geometry.dispose();
    this._material.dispose();
  }
}
