export function getStream(constraints) {
    return navigator.mediaDevices.getUserMedia(constraints);
};
export default {
	getStream,
};
