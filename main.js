import {loadGLTF, loadAudio} from './libs/loader.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", ()=> {
	
	const start = async () => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './abc.mind',
			maxTrack: 3,
		});
		
		const {renderer, scene, camera} = mindarThree;
		const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		scene.add( light );
		
		const airplane = await loadGLTF('./airplane/scene.gltf');
		airplane.scene.scale.set(0.5, 0.5, 0.5);
		
		const airplaneMixer = new THREE.AnimationMixer(airplane.scene);
		const airplaneAction = airplaneMixer.clipAction(airplane.animations[0]);
		airplaneAction.play();
		
		// we are loading the audio clip from the hard disk using loadAudio		
		const airplaneClip = await loadAudio("./sound/airplane.mp3");
		// we are going to add a speaker 
		const airplaneListener = new THREE.AudioListener();
		// we are adding the positional property to this speaker
		const airplaneAudio = new THREE.PositionalAudio(airplaneListener);
		
		const ball = await loadGLTF('./ball/scene.gltf');		
		ball.scene.scale.set(0.5, 0.5, 0.5);
		
		const ballMixer = new THREE.AnimationMixer(ball.scene);
		const ballAction = ballMixer.clipAction(ball.animations[0]);
		ballAction.play();
		
		const ballClip = await loadAudio("./sound/ball.mp3");
		const ballListener = new THREE.AudioListener();
		const ballAudio = new THREE.PositionalAudio(ballListener);
		
		const car = await loadGLTF('./car/scene.gltf');		
		car.scene.scale.set(0.5, 0.5, 0.5);
		
		const carMixer = new THREE.AnimationMixer(car.scene);
		const carAction = carMixer.clipAction(car.animations[0]);
		carAction.play();
		
		const carClip = await loadAudio("./sound/car.mp3");
		const carListener = new THREE.AudioListener();
		const carAudio = new THREE.PositionalAudio(carListener);
		
		const airplaneAnchor = mindarThree.addAnchor(0);
		airplaneAnchor.group.add(airplane.scene);
		// to make the audio sound louder when it is zoomed in
		camera.add(airplaneListener)
		// we set the referal distance to fade the audio when it is moved out
		airplaneAudio.setRefDistance(100);
		// add buffer the audio
		airplaneAudio.setBuffer(airplaneClip);
		// set the audio property loop
		airplaneAudio.setLoop(true);
		// add it to our airplane anchor 
		airplaneAnchor.group.add(airplaneAudio);
		
		airplaneAnchor.onTargetFound = () => {
			airplaneAudio.play();
		}
		
		airplaneAnchor.onTargetLost = () => {
			airplaneAudio.pause();
		}
		
		const ballAnchor = mindarThree.addAnchor(1);
		ballAnchor.group.add(ball.scene);
		camera.add(ballListener);
		ballAudio.setRefDistance(100);
		ballAudio.setBuffer(ballClip);
		ballAudio.setLoop(true);
		ballAnchor.group.add(ballAudio);
		
		ballAnchor.onTargetFound = () => {
			ballAudio.play();
		}
		
		ballAnchor.onTargetLost = () => {
			ballAudio.pause();
		}
		
		const carAnchor = mindarThree.addAnchor(2);
		carAnchor.group.add(car.scene);	
		camera.add(carListener);
		carAudio.setRefDistance(100);
		carAudio.setBuffer(carClip);
		carAudio.setLoop(true);
		carAnchor.group.add(carAudio);
		
		carAnchor.onTargetFound = () => {
			carAudio.play();
		}
		
		carAnchor.onTargetLost = () => {
			carAudio.pause();
		}
		
		const clock = new THREE.Clock;
		
		await mindarThree.start();
		
		renderer.setAnimationLoop(()=> {
			const delta = clock.getDelta();
			airplaneMixer.update(delta);
			ballMixer.update(delta);
			carMixer.update(delta);
			car.scene.rotation.set(0, car.scene.rotation.y + delta, 0);
			ball.scene.rotation.set(0, ball.scene.rotation.y + delta, 0);
			renderer.render(scene, camera);
		})
	};
	start();
});

