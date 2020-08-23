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
		this.cleanupBeforeStart = data.cleanupBeforeStart || false;
		this.cleanupAfterStop = data.cleanupAfterStop || false;
	}

	isAvailable(controlId) {
		return !!this.subStreams[controlId];
	}

	async start(controlId, args) {
		if(controlId in this.subStreams) return;
		if(this.cleanupBeforeStart) {
			this.cleanup();
		}
		try {
			this.subStreams[controlId] = 'pending';
			const params = this.startFns[controlId];
			const fn = params.fn;
			args = args || params.args;
			const stream = await fn.apply(null, [args]);
			this.subStreams[controlId] = stream;
		} catch(err) {
			delete this.subStreams[controlId];
			throw err;
		}
	}

	stop(controlId) {
		if(controlId in this.subStreams) {
			try {
				const activeStream = this.subStreams[controlId];
				activeStream.getTracks().forEach(track => {
					track.stop();
					activeStream.removeTrack(track);
				});
				delete this.subStreams[controlId];
			} catch(err) {
				if(this.cleanupAfterStop) {
					this.cleanup();
				}
			}
		}
	}

	enable(controlId) {
		if(controlId in this.subStreams) {
			try {
				const activeStream = this.subStreams[controlId];
				activeStream.getTracks().forEach(track => {
					track.enabled = true;
				});
			} catch(err) {
				console.log(err);
			}
		}
	}

	isEnabled(controlId) {
		if(controlId in this.subStreams) {
			try {
				const activeStream = this.subStreams[controlId];
				let isAllEnabled = true;
				activeStream.getTracks().forEach(track => {
					isAllEnabled &= track.enabled;
				});
				return isAllEnabled;
			} catch(err) {
				console.log(err);
				return false;
			}
		} else {
			return false;
		}
	}

	disable(controlId) {
		if(controlId in this.subStreams) {
			try {
				const activeStream = this.subStreams[controlId];
				activeStream.getTracks().forEach(track => {
					track.enabled = false;
				});
			} catch(err) {
				console.log(err);
			}
		}
	}

	isDisabled(controlId) {
		if(controlId in this.subStreams) {
			try {
				const activeStream = this.subStreams[controlId];
				let isAllDisabled = true;
				activeStream.getTracks().forEach(track => {
					isAllDisabled &= !track.enabled;
				});
				return isAllDisabled;
			} catch(err) {
				console.log(err);
				return false;
			}
		} else {
			return false;
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
