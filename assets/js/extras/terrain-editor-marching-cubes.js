function getLight(...pos) {
	const color = 0xFFFFFF;
	const intensity = 1;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(...pos);
	return light;
}

function getCube(geometry) {
	const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
	return new THREE.Mesh(geometry, material);
}

function correctDisplaySize() {
	// update camera's projection aspect ratio
	if (isFullScreen) {
		const pixelRatio = window.devicePixelRatio;
		renderer.setSize(canvas.clientWidth * pixelRatio, canvas.clientHeight * pixelRatio, false);
	} else {
		renderer.setSize(740, 500, false);
	}
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();
}

function render() {
	if (updateDisplay) {
	}

	renderer.render(scene, camera);
	// requestAnimationFrame(render);
};

// ---- utils end -------

let cv = document.getElementById("canvas");
let isFullScreen = false;

document.getElementById("toggle-fs").addEventListener("click", (event) => {
	canvas.classList.toggle("fullscreen");
	event.currentTarget.classList.toggle("tfs");
	isFullScreen = !isFullScreen;

	correctDisplaySize();
	render();
});

window.addEventListener('resize', () => {
	if (isFullScreen) {
		correctDisplaySize();
		render();
	}
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, cv.clientWidth / cv.clientHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas: cv });

const geometry = new THREE.BoxGeometry();

let cube = getCube(geometry);
scene.add(cube);
scene.add(getLight(-1, 2, 10));

scene.background = new THREE.Color("#3a3a3a");
camera.position.z = 5;

controls = new THREE.OrbitControls(camera, canvas);
controls.listenToKeyEvents(window);
controls.addEventListener('change', render);

render();
