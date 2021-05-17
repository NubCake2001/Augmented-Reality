import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { GUI } from './js/dat.gui.module.js';
import { name } from './texture.js';

var controls = new GUI();

function main() {
  var canvas = document.querySelector('#c');
  canvas.width = 700;
  canvas.height = 700;
  var renderer = new THREE.WebGLRenderer({ canvas });
  //--------------------------------------------------------------------------------------------------------
  var mainObj;
  var angle = 0;
  var isRotate = false;
  var isSticked = false;
  var stickedObj;
  var jumpDir;
  var comeback;
  var isDrone = false;
  //--------------------------------------------------------------------------------------------------------
  var fov = 75;
  var aspect = 1;  // the canvas default
  var near = 0.1;
  var far = 5;
  var camera = new THREE.PerspectiveCamera(fov, aspect, near, far); //Default Camera
  camera.position.z = 4;

  var droneCamera = new THREE.PerspectiveCamera(fov, aspect, near, 10); //Drone Camera
  droneCamera.position.z = 5;

  var scene = new THREE.Scene();
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  //--------------------------------------------------------------------------------------------------------
  // var loader = new THREE.TextureLoader();
  // var texture = loader.load('/road.jpeg');
  // texture.wrapS = THREE.RepeatWrapping;
  // texture.wrapT = THREE.RepeatWrapping;
  // texture.magFilter = THREE.NearestFilter;
  // var repeatsX = 2;
  // var repeatsY = 2;
  // texture.repeat.set(repeatsX, repeatsY);

  // var planeGeo = new THREE.PlaneGeometry(1, 1);
  // var planeMat = new THREE.MeshPhongMaterial({
  //   map: texture,
  //   side: THREE.DoubleSide,
  // });
  // var mesh = new THREE.Mesh(planeGeo, planeMat);
  // mesh.position.set(0, 0, 0);
  // mesh.scale.set(2, 2, 2);
  // mesh.rotateZ(Math.PI / 2);
  // scene.add(mesh);

  var mesh = name();
  scene.add(mesh);
  //--------------------------------------------------------------------------------------------------------

  var boxWidth = 1;
  var boxHeight = 1;
  var boxDepth = 1;
  var geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

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
  // var radius = 3.1;
  // var segments = 19;
  // var thetaStart = Math.PI * 1.26;
  // var thetaLength = Math.PI * 1.50;
  // var statObjGeometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);
  // createObj(statObjGeometry, new THREE.Color("rgb(215, 0, 0)"), -1.5, 1, 1, 0.05, true);
  // createObj(statObjGeometry, new THREE.Color("rgb(0, 215, 0)"), -0.5, -0.5, 0.5, 0.05, true);
  // createObj(statObjGeometry, new THREE.Color("rgb(0, 0, 215)"), 1, 0, 1, 0.05, true);
  // createObj(statObjGeometry, new THREE.Color("rgb(215, 0, 215)"), -0.5, 0.7, 1, 0.05, true);
  // createObj(statObjGeometry, new THREE.Color("rgb(0, 215, 215)"), 1, 1, 1, 0.05, true);
  //--------------------------------------------------------------------------------------------------------

  var initComp = new THREE.Object3D();
  scene.add(initComp);
  for (var i = 0; i < 3; i++) {
    var trainObj = createObj(geometry, new THREE.Color(Math.random(), Math.random(), Math.random()), i * 0.1, 0, 0, 0.1, false);
    initComp.add(trainObj);
  }
  //--------------------------------------------------------------------------------------------------------
  var avs = {
    av1: function () {
      console.log("Pressed");
      mainObj = createObj(geometry, new THREE.Color(Math.random(), Math.random(), Math.random()), 0, 0, 0, 0.2, true);
    },
    av2: function () {
      console.log("Pressed");
      mainObj = createObj(geometry, new THREE.Color(Math.random(), Math.random(), Math.random()), 0, 0, 0, 0.2, true);
    }
  };
  var Avatars = controls.addFolder("Select Avatar");
  Avatars.add(avs, 'av1').name('AV1');
  Avatars.add(avs, 'av2').name('AV2');
  //--------------------------------------------------------------------------------------------------------
  var optionsFun = {
    stick: false,
    rotate: false,
  }

  var options = controls.addFolder("Options");
  options.add(optionsFun, 'rotate').onChange(function (value) {
    if (isRotate) {
      isRotate = false;
    }
    else {
      isRotate = true;
    }
    console.log(isRotate);
  }).name("Rotate");

  options.add(optionsFun, 'stick').onChange(function (value) {
    if (isSticked == true) {
      stickedObj.remove(mainObj);
      mainObj.position.x = stickedObj.position.x;
      mainObj.position.y = stickedObj.position.y;
      mainObj.position.z = stickedObj.position.z;
      isSticked = false;
      scene.add(mainObj);
    }
  }).name("Stick");
  //--------------------------------------------------------------------------------------------------------
  // If the objects are colliding and it is in stick mode, then avatar will stick to object.
  var tempComp = [];
  tempComp.push(initComp);
  function checkCollision(av) {
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
          av.position.z = 0;
        }
        isSticked = true;
        stickedObj = tempComp[i];
        break;
      }
    }
  }
  //--------------------------------------------------------------------------------------------------------
  var cameraFun = {
    droneViewer: false,
  }
  var cameraOptions = controls.addFolder('Camera View');
  cameraOptions.add(cameraFun, 'droneViewer').onChange(function (value) {
    if (isDrone) {
      isDrone = false;
    }
    else {
      isDrone = true;
    }
  })
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

        case "l":
          if (isSticked) {
            jumpDir = 0; //down
            comeback = false;
            // mainObj.position.y += 0.5;
          }

        case "ArrowUp":
          if (!isSticked && !isDrone) {
            mainObj.position.y += 0.1;
          }
          else if (isDrone) {
            droneCamera.position.y += 0.1;
          }
          break;

        case "ArrowDown":
          if (!isSticked && !isDrone) {
            mainObj.position.y -= 0.1;
          }
          else if (isDrone) {
            droneCamera.position.y -= 0.1;
          }
          break;

        case "ArrowRight":
          if (!isSticked && !isDrone) {
            mainObj.position.x += 0.1;
          }
          else if (isDrone) {
            droneCamera.position.x += 0.1;
          }
          break;

        case "ArrowLeft":
          if (!isSticked && !isDrone) {
            mainObj.position.x -= 0.1;
          }
          else if (isDrone) {
            droneCamera.position.x -= 0.1;
          }
          break;

        case "z":
          if (!isSticked && !isDrone) {
            mainObj.position.z += 0.1;
          }
          else if (isDrone) {
            droneCamera.position.z += 0.1;
          }
          break;

        case "x":
          if (!isSticked && !isDrone) {
            mainObj.position.z -= 0.1;
          }
          else if (isDrone) {
            droneCamera.position.z -= 0.1;
          }
          break;
      }
    });
  };
  //--------------------------------------------------------------------------------------------------------
  function trainAutomate(angle) {
    angle = angle * Math.PI / 180;
    initComp.position.x = 2.5 * (Math.cos(angle));
    initComp.position.y = 2.5 * (Math.sin(angle));
  }
  //--------------------------------------------------------------------------------------------------------
  function animate() {
    angle += 0.4;
    trainAutomate(angle);

    if (jumpDir == 0 && isSticked == true) {
      if (comeback) {
        for (var i = 0; i < 50; i++) {
          mainObj.position.y -= 0.01;
        }
        jumpDir = 2;
        comeback = false;
      }
      else {
        for (var i = 0; i < 50; i++) {
          mainObj.position.y -= 0.01;
        }
        jumpDir = 1;
        comeback = true;
      }
    }

    if (jumpDir == 1 && isSticked == true) {
      if (comeback) {
        for (var i = 0; i < 50; i++) {
          mainObj.position.y += 0.01;
        }
        jumpDir = 2;
        comeback = false;
      }
      else {
        for (var i = 0; i < 50; i++) {
          mainObj.position.y += 0.01;
        }
        jumpDir = 0;
        comeback = true;
      }
    }

    if (optionsFun.stick == true) {
      checkCollision(mainObj);
    }
    if (isDrone) {
      renderer.render(scene, droneCamera);
    }
    else {
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
//--------------------------------------------------------------------------------------------------------

main();
