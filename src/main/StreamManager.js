import AbstractStreamManager from './AbstractStreamManager';

class StreamManager extends AbstractStreamManager {

	get isDisplayEnabled() {
		return this.isEnabled(this.streamKeys.display);
	}

	get isCameraEnabled() {
		return this.isEnabled(this.streamKeys.camera);
	}

	get isMicrophoneEnabled() {
		return this.isEnabled(this.streamKeys.microphone);
	}

}

export default StreamManager;
