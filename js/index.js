import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { CopyShader } from "three/addons/shaders/CopyShader.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);
camera.lookAt(0, 1, 0);

// Create a renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

// Handle resizing
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const podium = new THREE.Group();
scene.add(podium);

// Handle parallax effect (rotate the podium based on the mouse position)
window.addEventListener("mousemove", (e) => {
    const x = e.clientX - window.innerWidth / 2;
    const y = e.clientY - window.innerHeight / 2;
    podium.rotation.y = x * 0.0005;
    podium.rotation.x = y * 0.0005;
});

// Load the GLTF models
loader.load("assets/models/pillar.glb", (gltf) => {
    const material1 = new THREE.MeshToonMaterial({ color: 0xd6d6d6 });
    const material2 = new THREE.MeshToonMaterial({ color: 0xffea00 });
    const material3 = new THREE.MeshToonMaterial({ color: 0xde9e00 });

    const pillar1 = gltf.scene;
    pillar1.scale.set(1.75, 1.75, 1.75);
    pillar1.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = material1;
        }
    });

    const pillar2 = gltf.scene.clone();
    pillar2.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = material2;
        }
    });

    const pillar3 = gltf.scene.clone();
    pillar3.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = material3;
        }
    });

    pillar1.position.set(-2, -4.75, 0);
    pillar2.position.set(0, -3.75, 0);
    pillar3.position.set(2, -5.25, 0);

    podium.add(pillar1);
    podium.add(pillar2);
    podium.add(pillar3);
});

loader.load("assets/models/1.glb", (gltf) => {
    const model1 = gltf.scene;
    model1.position.set(-2, 0.25, 0);
    model1.scale.set(0.5, 0.5, 0.5);
    podium.add(model1);
});

loader.load("assets/models/2.glb", (gltf) => {
    const model2 = gltf.scene;
    model2.position.set(0, 1, 0);
    model2.scale.set(0.5, 0.5, 0.5);
    podium.add(model2);
});

loader.load("assets/models/3.glb", (gltf) => {
    const model3 = gltf.scene;
    model3.position.set(2, -0.5, 0);
    model3.scale.set(0.5, 0.5, 0.5);
    podium.add(model3);
});

// AMBIENTLIGHT
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
ambientLight.name = "ambientLight";
ambientLight.intensity = 0.25;
scene.add(ambientLight);

// FRONTLIGHT
const frontLight = new THREE.SpotLight(0xffffff);
frontLight.name = "frontLight";
frontLight.angle = (Math.PI / 16) * 1.5;
frontLight.position.set(-2, 6, 5);
frontLight.intensity = 15;
frontLight.castShadow = true;
frontLight.target.position.set(0, 0.75, 0);
frontLight.target.updateMatrixWorld();
frontLight.distance = 10;
frontLight.decay = 1.5;
scene.add(frontLight);

// FRONTLIFHT2
const frontLight2 = new THREE.SpotLight(0xffffff);
frontLight2.name = "frontLight2";
frontLight2.angle = (Math.PI / 16) * 1.5;
frontLight2.position.set(5, 5, 3);
frontLight2.intensity = 7;
frontLight2.castShadow = true;
frontLight2.target.position.set(-1, 0, 0);
frontLight2.target.updateMatrixWorld();
frontLight2.distance = 15;
frontLight2.decay = 1.5;
scene.add(frontLight2);

// FRONTLIFHT3
const frontLight3 = new THREE.SpotLight(0xffffff);
frontLight3.name = "frontLight3";
frontLight3.angle = (Math.PI / 16) * 2.5;
frontLight3.position.set(3, 2, 3);
frontLight3.intensity = 2;
frontLight3.castShadow = true;
frontLight3.target.position.set(2, -0.75, 0);
frontLight3.target.updateMatrixWorld();
frontLight3.distance = 15;
frontLight3.decay = 1;
scene.add(frontLight3);

// BACKLIGHT
const backLight = new THREE.SpotLight(0xffffff);
backLight.name = "backLight";
backLight.angle = (Math.PI / 16) * 1.5;
backLight.position.set(0, -3, -5);
backLight.intensity = 15;
backLight.castShadow = true;
backLight.target.position.set(0, 3, 0);
backLight.target.updateMatrixWorld();
scene.add(backLight);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0;
bloomPass.strength = 0.5;
bloomPass.radius = 0;
composer.addPass(bloomPass);

const effectCopy = new ShaderPass(CopyShader);
effectCopy.renderToScreen = true;

composer.addPass(effectCopy);

const effectFilm = new FilmPass(0.35, 0.025, 648, false);
composer.addPass(effectFilm);

const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.edgeStrength = 3;
outlinePass.edgeGlow = 0;
outlinePass.edgeThickness = 1;
outlinePass.pulsePeriod = 0;
outlinePass.visibleEdgeColor.set("#ffffff");
outlinePass.hiddenEdgeColor.set("#000000");
composer.addPass(outlinePass);

const effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
effectFXAA.renderToScreen = true;
composer.addPass(effectFXAA);

function animate() {
    requestAnimationFrame(animate);
    composer.render();
}
animate();
