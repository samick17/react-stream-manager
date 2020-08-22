# react-stream-manager

> The StreamManager for React Web Application

[![NPM](https://img.shields.io/npm/v/reacted.svg)](https://www.npmjs.com/package/reacted) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Support the project

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/samick17)
[![Donate](https://img.shields.io/badge/Donate-BuyMeCoffee-Blue.svg)](https://www.buymeacoffee.com/samick)

## Install

```bash
npm install --save react-stream-manager
```

## Import module

## Import specified module

```js
import { StreamManager } from 'react-stream-manager';
```

## Examples

```js
import { StreamManager } from 'react-stream-manager';

const streamManager = new StreamManager({
	streamKeys: {
		display: 'd',
		camera: 'c',
		microphone: 'm'
	},
	startFns: {
		display: {
			fn: async () => {
				// TODO get the display media stream
			},
			args: [],
		},
		camera: {
			fn: async () => {
				// TODO get the camera media stream
			},
			args: [],
		},
		microphone: {
			fn: async () => {
				// TODO get the microphone stream
			},
			args: [],
		}
	}
});
```

## Docs

 - [StreamManager](./docs/StreamManager.md)

## License

MIT © [samick17](https://github.com/samick17)
