import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { GUI } from './js/dat.gui.module.js';
import { multVerticalRoad, CylinderMapping, SphericalMapping, multHorRoad, trainTrack, grassFill, streetLight, Avatar } from './texture.js';
import { createMeshes } from './train.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

var controls = new GUI();

function main() {
  var canvas = document.querySelector('#c');
  var renderer = new THREE.WebGLRenderer({ canvas });

  //--------------------------------------------------------------------------------------------------------
  var mainObj;
  var count = 0;
  var angle = 0;
  var isSticked = false;
  var stickedObj;
  var jumpDir;
  var comeback;
  var isDrone = false;
  //--------------------------------------------------------------------------------------------------------
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  //--------------------------------------------------------------------------------------------------------
  var scene = new THREE.Scene();
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  // scene.add(ambientLight)  ;

  var fov = 75;
  var aspect = canvas.clientWidth / canvas.clientHeight;  // the canvas default
  var near = 0.1;
  var far = 1000;
  var camera = new THREE.PerspectiveCamera(fov, aspect, near, far); //Default Camera
  camera.position.z = 5;

  const CameraControls = new OrbitControls(camera, renderer.domElement);

  var droneViewer = new THREE.PerspectiveCamera(fov, aspect, near, far); //Drone Camera
  const helper = new THREE.CameraHelper(droneViewer);

  // scene.add(helper);
  // droneViewer.lookAt(new THREE.Vector3(0, 0, 0));
  // droneViewer.up = new THREE.Vector3(0, 0, 1);
  droneViewer.position.x = 0;
  droneViewer.position.y = 0;
  droneViewer.position.z = 4;

  // fppCamera.position.x = 0;
  // fppCamera.position.x = 0;
  // fppCamera.position.z = 0;


  //-------------------------------------------------------------------------------------------------------

  var mesh = trainTrack();
  scene.add(mesh);
  grassFill(scene);
  var initComp = createMeshes(scene);
  initComp.rotation.z = -Math.PI / 2;
  // initComp.rotation.x = Math.PI / 2;
  initComp.rotation.y = -Math.PI / 2;


  // track(scene);
  multHorRoad(scene);
  multVerticalRoad(scene);
  // streetLight(0, 0, 0, scene);

  //--------------------------------------------------------------------------------------------------------
  function createObj(geometry, color, x, y, z, fact, addtoScene = true) {
    var material = new THREE.MeshBasicMaterial({ color: color });
    var obj = new THREE.Mesh(geometry, material);
    obj.position.x = x;
    obj.position.y = y;
    obj.position.z = z;
    obj.scale.x = fact;
    obj.scale.y = fact;
    obj.scale.z = fact;
    if (addtoScene) {
      scene.add(obj);
      return obj;
    }
    else {
      return obj;
    }
  }
  //--------------------------------------------------------------------------------------------------------
  var avs = {
    av1: function () {
      if (!mainObj) {
        var mtl_loader = new MTLLoader();
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
            mainObj = mesh;
          })
        });
      }
    },
  };
  var Avatars = controls.addFolder("Select Avatar");
  Avatars.add(avs, 'av1').name('Spawn Avatar');

  //--------------------------------------------------------------------------------------------------------
  var loader = new THREE.TextureLoader();
  var texture = loader.load('/grass2.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  var repeatsX = 1;
  var repeatsY = 1;
  texture.repeat.set(repeatsX, repeatsY);
  const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
  const geometry1 = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  var cylinder = new THREE.Mesh(geometry, material);
  var cylinderTem = new THREE.Mesh(geometry1, material);

  // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  // const cylinder = new THREE.Mesh(geometry, material);
  cylinder.scale.set(0.04, 0.04, 0.04);
  cylinder.rotation.x = -Math.PI / 2;
  cylinder.position.set(2, 0, 0);
  scene.add(cylinder);
  cylinderTem.scale.set(0.6, 0.6, 0.6);
  cylinderTem.rotation.x = -Math.PI / 2;
  cylinderTem.position.set(-2, 0, 0);
  scene.add(cylinderTem);

  var textureFun = {
    cyl: false,
    sph: false,
  };

  var isCyl = false;
  var isSph = false;

  var cylinder1 = CylinderMapping();
  var cylinder2 = SphericalMapping();


  var textControls = controls.addFolder("Texture Controls");
  textControls.add(textureFun, 'cyl').onChange(function (value) {
    if (isCyl) {
      isCyl = false;
      scene.remove(cylinder1);
      scene.add(cylinder);
    }
    else {
      isCyl = true;
      scene.remove(cylinder);
      scene.add(cylinder1);
    }
  }).name("Cylindrical Mapping");
  textControls.add(textureFun, 'sph').onChange(function (value) {
    if (isSph) {
      isSph = false;
      scene.remove(cylinder2);
      scene.add(cylinderTem);
    }
    else {
      isSph = true;
      scene.remove(cylinderTem);
      scene.add(cylinder2);
    }
  }).name("Spherical Mapping");


  //--------------------------------------------------------------------------------------------------------
  var optionsFun = {
    stick: false,
  }

  var options = controls.addFolder("Options");
  options.add(optionsFun, 'stick').onChange(function (value) {
    if (isSticked == true) {
      isSticked = false;
      stickedObj.remove(mainObj);
      mainObj.position.x = stickedObj.position.x;
      mainObj.position.y = stickedObj.position.y;
      // mainObj.position.z = stickedObj.position.z;
      mainObj.scale.set(0.005, 0.005, 0.005);
      mainObj.rotation.z = 0;
      mainObj.rotation.y = 0;
      scene.add(mainObj);
    }
  }).name("Stick");
  //--------------------------------------------------------------------------------------------------------
  // If the objects are colliding and it is in stick mode, then avatar will stick to object.
  var tempComp = [];
  tempComp.push(initComp);
  function checkCollision(av) {
    // var av1 = av;
    for (var i = 0; i < tempComp.length; i++) {
      var temp = tempComp[i];
      var box1 = new THREE.Box3().setFromObject(av);
      var box2 = new THREE.Box3().setFromObject(temp);

      var isNear = box1.intersectsBox(box2);
      if (isNear) {
        tempComp[i].add(av);
        if (isSticked == false) {
          av.position.x = 0;
          av.position.y = 0;
          // av.position.z = 0;
        }
        isSticked = true;
        stickedObj = tempComp[i];
        av.scale.set(0.03, 0.03, 0.03);
        av.rotation.z = -Math.PI / 2;
        av.rotation.y = Math.PI / 2;
        // av.rotation.y = Math.PI;
        // av.rotation.z = Math.PI;

        // av.rotation.x = Math.PI / 2;

        // stickedObj.scale.set(1, 1, 1);
        break;
      }
    }
  }
  //--------------------------------------------------------------------------------------------------------
  var cameraFun = {
    droneViewer: false,
    fppViewer: false,
  }
  var cameraOptions = controls.addFolder('Camera View');
  cameraOptions.add(cameraFun, 'droneViewer').onChange(function (value) {
    if (isDrone) {
      isDrone = false;
    }
    else {
      isDrone = true;
    }
  });


  //--------------------------------------------------------------------------------------------------------
  window.onload = () => {
    window.addEventListener('keydown', function (event) {
      switch (event.key) {

        case "k":
          if (isSticked) {
            jumpDir = 1; //up
            comeback = false;
            // mainObj.position.y += 0.5;
          }

        case "ArrowUp":
          if (!isSticked && !isDrone) {
            mainObj.rotation.y = Math.PI;
            mainObj.position.y += 0.1;
            // mainObj.position.set(1, 1, 0);
          }
          else if (isDrone) {
            droneViewer.position.y += 0.1;
          }
          break;

        case "ArrowDown":
          if (!isSticked && !isDrone) {
            mainObj.rotation.y = 0;
            mainObj.position.y -= 0.1;
          }
          else if (isDrone) {
            droneViewer.position.y -= 0.1;
          }
          break;

        case "ArrowRight":
          if (!isSticked && !isDrone) {
            mainObj.rotation.y = Math.PI / 2;
            mainObj.position.x += 0.1;
          }
          else if (isDrone) {
            droneViewer.position.x += 0.1;
          }
          break;

        case "ArrowLeft":
          if (!isSticked && !isDrone) {
            mainObj.rotation.y = -Math.PI / 2;
            mainObj.position.x -= 0.1;
          }
          else if (isDrone) {
            droneViewer.position.x -= 0.1;
          }
          break;

        case "z":
          if (!isSticked && !isDrone) {
            mainObj.position.z += 0.1;
          }
          else if (isDrone) {
            droneViewer.position.z += 0.1;
          }
          break;

        case "x":
          if (!isSticked && !isDrone) {
            mainObj.position.z -= 0.1;
          }
          else if (isDrone) {
            droneViewer.position.z -= 0.1;
          }
          break;
      }
    });
  };
  //--------------------------------------------------------------------------------------------------------
  var trainLight = new THREE.PointLight(new THREE.Color(1, 1, 1), 50, 1.05, 1);
  trainLight.position.set(2.5, 0, 1);
  //--------------------------------------------------------------------------------------------------------
  var light1 = new THREE.PointLight(new THREE.Color(1, 1, 0), 2.5, 2.5, 1);
  light1.position.set(2, 0, 1.5);

  var light2 = new THREE.PointLight(new THREE.Color(1, 1, 0), 2.5, 2.5, 1);
  light2.position.set(-2, 0, 1.5);


  var light3 = new THREE.PointLight(new THREE.Color(1, 1, 0), 2.5, 2.5, 1);
  light3.position.set(0, 2.5, 1.5);

  var light4 = new THREE.PointLight(new THREE.Color(1, 1, 0), 2.5, 2.5, 1);
  light4.position.set(0, -2.5, 1.5);

  var light5 = new THREE.PointLight(new THREE.Color(1, 1, 0), 9, 1.1, 1);
  light5.position.set(0, 0, 1);

  var light6 = new THREE.PointLight(new THREE.Color(1, 1, 0), 2.5, 2.5, 1);
  light6.position.set(5.25, 0, 1.5);

  var light7 = new THREE.PointLight(new THREE.Color(1, 1, 0), 2.5, 2.5, 1);
  light7.position.set(-5.25, 0, 1.5);

  var light8 = new THREE.PointLight(new THREE.Color(1, 0, 1), 5, 3, 1);
  light8.position.set(3.25, 3, 1.5);

  var light9 = new THREE.PointLight(new THREE.Color(1, 0, 1), 5, 3, 1);
  light9.position.set(-3.25, 3, 1.5);

  var light10 = new THREE.PointLight(new THREE.Color(1, 0, 1), 5, 3, 1);
  light10.position.set(3.25, -3, 1.5);

  var light11 = new THREE.PointLight(new THREE.Color(1, 0, 1), 5, 3, 1);
  light11.position.set(-3.25, -3, 1.5);

  var lightFun = {
    streetLight: false,
    headLight: false,
    trackStreetLight: false,
  }
  var isStreetLight;
  var isHeadLight;
  var isTrackLight;
  var lightOptions = controls.addFolder('Lights');
  lightOptions.add(lightFun, 'streetLight').onChange(function (value) {
    if (isStreetLight) {
      isStreetLight = false;
      scene.remove(light1);
      scene.remove(light2);
      scene.remove(light3);
      scene.remove(light4);
      scene.remove(light5);
      scene.remove(light6);
      scene.remove(light7);
    }
    else {
      isStreetLight = true;
      scene.add(light1);
      scene.add(light2);
      scene.add(light3);
      scene.add(light4);
      scene.add(light5);
      scene.add(light6);
      scene.add(light7);

    }
  }).name("Street Lights");

  lightOptions.add(lightFun, 'trackStreetLight').onChange(function (value) {
    if (isTrackLight) {
      isTrackLight = false;
      scene.remove(light8);
      scene.remove(light9);
      scene.remove(light10);
      scene.remove(light11);
    }
    else {
      isTrackLight = true;
      scene.add(light8);
      scene.add(light9);
      scene.add(light10);
      scene.add(light11);
    }
  }).name("Track Street Lights");

  lightOptions.add(lightFun, 'headLight').onChange(function (value) {
    if (isHeadLight) {
      isHeadLight = false;
      scene.remove(trainLight);
    }
    else {
      isHeadLight = true;
      scene.add(trainLight);
    }
  })
  // var char = Avatar(scene);
  // scene.add(char);
  //--------------------------------------------------------------------------------------------------------
  function trainAutomate(angle) {
    angle = angle * -Math.PI / 180;
    initComp.position.x = 3.4 * (Math.cos(angle));
    initComp.position.y = 3.4 * (Math.sin(angle));
    // initComp.rotation.set(new THREE.Vector3(0, 0, angle + (Math.PI / 2)));
    // initComp.rotation.y = angle + (Math.PI / 2);
    // initComp.rotation.x = angle + (Math.PI / 2);

    // initComp.rotation.x = (Math.cos(angle)) / 2;
    // initComp.positiom.z = 2.5 * (Math.tan(angle));
  }
  //--------------------------------------------------------------------------------------------------------
  function animate() {
    // scene.background = new THREE.Color(0xffffff);
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      if (isDrone) {
        droneViewer.updateProjectionMatrix();
      }
    }

    angle += 0.2;
    trainAutomate(angle);
    trainLight.position.set(initComp.position.x, initComp.position.y + 0.4, 1)

    if (jumpDir == 1 && isSticked && count >= 0) {
      if (count < 4) {
        mainObj.position.y += 0.1;
        count += 0.1;
      }
      else {
        comeback = true;
        count = 0;
        jumpDir = 0;
      }
    }
    if (jumpDir == 0 && comeback) {
      if (count < 4) {
        mainObj.position.y -= 0.1;
        count += 0.1;
      }
      else {
        comeback = false;
        count = 0;
      }
    }


    // if (jumpDir == 1 && isSticked == true) {
    //   if (comeback) {
    //     for (var i = 0; i < 50; i++) {
    //       mainObj.position.y += 0.01;
    //     }
    //     jumpDir = 2;
    //     comeback = false;
    //   }
    //   else {
    //     for (var i = 0; i < 50; i++) {
    //       mainObj.position.y += 0.01;
    //     }
    //     jumpDir = 0;
    //     comeback = true;
    //   }
    // }

    // initComp.rotation.y += 0.013;
    // initComp.rotation.z += 0.013;

    // fppCamera.position.x = mainObj.position.x

    if (optionsFun.stick == true && mainObj) {
      checkCollision(mainObj);
    }
    if (isDrone) {
      renderer.render(scene, droneViewer);
    }
    else {
      camera.lookAt(camera.position.x, camera.position.y, 0);
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
//--------------------------------------------------------------------------------------------------------

main();
