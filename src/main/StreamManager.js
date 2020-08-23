import AbstractStreamManager from './AbstractStreamManager';

class StreamManager extends AbstractStreamManager {

	get isDisplayAvailable() {
		return this.isAvailable(this.streamKeys.display);
	}

	get isCameraAvailable() {
		return this.isAvailable(this.streamKeys.camera);
	}

	get isMicrophoneAvailable() {
		return this.isAvailable(this.streamKeys.microphone);
	}

}

export default StreamManager;
