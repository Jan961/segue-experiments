import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;

Object.assign(global, { TextDecoder, TextEncoder });
window.ResizeObserver = require('resize-observer-polyfill');
