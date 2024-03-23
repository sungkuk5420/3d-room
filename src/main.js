import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGL1Renderer({
  canvas: canvas,
  antialias: true
});

renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
//Scene
const scene = new THREE.Scene();
scene.background =new THREE.Color('white');

//Camera
const camera = new THREE.PerspectiveCamera(
  60, // fov 촬영되는 범위의 수직 각도로서 얼마나 많은 장면이 카메라에 의해 보여질지를 결정합니다. 일반적으로 35도에서 75도의 값을 가진다.
  window.innerWidth / window.innerHeight,// aspect 가로 세로 비율 , 대부분의 경우에 렌더링될 화면의 너비를 높이로 나눈 값이 된다.
  0.1,// near 
  1000// far
)

camera.position.x = -3;
camera.position.y = 3;
camera.position.z = 7;
scene.add(camera)

const controls = new OrbitControls( camera, renderer.domElement );

//light
// AmbientLight 주로 다른 광원과 함께 사용해서 , 전체 Scene의 기본 밝기를 설정하는데에 사용한다. 그림자가 생성하지안흔다.
// DirectionalLight 무한히 멀리 있는것처럼 느껴지는 광원으로, 태양빛과 비슷하다.
// PointLight 광원 주변의 객체에 영향을 미치고 그림자를 만들수 있다.
// spotLight는 원뿔 모양의 빛이에요 뮤지컬 무대에서 주인공에게 비추는 조명과 비슷합니다.

const ambientLight = new THREE.AmbientLight('white',1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white',3);
directionalLight.position.set(-3, 5, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);


//Mesh

const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry( 2, 2, 2 ), // 모양인 geometry
  // new THREE.MeshBasicMaterial( {color: 'firebrick'} ) // 재질인 material로 구성되어있다
  new THREE.MeshLambertMaterial( {
    color: 'firebrick',
    side: THREE.DoubleSide
  } ) // 재질인 material로 구성되어있다
)

boxMesh.position.y = 1;
boxMesh.castShadow = true;


scene.add(boxMesh);

const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  // new THREE.MeshBasicMaterial({color: '#092e66'})
  new THREE.MeshLambertMaterial({
    color: '#092e66',
    side: THREE.DoubleSide
  }),
)

groundMesh.rotation.x = THREE.MathUtils.degToRad(-90);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

camera.lookAt(boxMesh.position)

//Draw
const clock = new THREE.Clock();
function draw(){
  const delta = clock.getDelta();
  boxMesh.position.y += delta;
  if(boxMesh.position.y >5 ){
    boxMesh.position.y = 1;
  }
  controls.update();
  renderer.render(scene, camera)
  renderer.setAnimationLoop(draw);
}

draw()

function setLayout(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
}

//Evnets
window.addEventListener('resize',setLayout)

