import {
  IUniform,
  PlaneGeometry,
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
  private _geometry: PlaneGeometry;
  private _material: RawShaderMaterial;
  private _uniform: { [key: string]: IUniform<any> };
  private _vertex: string;
  private _fragment: string;
  private _fragmentKey: string;

  constructor(props: {
    vertex?: string;
    fragment: string;
    fragmentKey: string;
    uniform: { [key: string]: IUniform<any> };
  }) {
    const { vertex, fragment, fragmentKey, uniform } = props;
    this._uniform = uniform;
    this._vertex = vertex ?? vertexTemplate;
    this._fragment = fragment;
    this._geometry = new PlaneGeometry(2, 2);
    this._material = new RawShaderMaterial({
      uniforms: this._uniform,
      vertexShader: this._vertex,
      fragmentShader: this._fragment,
      transparent: true,
    });
    this._mesh = new Mesh(this._geometry, this._material);
    this._fragmentKey = fragmentKey;
  }

  get mesh() {
    return this._mesh;
  }

  get key() {
    return this._fragmentKey;
  }

  set fragment(value: string) {
    this._fragment = value;
  }

  set key(value: string) {
    this._fragmentKey = value;
  }

  set resolution(value: { x: number; y: number }) {
    this._uniform.resolution.value = new Vector2(value.x, value.y);
  }

  set time(value: number) {
    if (this._uniform.time) {
      this._uniform.time.value = value;
    }
  }

  set elapsedTime(value: number) {
    if (this._uniform.elapsedTime) {
      this._uniform.elapsedTime.value = value;
    }
  }

  reGenerate() {
    this._geometry = new PlaneGeometry(2, 2);
    this._material = new RawShaderMaterial({
      uniforms: this._uniform,
      vertexShader: this._vertex,
      fragmentShader: this._fragment,
      transparent: true,
    });
    this._material.needsUpdate = true;
    this._mesh = new Mesh(this._geometry, this._material);
  }

  dispose() {
    console.log("dispose");
    this._uniform = {};
    this.mesh.clear();
    this._geometry.dispose();
    this._material.dispose();
  }
}
