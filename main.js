import * as THREE from 'https://unpkg.com/three@0.162.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 8);
camera.lookAt(0, 0, 0);

// Create second camera
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);



// Add camera helper for the second camera
var cameraHelper = new THREE.CameraHelper(camera2);
scene.add(cameraHelper);

// Variable to keep track of the active camera
let activeCamera = camera2;

// Function to switch cameras
function switchCamera() {
    activeCamera = (activeCamera === camera2) ? camera : camera2;
    // camera.position.copy(camera2.position);
}

// Add button to switch cameras
const button = document.createElement('button');
button.innerText = 'Switch Camera';
button.style.position = 'absolute';
button.style.top = '10px';
button.style.left = '10px';
button.addEventListener('click', switchCamera);
document.body.appendChild(button);

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth damping effect

// Create plane (ground)
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// Create cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);



const jsonData = localStorage.getItem('pos_rot_data');

if (jsonData) {
    // Parse the JSON data
    const data = JSON.parse(jsonData);

    // Log the data to the console
    console.log("Data from localStorage:", data);
    scene.remove(cameraHelper);
    // Set camera position and rotation
    camera2.fov = data.camera.fov;
    camera2.position.set(data.camera.position.x, data.camera.position.y, data.camera.position.z);
    camera2.rotation.set(data.camera.rotation.x, data.camera.rotation.y, data.camera.rotation.z);
    var cameraHelper = new THREE.CameraHelper(camera2);
    scene.add(cameraHelper);
    cameraHelper.update();
    



    console.log(data.camera.fov);



    // Set cube position and rotation
    cube.position.set(data.cube.position.x, data.cube.position.y, data.cube.position.z);
    cube.rotation.set(data.cube.rotation.x, data.cube.rotation.y, data.cube.rotation.z);
    cube.scale.set(data.cube.scale.x, data.cube.scale.y, data.cube.scale.z);

    // Set plane position and rotation
    plane.position.set(data.plane.position.x, data.plane.position.y, data.plane.position.z);
    plane.rotation.set(data.plane.rotation.x, data.plane.rotation.y, data.plane.rotation.z);
} else {
    console.log("No data found in localStorage.");
}

// Animation function
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, activeCamera);
}

// Handle window resizing
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start animation
animate();