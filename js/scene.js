//Run the whole thing only on WebGL capable browsers
if (WebGLEnabled)
{
	//Debug vars
	//var stats, renderStats;
	
	var scene, camera, renderer;
	var cameraPosition, cameraAngle;
	
	var vesperiaStarMaterial, vesperiaRingMaterial;
	
	var loadedAssets;
	
	var clock = new THREE.Clock();
	
	init();
}
else
{
	finishLoading();
}

function init()
{
	loadedAssets = 0;
	
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
	cameraPosition = { z: 100 };
	camera.position =  new THREE.Vector3(0, 0, cameraPosition.z);
	cameraAngle = { angle: 0 };
	rotateCamera(cameraAngle.angle);
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x02060d, 1);
	document.body.appendChild(renderer.domElement);
	
	THREEx.WindowResize(renderer, camera);

	//Debug stuff -----------------------------------------------------------------
	/*
	stats = new Stats();
	document.body.appendChild(stats.domElement);
	
	rendererStats = new THREEx.RendererStats();
	rendererStats.domElement.style.position = 'absolute';
	rendererStats.domElement.style.left = '0px';
	rendererStats.domElement.style.bottom = '0px';
	document.body.appendChild(rendererStats.domElement);
	*/
	
	//Sky sphere ------------------------------------------------------------------
	
	var loader = new THREE.JSONLoader();
	loader.load('content/models/skysphere.json', function (geometry)
	{
		finishedAssetLoading();
		
		var t = THREE.ImageUtils.loadTexture('content/models/skysphere.jpg', undefined, finishedAssetLoading);
		t.wrapS = t.wrapT = THREE.RepeatWrapping;
		t.repeat.set(3, 2);
		
		var material = new THREE.MeshBasicMaterial(
		{
			map: t
		});
		
		var skyMesh = new THREE.Mesh(geometry, material);
		scene.add(skyMesh);
	});
	
	//Particles -------------------------------------------------------------------
	
	var particleCount = 50000, particleRange = 500;
    var particles = new THREE.Geometry();
	
	//Shader material for the particles -------------------------------------------
	
	StarShader.uniforms.texture.value = THREE.ImageUtils.loadTexture('content/star.png', undefined, finishedAssetLoading);
	
	var pMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: StarShader.uniforms,
		attributes: StarShader.attributes,
		vertexShader: StarShader.vertexShader,
		fragmentShader: StarShader.fragmentShader,
		transparent: true,
		depthTest: false,
		blending: THREE.AdditiveBlending
	});
	
	//Particle spawn at random around X and Y axis, and from back to front --------
	//around Z axis. To deal with drawing order and shit. -------------------------
	for (var p = 0; p < particleCount; p++)
	{
		var pX = (Math.random() * particleRange) - (particleRange * 0.5);
		var pY = (Math.random() * particleRange) - (particleRange * 0.5);
		var pZ = ((p * particleRange) / particleCount) - (particleRange * 0.5);
		var particle = new THREE.Vector3(pX, pY, pZ);
		
		particles.vertices.push(particle);
		
		var pColor = new THREE.Color();
		pColor.setHSL(Math.random(), 0.5 * Math.random(), 1.25 * Math.random() + 0.4);
		StarShader.attributes.color.value[p] = pColor;
		StarShader.attributes.frequency.value[p] = 2.0 * Math.random() + 0.5;
	}
	
	// Create the particle system
	var particleSystem = new THREE.PointCloud(particles, pMaterial);
	//particleSystem.sortParticles = true;
	
	//Disable frustum culling since it affects the whole mesh instead of
	//each particle individually, so it doesn't have any effect anyway.
	particleSystem.frustumCulled = false;
	
	// add it to the scene
	scene.add(particleSystem);
	
	//Vesperia glow sprite --------------------------------------------------------
	
	var vesperiaTexture = THREE.ImageUtils.loadTexture('content/vesperia-glow.jpg', undefined, finishedAssetLoading);
	var vesperiaMaterial = new THREE.SpriteMaterial(
	{
		map: vesperiaTexture,
		color: 0xcc8844,
		useScreenCoordinates: false,
		depthTest: false,
		transparent: true,
		blending: THREE.AdditiveBlending
	});
	var vesperiaSprite = new THREE.Sprite(vesperiaMaterial);
	vesperiaSprite.position.set(0, 0, 0);
	//Width, Height, Depth? For a sprite? Let's leave it at one or the world could be destroyed.
	vesperiaSprite.scale.set(400, 400, 1);
	scene.add(vesperiaSprite);
	
	//Vesperia star sprite ------------------------------------------------------
	
	var vesperiaStarTexture = THREE.ImageUtils.loadTexture('content/vesperia-star.png', undefined, finishedAssetLoading);
	vesperiaStarMaterial = new THREE.SpriteMaterial(
	{
		map: vesperiaStarTexture,
		color: 0xffffff,
		useScreenCoordinates: false,
		depthTest: false,
		transparent: true,
		blending: THREE.AdditiveBlending
	});
	var vesperiaStarSprite = new THREE.Sprite(vesperiaStarMaterial);
	vesperiaStarSprite.position.set(0, 0, 0);
	//Width, Height, Depth? For a sprite? Let's leave it at one or the world could be destroyed.
	vesperiaStarSprite.scale.set(128, 128, 1);
	scene.add(vesperiaStarSprite);
	
	//Vesperia ring sprite ------------------------------------------------------
	
	var vesperiaRingTexture = THREE.ImageUtils.loadTexture('content/vesperia-ring.png', undefined, finishedAssetLoading);
	vesperiaRingMaterial = new THREE.SpriteMaterial(
	{
		map: vesperiaRingTexture,
		color: 0xffffff,
		useScreenCoordinates: false,
		depthTest: false,
		transparent: true,
		blending: THREE.AdditiveBlending
	});
	var vesperiaRingSprite = new THREE.Sprite(vesperiaRingMaterial);
	vesperiaRingSprite.position.set(0, 0, 0);
	//Width, Height, Depth? For a sprite? Let's leave it at one or the world could be destroyed.
	vesperiaRingSprite.scale.set(96, 96, 1);
	scene.add(vesperiaRingSprite);
}

function animate()
{
	requestAnimationFrame(animate);
	update();
	render();
}

function update()
{	
	var delta = clock.getDelta();
	var eTime = clock.getElapsedTime();
	StarShader.uniforms.time.value = eTime;
	//particleSystem.rotation.y -= 0.05 * delta;
	//camera.position.z -= 2 * delta;
	
	vesperiaStarMaterial.rotation += 0.1 * delta;
	vesperiaRingMaterial.rotation -= 0.1 * delta;
	
	//if(typeof skyMesh !== "undefined") skyMesh.rotation.y -= 0.05 * delta;
	
	//rotateCamera(eTime * 0.01);
	//rotateCamera(cameraAngle);
	
	TWEEN.update();
	
	//Debug
	//stats.update();
	//rendererStats.update(renderer);
}

function render()
{
	renderer.render(scene, camera);
}

//Other functions ---------------------------------------------------------------

function initialZoomOut()
{
	var tween = new TWEEN.Tween(cameraPosition).to({z: 200}, 2000);
	tween.easing(TWEEN.Easing.Cubic.InOut);
	tween.onUpdate(function()
	{
		camera.position.z = cameraPosition.z;
	});
	tween.start();
}

function changeCameraAngle(ang)
{
	var tween = new TWEEN.Tween(cameraAngle).to({angle: ang}, 2000);
	tween.easing(TWEEN.Easing.Cubic.InOut);
	tween.onUpdate(function()
	{
		rotateCamera(cameraAngle.angle);
	});
	tween.start();
}

function rotateCamera(angle)
{
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	
	camera.position.x = -cameraPosition.z * s;
	camera.position.z = +cameraPosition.z * c;
	
	camera.lookAt(new THREE.Vector3(0,0,0));
}

function finishedAssetLoading()
{
	loadedAssets++;
	
	if(loadedAssets == 5)
	{
		finishLoading();
		animate();
	}
}