import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/OBJLoader.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
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

camera.position.set(10, 10, 15); // 카메라 위치 설정
const controls = new OrbitControls(camera, renderer.domElement); // 카메라 사용
controls.update();

function init(geometry) {
  const texture = new THREE.TextureLoader().load('./assets/obj/white-texture.jpg'); // 텍스쳐 불러오기
  
  const material = new THREE.MeshPhongMaterial({ map: texture }); // 3D 모델에 텍스쳐 매핑
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  mesh.position.set(0, 0, 0); // 원하는 위치로 조정
  
  const sunlight = new THREE.DirectionalLight(0xffffff); // 직사광 생성(16진수 : 조명의 색상)
  sunlight.position.y = 2; // 조명의 위치
  scene.add(sunlight);

  const filllight = new THREE.DirectionalLight(0x88ccff); // 직사광 생성
  filllight.position.x = 1; // 조명의 x 위치
  filllight.position.y = -2; // 조명의 y 위치
  scene.add(filllight);

    // Ambient Light (주변광)
    const ambientLight = new THREE.AmbientLight(0x404040); // 조명 색상
    scene.add(ambientLight);
  
    // Hemispheric Light (반구광)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1); // 하늘색, 땅색, 강도
    scene.add(hemiLight);
    
  function animate() { // 렌더링 루프 함수
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

const loader = new OBJLoader();
loader.load("./assets/obj/Cottage_FREE.obj", (obj) => init(obj.children[0].geometry) ); // obj 파일 불러오기

// 창 크기에 따른 사이즈 설정
function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);