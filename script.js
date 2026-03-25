gsap.registerPlugin(ScrollTrigger);

/* =====================
   BASIC SETUP
===================== */

const scene = new THREE.Scene();

/* 🌫️ Fog (depth + atmosphere) */
scene.fog = new THREE.Fog(0x000000, 5, 30);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 1.5, 8);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("scene"),
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

/* =====================
   LIGHTING (SOFT CINEMATIC)
===================== */

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 10, 5);
scene.add(light);

scene.add(new THREE.AmbientLight(0x222222));

/* =====================
   FLOOR
===================== */

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x111111 })
);

floor.rotation.x = -Math.PI / 2;
scene.add(floor);

/* =====================
   CLOUDS (3D PARTICLES)
===================== */

const cloudGeometry = new THREE.BufferGeometry();
const cloudCount = 1000;

const positions = new Float32Array(cloudCount * 3);

for (let i = 0; i < cloudCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 1] = Math.random() * 5 + 2;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
}

cloudGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const cloudMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.1,
  transparent: true,
  opacity: 0.5
});

const clouds = new THREE.Points(cloudGeometry, cloudMaterial);
scene.add(clouds);

/* =====================
   DOOR (CENTER OBJECT)
===================== */

const doorGroup = new THREE.Group();

const doorMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  metalness: 0.5,
  roughness: 0.3
});

const leftDoor = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 0.1),
  doorMaterial
);

const rightDoor = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 0.1),
  doorMaterial
);

leftDoor.position.x = -0.5;
rightDoor.position.x = 0.5;

doorGroup.add(leftDoor);
doorGroup.add(rightDoor);

doorGroup.position.set(0, 1, -10);

scene.add(doorGroup);

/* =====================
   SCROLL ANIMATION (WORLD TRAVEL)
===================== */

gsap.to(camera.position, {
  z: 2,
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

/* Clouds move */
gsap.to(clouds.rotation, {
  y: 2,
  scrollTrigger: {
    trigger: "body",
    scrub: true
  }
});

/* Door moves closer */
gsap.to(doorGroup.position, {
  z: -2,
  scrollTrigger: {
    trigger: "body",
    start: "top center",
    end: "center center",
    scrub: true
  }
});

/* Door opens */
gsap.to(leftDoor.rotation, {
  y: -1.5,
  scrollTrigger: {
    trigger: "body",
    start: "center center",
    end: "bottom center",
    scrub: true
  }
});

gsap.to(rightDoor.rotation, {
  y: 1.5,
  scrollTrigger: {
    trigger: "body",
    start: "center center",
    end: "bottom center",
    scrub: true
  }
});

/* =====================
   ANIMATION LOOP
===================== */

function animate() {
  requestAnimationFrame(animate);

  clouds.rotation.y += 0.0005;

  renderer.render(scene, camera);
}

animate();

/* =====================
   RESIZE
===================== */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
