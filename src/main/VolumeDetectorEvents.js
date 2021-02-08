import EventUtils from 'react-event-base/EventUtils';

export default EventUtils.createEventTypes([
  'Detect',
  'Ignore',
  'ThresholdChanged',
  'StreamChanged',
  'Start',
  'Stop',
  'Process',
]);
