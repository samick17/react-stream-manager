class AbstractStreamManager {

	setStreamKeys(streamKeys) {
		this.streamKeys = streamKeys;
	}
	setStartFunctions(startFns) {
		this.startFns = startFns;
	}

	constructor(data={}) {
		this.mediaStreams = {};
		this.subStreams = {};
		this.streamKeys = data.streamKeys || {};
		this.startFns = data.startFns || {};
	}

	isEnabled(controlId) {
		return !!this.subStreams[controlId];
	}

	async start(controlId) {
		if(controlId in this.subStreams) return;
		try {
			this.subStreams[controlId] = 'pending';
			const {fn, args} = this.startFns[controlId];
			const stream = await fn.apply(null, [args]);
			this.subStreams[controlId] = stream;
		} catch(err) {
			delete this.subStreams[controlId];
			throw err;
		}
	}

	stop(controlId) {
		if(controlId in this.subStreams) {
			const activeStream = this.subStreams[controlId];
			activeStream.getTracks().forEach(track => {
				track.stop();
				activeStream.removeTrack(track);
			});
			delete this.subStreams[controlId];
			this.cleanup();
		}
	}

	cleanup() {
		for(let key in this.mediaStreams) {
			let mediaStream = this.mediaStreams[key];
			mediaStream.getTracks().forEach(track => {
				if(track.readyState === 'ended') {
					mediaStream.removeTrack(track);
				}
			});
			if(!mediaStream.active || mediaStream.getTracks().length === 0) {
				delete this.mediaStreams[key];
			}
		}
	}

	composeAs(keys, mediaStreamKey) {
		let activeStream = this.mediaStreams[mediaStreamKey];
		if(!activeStream) {
			activeStream = new MediaStream();
			this.mediaStreams[mediaStreamKey] = activeStream;
		}
		for(let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if(key in this.subStreams) {
				let srcStream = this.subStreams[key];
				srcStream.getTracks().forEach(track => activeStream.addTrack(track));
			}
		}
		return activeStream;
	}

}

export default AbstractStreamManager;
