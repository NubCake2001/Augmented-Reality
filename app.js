import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

function main() {
  const canvas = document.querySelector('#c');
  canvas.width = 700;
  canvas.height = 700;
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 75;
  const aspect = 1;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  const scene = new THREE.Scene();

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const color3 = new THREE.Color("rgb(215, 0, 0)");
  const material = new THREE.MeshBasicMaterial({ color: color3 });  // greenish blue

  const trainComps = [];
  function createTrainObj(geometry, color, x) {
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;
    trainComps.push(cube);
  }

  createTrainObj(geometry, color3, 0);
  createTrainObj(geometry, color3, 2);
  createTrainObj(geometry, color3, -2);
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  renderer.render(scene, camera);
}

main();
