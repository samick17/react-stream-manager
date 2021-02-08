window.onload = () => {
	const button = document.createElement('button');
	button.innerText = 'Play';
	document.body.append(button);
	const audioSrc = 'Beethoven_Moonlight_3rd_movement.ogg';

	function reqArrayBuffer(url) {
		return new Promise((resolve) => {
			const xhr = new XMLHttpRequest();
			xhr.responseType = 'arraybuffer';
			xhr.onload = () => {
				resolve(xhr.response);
			};
			xhr.open('GET', url, true);
			xhr.send();
		});
	}
	const volDetector = new stream.VolumeDetector();
	let unbindVolDetectorEvents;

	function createVisualizer() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		document.body.append(canvas);
		let array = [];
		const color = {
			r: 190,
			g: 64,
			b: 150
		};
		let isStart = false;
		function render(t) {
			ctx.globalCompositeOperation = 'xor';
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			let x = 0;
			let step = canvas.width / array.length;
			for(let i = 0; i < array.length - 20; i++) {
				let v = array[i];
				let rate = v / 100;
				ctx.strokeStyle = `rgba(${color.r * rate}, ${color.g}, ${100 + color.b * rate}, .5)`;
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(x, canvas.height);
				ctx.lineTo(x, rate * canvas.height);
				ctx.stroke();
				ctx.closePath();
				ctx.restore();
				x += step;
			}
			if(isStart) {
				requestAnimationFrame(render);
			}
		}
		return {
			start: () => {
				isStart = true;
				requestAnimationFrame(render);
			},
			update: (data) => {
				array = data;
			},
		};
	}
	const visualizer = createVisualizer();

	button.addEventListener('click', async () => {
		if(unbindVolDetectorEvents) {
			unbindVolDetectorEvents();
			unbindVolDetectorEvents = null;
		}
		if(volDetector.isStart) {
			button.innerText = 'Play';
			volDetector.stop();
			visualizer.stop();
		} else {
			button.innerText = 'Stop';
			const arrayBuffer = await reqArrayBuffer(audioSrc);
			volDetector.startFromArrayBuffer(arrayBuffer);
			unbindVolDetectorEvents = volDetector.on({
				[stream.VolumeDetectorEvents.Start]: () => {
					// console.log('Start');
				},
				[stream.VolumeDetectorEvents.Detect]: (average) => {
					// console.log(average);
				},
				[stream.VolumeDetectorEvents.Process]: (array) => {
					visualizer.update(array);
				},
			});
			visualizer.start();
			console.log(volDetector);
		}
	});
	
};
