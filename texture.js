import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { GUI } from './js/dat.gui.module.js';
export function name() {
    var loader = new THREE.TextureLoader();
    var texture = loader.load('/road.jpeg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    var repeatsX = 2;
    var repeatsY = 2;
    texture.repeat.set(repeatsX, repeatsY);

    var planeGeo = new THREE.PlaneGeometry(1, 1);
    var planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.position.set(0, 0, 0);
    mesh.scale.set(2, 2, 2);
    mesh.rotateZ(Math.PI / 2);
    // scene.add(mesh);
    return mesh;
}