import { EventModel } from 'react-event-base/Core';
import { getStream } from './MediaDevice';
import Events from './VolumeDetectorEvents';

class VolumeDetector extends EventModel {
  constructor(data) {
    super(data);
    this.volumeThreshold = this.volumeThreshold || 2;
    this.isStart = false;
    this.audioContext = null;
    this.mediaStreamSource = null;
    this.processor = null;
    this.analyser = null;
  }

  setStream(stream) {
    this.stream = stream;
    this.trigger(Events.StreamChanged, [this.stream]);
  }

  setVolumeThreshold(volumeThreshold) {
    this.volumeThreshold = volumeThreshold;
    this.trigger(Events.ThresholdChanged, [this.volumeThreshold]);
  }

  async getMicStream() {
    return this.stream || await getStream({
      audio: true
    });
  }

  clearAudioContext() {
    this.audioContext = null;
    this.mediaStreamSource = null;
    this.processor = null;
    this.analyser = null;
  }

  volumeAudioProcess(event) {
    let values = 0;
    if(!this.analyser){
    return;
    }
    const array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(array);
    const length = array.length;
    for (let i = 0; i < length; i++) {
      values += (array[i]);
    }
    const average = values / length;
    if(average >= this.volumeThreshold) {
      this.trigger(Events.Detect, [average]);
    } else {
      this.trigger(Events.Ignore, [average]);
    }
  }

  async start() {
    if(this.isStart) return;
    if(this.stream && this.stream.getAudioTracks().length === 0) return;
    this.isStart = true;
    const volumeDetectorV2 = this;
    const micStream = await volumeDetectorV2.getMicStream();
    volumeDetectorV2.audioContext = new AudioContext();
    volumeDetectorV2.mediaStreamSource = volumeDetectorV2.audioContext.createMediaStreamSource(micStream);
    volumeDetectorV2.analyser = volumeDetectorV2.audioContext.createAnalyser();
    volumeDetectorV2.processor = volumeDetectorV2.audioContext.createScriptProcessor(2048, 1, 1);
    volumeDetectorV2.analyser.smoothingTimeConstant = 0.8;
    volumeDetectorV2.analyser.fftSize = 1024;
    volumeDetectorV2.mediaStreamSource.connect(volumeDetectorV2.analyser);
    volumeDetectorV2.analyser.connect(volumeDetectorV2.processor);
    volumeDetectorV2.processor.connect(volumeDetectorV2.audioContext.destination);
    volumeDetectorV2.processor.onaudioprocess = function(e) {
      volumeDetectorV2.volumeAudioProcess(e);
    };
    this.trigger(Events.Start);
  }

  stop() {
    if(!this.isStart) return;
    this.isStart = false;
    try {
      this.mediaStreamSource.disconnect(this.analyser);
      this.analyser.disconnect(this.processor);
      this.processor.disconnect(this.audioContext.destination);
      this.clearAudioContext();
    } catch(err) {
      console.log(err);
    } finally {
      this.trigger(Events.Stop);
    }
  }
}

export default VolumeDetector;
