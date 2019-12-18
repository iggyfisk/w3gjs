/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer$1.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

/*
 * Export kMaxLength after typed array support is determined.
 */
var _kMaxLength = kMaxLength();

function kMaxLength () {
  return Buffer$1.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer$1.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer$1(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer$1 (arg, encodingOrOffset, length) {
  if (!Buffer$1.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer$1)) {
    return new Buffer$1(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer$1.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer$1._augment = function (arr) {
  arr.__proto__ = Buffer$1.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer$1.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer$1.TYPED_ARRAY_SUPPORT) {
  Buffer$1.prototype.__proto__ = Uint8Array.prototype;
  Buffer$1.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer$1.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer$1.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer$1.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer$1.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer$1.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer$1.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer$1.alloc(+length)
}
Buffer$1.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer$1.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer$1.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer$1.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer$1.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer$1.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer$1.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer$1.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer$1.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer$1.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer$1.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer$1.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer$1.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer$1.compare(this, b) === 0
};

Buffer$1.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer$1.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer$1.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer$1.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer$1.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer$1.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer$1.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer$1.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer$1.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer$1.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer$1.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer$1(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer$1.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer$1.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer$1.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer$1.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer$1.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer$1.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer$1.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer$1.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer$1.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer$1.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer$1.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer$1.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer$1.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer$1.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer$1.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer$1.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer$1.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer$1.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer$1.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer$1.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer$1.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer$1.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer$1.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer$1.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer$1.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer$1.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer$1.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer$1.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer$1.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer$1.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer$1.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer$1.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer$1.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer$1.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer$1.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer$1.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer$1.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer$1.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer$1.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer$1.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer$1.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer$1.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer$1(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

var bufferEs6 = /*#__PURE__*/Object.freeze({
    INSPECT_MAX_BYTES: INSPECT_MAX_BYTES,
    kMaxLength: _kMaxLength,
    Buffer: Buffer$1,
    SlowBuffer: SlowBuffer,
    isBuffer: isBuffer
});

/*
from https://github.com/substack/vm-browserify/blob/bfd7c5f59edec856dc7efe0b77a4f6b2fa20f226/index.js

MIT license no Copyright holder mentioned
*/


function Object_keys(obj) {
  if (Object.keys) return Object.keys(obj)
  else {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
  }
}

function forEach(xs, fn) {
  if (xs.forEach) return xs.forEach(fn)
  else
    for (var i = 0; i < xs.length; i++) {
      fn(xs[i], i, xs);
    }
}
var _defineProp;

function defineProp(obj, name, value) {
  if (typeof _defineProp !== 'function') {
    _defineProp = createDefineProp;
  }
  _defineProp(obj, name, value);
}

function createDefineProp() {
  try {
    Object.defineProperty({}, '_', {});
    return function(obj, name, value) {
      Object.defineProperty(obj, name, {
        writable: true,
        enumerable: false,
        configurable: true,
        value: value
      });
    };
  } catch (e) {
    return function(obj, name, value) {
      obj[name] = value;
    };
  }
}

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
  'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
  'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
  'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
  'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'
];

function Context() {}
Context.prototype = {};

function Script(code) {
  if (!(this instanceof Script)) return new Script(code);
  this.code = code;
}
function otherRunInContext(code, context) {
  var args = Object_keys(global$1);
  args.push('with (this.__ctx__){return eval(this.__code__)}');
  var fn = Function.apply(null, args);
  return fn.apply({
    __code__: code,
    __ctx__: context
  });
}
Script.prototype.runInContext = function(context) {
  if (!(context instanceof Context)) {
    throw new TypeError('needs a \'context\' argument.');
  }
  if (global$1.document) {
    var iframe = global$1.document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';

    global$1.document.body.appendChild(iframe);

    var win = iframe.contentWindow;
    var wEval = win.eval,
      wExecScript = win.execScript;

    if (!wEval && wExecScript) {
      // win.eval() magically appears when this is called in IE:
      wExecScript.call(win, 'null');
      wEval = win.eval;
    }

    forEach(Object_keys(context), function(key) {
      win[key] = context[key];
    });
    forEach(globals, function(key) {
      if (context[key]) {
        win[key] = context[key];
      }
    });

    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);

    forEach(Object_keys(win), function(key) {
      // Avoid copying circular objects like `top` and `window` by only
      // updating existing context properties or new properties in the `win`
      // that was only introduced after the eval.
      if (key in context || indexOf(winKeys, key) === -1) {
        context[key] = win[key];
      }
    });

    forEach(globals, function(key) {
      if (!(key in context)) {
        defineProp(context, key, win[key]);
      }
    });
    global$1.document.body.removeChild(iframe);

    return res;
  }
  return otherRunInContext(this.code, context);
};

Script.prototype.runInThisContext = function() {
  var fn = new Function('code', 'return eval(code);');
  return fn.call(global$1, this.code); // maybe...
};

Script.prototype.runInNewContext = function(context) {
  var ctx = createContext(context);
  var res = this.runInContext(ctx);
  if (context) {
    forEach(Object_keys(ctx), function(key) {
      context[key] = ctx[key];
    });
  }

  return res;
};


function createScript(code) {
  return new Script(code);
}

function createContext(context) {
  if (isContext(context)) {
    return context;
  }
  var copy = new Context();
  if (typeof context === 'object') {
    forEach(Object_keys(context), function(key) {
      copy[key] = context[key];
    });
  }
  return copy;
}
function runInContext(code, contextifiedSandbox, options) {
  var script = new Script(code, options);
  return script.runInContext(contextifiedSandbox, options);
}
function runInThisContext(code, options) {
  var script = new Script(code, options);
  return script.runInThisContext(options);
}
function isContext(context) {
  return context instanceof Context;
}
function runInNewContext(code, sandbox, options) {
  var script = new Script(code, options);
  return script.runInNewContext(sandbox, options);
}
var vm_1 = {
  runInContext: runInContext,
  isContext: isContext,
  createContext: createContext,
  createScript: createScript,
  Script: Script,
  runInThisContext: runInThisContext,
  runInNewContext: runInNewContext
};


/*
from indexOf
@ author tjholowaychuk
@ license MIT
*/
var _indexOf = [].indexOf;

function indexOf(arr, obj){
  if (_indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
}

var context = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
var Context = /** @class */ (function () {
    function Context() {
        this.code = '';
        this.scopes = [['vars']];
        this.bitFields = [];
        this.tmpVariableCount = 0;
        this.references = {};
    }
    Context.prototype.generateVariable = function (name) {
        var arr = [];
        var scopes = this.scopes[this.scopes.length - 1];
        arr.push.apply(arr, scopes);
        if (name) {
            arr.push(name);
        }
        return arr.join('.');
    };
    Context.prototype.generateOption = function (val) {
        switch (typeof val) {
            case 'number':
                return val.toString();
            case 'string':
                return this.generateVariable(val);
            case 'function':
                return "(" + val + ").call(" + this.generateVariable() + ", vars)";
        }
    };
    Context.prototype.generateError = function (err) {
        this.pushCode('throw new Error(' + err + ');');
    };
    Context.prototype.generateTmpVariable = function () {
        return '$tmp' + this.tmpVariableCount++;
    };
    Context.prototype.pushCode = function (code) {
        this.code += code + '\n';
    };
    Context.prototype.pushPath = function (name) {
        if (name) {
            this.scopes[this.scopes.length - 1].push(name);
        }
    };
    Context.prototype.popPath = function (name) {
        if (name) {
            this.scopes[this.scopes.length - 1].pop();
        }
    };
    Context.prototype.pushScope = function (name) {
        this.scopes.push([name]);
    };
    Context.prototype.popScope = function () {
        this.scopes.pop();
    };
    Context.prototype.addReference = function (alias) {
        if (this.references[alias])
            return;
        this.references[alias] = { resolved: false, requested: false };
    };
    Context.prototype.markResolved = function (alias) {
        this.references[alias].resolved = true;
    };
    Context.prototype.markRequested = function (aliasList) {
        var _this = this;
        aliasList.forEach(function (alias) {
            _this.references[alias].requested = true;
        });
    };
    Context.prototype.getUnresolvedReferences = function () {
        var references = this.references;
        return Object.keys(this.references).filter(function (alias) { return !references[alias].resolved && !references[alias].requested; });
    };
    return Context;
}());
exports.Context = Context;

});

unwrapExports(context);
var context_1 = context.Context;

var binary_parser = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



var aliasRegistry = {};
var FUNCTION_PREFIX = '___parser_';
var PRIMITIVE_SIZES = {
    uint8: 1,
    uint16le: 2,
    uint16be: 2,
    uint32le: 4,
    uint32be: 4,
    int8: 1,
    int16le: 2,
    int16be: 2,
    int32le: 4,
    int32be: 4,
    int64be: 8,
    int64le: 8,
    uint64be: 8,
    uint64le: 8,
    floatle: 4,
    floatbe: 4,
    doublele: 8,
    doublebe: 8,
};
var CAPITILIZED_TYPE_NAMES = {
    uint8: 'UInt8',
    uint16le: 'UInt16LE',
    uint16be: 'UInt16BE',
    uint32le: 'UInt32LE',
    uint32be: 'UInt32BE',
    int8: 'Int8',
    int16le: 'Int16LE',
    int16be: 'Int16BE',
    int32le: 'Int32LE',
    int32be: 'Int32BE',
    int64be: 'BigInt64BE',
    int64le: 'BigInt64LE',
    uint64be: 'BigUInt64BE',
    uint64le: 'BigUInt64LE',
    floatle: 'FloatLE',
    floatbe: 'FloatBE',
    doublele: 'DoubleLE',
    doublebe: 'DoubleBE',
    bit: 'Bit',
    string: 'String',
    buffer: 'Buffer',
    array: 'Array',
    choice: 'Choice',
    nest: 'Nest',
    skip: 'Skip',
    pointer: 'Pointer',
    '': '',
};
var Parser = /** @class */ (function () {
    function Parser() {
        this.varName = '';
        this.type = '';
        this.options = {};
        this.next = null;
        this.head = null;
        this.compiled = null;
        this.endian = 'be';
        this.constructorFn = null;
        this.alias = null;
    }
    Parser.start = function () {
        return new Parser();
    };
    Parser.prototype.primitiveGenerateN = function (type, ctx) {
        var typeName = CAPITILIZED_TYPE_NAMES[type];
        ctx.pushCode(ctx.generateVariable(this.varName) + " = buffer.read" + typeName + "(offset);");
        ctx.pushCode("offset += " + PRIMITIVE_SIZES[type] + ";");
    };
    Parser.prototype.primitiveN = function (type, varName, options) {
        return this.setNextParser(type, varName, options);
    };
    Parser.prototype.useThisEndian = function (type) {
        return (type + this.endian.toLowerCase());
    };
    Parser.prototype.uint8 = function (varName, options) {
        return this.primitiveN('uint8', varName, options);
    };
    Parser.prototype.uint16 = function (varName, options) {
        return this.primitiveN(this.useThisEndian('uint16'), varName, options);
    };
    Parser.prototype.uint16le = function (varName, options) {
        return this.primitiveN('uint16le', varName, options);
    };
    Parser.prototype.uint16be = function (varName, options) {
        return this.primitiveN('uint16be', varName, options);
    };
    Parser.prototype.uint32 = function (varName, options) {
        return this.primitiveN(this.useThisEndian('uint32'), varName, options);
    };
    Parser.prototype.uint32le = function (varName, options) {
        return this.primitiveN('uint32le', varName, options);
    };
    Parser.prototype.uint32be = function (varName, options) {
        return this.primitiveN('uint32be', varName, options);
    };
    Parser.prototype.int8 = function (varName, options) {
        return this.primitiveN('int8', varName, options);
    };
    Parser.prototype.int16 = function (varName, options) {
        return this.primitiveN(this.useThisEndian('int16'), varName, options);
    };
    Parser.prototype.int16le = function (varName, options) {
        return this.primitiveN('int16le', varName, options);
    };
    Parser.prototype.int16be = function (varName, options) {
        return this.primitiveN('int16be', varName, options);
    };
    Parser.prototype.int32 = function (varName, options) {
        return this.primitiveN(this.useThisEndian('int32'), varName, options);
    };
    Parser.prototype.int32le = function (varName, options) {
        return this.primitiveN('int32le', varName, options);
    };
    Parser.prototype.int32be = function (varName, options) {
        return this.primitiveN('int32be', varName, options);
    };
    Parser.prototype.bigIntVersionCheck = function () {
        var major = process.version.replace('v', '').split('.')[0];
        if (Number(major) < 12) {
            throw new Error("The methods readBigInt64BE, readBigInt64BE, readBigInt64BE, readBigInt64BE are not avilable in your version of nodejs: " + process.version + ", you must use v12 or greater");
        }
    };
    Parser.prototype.int64 = function (varName, options) {
        this.bigIntVersionCheck();
        return this.primitiveN(this.useThisEndian('int64'), varName, options);
    };
    Parser.prototype.int64be = function (varName, options) {
        this.bigIntVersionCheck();
        return this.primitiveN('int64be', varName, options);
    };
    Parser.prototype.int64le = function (varName, options) {
        this.bigIntVersionCheck();
        return this.primitiveN('int64le', varName, options);
    };
    Parser.prototype.uint64 = function (varName, options) {
        this.bigIntVersionCheck();
        return this.primitiveN(this.useThisEndian('uint64'), varName, options);
    };
    Parser.prototype.uint64be = function (varName, options) {
        this.bigIntVersionCheck();
        return this.primitiveN('uint64be', varName, options);
    };
    Parser.prototype.uint64le = function (varName, options) {
        this.bigIntVersionCheck();
        return this.primitiveN('uint64le', varName, options);
    };
    Parser.prototype.floatle = function (varName, options) {
        return this.primitiveN('floatle', varName, options);
    };
    Parser.prototype.floatbe = function (varName, options) {
        return this.primitiveN('floatbe', varName, options);
    };
    Parser.prototype.doublele = function (varName, options) {
        return this.primitiveN('doublele', varName, options);
    };
    Parser.prototype.doublebe = function (varName, options) {
        return this.primitiveN('doublebe', varName, options);
    };
    Parser.prototype.bitN = function (size, varName, options) {
        if (!options) {
            options = {};
        }
        options.length = size;
        return this.setNextParser('bit', varName, options);
    };
    Parser.prototype.bit1 = function (varName, options) {
        return this.bitN(1, varName, options);
    };
    Parser.prototype.bit2 = function (varName, options) {
        return this.bitN(2, varName, options);
    };
    Parser.prototype.bit3 = function (varName, options) {
        return this.bitN(3, varName, options);
    };
    Parser.prototype.bit4 = function (varName, options) {
        return this.bitN(4, varName, options);
    };
    Parser.prototype.bit5 = function (varName, options) {
        return this.bitN(5, varName, options);
    };
    Parser.prototype.bit6 = function (varName, options) {
        return this.bitN(6, varName, options);
    };
    Parser.prototype.bit7 = function (varName, options) {
        return this.bitN(7, varName, options);
    };
    Parser.prototype.bit8 = function (varName, options) {
        return this.bitN(8, varName, options);
    };
    Parser.prototype.bit9 = function (varName, options) {
        return this.bitN(9, varName, options);
    };
    Parser.prototype.bit10 = function (varName, options) {
        return this.bitN(10, varName, options);
    };
    Parser.prototype.bit11 = function (varName, options) {
        return this.bitN(11, varName, options);
    };
    Parser.prototype.bit12 = function (varName, options) {
        return this.bitN(12, varName, options);
    };
    Parser.prototype.bit13 = function (varName, options) {
        return this.bitN(13, varName, options);
    };
    Parser.prototype.bit14 = function (varName, options) {
        return this.bitN(14, varName, options);
    };
    Parser.prototype.bit15 = function (varName, options) {
        return this.bitN(15, varName, options);
    };
    Parser.prototype.bit16 = function (varName, options) {
        return this.bitN(16, varName, options);
    };
    Parser.prototype.bit17 = function (varName, options) {
        return this.bitN(17, varName, options);
    };
    Parser.prototype.bit18 = function (varName, options) {
        return this.bitN(18, varName, options);
    };
    Parser.prototype.bit19 = function (varName, options) {
        return this.bitN(19, varName, options);
    };
    Parser.prototype.bit20 = function (varName, options) {
        return this.bitN(20, varName, options);
    };
    Parser.prototype.bit21 = function (varName, options) {
        return this.bitN(21, varName, options);
    };
    Parser.prototype.bit22 = function (varName, options) {
        return this.bitN(22, varName, options);
    };
    Parser.prototype.bit23 = function (varName, options) {
        return this.bitN(23, varName, options);
    };
    Parser.prototype.bit24 = function (varName, options) {
        return this.bitN(24, varName, options);
    };
    Parser.prototype.bit25 = function (varName, options) {
        return this.bitN(25, varName, options);
    };
    Parser.prototype.bit26 = function (varName, options) {
        return this.bitN(26, varName, options);
    };
    Parser.prototype.bit27 = function (varName, options) {
        return this.bitN(27, varName, options);
    };
    Parser.prototype.bit28 = function (varName, options) {
        return this.bitN(28, varName, options);
    };
    Parser.prototype.bit29 = function (varName, options) {
        return this.bitN(29, varName, options);
    };
    Parser.prototype.bit30 = function (varName, options) {
        return this.bitN(30, varName, options);
    };
    Parser.prototype.bit31 = function (varName, options) {
        return this.bitN(31, varName, options);
    };
    Parser.prototype.bit32 = function (varName, options) {
        return this.bitN(32, varName, options);
    };
    Parser.prototype.namely = function (alias) {
        aliasRegistry[alias] = this;
        this.alias = alias;
        return this;
    };
    Parser.prototype.skip = function (length, options) {
        if (options && options.assert) {
            throw new Error('assert option on skip is not allowed.');
        }
        return this.setNextParser('skip', '', { length: length });
    };
    Parser.prototype.string = function (varName, options) {
        if (!options.zeroTerminated && !options.length && !options.greedy) {
            throw new Error('Neither length, zeroTerminated, nor greedy is defined for string.');
        }
        if ((options.zeroTerminated || options.length) && options.greedy) {
            throw new Error('greedy is mutually exclusive with length and zeroTerminated for string.');
        }
        if (options.stripNull && !(options.length || options.greedy)) {
            throw new Error('Length or greedy must be defined if stripNull is defined.');
        }
        options.encoding = options.encoding || 'utf8';
        return this.setNextParser('string', varName, options);
    };
    Parser.prototype.buffer = function (varName, options) {
        if (!options.length && !options.readUntil) {
            throw new Error('Length nor readUntil is defined in buffer parser');
        }
        return this.setNextParser('buffer', varName, options);
    };
    Parser.prototype.array = function (varName, options) {
        if (!options.readUntil && !options.length && !options.lengthInBytes) {
            throw new Error('Length option of array is not defined.');
        }
        if (!options.type) {
            throw new Error('Type option of array is not defined.');
        }
        if (typeof options.type === 'string' &&
            !aliasRegistry[options.type] &&
            Object.keys(PRIMITIVE_SIZES).indexOf(options.type) < 0) {
            throw new Error("Specified primitive type \"" + options.type + "\" is not supported.");
        }
        return this.setNextParser('array', varName, options);
    };
    Parser.prototype.choice = function (varName, options) {
        if (typeof options !== 'object' && typeof varName === 'object') {
            options = varName;
            varName = null;
        }
        if (!options.tag) {
            throw new Error('Tag option of array is not defined.');
        }
        if (!options.choices) {
            throw new Error('Choices option of array is not defined.');
        }
        Object.keys(options.choices).forEach(function (key) {
            if (isNaN(parseInt(key, 10))) {
                throw new Error('Key of choices must be a number.');
            }
            if (!options.choices[key]) {
                throw new Error("Choice Case " + key + " of " + varName + " is not valid.");
            }
            if (typeof options.choices[key] === 'string' &&
                !aliasRegistry[options.choices[key]] &&
                Object.keys(PRIMITIVE_SIZES).indexOf(options.choices[key]) < 0) {
                throw new Error("Specified primitive type \"" + options.choices[key] + "\" is not supported.");
            }
        });
        return this.setNextParser('choice', varName, options);
    };
    Parser.prototype.nest = function (varName, options) {
        if (typeof options !== 'object' && typeof varName === 'object') {
            options = varName;
            varName = null;
        }
        if (!options.type) {
            throw new Error('Type option of nest is not defined.');
        }
        if (!(options.type instanceof Parser) && !aliasRegistry[options.type]) {
            throw new Error('Type option of nest must be a Parser object.');
        }
        if (!(options.type instanceof Parser) && !varName) {
            throw new Error('options.type must be a object if variable name is omitted.');
        }
        return this.setNextParser('nest', varName, options);
    };
    Parser.prototype.pointer = function (varName, options) {
        if (!options.offset) {
            throw new Error('Offset option of pointer is not defined.');
        }
        if (!options.type) {
            throw new Error('Type option of pointer is not defined.');
        }
        else if (typeof options.type === 'string') {
            if (Object.keys(PRIMITIVE_SIZES).indexOf(options.type) < 0 &&
                !aliasRegistry[options.type]) {
                throw new Error('Specified type "' + options.type + '" is not supported.');
            }
        }
        else if (options.type instanceof Parser) ;
        else {
            throw new Error('Type option of pointer must be a string or a Parser object.');
        }
        return this.setNextParser('pointer', varName, options);
    };
    Parser.prototype.endianess = function (endianess) {
        switch (endianess.toLowerCase()) {
            case 'little':
                this.endian = 'le';
                break;
            case 'big':
                this.endian = 'be';
                break;
            default:
                throw new Error("Invalid endianess: " + endianess);
        }
        return this;
    };
    Parser.prototype.create = function (constructorFn) {
        if (!(constructorFn instanceof Function)) {
            throw new Error('Constructor must be a Function object.');
        }
        this.constructorFn = constructorFn;
        return this;
    };
    Parser.prototype.getCode = function () {
        var ctx = new context.Context();
        ctx.pushCode('if (!Buffer.isBuffer(buffer)) {');
        ctx.generateError('"argument buffer is not a Buffer object"');
        ctx.pushCode('}');
        if (!this.alias) {
            this.addRawCode(ctx);
        }
        else {
            this.addAliasedCode(ctx);
        }
        if (this.alias) {
            ctx.pushCode("return " + (FUNCTION_PREFIX + this.alias) + "(0).result;");
        }
        else {
            ctx.pushCode('return vars;');
        }
        return ctx.code;
    };
    Parser.prototype.addRawCode = function (ctx) {
        ctx.pushCode('var offset = 0;');
        if (this.constructorFn) {
            ctx.pushCode('var vars = new constructorFn();');
        }
        else {
            ctx.pushCode('var vars = {};');
        }
        this.generate(ctx);
        this.resolveReferences(ctx);
        ctx.pushCode('return vars;');
    };
    Parser.prototype.addAliasedCode = function (ctx) {
        ctx.pushCode("function " + (FUNCTION_PREFIX + this.alias) + "(offset) {");
        if (this.constructorFn) {
            ctx.pushCode('var vars = new constructorFn();');
        }
        else {
            ctx.pushCode('var vars = {};');
        }
        this.generate(ctx);
        ctx.markResolved(this.alias);
        this.resolveReferences(ctx);
        ctx.pushCode('return { offset: offset, result: vars };');
        ctx.pushCode('}');
        return ctx;
    };
    Parser.prototype.resolveReferences = function (ctx) {
        var references = ctx.getUnresolvedReferences();
        ctx.markRequested(references);
        references.forEach(function (alias) {
            var parser = aliasRegistry[alias];
            parser.addAliasedCode(ctx);
        });
    };
    Parser.prototype.compile = function () {
        var src = '(function(buffer, constructorFn) { ' + this.getCode() + ' })';
        this.compiled = vm_1.runInNewContext(src, { Buffer: bufferEs6.Buffer });
    };
    Parser.prototype.sizeOf = function () {
        var size = NaN;
        if (Object.keys(PRIMITIVE_SIZES).indexOf(this.type) >= 0) {
            size = PRIMITIVE_SIZES[this.type];
            // if this is a fixed length string
        }
        else if (this.type === 'string' &&
            typeof this.options.length === 'number') {
            size = this.options.length;
            // if this is a fixed length buffer
        }
        else if (this.type === 'buffer' &&
            typeof this.options.length === 'number') {
            size = this.options.length;
            // if this is a fixed length array
        }
        else if (this.type === 'array' &&
            typeof this.options.length === 'number') {
            var elementSize = NaN;
            if (typeof this.options.type === 'string') {
                elementSize = PRIMITIVE_SIZES[this.options.type];
            }
            else if (this.options.type instanceof Parser) {
                elementSize = this.options.type.sizeOf();
            }
            size = this.options.length * elementSize;
            // if this a skip
        }
        else if (this.type === 'skip') {
            size = this.options.length;
            // if this is a nested parser
        }
        else if (this.type === 'nest') {
            size = this.options.type.sizeOf();
        }
        else if (!this.type) {
            size = 0;
        }
        if (this.next) {
            size += this.next.sizeOf();
        }
        return size;
    };
    // Follow the parser chain till the root and start parsing from there
    Parser.prototype.parse = function (buffer) {
        if (!this.compiled) {
            this.compile();
        }
        return this.compiled(buffer, this.constructorFn);
    };
    Parser.prototype.setNextParser = function (type, varName, options) {
        var parser = new Parser();
        parser.type = type;
        parser.varName = varName;
        parser.options = options || parser.options;
        parser.endian = this.endian;
        if (this.head) {
            this.head.next = parser;
        }
        else {
            this.next = parser;
        }
        this.head = parser;
        return this;
    };
    // Call code generator for this parser
    Parser.prototype.generate = function (ctx) {
        if (this.type) {
            switch (this.type) {
                case 'uint8':
                case 'uint16le':
                case 'uint16be':
                case 'uint32le':
                case 'uint32be':
                case 'int8':
                case 'int16le':
                case 'int16be':
                case 'int32le':
                case 'int32be':
                case 'int64be':
                case 'int64le':
                case 'uint64be':
                case 'uint64le':
                case 'floatle':
                case 'floatbe':
                case 'doublele':
                case 'doublebe':
                    this.primitiveGenerateN(this.type, ctx);
                    break;
                case 'bit':
                    this.generateBit(ctx);
                    break;
                case 'string':
                    this.generateString(ctx);
                    break;
                case 'buffer':
                    this.generateBuffer(ctx);
                    break;
                case 'skip':
                    this.generateSkip(ctx);
                    break;
                case 'nest':
                    this.generateNest(ctx);
                    break;
                case 'array':
                    this.generateArray(ctx);
                    break;
                case 'choice':
                    this.generateChoice(ctx);
                    break;
                case 'pointer':
                    this.generatePointer(ctx);
                    break;
            }
            this.generateAssert(ctx);
        }
        var varName = ctx.generateVariable(this.varName);
        if (this.options.formatter) {
            this.generateFormatter(ctx, varName, this.options.formatter);
        }
        return this.generateNext(ctx);
    };
    Parser.prototype.generateAssert = function (ctx) {
        if (!this.options.assert) {
            return;
        }
        var varName = ctx.generateVariable(this.varName);
        switch (typeof this.options.assert) {
            case 'function':
                ctx.pushCode("if (!(" + this.options.assert + ").call(vars, " + varName + ")) {");
                break;
            case 'number':
                ctx.pushCode("if (" + this.options.assert + " !== " + varName + ") {");
                break;
            case 'string':
                ctx.pushCode("if (\"" + this.options.assert + "\" !== " + varName + ") {");
                break;
            default:
                throw new Error('Assert option supports only strings, numbers and assert functions.');
        }
        ctx.generateError("\"Assert error: " + varName + " is \" + " + this.options.assert);
        ctx.pushCode('}');
    };
    // Recursively call code generators and append results
    Parser.prototype.generateNext = function (ctx) {
        if (this.next) {
            ctx = this.next.generate(ctx);
        }
        return ctx;
    };
    Parser.prototype.generateBit = function (ctx) {
        // TODO find better method to handle nested bit fields
        var parser = JSON.parse(JSON.stringify(this));
        parser.varName = ctx.generateVariable(parser.varName);
        ctx.bitFields.push(parser);
        if (!this.next ||
            (this.next && ['bit', 'nest'].indexOf(this.next.type) < 0)) {
            var sum_1 = 0;
            ctx.bitFields.forEach(function (parser) { return (sum_1 += parser.options.length); });
            var val_1 = ctx.generateTmpVariable();
            if (sum_1 <= 8) {
                ctx.pushCode("var " + val_1 + " = buffer.readUInt8(offset);");
                sum_1 = 8;
            }
            else if (sum_1 <= 16) {
                ctx.pushCode("var " + val_1 + " = buffer.readUInt16BE(offset);");
                sum_1 = 16;
            }
            else if (sum_1 <= 24) {
                var val1 = ctx.generateTmpVariable();
                var val2 = ctx.generateTmpVariable();
                ctx.pushCode("var " + val1 + " = buffer.readUInt16BE(offset);");
                ctx.pushCode("var " + val2 + " = buffer.readUInt8(offset + 2);");
                ctx.pushCode("var " + val_1 + " = (" + val1 + " << 8) | " + val2 + ";");
                sum_1 = 24;
            }
            else if (sum_1 <= 32) {
                ctx.pushCode("var " + val_1 + " = buffer.readUInt32BE(offset);");
                sum_1 = 32;
            }
            else {
                throw new Error('Currently, bit field sequence longer than 4-bytes is not supported.');
            }
            ctx.pushCode("offset += " + sum_1 / 8 + ";");
            var bitOffset_1 = 0;
            var isBigEndian_1 = this.endian === 'be';
            ctx.bitFields.forEach(function (parser) {
                var offset = isBigEndian_1
                    ? sum_1 - bitOffset_1 - parser.options.length
                    : bitOffset_1;
                var mask = (1 << parser.options.length) - 1;
                ctx.pushCode(parser.varName + " = " + val_1 + " >> " + offset + " & " + mask + ";");
                bitOffset_1 += parser.options.length;
            });
            ctx.bitFields = [];
        }
    };
    Parser.prototype.generateSkip = function (ctx) {
        var length = ctx.generateOption(this.options.length);
        ctx.pushCode("offset += " + length + ";");
    };
    Parser.prototype.generateString = function (ctx) {
        var name = ctx.generateVariable(this.varName);
        var start = ctx.generateTmpVariable();
        var encoding = this.options.encoding;
        if (this.options.length && this.options.zeroTerminated) {
            var len = this.options.length;
            ctx.pushCode("var " + start + " = offset;");
            ctx.pushCode("while(buffer.readUInt8(offset++) !== 0 && offset - " + start + "  < " + len + ");");
            ctx.pushCode(name + " = buffer.toString('" + encoding + "', " + start + ", offset - " + start + " < " + len + " ? offset - 1 : offset);");
        }
        else if (this.options.length) {
            var len = ctx.generateOption(this.options.length);
            ctx.pushCode(name + " = buffer.toString('" + encoding + "', offset, offset + " + len + ");");
            ctx.pushCode("offset += " + len + ";");
        }
        else if (this.options.zeroTerminated) {
            ctx.pushCode("var " + start + " = offset;");
            ctx.pushCode('while(buffer.readUInt8(offset++) !== 0);');
            ctx.pushCode(name + " = buffer.toString('" + encoding + "', " + start + ", offset - 1);");
        }
        else if (this.options.greedy) {
            ctx.pushCode("var " + start + " = offset;");
            ctx.pushCode('while(buffer.length > offset++);');
            ctx.pushCode(name + " = buffer.toString('" + encoding + "', " + start + ", offset);");
        }
        if (this.options.stripNull) {
            ctx.pushCode(name + " = " + name + ".replace(/\\x00+$/g, '')");
        }
    };
    Parser.prototype.generateBuffer = function (ctx) {
        var varName = ctx.generateVariable(this.varName);
        if (typeof this.options.readUntil === 'function') {
            var pred = this.options.readUntil;
            var start = ctx.generateTmpVariable();
            var cur = ctx.generateTmpVariable();
            ctx.pushCode("var " + start + " = offset;");
            ctx.pushCode("var " + cur + " = 0;");
            ctx.pushCode("while (offset < buffer.length) {");
            ctx.pushCode(cur + " = buffer.readUInt8(offset);");
            ctx.pushCode("if (" + pred + ".call(this, " + cur + ", buffer.slice(offset))) break;");
            ctx.pushCode("offset += 1;");
            ctx.pushCode("}");
            ctx.pushCode(varName + " = buffer.slice(" + start + ", offset);");
        }
        else if (this.options.readUntil === 'eof') {
            ctx.pushCode(varName + " = buffer.slice(offset);");
        }
        else {
            var len = ctx.generateOption(this.options.length);
            ctx.pushCode(varName + " = buffer.slice(offset, offset + " + len + ");");
            ctx.pushCode("offset += " + len + ";");
        }
        if (this.options.clone) {
            ctx.pushCode(varName + " = Buffer.from(" + varName + ");");
        }
    };
    Parser.prototype.generateArray = function (ctx) {
        var length = ctx.generateOption(this.options.length);
        var lengthInBytes = ctx.generateOption(this.options.lengthInBytes);
        var type = this.options.type;
        var counter = ctx.generateTmpVariable();
        var lhs = ctx.generateVariable(this.varName);
        var item = ctx.generateTmpVariable();
        var key = this.options.key;
        var isHash = typeof key === 'string';
        if (isHash) {
            ctx.pushCode(lhs + " = {};");
        }
        else {
            ctx.pushCode(lhs + " = [];");
        }
        if (typeof this.options.readUntil === 'function') {
            ctx.pushCode('do {');
        }
        else if (this.options.readUntil === 'eof') {
            ctx.pushCode("for (var " + counter + " = 0; offset < buffer.length; " + counter + "++) {");
        }
        else if (lengthInBytes !== undefined) {
            ctx.pushCode("for (var " + counter + " = offset; offset - " + counter + " < " + lengthInBytes + "; ) {");
        }
        else {
            ctx.pushCode("for (var " + counter + " = 0; " + counter + " < " + length + "; " + counter + "++) {");
        }
        if (typeof type === 'string') {
            if (!aliasRegistry[type]) {
                var typeName = CAPITILIZED_TYPE_NAMES[type];
                ctx.pushCode("var " + item + " = buffer.read" + typeName + "(offset);");
                ctx.pushCode("offset += " + PRIMITIVE_SIZES[type] + ";");
            }
            else {
                var tempVar = ctx.generateTmpVariable();
                ctx.pushCode("var " + tempVar + " = " + (FUNCTION_PREFIX + type) + "(offset);");
                ctx.pushCode("var " + item + " = " + tempVar + ".result; offset = " + tempVar + ".offset;");
                if (type !== this.alias)
                    ctx.addReference(type);
            }
        }
        else if (type instanceof Parser) {
            ctx.pushCode("var " + item + " = {};");
            ctx.pushScope(item);
            type.generate(ctx);
            ctx.popScope();
        }
        if (isHash) {
            ctx.pushCode(lhs + "[" + item + "." + key + "] = " + item + ";");
        }
        else {
            ctx.pushCode(lhs + ".push(" + item + ");");
        }
        ctx.pushCode('}');
        if (typeof this.options.readUntil === 'function') {
            var pred = this.options.readUntil;
            ctx.pushCode("while (!(" + pred + ").call(this, " + item + ", buffer.slice(offset)));");
        }
    };
    Parser.prototype.generateChoiceCase = function (ctx, varName, type) {
        if (typeof type === 'string') {
            var varName_1 = ctx.generateVariable(this.varName);
            if (!aliasRegistry[type]) {
                var typeName = CAPITILIZED_TYPE_NAMES[type];
                ctx.pushCode(varName_1 + " = buffer.read" + typeName + "(offset);");
                ctx.pushCode("offset += " + PRIMITIVE_SIZES[type]);
            }
            else {
                var tempVar = ctx.generateTmpVariable();
                ctx.pushCode("var " + tempVar + " = " + (FUNCTION_PREFIX + type) + "(offset);");
                ctx.pushCode(varName_1 + " = " + tempVar + ".result; offset = " + tempVar + ".offset;");
                if (type !== this.alias)
                    ctx.addReference(type);
            }
        }
        else if (type instanceof Parser) {
            ctx.pushPath(varName);
            type.generate(ctx);
            ctx.popPath(varName);
        }
    };
    Parser.prototype.generateChoice = function (ctx) {
        var _this = this;
        var tag = ctx.generateOption(this.options.tag);
        if (this.varName) {
            ctx.pushCode(ctx.generateVariable(this.varName) + " = {};");
        }
        ctx.pushCode("switch(" + tag + ") {");
        Object.keys(this.options.choices).forEach(function (tag) {
            var type = _this.options.choices[tag];
            ctx.pushCode("case " + tag + ":");
            _this.generateChoiceCase(ctx, _this.varName, type);
            ctx.pushCode('break;');
        });
        ctx.pushCode('default:');
        if (this.options.defaultChoice) {
            this.generateChoiceCase(ctx, this.varName, this.options.defaultChoice);
        }
        else {
            ctx.generateError("\"Met undefined tag value \" + " + tag + " + \" at choice\"");
        }
        ctx.pushCode('}');
    };
    Parser.prototype.generateNest = function (ctx) {
        var nestVar = ctx.generateVariable(this.varName);
        if (this.options.type instanceof Parser) {
            if (this.varName) {
                ctx.pushCode(nestVar + " = {};");
            }
            ctx.pushPath(this.varName);
            this.options.type.generate(ctx);
            ctx.popPath(this.varName);
        }
        else if (aliasRegistry[this.options.type]) {
            var tempVar = ctx.generateTmpVariable();
            ctx.pushCode("var " + tempVar + " = " + (FUNCTION_PREFIX + this.options.type) + "(offset);");
            ctx.pushCode(nestVar + " = " + tempVar + ".result; offset = " + tempVar + ".offset;");
            if (this.options.type !== this.alias)
                ctx.addReference(this.options.type);
        }
    };
    Parser.prototype.generateFormatter = function (ctx, varName, formatter) {
        if (typeof formatter === 'function') {
            ctx.pushCode(varName + " = (" + formatter + ").call(this, " + varName + ");");
        }
    };
    Parser.prototype.generatePointer = function (ctx) {
        var type = this.options.type;
        var offset = ctx.generateOption(this.options.offset);
        var tempVar = ctx.generateTmpVariable();
        var nestVar = ctx.generateVariable(this.varName);
        // Save current offset
        ctx.pushCode("var " + tempVar + " = offset;");
        // Move offset
        ctx.pushCode("offset = " + offset + ";");
        if (this.options.type instanceof Parser) {
            ctx.pushCode(nestVar + " = {};");
            ctx.pushPath(this.varName);
            this.options.type.generate(ctx);
            ctx.popPath(this.varName);
        }
        else if (aliasRegistry[this.options.type]) {
            var tempVar_1 = ctx.generateTmpVariable();
            ctx.pushCode("var " + tempVar_1 + " = " + (FUNCTION_PREFIX + this.options.type) + "(offset);");
            ctx.pushCode(nestVar + " = " + tempVar_1 + ".result; offset = " + tempVar_1 + ".offset;");
            if (this.options.type !== this.alias)
                ctx.addReference(this.options.type);
        }
        else if (Object.keys(PRIMITIVE_SIZES).indexOf(this.options.type) >= 0) {
            var typeName = CAPITILIZED_TYPE_NAMES[type];
            ctx.pushCode(nestVar + " = buffer.read" + typeName + "(offset);");
            ctx.pushCode("offset += " + PRIMITIVE_SIZES[type] + ";");
        }
        // Restore offset
        ctx.pushCode("offset = " + tempVar + ";");
    };
    return Parser;
}());
exports.Parser = Parser;

});

unwrapExports(binary_parser);
var binary_parser_1 = binary_parser.Parser;

var objectIdFormatter = function (arr) {
    if (arr[3] >= 0x41 && arr[3] <= 0x7A) {
        return { type: 'stringencoded', value: arr.map(function (e) { return String.fromCharCode(parseInt(e, 10)); }).reverse().join('') };
    }
    return { type: 'alphanumeric', value: arr.map(function (e) { return parseInt(e, 16); }) };
};
var raceFlagFormatter = function (flag) {
    switch (flag) {
        case 0x01:
        case 0x41:
            return 'H';
        case 0x02:
        case 0x42:
            return 'O';
        case 0x04:
        case 0x44:
            return 'N';
        case 0x08:
        case 0x48:
            return 'U';
        case 0x20:
        case 0x60:
            return 'R';
    }
    return flag;
};
var chatModeFormatter = function (flag) {
    switch (flag) {
        case 0x00:
            return 'ALL';
        case 0x01:
            return 'ALLY';
        case 0x02:
            return 'OBS';
    }
    if (flag >= 3 && flag <= 27) {
        return "PRIVATE" + flag;
    }
    return flag;
};

/*
  Parses a CommandDataBlock that is contained inside of a TimeSlotBlock
*/
var PauseGameAction = new binary_parser_1();
var ResumeGameAction = new binary_parser_1();
var SetGameSpeedAction = new binary_parser_1()
    .int8('speed');
var IncreaseGameSpeedAction = new binary_parser_1();
var DecreaseGameSpeedAction = new binary_parser_1();
var SaveGameAction = new binary_parser_1()
    .string('saveGameName', { zeroTerminated: true });
// @ts-ignore
var SaveGameFinishedAction = new binary_parser_1()
    .int16le('');
var UnitBuildingAbilityActionNoParams = new binary_parser_1()
    .int16le('abilityFlags')
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: objectIdFormatter
})
    .int32le('unknownA')
    .int32le('unknownB');
var UnitBuildingAbilityActionTargetPosition = new binary_parser_1()
    .int16le('abilityFlags')
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: objectIdFormatter
})
    .int32le('unknownA')
    .int32le('unknownB')
    .floatle('targetX')
    .floatle('targetY');
var UnitBuildingAbilityActionTargetPositionTargetObjectId = new binary_parser_1()
    .int16le('abilityFlags')
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: objectIdFormatter
})
    .int32le('unknownA')
    .int32le('unknownB')
    .floatle('targetX')
    .floatle('targetY')
    .int32le('objectId1')
    .int32le('objectId2');
var GiveItemToUnitAction = new binary_parser_1()
    .int16le('abilityFlags')
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: objectIdFormatter
})
    .int32le('unknownA')
    .int32le('unknownB')
    .floatle('targetX')
    .floatle('targetY')
    .int32le('objectId1')
    .int32le('objectId2')
    .int32le('itemObjectId1')
    .int32le('itemObjectId2');
var UnitBuildingAbilityActionTwoTargetPositions = new binary_parser_1()
    .int16le('abilityFlags')
    .array('itemId1', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: objectIdFormatter
})
    .int32le('unknownA')
    .int32le('unknownB')
    .floatle('targetAX')
    .floatle('targetAY')
    .array('itemId2', {
    type: 'uint8',
    length: 4,
    formatter: objectIdFormatter
})
    .skip(9)
    .floatle('targetBX')
    .floatle('targetBY');
var SelectionUnit = new binary_parser_1()
    .array('itemId1', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: objectIdFormatter
})
    .array('itemId2', {
    type: 'uint8',
    length: 4,
    formatter: objectIdFormatter
});
var ChangeSelectionAction = new binary_parser_1()
    .int8('selectMode')
    .int16le('numberUnits')
    .array('actions', {
    type: SelectionUnit,
    length: 'numberUnits'
});
var AssignGroupHotkeyAction = new binary_parser_1()
    .int8('groupNumber')
    .int16le('numberUnits')
    .array('actions', {
    type: SelectionUnit,
    length: 'numberUnits'
});
var SelectGroupHotkeyAction = new binary_parser_1()
    .int8('groupNumber')
    .int8('unknown');
var SelectSubgroupAction = new binary_parser_1()
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: objectIdFormatter
})
    .int32le('objectId1')
    .int32le('objectId2');
var PreSubselectionAction = new binary_parser_1();
var UnknownAction1B = new binary_parser_1()
    .skip(9);
var SelectGroundItemAction = new binary_parser_1()
    .skip(1)
    .array('itemId1', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: objectIdFormatter
})
    .array('itemId2', {
    type: 'uint8',
    length: 4,
    formatter: objectIdFormatter
});
var CancelHeroRevivalAction = new binary_parser_1()
    .array('itemId1', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: objectIdFormatter
})
    .array('itemId2', {
    type: 'uint8',
    length: 4,
    formatter: objectIdFormatter
});
var RemoveUnitFromBuildingQueueAction = new binary_parser_1()
    .int8('slotNumber')
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: objectIdFormatter
});
var ChangeAllyOptionsAction = new binary_parser_1()
    .int8('slotNumber')
    .int32le('flags');
var TransferResourcesAction = new binary_parser_1()
    .int8('slotNumber')
    .int32le('gold')
    .int32le('lumber');
var MapTriggerChatAction = new binary_parser_1()
    .skip(8)
    .string('action', { zeroTerminated: true });
var ESCPressedAction = new binary_parser_1();
var ChooseHeroSkillSubmenu = new binary_parser_1();
var EnterBuildingSubmenu = new binary_parser_1();
var MinimapSignal = new binary_parser_1()
    .skip(12);
var ContinueGame = new binary_parser_1()
    .skip(16);
var UnknownAction75 = new binary_parser_1()
    .skip(1);
var UnknownAction7B = new binary_parser_1()
    .skip(16);
var ScenarioTriggerAction = new binary_parser_1()
    .skip(12);
var W3MMDAction = new binary_parser_1()
    .string('filename', { zeroTerminated: true })
    .string('missionKey', { zeroTerminated: true })
    .string('key', { zeroTerminated: true })
    .int32le('value');
// @ts-ignore
var ActionBlock = new binary_parser_1()
    .int8('actionId')
    .choice('', {
    tag: 'actionId',
    choices: {
        0x1: PauseGameAction,
        0x2: ResumeGameAction,
        0x3: SetGameSpeedAction,
        0x4: IncreaseGameSpeedAction,
        0x5: DecreaseGameSpeedAction,
        0x6: SaveGameAction,
        0x7: SaveGameFinishedAction,
        0x10: UnitBuildingAbilityActionNoParams,
        0x11: UnitBuildingAbilityActionTargetPosition,
        0x12: UnitBuildingAbilityActionTargetPositionTargetObjectId,
        0x13: GiveItemToUnitAction,
        0x14: UnitBuildingAbilityActionTwoTargetPositions,
        0x16: ChangeSelectionAction,
        0x17: AssignGroupHotkeyAction,
        0x18: SelectGroupHotkeyAction,
        0x19: SelectSubgroupAction,
        0x1A: PreSubselectionAction,
        0x1B: UnknownAction1B,
        0x1C: SelectGroundItemAction,
        0x1D: CancelHeroRevivalAction,
        0x1E: RemoveUnitFromBuildingQueueAction,
        0x1F: RemoveUnitFromBuildingQueueAction,
        0x20: new binary_parser_1(),
        0x22: new binary_parser_1(),
        0x23: new binary_parser_1(),
        0x24: new binary_parser_1(),
        0x25: new binary_parser_1(),
        0x26: new binary_parser_1(),
        0x27: new binary_parser_1().skip(5),
        0x28: new binary_parser_1().skip(5),
        0x29: new binary_parser_1(),
        0x2a: new binary_parser_1(),
        0x2b: new binary_parser_1(),
        0x2c: new binary_parser_1(),
        0x2d: new binary_parser_1().skip(5),
        0x2e: new binary_parser_1().skip(4),
        0x2f: new binary_parser_1(),
        0x30: new binary_parser_1(),
        0x31: new binary_parser_1(),
        0x32: new binary_parser_1(),
        0x50: ChangeAllyOptionsAction,
        0x51: TransferResourcesAction,
        0x60: MapTriggerChatAction,
        0x61: ESCPressedAction,
        0x62: ScenarioTriggerAction,
        0x63: new binary_parser_1(),
        0x66: ChooseHeroSkillSubmenu,
        0x65: ChooseHeroSkillSubmenu,
        0x67: EnterBuildingSubmenu,
        0x68: MinimapSignal,
        0x69: ContinueGame,
        0x6a: ContinueGame,
        0x6b: W3MMDAction,
        0x6c: new binary_parser_1(),
        0x6d: new binary_parser_1(),
        0x75: UnknownAction75,
        0x7B: UnknownAction7B
    }
});
var ActionBlockList = new binary_parser_1()
    // @ts-ignore
    .array(null, { type: ActionBlock, readUntil: 'eof' });
// 0x17
var CommandDataBlock = new binary_parser_1()
    .int8('playerId')
    .int16le('actionBlockLength')
    .buffer('actions', { length: 'actionBlockLength' });

var playerColor = function (color) {
    switch (color) {
        case 0:
            return '#ff0000';
        case 1:
            return '#0000FF';
        case 2:
            return '#008080';
        case 3:
            return '#800080';
        case 4:
            return '#FFFF00';
        case 5:
            return '#FFA500';
        case 6:
            return '#008000';
        case 7:
            return '#FFC0CB';
        case 8:
            return '#808080';
        case 9:
            return '#ADD8E6';
        case 10:
            return '#006400';
        case 11:
            return '#ADD8E6';
        case 12:
            return '#800000';
        case 13:
            return '#000080';
        case 14:
            return '#40E0D0';
        case 15:
            return '#EE82EE';
        case 16:
            return '#F5DEB3';
        case 17:
            return '#FFDAB9';
        case 18:
            return '#F5FFFA';
        case 19:
            return '#E6E6FA';
        case 20:
            return '#3eb489';
        case 21:
            return '#FFFAFA';
        case 22:
            return '#50c878';
        case 23:
            return '#D0B078';
        default:
            return '000000';
    }
};
var gameVersion = function (version) {
    if (version === 10030) {
        return '1.30.2+';
    }
    else if (version > 10030) {
        var str = String(version);
        return "1." + str.substring(str.length - 2, str.length);
    }
    return "1." + version;
};
var mapFilename = function (mapPath) {
    var fragment = mapPath.split('\\').pop();
    if (fragment !== undefined) {
        return fragment.split('//').pop();
    }
    return '';
};
var convert = {
    playerColor: playerColor,
    gameVersion: gameVersion,
    mapFilename: mapFilename
};

var items = {
    amrc: 'i_Amulet of Recall',
    ankh: 'i_Ankh of Reincarnation',
    belv: 'i_Boots of Quel\'Thalas +6',
    bgst: 'i_Belt of Giant Strength +6',
    bspd: 'i_Boots of Speed',
    ccmd: 'i_Scepter of Mastery',
    ciri: 'i_Robe of the Magi +6',
    ckng: 'i_Crown of Kings +5',
    clsd: 'i_Cloak of Shadows',
    crys: 'i_Crystal Ball',
    desc: 'i_Kelen\'s Dagger of Escape',
    gemt: 'i_Gem of True Seeing',
    gobm: 'i_Goblin Land Mines',
    gsou: 'i_Soul Gem',
    guvi: 'i_Glyph of Ultravision',
    gfor: 'i_Glyph of Fortification',
    soul: 'i_Soul',
    mdpb: 'i_Medusa Pebble',
    rag1: 'i_Slippers of Agility +3',
    rat3: 'i_Claws of Attack +3',
    rin1: 'i_Mantle of Intelligence +3',
    rde1: 'i_Ring of Protection +2',
    rde2: 'i_Ring of Protection +3',
    rde3: 'i_Ring of Protection +4',
    rhth: 'i_Khadgar\'s Gem of Health',
    rst1: 'i_Gauntlets of Ogre Strength +3',
    ofir: 'i_Orb of Fire',
    ofro: 'i_Orb of Frost',
    olig: 'i_Orb of Lightning',
    oli2: 'i_Orb of Lightning',
    oven: 'i_Orb of Venom',
    odef: 'i_Orb of Darkness',
    ocor: 'i_Orb of Corruption',
    pdiv: 'i_Potion of Divinity',
    phea: 'i_Potion of Healing',
    pghe: 'i_Potion of Greater Healing',
    pinv: 'i_Potion of Invisibility',
    pgin: 'i_Potion of Greater Invisibility',
    pman: 'i_Potion of Mana',
    pgma: 'i_Potion of Greater Mana',
    pnvu: 'i_Potion of Invulnerability',
    pnvl: 'i_Potion of Lesser Invulnerability',
    pres: 'i_Potion of Restoration',
    pspd: 'i_Potion of Speed',
    rlif: 'i_Ring of Regeneration',
    rwiz: 'i_Sobi Mask',
    sfog: 'i_Horn of the Clouds',
    shea: 'i_Scroll of Healing',
    sman: 'i_Scroll of Mana',
    spro: 'i_Scroll of Protection',
    sres: 'i_Scroll of Restoration',
    ssil: 'i_Staff of Silence',
    stwp: 'i_Scroll of Town Portal',
    tels: 'i_Goblin Night Scope',
    tdex: 'i_Tome of Agility',
    texp: 'i_Tome of Experience',
    tint: 'i_Tome of Intelligence',
    tkno: 'i_Tome of Power',
    tstr: 'i_Tome of Strength',
    ward: 'i_Warsong Battle Drums',
    will: 'i_Wand of Illusion',
    wneg: 'i_Wand of Negation',
    rdis: 'i_Rune of Dispel Magic',
    rwat: 'i_Rune of the Watcher',
    fgrd: 'i_Red Drake Egg',
    fgrg: 'i_Stone Token',
    fgdg: 'i_Demonic Figurine',
    fgfh: 'i_Spiked Collar',
    fgsk: 'i_Book of the Dead',
    engs: 'i_Enchanted Gemstone',
    k3m1: 'i_Mooncrystal',
    modt: 'i_Mask of Death',
    sand: 'i_Scroll of Animate Dead',
    srrc: 'i_Scroll of Resurrection',
    sror: 'i_Scroll of the Beast',
    infs: 'i_Inferno Stone',
    shar: 'i_Ice Shard',
    wild: 'i_Amulet of the Wild',
    wswd: 'i_Sentry Wards',
    whwd: 'i_Healing Wards',
    wlsd: 'i_Wand of Lightning Shield',
    wcyc: 'i_Wand of the Wind',
    rnec: 'i_Rod of Necromancy',
    pams: 'i_Anti-magic Potion',
    clfm: 'i_Cloak of Flames',
    evtl: 'i_Talisman of Evasion',
    nspi: 'i_Necklace of Spell Immunity',
    lhst: 'i_The Lion Horn of Stormwind',
    kpin: 'i_Khadgar\'s Pipe of Insight',
    sbch: 'i_Scourge Bone Chimes',
    afac: 'i_Alleria\'s Flute of Accuracy',
    ajen: 'i_Ancient Janggo of Endurance',
    lgdh: 'i_Legion Doom-Horn',
    hcun: 'i_Hood of Cunning',
    mcou: 'i_Medallion of Courage',
    hval: 'i_Helm of Valor',
    cnob: 'i_Circlet of Nobility',
    prvt: 'i_Periapt of Vitality',
    tgxp: 'i_Tome of Greater Experience',
    mnst: 'i_Mana Stone',
    hlst: 'i_Health Stone',
    tpow: 'i_Tome of Knowledge',
    tst2: 'i_Tome of Strength +2',
    tin2: 'i_Tome of Intelligence +2',
    tdx2: 'i_Tome of Agility +2',
    rde0: 'i_Ring of Protection +1',
    rde4: 'i_Ring of Protection +5',
    rat6: 'i_Claws of Attack +6',
    rat9: 'i_Claws of Attack +9',
    ratc: 'i_Claws of Attack +12',
    ratf: 'i_Claws of Attack +15',
    manh: 'i_Manual of Health',
    pmna: 'i_Pendant of Mana',
    penr: 'i_Pendant of Energy',
    gcel: 'i_Gloves of Haste',
    totw: 'i_Talisman of the Wild',
    phlt: 'i_Phat Lewt',
    gopr: 'i_Glyph of Purification',
    ches: 'i_Cheese',
    mlst: 'i_Maul of Strength',
    rnsp: 'i_Ring of Superiority',
    brag: 'i_Bracer of Agility',
    sksh: 'i_Skull Shield',
    vddl: 'i_Voodoo Doll',
    sprn: 'i_Spider Ring',
    tmmt: 'i_Totem of Might',
    anfg: 'i_Ancient Figurine',
    lnrn: 'i_Lion\'s Ring',
    iwbr: 'i_Ironwood Branch',
    jdrn: 'i_Jade Ring',
    drph: 'i_Druid Pouch',
    hslv: 'i_Healing Salve',
    pclr: 'i_Clarity Potion',
    plcl: 'i_Lesser Clarity Potion',
    rej1: 'i_Minor Replenishment Potion',
    rej2: 'i_Lesser Replenishment Potion',
    rej3: 'i_Replenishment Potion',
    rej4: 'i_Greater Replenishment Potion',
    rej5: 'i_Lesser Scroll of Replenishment ',
    rej6: 'i_Greater Scroll of Replenishment ',
    sreg: 'i_Scroll of Regeneration',
    gold: 'i_Gold Coins',
    lmbr: 'i_Bundle of Lumber',
    fgun: 'i_Flare Gun',
    pomn: 'i_Potion of Omniscience',
    gomn: 'i_Glyph of Omniscience',
    wneu: 'i_Wand of Neutralization',
    silk: 'i_Spider Silk Broach',
    lure: 'i_Monster Lure',
    skul: 'i_Sacrificial Skull',
    moon: 'i_Moonstone',
    brac: 'i_Runed Bracers',
    vamp: 'i_Vampiric Potion',
    woms: 'i_Wand of Mana Stealing',
    tcas: 'i_Tiny Castle',
    tgrh: 'i_Tiny Great Hall',
    tsct: 'i_Ivory Tower',
    wshs: 'i_Wand of Shadowsight',
    tret: 'i_Tome of Retraining',
    sneg: 'i_Staff of Negation',
    stel: 'i_Staff of Teleportation',
    spre: 'i_Staff of Preservation',
    mcri: 'i_Mechanical Critter',
    spsh: 'i_Amulet of Spell Shield',
    sbok: 'i_Spell Book',
    ssan: 'i_Staff of Sanctuary',
    shas: 'i_Scroll of Speed',
    dust: 'i_Dust of Appearance',
    oslo: 'i_Orb of Slow',
    dsum: 'i_Diamond of Summoning',
    sor1: 'i_Shadow Orb +1',
    sor2: 'i_Shadow Orb +2',
    sor3: 'i_Shadow Orb +3',
    sor4: 'i_Shadow Orb +4',
    sor5: 'i_Shadow Orb +5',
    sor6: 'i_Shadow Orb +6',
    sor7: 'i_Shadow Orb +7',
    sor8: 'i_Shadow Orb +8',
    sor9: 'i_Shadow Orb +9',
    sora: 'i_Shadow Orb +10',
    sorf: 'i_Shadow Orb Fragment',
    fwss: 'i_Frost Wyrm Skull Shield',
    ram1: 'i_Ring of the Archmagi',
    ram2: 'i_Ring of the Archmagi',
    ram3: 'i_Ring of the Archmagi',
    ram4: 'i_Ring of the Archmagi',
    shtm: 'i_Shamanic Totem',
    shwd: 'i_Shimmerweed',
    btst: 'i_Battle Standard',
    skrt: 'i_Skeletal Artifact',
    thle: 'i_Thunder Lizard Egg',
    sclp: 'i_Secret Level Powerup',
    gldo: 'i_Orb of Kil\'jaeden',
    tbsm: 'i_Tiny Blacksmith',
    tfar: 'i_Tiny Farm',
    tlum: 'i_Tiny Lumber Mill',
    tbar: 'i_Tiny Barracks',
    tbak: 'i_Tiny Altar of Kings',
    mgtk: 'i_Magic Key Chain',
    stre: 'i_Staff of Reanimation',
    horl: 'i_Sacred Relic',
    hbth: 'i_Helm of Battlethirst',
    blba: 'i_Bladebane Armor',
    rugt: 'i_Runed Gauntlets',
    frhg: 'i_Firehand Gauntlets',
    gvsm: 'i_Gloves of Spell Mastery',
    crdt: 'i_Crown of the Deathlord',
    arsc: 'i_Arcane Scroll',
    scul: 'i_Scroll of the Unholy Legion',
    tmsc: 'i_Tome of Sacrifices',
    dtsb: 'i_Drek\'thar\'s Spellbook',
    grsl: 'i_Grimoire of Souls',
    arsh: 'i_Arcanite Shield',
    shdt: 'i_Shield of the Deathlord',
    shhn: 'i_Shield of Honor',
    shen: 'i_Enchanted Shield',
    thdm: 'i_Thunderlizard Diamond',
    stpg: 'i_Clockwork Penguin',
    shrs: 'i_Shimmerglaze Roast',
    bfhr: 'i_Bloodfeather\'s Heart',
    cosl: 'i_Celestial Orb of Souls',
    shcw: 'i_Shaman Claws',
    srbd: 'i_Searing Blade',
    frgd: 'i_Frostguard',
    envl: 'i_Enchanted Vial',
    rump: 'i_Rusty Mining Pick',
    mort: 'i_Mogrin\'s Report',
    srtl: 'i_Serathil',
    stwa: 'i_Sturdy War Axe',
    klmm: 'i_Killmaim',
    rots: 'i_Scepter of the Sea',
    axas: 'i_Ancestral Staff',
    mnsf: 'i_Mindstaff',
    schl: 'i_Scepter of Healing',
    asbl: 'i_Assassin\'s Blade',
    kgal: 'i_Keg of Ale',
    dphe: 'i_Thunder Phoenix Egg',
    dkfw: 'i_Keg of Thunderwater',
    dthb: 'i_Thunderbloom Bulb',
    ritd: 'i_Ritual Dagger'
};
var units = {
    hfoo: 'u_Footman',
    hkni: 'u_Knight',
    hmpr: 'u_Priest',
    hmtm: 'u_Mortar Team',
    hpea: 'u_Peasant',
    hrif: 'u_Rifleman',
    hsor: 'u_Sorceress',
    hmtt: 'u_Siege Engine',
    hrtt: 'u_Siege Engine',
    hgry: 'u_Gryphon Rider',
    hgyr: 'u_Flying Machine',
    hspt: 'u_Spell Breaker',
    hdhw: 'u_Dragonhawk Rider',
    // building upgrades
    hkee: 'b_Keep',
    hcas: 'b_Castle',
    hctw: 'b_Cannon Tower',
    hgtw: 'b_Guard Tower',
    hatw: 'b_Arcane Tower',
    ebal: 'u_Glaive Thrower',
    echm: 'u_Chimaera',
    edoc: 'u_Druid of the Claw',
    edot: 'u_Druid of the Talon',
    ewsp: 'u_Wisp',
    esen: 'u_Huntress',
    earc: 'u_Archer',
    edry: 'u_Dryad',
    ehip: 'u_Hippogryph',
    emtg: 'u_Mountain Giant',
    efdr: 'u_Faerie Dragon',
    // building upgrades
    etoa: 'b_Tree of Ages',
    etoe: 'b_Tree of Eternity',
    ocat: 'u_Demolisher',
    odoc: 'u_Troll Witch Doctor',
    ogru: 'u_Grunt',
    ohun: 'u_Troll Headhunter/Berserker',
    otbk: 'u_Troll Headhunter/Berserker',
    okod: 'u_Kodo Beast',
    opeo: 'u_Peon',
    orai: 'u_Raider',
    oshm: 'u_Shaman',
    otau: 'u_Tauren',
    owyv: 'u_Wind Rider',
    ospw: 'u_Spirit Walker',
    ospm: 'u_Spirit Walker',
    otbr: 'u_Troll Batrider',
    // building upgrades
    ofrt: 'b_Fortress',
    ostr: 'b_Stronghold',
    uaco: 'u_Acolyte',
    uabo: 'u_Abomination',
    uban: 'u_Banshee',
    ucry: 'u_Crypt Fiend',
    ufro: 'u_Frost Wyrm',
    ugar: 'u_Gargoyle',
    ugho: 'u_Ghoul',
    unec: 'u_Necromancer',
    umtw: 'u_Meatwagon',
    ushd: 'u_Shade',
    uobs: 'u_Obsidian Statue',
    ubsp: 'u_Destroyer',
    // building upgrades
    unp1: 'b_Halls of the Dead',
    unp2: 'b_Black Citadel',
    uzg1: 'b_Spirit Tower',
    uzg2: 'b_Nerubian Tower',
    nskm: 'u_Skeletal Marksman',
    nskf: 'u_Burning Archer',
    nws1: 'u_Dragon Hawk',
    nban: 'u_Bandit',
    nrog: 'u_Rogue',
    nenf: 'u_Enforcer',
    nass: 'u_Assassin',
    nbdk: 'u_Black Drake',
    nrdk: 'u_Red Dragon Whelp',
    nbdr: 'u_Black Dragon Whelp',
    nrdr: 'u_Red Drake',
    nbwm: 'u_Black Dragon',
    nrwm: 'u_Red Dragon',
    nadr: 'u_Blue Dragon',
    nadw: 'u_Blue Dragon Whelp',
    nadk: 'u_Blue Drake',
    nbzd: 'u_Bronze Dragon',
    nbzk: 'u_Bronze Drake',
    nbzw: 'u_Bronze Dragon Whelp',
    ngrd: 'u_Green Dragon',
    ngdk: 'u_Green Drake',
    ngrw: 'u_Green Dragon Whelp',
    ncea: 'u_Centaur Archer',
    ncen: 'u_Centaur Outrunner',
    ncer: 'u_Centaur Drudge',
    ndth: 'u_Dark Troll High Priest',
    ndtp: 'u_Dark Troll Shadow Priest',
    ndtb: 'u_Dark Troll Berserker',
    ndtw: 'u_Dark Troll Warlord',
    ndtr: 'u_Dark Troll',
    ndtt: 'u_Dark Troll Trapper',
    nfsh: 'u_Forest Troll High Priest',
    nfsp: 'u_Forest Troll Shadow Priest',
    nftr: 'u_Forest Troll',
    nftb: 'u_Forest Troll Berserker',
    nftt: 'u_Forest Troll Trapper',
    nftk: 'u_Forest Troll Warlord',
    ngrk: 'u_Mud Golem',
    ngir: 'u_Goblin Shredder',
    nfrs: 'u_Furbolg Shaman',
    ngna: 'u_Gnoll Poacher',
    ngns: 'u_Gnoll Assassin',
    ngno: 'u_Gnoll',
    ngnb: 'u_Gnoll Brute',
    ngnw: 'u_Gnoll Warden',
    ngnv: 'u_Gnoll Overseer',
    ngsp: 'u_Goblin Sapper',
    nhrr: 'u_Harpy Rogue',
    nhrw: 'u_Harpy Windwitch',
    nits: 'u_Ice Troll Berserker',
    nitt: 'u_Ice Troll Trapper',
    nkob: 'u_Kobold',
    nkog: 'u_Kobold Geomancer',
    nthl: 'u_Thunder Lizard',
    nmfs: 'u_Murloc Flesheater',
    nmrr: 'u_Murloc Huntsman',
    nowb: 'u_Wildkin',
    nrzm: 'u_Razormane Medicine Man',
    nnwa: 'u_Nerubian Warrior',
    nnwl: 'u_Nerubian Webspinner',
    nogr: 'u_Ogre Warrior',
    nogm: 'u_Ogre Mauler',
    nogl: 'u_Ogre Lord',
    nomg: 'u_Ogre Magi',
    nrvs: 'u_Frost Revenant',
    nslf: 'u_Sludge Flinger',
    nsts: 'u_Satyr Shadowdancer',
    nstl: 'u_Satyr Soulstealer',
    nzep: 'u_Goblin Zeppelin',
    ntrt: 'u_Giant Sea Turtle',
    nlds: 'u_Makrura Deepseer',
    nlsn: 'u_Makrura Snapper',
    nmsn: 'u_Mur\'gul Snarecaster',
    nscb: 'u_Spider Crab Shorecrawler',
    nbot: 'u_Transport Ship',
    nsc2: 'u_Spider Crab Limbripper',
    nsc3: 'u_Spider Crab Behemoth',
    nbdm: 'u_Blue Dragonspawn Meddler',
    nmgw: 'u_Magnataur Warrior',
    nanb: 'u_Barbed Arachnathid',
    nanm: 'u_Barbed Arachnathid',
    nfps: 'u_Polar Furbolg Shaman',
    nmgv: 'u_Magic Vault',
    nitb: 'u_Icy Treasure Box',
    npfl: 'u_Fel Beast',
    ndrd: 'u_Draenei Darkslayer',
    ndrm: 'u_Draenei Disciple',
    nvdw: 'u_Voidwalker',
    nvdg: 'u_Greater Voidwalker',
    nnht: 'u_Nether Dragon Hatchling',
    nndk: 'u_Nether Drake',
    nndr: 'u_Nether Dragon'
};
var buildings = {
    hhou: 'Farm',
    halt: 'Altar of Kings',
    harm: 'Workshop',
    hars: 'Arcane Sanctum',
    hbar: 'Barracks',
    hbla: 'Blacksmith',
    hgra: 'Gryphon Aviary',
    hwtw: 'Scout Tower',
    hvlt: 'Arcane Vault',
    hlum: 'Lumber Mill',
    htow: 'Town Hall',
    etrp: 'Ancient Protector',
    etol: 'Tree of Life',
    edob: 'Hunter\'s Hall',
    eate: 'Altar of Elders',
    eden: 'Ancient of Wonders',
    eaoe: 'Ancient of Lore',
    eaom: 'Ancient of War',
    eaow: 'Ancient of Wind',
    edos: 'Chimaera Roost',
    emow: 'Moon Well',
    oalt: 'Altar of Storms',
    obar: 'Barracks',
    obea: 'Beastiary',
    ofor: 'War Mill',
    ogre: 'Great Hall',
    osld: 'Spirit Lodge',
    otrb: 'Orc Burrow',
    orbr: 'Reinforced Orc Burrow',
    otto: 'Tauren Totem',
    ovln: 'Voodoo Lounge',
    owtw: 'Watch Tower',
    uaod: 'Altar of Darkness',
    unpl: 'Necropolis',
    usep: 'Crypt',
    utod: 'Temple of the Damned',
    utom: 'Tomb of Relics',
    ugol: 'Haunted Gold Mine',
    uzig: 'Ziggurat',
    ubon: 'Boneyard',
    usap: 'Sacrificial Pit',
    uslh: 'Slaughterhouse',
    ugrv: 'Graveyard'
};
var upgrades = {
    Rhss: 'p_Control Magic',
    Rhme: 'p_Swords',
    Rhra: 'p_Gunpowder',
    Rhar: 'p_Plating',
    Rhla: 'p_Armor',
    Rhac: 'p_Masonry',
    Rhgb: 'p_Flying Machine Bombs',
    Rhlh: 'p_Lumber Harvesting',
    Rhde: 'p_Defend',
    Rhan: 'p_Animal War Training',
    Rhpt: 'p_Priest Training',
    Rhst: 'p_Sorceress Training',
    Rhri: 'p_Long Rifles',
    Rhse: 'p_Magic Sentry',
    Rhfl: 'p_Flare',
    Rhhb: 'p_Storm Hammers',
    Rhrt: 'p_Barrage',
    Rhpm: 'p_Backpack',
    Rhfc: 'p_Flak Cannons',
    Rhfs: 'p_Fragmentation Shards',
    Rhcd: 'p_Cloud',
    Rhsb: 'p_Sundering Blades',
    Resm: 'p_Strength of the Moon',
    Resw: 'p_Strength of the Wild',
    Rema: 'p_Moon Armor',
    Rerh: 'p_Reinforced Hides',
    Reuv: 'p_Ultravision',
    Renb: 'p_Nature\'s Blessing',
    Reib: 'p_Improved Bows',
    Remk: 'p_Marksmanship',
    Resc: 'p_Sentinel',
    Remg: 'p_Upgrade Moon Glaive',
    Redt: 'p_Druid of the Talon Training',
    Redc: 'p_Druid of the Claw Training',
    Resi: 'p_Abolish Magic',
    Reht: 'p_Hippogryph Taming',
    Recb: 'p_Corrosive Breath',
    Repb: 'p_Vorpal Blades',
    Rers: 'p_Resistant Skin',
    Rehs: 'p_Hardened Skin',
    Reeb: 'p_Mark of the Claw',
    Reec: 'p_Mark of the Talon',
    Rews: 'p_Well Spring',
    Repm: 'p_Backpack',
    Roch: 'p_Chaos',
    Rome: 'p_Melee Weapons',
    Rora: 'p_Ranged Weapons',
    Roar: 'p_Armor',
    Rwdm: 'p_War Drums Damage Increase',
    Ropg: 'p_Pillage',
    Robs: 'p_Berserker Strength',
    Rows: 'p_Pulverize',
    Roen: 'p_Ensnare',
    Rovs: 'p_Envenomed Spears',
    Rowd: 'p_Witch Doctor Training',
    Rost: 'p_Shaman Training',
    Rosp: 'p_Spiked Barricades',
    Rotr: 'p_Troll Regeneration',
    Rolf: 'p_Liquid Fire',
    Ropm: 'p_Backpack',
    Rowt: 'p_Spirit Walker Training',
    Robk: 'p_Berserker Upgrade',
    Rorb: 'p_Reinforced Defenses',
    Robf: 'p_Burning Oil',
    Rusp: 'p_Destroyer Form',
    Rume: 'p_Unholy Strength',
    Rura: 'p_Creature Attack',
    Ruar: 'p_Unholy Armor',
    Rucr: 'p_Creature Carapace',
    Ruac: 'p_Cannibalize',
    Rugf: 'p_Ghoul Frenzy',
    Ruwb: 'p_Web',
    Rusf: 'p_Stone Form',
    Rune: 'p_Necromancer Training',
    Ruba: 'p_Banshee Training',
    Rufb: 'p_Freezing Breath',
    Rusl: 'p_Skeletal Longevity',
    Rupc: 'p_Disease Cloud',
    Rusm: 'p_Skeletal Mastery',
    Rubu: 'p_Burrow',
    Ruex: 'p_Exhume Corpses',
    Rupm: 'p_Backpack'
};
var abilityToHero = {
    AHbz: 'Hamg',
    AHwe: 'Hamg',
    AHab: 'Hamg',
    AHmt: 'Hamg',
    AHtb: 'Hmkg',
    AHtc: 'Hmkg',
    AHbh: 'Hmkg',
    AHav: 'Hmkg',
    AHhb: 'Hpal',
    AHds: 'Hpal',
    AHad: 'Hpal',
    AHre: 'Hpal',
    AHdr: 'Hblm',
    AHfs: 'Hblm',
    AHbn: 'Hblm',
    AHpx: 'Hblm',
    AEmb: 'Edem',
    AEim: 'Edem',
    AEev: 'Edem',
    AEme: 'Edem',
    AEer: 'Ekee',
    AEfn: 'Ekee',
    AEah: 'Ekee',
    AEtq: 'Ekee',
    AEst: 'Emoo',
    AHfa: 'Emoo',
    AEar: 'Emoo',
    AEsf: 'Emoo',
    AEbl: 'Ewar',
    AEfk: 'Ewar',
    AEsh: 'Ewar',
    AEsv: 'Ewar',
    AOwk: 'Obla',
    AOmi: 'Obla',
    AOcr: 'Obla',
    AOww: 'Obla',
    AOcl: 'Ofar',
    AOfs: 'Ofar',
    AOsf: 'Ofar',
    AOeq: 'Ofar',
    AOsh: 'Otch',
    AOae: 'Otch',
    AOws: 'Otch',
    AOre: 'Otch',
    AOhw: 'Oshd',
    AOhx: 'Oshd',
    AOsw: 'Oshd',
    AOvd: 'Oshd',
    AUdc: 'Udea',
    AUdp: 'Udea',
    AUau: 'Udea',
    AUan: 'Udea',
    AUcs: 'Udre',
    AUsl: 'Udre',
    AUav: 'Udre',
    AUin: 'Udre',
    AUfn: 'Ulic',
    AUfa: 'Ulic',
    AUfu: 'Ulic',
    AUdr: 'Ulic',
    AUdd: 'Ulic',
    AUim: 'Ucrl',
    AUts: 'Ucrl',
    AUcb: 'Ucrl',
    AUls: 'Ucrl',
    ANbf: 'Npbm',
    ANdb: 'Npbm',
    ANdh: 'Npbm',
    ANef: 'Npbm',
    ANdr: 'Nbrn',
    ANsi: 'Nbrn',
    ANba: 'Nbrn',
    ANch: 'Nbrn',
    ANms: 'Nngs',
    ANfa: 'Nngs',
    ANfl: 'Nngs',
    ANto: 'Nngs',
    ANrf: 'Nplh',
    ANca: 'Nplh',
    ANht: 'Nplh',
    ANdo: 'Nplh',
    ANsg: 'Nbst',
    ANsq: 'Nbst',
    ANsw: 'Nbst',
    ANst: 'Nbst',
    ANeg: 'Ntin',
    ANcs: 'Ntin',
    ANc1: 'Ntin',
    ANc2: 'Ntin',
    ANc3: 'Ntin',
    ANsy: 'Ntin',
    ANs1: 'Ntin',
    ANs2: 'Ntin',
    ANs3: 'Ntin',
    ANrg: 'Ntin',
    ANg1: 'Ntin',
    ANg2: 'Ntin',
    ANg3: 'Ntin',
    ANic: 'Nfir',
    ANia: 'Nfir',
    ANso: 'Nfir',
    ANlm: 'Nfir',
    ANvc: 'Nfir',
    ANhs: 'Nalc',
    ANab: 'Nalc',
    ANcr: 'Nalc',
    ANtm: 'Nalc'
};

/**
 * Helpers
 */
var isRightclickAction = function (input) { return input[0] === 0x03 && input[1] === 0; };
var isBasicAction = function (input) { return input[0] <= 0x19 && input[1] === 0; };
var reduceHeroes = function (heroCollector) {
    return Object.values(heroCollector).sort(function (h1, h2) { return h1.order - h2.order; }).reduce(function (aggregator, hero) {
        hero.level = Object.values(hero.abilities).reduce(function (prev, curr) { return prev + curr; }, 0);
        delete hero.order;
        aggregator.push(hero);
        return aggregator;
    }, []);
};
var Player = /** @class */ (function () {
    function Player(id, name, teamid, color, race) {
        this.id = id;
        this.name = name;
        this.teamid = teamid;
        this.color = convert.playerColor(color);
        this.race = race;
        this.raceDetected = '';
        this.units = { summary: {}, order: [] };
        this.upgrades = { summary: {}, order: [] };
        this.items = { summary: {}, order: [] };
        this.buildings = { summary: {}, order: [] };
        this.heroes = [];
        this.heroCollector = {};
        this.heroCount = 0;
        this.actions = {
            timed: [],
            assigngroup: 0,
            rightclick: 0,
            basic: 0,
            buildtrain: 0,
            ability: 0,
            item: 0,
            select: 0,
            removeunit: 0,
            subgroup: 0,
            selecthotkey: 0,
            esc: 0
        };
        this._currentlyTrackedAPM = 0;
        this._lastActionWasDeselect = false;
        this._retrainingMetadata = {};
        this._lastRetrainingTime = 0;
        this.currentTimePlayed = 0;
        this.apm = 0;
        return this;
    }
    Player.prototype.newActionTrackingSegment = function (timeTrackingInterval) {
        if (timeTrackingInterval === void 0) { timeTrackingInterval = 60000; }
        this.actions.timed.push(Math.floor(this._currentlyTrackedAPM * (60000.0 / timeTrackingInterval)));
        this._currentlyTrackedAPM = 0;
    };
    Player.prototype.detectRaceByActionId = function (actionId) {
        switch (actionId[0]) {
            case 'e':
                this.raceDetected = 'N';
                break;
            case 'o':
                this.raceDetected = 'O';
                break;
            case 'h':
                this.raceDetected = 'H';
                break;
            case 'u':
                this.raceDetected = 'U';
                break;
        }
    };
    Player.prototype.handleStringencodedItemID = function (actionId, gametime) {
        if (units[actionId]) {
            this.units.summary[actionId] = this.units.summary[actionId] + 1 || 1;
            this.units.order.push({ id: actionId, ms: gametime });
        }
        else if (items[actionId]) {
            this.items.summary[actionId] = this.items.summary[actionId] + 1 || 1;
            this.items.order.push({ id: actionId, ms: gametime });
        }
        else if (buildings[actionId]) {
            this.buildings.summary[actionId] = this.buildings.summary[actionId] + 1 || 1;
            this.buildings.order.push({ id: actionId, ms: gametime });
        }
        else if (upgrades[actionId]) {
            this.upgrades.summary[actionId] = this.upgrades.summary[actionId] + 1 || 1;
            this.upgrades.order.push({ id: actionId, ms: gametime });
        }
    };
    Player.prototype.handleHeroSkill = function (actionId, gametime) {
        var heroId = abilityToHero[actionId];
        if (this.heroCollector[heroId] === undefined) {
            this.heroCount += 1;
            this.heroCollector[heroId] = { level: 0, abilities: {}, order: this.heroCount, id: heroId, abilityOrder: [], retrainingHistory: [] };
        }
        if (this._lastRetrainingTime > 0) {
            this.heroCollector[heroId].retrainingHistory.push({ time: this._lastRetrainingTime, abilities: this.heroCollector[heroId].abilities });
            this.heroCollector[heroId].abilities = {};
            this.heroCollector[heroId].abilityOrder.push({ type: 'retraining', time: this._lastRetrainingTime });
            this._lastRetrainingTime = 0;
        }
        this.heroCollector[heroId].abilities[actionId] = this.heroCollector[heroId].abilities[actionId] || 0;
        this.heroCollector[heroId].abilities[actionId] += 1;
        this.heroCollector[heroId].abilityOrder.push({ type: 'ability', time: gametime, value: actionId });
    };
    Player.prototype.handleRetraining = function (gametime) {
        this._lastRetrainingTime = gametime;
    };
    Player.prototype.handle0x10 = function (itemid, gametime) {
        switch (itemid.value[0]) {
            case 'A':
                this.handleHeroSkill(itemid.value, gametime);
                break;
            case 'R':
                this.handleStringencodedItemID(itemid.value, gametime);
                break;
            case 'u':
            case 'e':
            case 'h':
            case 'o':
                if (!this.raceDetected) {
                    this.detectRaceByActionId(itemid.value);
                }
                this.handleStringencodedItemID(itemid.value, gametime);
                break;
            default:
                this.handleStringencodedItemID(itemid.value, gametime);
        }
        itemid.value[0] !== '0'
            ? this.actions.buildtrain = this.actions.buildtrain + 1 || 1
            : this.actions.ability = this.actions.ability + 1 || 1;
        this._currentlyTrackedAPM++;
    };
    Player.prototype.handle0x11 = function (itemid, gametime) {
        this._currentlyTrackedAPM++;
        if (itemid.type === 'alphanumeric') {
            if (itemid.value[0] <= 0x19 && itemid.value[1] === 0) {
                this.actions.basic = this.actions.basic + 1 || 1;
            }
            else {
                this.actions.ability = this.actions.ability + 1 || 1;
            }
        }
        else {
            this.handleStringencodedItemID(itemid.value, gametime);
        }
    };
    Player.prototype.handle0x12 = function (itemid) {
        if (isRightclickAction(itemid.value)) {
            this.actions.rightclick = this.actions.rightclick + 1 || 1;
        }
        else if (isBasicAction(itemid.value)) {
            this.actions.basic = this.actions.basic + 1 || 1;
        }
        else {
            this.actions.ability = this.actions.ability + 1 || 1;
        }
        this._currentlyTrackedAPM++;
    };
    Player.prototype.handle0x13 = function (itemid) {
        this.actions.item = this.actions.item + 1 || 1;
        this._currentlyTrackedAPM++;
    };
    Player.prototype.handle0x14 = function (itemid) {
        if (isRightclickAction(itemid.value)) {
            this.actions.rightclick = this.actions.rightclick + 1 || 1;
        }
        else if (isBasicAction(itemid.value)) {
            this.actions.basic = this.actions.basic + 1 || 1;
        }
        else {
            this.actions.ability = this.actions.ability + 1 || 1;
        }
        this._currentlyTrackedAPM++;
    };
    Player.prototype.handle0x16 = function (selectMode, isAPM) {
        if (isAPM) {
            this.actions.select = this.actions.select + 1 || 1;
            this._currentlyTrackedAPM++;
        }
    };
    Player.prototype.handleOther = function (actionId) {
        switch (actionId) {
            case 0x17:
                this.actions.assigngroup = this.actions.assigngroup + 1 || 1;
                this._currentlyTrackedAPM++;
                break;
            case 0x18:
                this.actions.selecthotkey = this.actions.selecthotkey + 1 || 1;
                this._currentlyTrackedAPM++;
                break;
            case 0x1C:
            case 0x1D:
            case 0x66:
            case 0x67:
                this._currentlyTrackedAPM++;
                break;
            case 0x1E:
                this.actions.removeunit = this.actions.removeunit + 1 || 1;
                this._currentlyTrackedAPM++;
                break;
            case 0x61:
                this.actions.esc = this.actions.esc + 1 || 1;
                this._currentlyTrackedAPM++;
                break;
        }
    };
    Player.prototype.cleanup = function () {
        var apmSum = this.actions.timed.reduce(function (a, b) { return a + b; });
        this.apm = Math.round(apmSum / this.actions.timed.length);
        this.heroes = reduceHeroes(this.heroCollector);
        delete this._currentlyTrackedAPM;
    };
    return Player;
}());

var Header = new binary_parser_1()
    .string('magic', { zeroTerminated: true })
    .int32le('offset')
    .int32le('compressedSize')
    .string('headerVersion', { encoding: 'hex', length: 4 })
    .int32le('decompressedSize')
    .int32le('compressedDataBlockCount');
var SubHeaderV1 = new binary_parser_1()
    .string('gameIdentifier', { length: 4 })
    .int32le('version')
    .int16le('buildNo')
    .string('flags', { encoding: 'hex', length: 2 })
    .int32le('replayLengthMS')
    .uint32le('checksum');
/*
const SubHeaderV0 = new Parser()
  .string('unknown', {length: 4})
  .int16le('version')
  .int16le('buildNo')
  .string('flags', {encoding: 'hex', length: 2})
  .int32le('replayLengthMS')
  .int32le('checksum')
*/
var DataBlock = new binary_parser_1()
    .int32le('blockSize')
    .int32le('blockDecompressedSize')
    .string('unknown', { encoding: 'hex', length: 4 })
    .buffer('compressed', { length: 'blockSize' });
var DataBlocks = new binary_parser_1()
    .array('blocks', { type: DataBlock, readUntil: 'eof' });
var ReplayHeader = new binary_parser_1()
    // @ts-ignore
    .nest(null, {
    type: Header
})
    .nest(null, { type: SubHeaderV1 })
    .nest(null, { type: DataBlocks });
var PlayerRecordLadder = new binary_parser_1()
    .string('runtimeMS', { encoding: 'hex', length: 4 })
    .int32le('raceFlags', { formatter: raceFlagFormatter });
var HostRecord = new binary_parser_1()
    .int8('playerId')
    .string('playerName', { zeroTerminated: true })
    .uint8('addDataFlagHost')
    .choice('additional', {
    tag: 'addDataFlagHost',
    choices: {
        8: PlayerRecordLadder,
        0: new binary_parser_1().skip(0),
        1: new binary_parser_1().skip(1),
        2: new binary_parser_1().skip(2)
    }
});
var PlayerRecord = new binary_parser_1()
    .int8('playerId')
    .string('playerName', { zeroTerminated: true })
    .uint8('addDataFlag')
    .choice('additional', {
    tag: 'addDataFlag',
    choices: {
        1: new binary_parser_1().skip(1),
        8: PlayerRecordLadder,
        2: new binary_parser_1().skip(2),
        0: new binary_parser_1().skip(0)
    }
});
var PlayerRecordInList = new binary_parser_1()
    // @ts-ignore
    .nest(null, { type: PlayerRecord })
    .skip(4);
var PlayerSlotRecord = new binary_parser_1()
    .int8('playerId')
    .skip(1) // mapDownloadPercent
    .int8('slotStatus')
    .int8('computerFlag')
    .int8('teamId')
    .int8('color')
    .int8('raceFlag', { formatter: raceFlagFormatter })
    .int8('aiStrength')
    .int8('handicapFlag');
var GameMetaData = new binary_parser_1()
    .skip(5)
    .nest('player', { type: HostRecord })
    .string('gameName', { zeroTerminated: true })
    .skip(1)
    .string('encodedString', { zeroTerminated: true, encoding: 'hex' })
    .int32le('playerCount')
    .string('gameType', { length: 4, encoding: 'hex' })
    .string('languageId', { length: 4, encoding: 'hex' })
    .array('playerList', {
    type: new binary_parser_1()
        .int8('hasRecord')
        // @ts-ignore
        .choice(null, {
        tag: 'hasRecord',
        choices: {
            22: PlayerRecordInList
        },
        defaultChoice: new binary_parser_1().skip(-1)
    }),
    readUntil: function (item, buffer) {
        // @ts-ignore
        var next = buffer.readInt8();
        return next === 25;
    }
})
    .int8('gameStartRecord')
    .int16('dataByteCount')
    .int8('slotRecordCount')
    .array('playerSlotRecords', { type: PlayerSlotRecord, length: 'slotRecordCount' })
    .int32le('randomSeed')
    .string('selectMode', { length: 1, encoding: 'hex' })
    .int8('startSpotCount');
var EncodedMapMetaString = new binary_parser_1()
    .uint8('speed')
    .bit1('hideTerrain')
    .bit1('mapExplored')
    .bit1('alwaysVisible')
    .bit1('default')
    .bit2('observerMode')
    .bit1('teamsTogether')
    .bit2('empty')
    .bit2('fixedTeams')
    .bit5('empty')
    .bit1('fullSharedUnitControl')
    .bit1('randomHero')
    .bit1('randomRaces')
    .bit3('empty')
    .bit1('referees')
    .skip(5)
    .string('mapChecksum', { length: 4, encoding: 'hex' })
    .string('mapName', { zeroTerminated: true })
    .string('creator', { zeroTerminated: true });

/*
  Parses actual game data
  Please note that TimeSlotBlocks do not fully parse included actions.
  They should be parsed block by block manually
  afterwards to ensure proper error handling.
*/
// 0x17
var LeaveGameBlock = new binary_parser_1()
    .string('reason', { length: 4, encoding: 'hex' })
    .int8('playerId')
    .string('result', { length: 4, encoding: 'hex' })
    .skip(4);
// 0x1A
var FirstStartBlock = new binary_parser_1()
    .skip(4);
// 0x1B
var SecondStartBlock = new binary_parser_1()
    .skip(4);
// 0x1C
var ThirdStartBlock = new binary_parser_1()
    .skip(4);
// 0x1F 0x1E
var TimeSlotBlock = new binary_parser_1()
    .int16le('byteCount')
    .int16le('timeIncrement')
    .array('actions', {
    type: CommandDataBlock,
    lengthInBytes: function () {
        // @ts-ignore
        return this.byteCount - 2;
    }
});
// 0x20
// @ts-ignore
var PlayerChatMessageBlock = new binary_parser_1()
    .int8('playerId')
    .int16le('byteCount')
    .int8('flags')
    .choice('', {
    tag: 'flags',
    choices: {
        0x10: new binary_parser_1(),
        // @ts-ignore
        0x20: new binary_parser_1().int8('mode', { length: 4, formatter: chatModeFormatter, encoding: 'hex' }).skip(3)
    }
})
    .string('message', { zeroTerminated: true, encoding: 'utf8' });
// 0x22
var Unknown0x22 = new binary_parser_1()
    .uint8('length')
    .string('content', { length: 'length' });
// 0x23
var Unknown0x23 = new binary_parser_1()
    .skip(10);
// 0x2F
var ForcedGameEndCountdown = new binary_parser_1()
    .skip(8);
// @ts-ignore
var GameData = new binary_parser_1()
    .uint8('type')
    .choice('', {
    tag: 'type',
    choices: {
        0x17: LeaveGameBlock,
        0x1a: FirstStartBlock,
        0x1b: SecondStartBlock,
        0x1c: ThirdStartBlock,
        0x1f: TimeSlotBlock,
        0x1e: TimeSlotBlock,
        0x20: PlayerChatMessageBlock,
        0x22: Unknown0x22,
        0x23: Unknown0x23,
        0x2f: ForcedGameEndCountdown,
        0: new binary_parser_1()
    }
});
var GameDataParser = new binary_parser_1()
    // @ts-ignore
    .array(null, { type: GameData, readUntil: 'eof' });

// Cannot import node modules directly because error with rollup
// https://rollupjs.org/guide/en#error-name-is-not-exported-by-module-
var readFileSync = require('fs').readFileSync;
var _a = require('zlib'), inflateSync = _a.inflateSync, constants = _a.constants;
var GameDataParserComposed = new binary_parser_1()
    .nest('meta', { type: GameMetaData })
    .nest('blocks', { type: GameDataParser });
var EventEmitter = require('events');
var ReplayParser = /** @class */ (function (_super) {
    __extends(ReplayParser, _super);
    function ReplayParser() {
        var _this = _super.call(this) || this;
        _this.msElapsed = 0;
        _this.buffer = Buffer.from('');
        _this.filename = '';
        _this.decompressed = Buffer.from('');
        return _this;
    }
    ReplayParser.prototype.parse = function ($buffer) {
        this.msElapsed = 0;
        this.buffer = readFileSync($buffer);
        this.buffer = this.buffer.slice(this.buffer.indexOf('Warcraft III recorded game'));
        this.filename = $buffer;
        var decompressed = [];
        this._parseHeader();
        this.header.blocks.forEach(function (block) {
            if (block.blockSize > 0 && block.blockDecompressedSize === 8192) {
                try {
                    var r = inflateSync(block.compressed, { finishFlush: constants.Z_SYNC_FLUSH });
                    if (r.byteLength > 0 && block.compressed.byteLength > 0) {
                        decompressed.push(r);
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
            }
        });
        this.decompressed = Buffer.concat(decompressed);
        this.gameMetaDataDecoded = GameDataParserComposed.parse(this.decompressed);
        var decodedMetaStringBuffer = this.decodeGameMetaString(this.gameMetaDataDecoded.meta.encodedString);
        var meta = __assign(__assign(__assign({}, this.gameMetaDataDecoded), this.gameMetaDataDecoded.meta), EncodedMapMetaString.parse(decodedMetaStringBuffer));
        var newMeta = meta;
        delete newMeta.meta;
        this.emit('gamemetadata', newMeta);
        this._parseGameDataBlocks();
    };
    ReplayParser.prototype._parseHeader = function () {
        this.header = ReplayHeader.parse(this.buffer);
    };
    ReplayParser.prototype._parseGameDataBlocks = function () {
        var _this = this;
        this.gameMetaDataDecoded.blocks.forEach(function (block) {
            _this.emit('gamedatablock', block);
            _this._processGameDataBlock(block);
        });
    };
    ReplayParser.prototype._processGameDataBlock = function (block) {
        switch (block.type) {
            case 31:
            case 30:
                this.msElapsed += block.timeIncrement;
                this.emit('timeslotblock', block);
                this._processTimeSlot(block);
                break;
        }
    };
    ReplayParser.prototype._processTimeSlot = function (timeSlotBlock) {
        var _this = this;
        timeSlotBlock.actions.forEach(function (block) {
            _this._processCommandDataBlock(block);
            _this.emit('commandblock', block);
        });
    };
    ReplayParser.prototype._processCommandDataBlock = function (actionBlock) {
        var _this = this;
        try {
            ActionBlockList.parse(actionBlock.actions).forEach(function (action) {
                _this.emit('actionblock', action, actionBlock.playerId);
            });
        }
        catch (ex) {
            console.error(ex);
        }
    };
    ReplayParser.prototype.decodeGameMetaString = function (str) {
        var test = Buffer.from(str, 'hex');
        var decoded = Buffer.alloc(test.length);
        var mask = 0;
        var dpos = 0;
        for (var i = 0; i < test.length; i++) {
            if (i % 8 === 0) {
                mask = test[i];
            }
            else {
                if ((mask & (0x1 << (i % 8))) === 0) {
                    decoded.writeUInt8(test[i] - 1, dpos++);
                }
                else {
                    decoded.writeUInt8(test[i], dpos++);
                }
            }
        }
        return decoded;
    };
    return ReplayParser;
}(EventEmitter));

var sortPlayers = function (player1, player2) {
    if (player2.teamid > player1.teamid)
        return -1;
    if (player2.teamid < player1.teamid)
        return 1;
    if (player2.id > player1.id)
        return -1;
    if (player2.id < player1.id)
        return 1;
    return 0;
};

// Cannot import node modules directly because error with rollup
// https://rollupjs.org/guide/en#error-name-is-not-exported-by-module-
var createHash = require('crypto').createHash;
var performance$1 = require('perf_hooks').performance;
var W3GReplay = /** @class */ (function (_super) {
    __extends(W3GReplay, _super);
    function W3GReplay() {
        var _this = _super.call(this) || this;
        _this.playerActionTracker = {};
        _this.id = '';
        _this.totalTimeTracker = 0;
        _this.timeSegmentTracker = 0;
        _this.playerActionTrackInterval = 60000;
        _this.gametype = '';
        _this.matchup = '';
        _this.on('gamemetadata', function (metaData) { return _this.handleMetaData(metaData); });
        _this.on('gamedatablock', function (block) { return _this.processGameDataBlock(block); });
        _this.on('timeslotblock', function (block) { return _this.handleTimeSlot(block); });
        return _this;
    }
    // gamedatablock timeslotblock commandblock actionblock
    W3GReplay.prototype.parse = function ($buffer) {
        var _this = this;
        this.parseStartTime = performance$1.now();
        this.buffer = Buffer.from('');
        this.filename = '';
        this.id = '';
        this.chatlog = [];
        this.leaveEvents = [];
        this.w3mmd = [];
        this.players = {};
        this.totalTimeTracker = 0;
        this.timeSegmentTracker = 0;
        this.playerActionTrackInterval = 60000;
        _super.prototype.parse.call(this, $buffer);
        this.chatlog = this.chatlog.map(function (elem) {
            return (__assign(__assign({}, elem), { player: _this.players[elem.playerId].name }));
        });
        this.generateID();
        this.determineMatchup();
        this.cleanup();
        return this.finalize();
    };
    W3GReplay.prototype.handleMetaData = function (metaData) {
        var _this = this;
        this.slots = metaData.playerSlotRecords;
        this.playerList = __spreadArrays([metaData.player], metaData.playerList);
        this.meta = metaData;
        var tempPlayers = {};
        this.teams = [];
        this.players = {};
        this.playerList.forEach(function (player) {
            tempPlayers[player.playerId] = player;
        });
        this.slots.forEach(function (slot) {
            if (slot.slotStatus > 1) {
                _this.teams[slot.teamId] = _this.teams[slot.teamId] || [];
                _this.teams[slot.teamId].push(slot.playerId);
                _this.players[slot.playerId] = new Player(slot.playerId, tempPlayers[slot.playerId]
                    ? tempPlayers[slot.playerId].playerName
                    : 'Computer', slot.teamId, slot.color, slot.raceFlag);
            }
        });
    };
    W3GReplay.prototype.processGameDataBlock = function (block) {
        switch (block.type) {
            case 31:
            case 30:
                this.totalTimeTracker += block.timeIncrement;
                this.timeSegmentTracker += block.timeIncrement;
                if (this.timeSegmentTracker > this.playerActionTrackInterval) {
                    // @ts-ignore
                    Object.values(this.players).forEach(function (p) { return p.newActionTrackingSegment(); });
                    this.timeSegmentTracker = 0;
                }
                break;
            case 32:
                block.timeMS = this.totalTimeTracker;
                this.chatlog.push(block);
                break;
            case 23:
                this.leaveEvents.push(block);
                break;
        }
    };
    W3GReplay.prototype.handleTimeSlot = function (block) {
        var _this = this;
        block.actions.forEach(function (commandBlock) {
            _this.processCommandDataBlock(commandBlock);
        });
    };
    W3GReplay.prototype.processCommandDataBlock = function (block) {
        var _this = this;
        var currentPlayer = this.players[block.playerId];
        currentPlayer.currentTimePlayed = this.totalTimeTracker;
        currentPlayer._lastActionWasDeselect = false;
        try {
            ActionBlockList.parse(block.actions).forEach(function (action) {
                _this.handleActionBlock(action, currentPlayer);
            });
        }
        catch (ex) {
            console.error(ex);
        }
    };
    W3GReplay.prototype.handleActionBlock = function (action, currentPlayer) {
        this.playerActionTracker[currentPlayer.id] = this.playerActionTracker[currentPlayer.id] || [];
        this.playerActionTracker[currentPlayer.id].push(action);
        if (action.itemId && (action.itemId.value === 'tert' || action.itemId.value === 'tret')) {
            currentPlayer.handleRetraining(this.totalTimeTracker);
        }
        switch (action.actionId) {
            case 0x10:
                currentPlayer.handle0x10(action.itemId, this.totalTimeTracker);
                break;
            case 0x11:
                currentPlayer.handle0x11(action.itemId, this.totalTimeTracker);
                break;
            case 0x12:
                currentPlayer.handle0x12(action.itemId);
                break;
            case 0x13:
                currentPlayer.handle0x13(action.itemId);
                break;
            case 0x14:
                currentPlayer.handle0x14(action.itemId1);
                break;
            case 0x16:
                if (action.selectMode === 0x02) {
                    currentPlayer._lastActionWasDeselect = true;
                    currentPlayer.handle0x16(action.selectMode, true);
                }
                else {
                    if (currentPlayer._lastActionWasDeselect === false) {
                        currentPlayer.handle0x16(action.selectMode, true);
                    }
                    currentPlayer._lastActionWasDeselect = false;
                }
                break;
            case 0x17:
            case 0x18:
            case 0x1C:
            case 0x1D:
            case 0x1E:
            case 0x61:
            case 0x65:
            case 0x66:
            case 0x67:
                currentPlayer.handleOther(action.actionId);
                break;
            case 0x6b:
                this.w3mmd.push(action);
                break;
        }
    };
    W3GReplay.prototype.isObserver = function (player) {
        return (player.teamid === 24 && this.header.version >= 29) || (player.teamid === 12 && this.header.version < 29);
    };
    W3GReplay.prototype.determineMatchup = function () {
        var _this = this;
        var teamRaces = {};
        Object.values(this.players).forEach(function (p) {
            if (!_this.isObserver(p)) {
                teamRaces[p.teamid] = teamRaces[p.teamid] || [];
                teamRaces[p.teamid].push(p.raceDetected || p.race);
            }
        });
        this.gametype = Object.values(teamRaces).map(function (e) { return e.length; }).sort().join('on');
        this.matchup = Object.values(teamRaces).map(function (e) { return e.sort().join(''); }).sort().join('v');
    };
    W3GReplay.prototype.generateID = function () {
        var _this = this;
        var players = Object.values(this.players).filter(function (p) { return _this.isObserver(p) === false; }).sort(function (player1, player2) {
            if (player1.id < player2.id) {
                return -1;
            }
            return 1;
        }).reduce(function (accumulator, player) {
            accumulator += player.name;
            return accumulator;
        }, '');
        var idBase = this.meta.randomSeed + players + this.meta.mapName;
        this.id = createHash('sha256').update(idBase).digest('hex');
    };
    W3GReplay.prototype.cleanup = function () {
        var _this = this;
        this.observers = [];
        Object.values(this.players).forEach(function (p) {
            p.newActionTrackingSegment(_this.playerActionTrackInterval);
            p.cleanup();
            if (_this.isObserver(p)) {
                _this.observers.push(p.name);
                delete _this.players[p.id];
            }
        });
        if (this.header.version >= 29 && Object.prototype.hasOwnProperty.call(this.teams, '24')) {
            delete this.teams[24];
        }
        else if (Object.prototype.hasOwnProperty.call(this.teams, '12')) {
            delete this.teams[12];
        }
        delete this.slots;
        delete this.playerList;
        delete this.buffer;
        delete this.decompressed;
        delete this.gameMetaDataDecoded;
        delete this.header.blocks;
        delete this.apmTimeSeries;
    };
    W3GReplay.prototype.finalize = function () {
        var settings = {
            referees: !!this.meta.referees,
            fixedTeams: !!this.meta.fixedTeams,
            fullSharedUnitControl: !!this.meta.fullSharedUnitControl,
            alwaysVisible: !!this.meta.alwaysVisible,
            hideTerrain: !!this.meta.hideTerrain,
            mapExplored: !!this.meta.mapExplored,
            teamsTogether: !!this.meta.teamsTogether,
            randomHero: !!this.meta.randomHero,
            randomRaces: !!this.meta.randomRaces,
            speed: this.meta.speed
        };
        var root = {
            id: this.id,
            gamename: this.meta.gameName,
            randomseed: this.meta.randomSeed,
            startSpots: this.meta.startSpotCount,
            observers: this.observers,
            players: Object.values(this.players).sort(sortPlayers),
            matchup: this.matchup,
            creator: this.meta.creator,
            type: this.gametype,
            chat: this.chatlog,
            apm: {
                trackingInterval: this.playerActionTrackInterval
            },
            map: {
                path: this.meta.mapName,
                file: convert.mapFilename(this.meta.mapName),
                checksum: this.meta.mapChecksum
            },
            version: convert.gameVersion(this.header.version),
            duration: this.header.replayLengthMS,
            expansion: this.header.gameIdentifier === 'PX3W',
            settings: settings,
            parseTime: Math.round(performance$1.now() - this.parseStartTime)
        };
        return root;
    };
    return W3GReplay;
}(ReplayParser));

export default W3GReplay;
//# sourceMappingURL=W3GReplay.es5.js.map
