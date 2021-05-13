import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  const boxWidth = 2;
  const boxHeight = 2;
  const boxDepth = 2;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });  // greenish blue

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  renderer.render(scene, camera);
}

main();
