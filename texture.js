import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { OBJLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';


function verticalRoad(y) {
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
    mesh.position.set(0, y, 0);
    mesh.scale.set(0.8, 0.8, 0.8);
    mesh.rotateZ(Math.PI / 2);
    // scene.add(mesh);
    return mesh;
}

function horRoad(x) {
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
    mesh.position.set(x, 0, 0);
    mesh.scale.set(0.8, 0.8, 0.8);
    // mesh.rotateZ(Math.PI / 2);
    // scene.add(mesh);
    return mesh;
}

export function multVerticalRoad(scene) {
    for (var i = -3.2; i < 3.6; i = i + 0.8) {
        var mesh = verticalRoad(i);
        scene.add(mesh);
    }
}
export function multHorRoad(scene) {
    for (var i = -6; i < 6; i = i + 0.8) {
        var mesh = horRoad(i);
        scene.add(mesh);
    }
}

export function grassFill(scene) {
    // for (var i = -1; i < 2; i++) {
    //     for (var j = -1; j < 2; j++) {
    var loader = new THREE.TextureLoader();
    var texture = loader.load('/grass2.jpeg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    var repeatsX = 1;
    var repeatsY = 1;
    texture.repeat.set(repeatsX, repeatsY);

    var planeGeo = new THREE.CircleGeometry(3, 32);
    var planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.position.set(0, 0, 0);
    // mesh.scale.set(2, 32);
    scene.add(mesh);
    // }
    // }
}


export function Avatar(scene) {
    var mtl_loader = new MTLLoader();
    var mesh1;
    mtl_loader.load('Character/Character.mtl', function (materials) {

        materials.preload()

        const obj_loader = new OBJLoader();
        obj_loader.setMaterials(materials);
        obj_loader.setPath('Character/');
        obj_loader.load('Character.obj', function (mesh) {

            mesh.position.set(0, 0, 0);
            mesh.scale.set(0.005, 0.005, 0.005);
            mesh.castShadow = true;
            mesh.rotation.x = Math.PI / 2;

            scene.add(mesh);
            mesh1 = mesh;

        })
    });
    return mesh1;
}

export function trainTrack() {
    var loader = new THREE.TextureLoader();
    var texture = loader.load('/track2.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    var repeatsX = 1;
    var repeatsY = 1;
    texture.repeat.set(repeatsX, repeatsY);

    var planeGeo = new THREE.PlaneGeometry(1, 1);
    var planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        // transparent: true,
    });
    var mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.position.set(0, 0, 0);
    mesh.scale.set(7.6, 7.6, 7.6);
    // mesh.rotateZ(Math.PI / 2);
    // scene.add(mesh);
    return mesh;
}

export function streetLight(x, y, z, scene) {
    var loader = new THREE.TextureLoader();
    var loader = new THREE.TextureLoader();
    var texture = loader.load('/StreetLight.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    var repeatsX = 1;
    var repeatsY = 1;
    texture.repeat.set(repeatsX, repeatsY);

    var planeGeo = new THREE.PlaneGeometry(1, 1);
    var planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
    });
    var mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.position.set(x, y, z);
    mesh.rotation.x = 0.9;
    // mesh.rotation.z = 1;
    // mesh.rotation.y = 1;
    mesh.scale.set(2, 2, 2);
    scene.add(mesh);

}


function assignSphericalUVs(geometry) {
    // geometry.computeBoundingBox();
    var positions = Array.from(geometry.attributes.position.array);
    for (var i = 0; i < positions.length / 3; i++) {
        var x = positions[i * 3];
        var y = positions[i * 3 + 1];
        var z = positions[i * 3 + 2];
        var U = Math.atan2(z, x) / Math.PI * 0.5 - 0.5;
        var V = 0.5 - Math.asin(y) / Math.PI;
        geometry.attributes.uv.array[i * 2] = U;
        geometry.attributes.uv.array[i * 2 + 1] = V;
    }
    geometry.uvsNeedUpdate = true;
    // console.log(geometry.attributes.uv.array);
}

function assignCylindricalUVs(geometry) {
    var positions = Array.from(geometry.attributes.position.array);
    for (var i = 0; i < positions.length / 3; i++) {
        var x = positions[i * 3];
        var y = positions[i * 3 + 1];
        var z = positions[i * 3 + 2];
        var U = Math.atan2(x, z) / Math.PI * 0.5 + 0.5
        var V = y
        geometry.attributes.uv.array[i * 2] = U;
        geometry.attributes.uv.array[i * 2 + 1] = V;
    }
    geometry.uvsNeedUpdate = true;
}

export function CylinderMapping() {
    var loader = new THREE.TextureLoader();
    var texture = loader.load('/grass2.jpeg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    var repeatsX = 1;
    var repeatsY = 1;
    texture.repeat.set(repeatsX, repeatsY);
    const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
    assignCylindricalUVs(geometry);
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.scale.set(0.04, 0.04, 0.04);
    cylinder.rotation.x = -Math.PI / 2;
    cylinder.position.set(2, 0, 0);
    return cylinder;
}

export function SphericalMapping() {
    var loader = new THREE.TextureLoader();
    var texture = loader.load('/grass2.jpeg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    var repeatsX = 1;
    var repeatsY = 1;
    texture.repeat.set(repeatsX, repeatsY);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    assignSphericalUVs(geometry);
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.scale.set(0.6, 0.6, 0.6);
    cylinder.rotation.x = -Math.PI / 2;
    cylinder.position.set(-2, 0, 0);
    return cylinder;
}