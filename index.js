import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/OBJLoader.js";

// 초기 카메라 위치
const initialCameraPosition = new THREE.Vector3(10, 10, 15);
const targetCameraPosition = new THREE.Vector3(0, 0, 0); // 초기화 시점의 타겟 위치

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.copy(initialCameraPosition); // 카메라 초기 위치 설정
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// 스카이박스 텍스처 이미지 경로
const skyboxTextureUrls = [
  './assets/skybox/posx.jpg',   // right
  './assets/skybox/negx.jpg',    // left
  './assets/skybox/posy.jpg',     // top
  './assets/skybox/negy.jpg',  // bottom
  './assets/skybox/posz.jpg',   // front
  './assets/skybox/negz.jpg'     // back
];

// 스카이박스 텍스처 로드
const skyboxTexture = new THREE.CubeTextureLoader().load(skyboxTextureUrls);
scene.background = skyboxTexture;

let cameraControlEnabled = false; // 초기에 카메라 컨트롤 비활성화

// OrbitControls를 이곳에서 선언하고 초기화합니다.
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false; // 초기에 컨트롤 비활성화
controls.update();

window.toggleCameraControl = function() {
  cameraControlEnabled = !cameraControlEnabled; // 카메라 컨트롤 상태 전환

  if (cameraControlEnabled) {
    controls.enabled = true; // OrbitControls 활성화
    console.log("카메라 컨트롤 활성화");
  } else {
    controls.enabled = false; // OrbitControls 비활성화
    console.log("카메라 컨트롤 비활성화");
  }
}

window.resetCameraControl = function() { // 초기화 버튼
  cameraControlEnabled = false;
  controls.enabled = false;
  resetCameraPosition(); // 초기 카메라 위치로 되돌리기
  console.log("카메라 컨트롤 초기화");
}

function resetCameraPosition() {
  camera.position.copy(initialCameraPosition); // 초기 카메라 위치로 설정
  camera.lookAt(targetCameraPosition); // 카메라가 초기화 시점의 타겟 위치를 바라보도록 설정
}

function init(geometry) {
  const texture = new THREE.TextureLoader().load('./assets/texture/wood.jpg');

  const material = new THREE.MeshPhongMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const sunlight = new THREE.DirectionalLight(0xffffff);
  sunlight.position.y = 2;
  scene.add(sunlight);

  const filllight = new THREE.DirectionalLight(0x88ccff);
  filllight.position.x = 1;
  filllight.position.y = -2;
  scene.add(filllight);

  // Ambient Light (주변광)
  const ambientLight = new THREE.AmbientLight(0x404040); // 조명 색상
  scene.add(ambientLight);

  // Hemispheric Light (반구광)
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1); // 하늘색, 땅색, 강도
  scene.add(hemiLight);

  function animate() {
    requestAnimationFrame(animate);
    if (cameraControlEnabled) {
      controls.update(); // 카메라 컨트롤 활성화된 경우에만 업데이트
    }
    renderer.render(scene, camera);
  }
  animate();
}

const loader = new OBJLoader();
loader.load("./assets/obj/wooden_tower.obj", (obj) => init(obj.children[0].geometry) );

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);
