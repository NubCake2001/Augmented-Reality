import {
    Scene,
    Color,
    PerspectiveCamera,
    BoxBufferGeometry,
    MeshStandardMaterial,
    Mesh,
    Group,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
    TextureLoader,
    sRGBEncoding,
    CylinderBufferGeometry
} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

let container;
let camera;
let renderer;
let scene;
let mesh;
let controls;
const train = new Group();

export function createMeshes(scene) {
    scene.add(train);

    const materials = createMaterials();
    const geometries = createGeometries();

    const nose = new Mesh(geometries.nose, materials.body);
    nose.rotation.z = Math.PI / 2;
    nose.position.x = -1;

    const cabin = new Mesh(geometries.cabin, materials.body);
    cabin.position.set(1.5, 0.4, 0);

    const cabin1 = new Mesh(geometries.cabin, materials.body);
    cabin1.position.set(3.3, 0.4, 0);

    const chimney = new Mesh(geometries.chimney, materials.detail);
    chimney.position.set(-2, 0.9, 0);

    const smallWheelRear = new Mesh(geometries.wheel, materials.detail);
    smallWheelRear.position.set(0, -0.5, 0);

    const smallWheelCenter = smallWheelRear.clone();
    smallWheelCenter.position.set(-1, -0.5, 0);

    const smallWheelFront = smallWheelRear.clone();
    smallWheelFront.position.set(-2, -0.5, 0);

    const bigWheel = smallWheelRear.clone();
    bigWheel.scale.set(2, 2, 1.25);
    bigWheel.position.set(1.5, -0.1, 0);

    const bigWheel1 = smallWheelRear.clone();
    bigWheel1.scale.set(2, 2, 1.25);
    bigWheel1.position.set(3.3, -0.1, 0);

    train.add(
        nose,
        cabin,
        cabin1,
        chimney,
        smallWheelRear,
        smallWheelCenter,
        smallWheelFront,
        bigWheel,
        bigWheel1
    );
    train.scale.set(0.2, 0.2, 0.2);
    return train;
}

function createGeometries() {
    const nose = new CylinderBufferGeometry(0.75, 0.75, 3, 12);
    const cabin = new BoxBufferGeometry(2, 2.25, 1.5);
    const chimney = new CylinderBufferGeometry(0.3, 0.1, 0.5);
    const wheel = new CylinderBufferGeometry(0.4, 0.4, 1.75, 16);
    wheel.rotateX(Math.PI / 2);

    return {
        nose,
        cabin,
        chimney,
        wheel
    };
}

function createMaterials() {
    const body = new MeshStandardMaterial({
        color: 0xff3333, // Red
        flatShading: true
    });
    body.color.convertSRGBToLinear();

    const detail = new MeshStandardMaterial({
        color: 0x333333, // Gray
        flatShading: true
    });
    detail.color.convertSRGBToLinear();

    return {
        body,
        detail
    };
}

