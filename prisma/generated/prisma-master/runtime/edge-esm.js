var Hs = Object.create;
var Qr = Object.defineProperty;
var Ws = Object.getOwnPropertyDescriptor;
var Ks = Object.getOwnPropertyNames;
var zs = Object.getPrototypeOf,
  Ys = Object.prototype.hasOwnProperty;
var Hr = ((e) =>
  typeof require < 'u'
    ? require
    : typeof Proxy < 'u'
    ? new Proxy(e, { get: (t, r) => (typeof require < 'u' ? require : t)[r] })
    : e)(function (e) {
  if (typeof require < 'u') return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var Te = (e, t) => () => (e && (t = e((e = 0))), t);
var Fe = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
  Wr = (e, t) => {
    for (var r in t) Qr(e, r, { get: t[r], enumerable: !0 });
  },
  Zs = (e, t, r, n) => {
    if ((t && typeof t == 'object') || typeof t == 'function')
      for (let i of Ks(t))
        !Ys.call(e, i) && i !== r && Qr(e, i, { get: () => t[i], enumerable: !(n = Ws(t, i)) || n.enumerable });
    return e;
  };
var _e = (e, t, r) => (
  (r = e != null ? Hs(zs(e)) : {}), Zs(t || !e || !e.__esModule ? Qr(r, 'default', { value: e, enumerable: !0 }) : r, e)
);
var y,
  c = Te(() => {
    'use strict';
    y = {
      nextTick: (e, ...t) => {
        setTimeout(() => {
          e(...t);
        }, 0);
      },
      env: {},
      version: '',
      cwd: () => '/',
      stderr: {},
      argv: ['/bin/node'],
    };
  });
var b,
  p = Te(() => {
    'use strict';
    b =
      globalThis.performance ??
      (() => {
        let e = Date.now();
        return { now: () => Date.now() - e };
      })();
  });
var E,
  m = Te(() => {
    'use strict';
    E = () => {};
    E.prototype = E;
  });
var d = Te(() => {
  'use strict';
});
var ci = Fe((ze) => {
  'use strict';
  f();
  c();
  p();
  m();
  d();
  var zn = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
    Xs = zn((e) => {
      'use strict';
      (e.byteLength = l), (e.toByteArray = g), (e.fromByteArray = S);
      var t = [],
        r = [],
        n = typeof Uint8Array < 'u' ? Uint8Array : Array,
        i = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      for (o = 0, s = i.length; o < s; ++o) (t[o] = i[o]), (r[i.charCodeAt(o)] = o);
      var o, s;
      (r[45] = 62), (r[95] = 63);
      function a(C) {
        var R = C.length;
        if (R % 4 > 0) throw new Error('Invalid string. Length must be a multiple of 4');
        var M = C.indexOf('=');
        M === -1 && (M = R);
        var F = M === R ? 0 : 4 - (M % 4);
        return [M, F];
      }
      function l(C) {
        var R = a(C),
          M = R[0],
          F = R[1];
        return ((M + F) * 3) / 4 - F;
      }
      function u(C, R, M) {
        return ((R + M) * 3) / 4 - M;
      }
      function g(C) {
        var R,
          M = a(C),
          F = M[0],
          B = M[1],
          D = new n(u(C, F, B)),
          O = 0,
          oe = B > 0 ? F - 4 : F,
          G;
        for (G = 0; G < oe; G += 4)
          (R =
            (r[C.charCodeAt(G)] << 18) |
            (r[C.charCodeAt(G + 1)] << 12) |
            (r[C.charCodeAt(G + 2)] << 6) |
            r[C.charCodeAt(G + 3)]),
            (D[O++] = (R >> 16) & 255),
            (D[O++] = (R >> 8) & 255),
            (D[O++] = R & 255);
        return (
          B === 2 && ((R = (r[C.charCodeAt(G)] << 2) | (r[C.charCodeAt(G + 1)] >> 4)), (D[O++] = R & 255)),
          B === 1 &&
            ((R = (r[C.charCodeAt(G)] << 10) | (r[C.charCodeAt(G + 1)] << 4) | (r[C.charCodeAt(G + 2)] >> 2)),
            (D[O++] = (R >> 8) & 255),
            (D[O++] = R & 255)),
          D
        );
      }
      function h(C) {
        return t[(C >> 18) & 63] + t[(C >> 12) & 63] + t[(C >> 6) & 63] + t[C & 63];
      }
      function v(C, R, M) {
        for (var F, B = [], D = R; D < M; D += 3)
          (F = ((C[D] << 16) & 16711680) + ((C[D + 1] << 8) & 65280) + (C[D + 2] & 255)), B.push(h(F));
        return B.join('');
      }
      function S(C) {
        for (var R, M = C.length, F = M % 3, B = [], D = 16383, O = 0, oe = M - F; O < oe; O += D)
          B.push(v(C, O, O + D > oe ? oe : O + D));
        return (
          F === 1
            ? ((R = C[M - 1]), B.push(t[R >> 2] + t[(R << 4) & 63] + '=='))
            : F === 2 &&
              ((R = (C[M - 2] << 8) + C[M - 1]), B.push(t[R >> 10] + t[(R >> 4) & 63] + t[(R << 2) & 63] + '=')),
          B.join('')
        );
      }
    }),
    ea = zn((e) => {
      (e.read = function (t, r, n, i, o) {
        var s,
          a,
          l = o * 8 - i - 1,
          u = (1 << l) - 1,
          g = u >> 1,
          h = -7,
          v = n ? o - 1 : 0,
          S = n ? -1 : 1,
          C = t[r + v];
        for (v += S, s = C & ((1 << -h) - 1), C >>= -h, h += l; h > 0; s = s * 256 + t[r + v], v += S, h -= 8);
        for (a = s & ((1 << -h) - 1), s >>= -h, h += i; h > 0; a = a * 256 + t[r + v], v += S, h -= 8);
        if (s === 0) s = 1 - g;
        else {
          if (s === u) return a ? NaN : (C ? -1 : 1) * (1 / 0);
          (a = a + Math.pow(2, i)), (s = s - g);
        }
        return (C ? -1 : 1) * a * Math.pow(2, s - i);
      }),
        (e.write = function (t, r, n, i, o, s) {
          var a,
            l,
            u,
            g = s * 8 - o - 1,
            h = (1 << g) - 1,
            v = h >> 1,
            S = o === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
            C = i ? 0 : s - 1,
            R = i ? 1 : -1,
            M = r < 0 || (r === 0 && 1 / r < 0) ? 1 : 0;
          for (
            r = Math.abs(r),
              isNaN(r) || r === 1 / 0
                ? ((l = isNaN(r) ? 1 : 0), (a = h))
                : ((a = Math.floor(Math.log(r) / Math.LN2)),
                  r * (u = Math.pow(2, -a)) < 1 && (a--, (u *= 2)),
                  a + v >= 1 ? (r += S / u) : (r += S * Math.pow(2, 1 - v)),
                  r * u >= 2 && (a++, (u /= 2)),
                  a + v >= h
                    ? ((l = 0), (a = h))
                    : a + v >= 1
                    ? ((l = (r * u - 1) * Math.pow(2, o)), (a = a + v))
                    : ((l = r * Math.pow(2, v - 1) * Math.pow(2, o)), (a = 0)));
            o >= 8;
            t[n + C] = l & 255, C += R, l /= 256, o -= 8
          );
          for (a = (a << o) | l, g += o; g > 0; t[n + C] = a & 255, C += R, a /= 256, g -= 8);
          t[n + C - R] |= M * 128;
        });
    }),
    Kr = Xs(),
    We = ea(),
    Qn =
      typeof Symbol == 'function' && typeof Symbol.for == 'function' ? Symbol.for('nodejs.util.inspect.custom') : null;
  ze.Buffer = T;
  ze.SlowBuffer = sa;
  ze.INSPECT_MAX_BYTES = 50;
  var or = 2147483647;
  ze.kMaxLength = or;
  T.TYPED_ARRAY_SUPPORT = ta();
  !T.TYPED_ARRAY_SUPPORT &&
    typeof console < 'u' &&
    typeof console.error == 'function' &&
    console.error(
      'This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.',
    );
  function ta() {
    try {
      let e = new Uint8Array(1),
        t = {
          foo: function () {
            return 42;
          },
        };
      return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(e, t), e.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(T.prototype, 'parent', {
    enumerable: !0,
    get: function () {
      if (T.isBuffer(this)) return this.buffer;
    },
  });
  Object.defineProperty(T.prototype, 'offset', {
    enumerable: !0,
    get: function () {
      if (T.isBuffer(this)) return this.byteOffset;
    },
  });
  function we(e) {
    if (e > or) throw new RangeError('The value "' + e + '" is invalid for option "size"');
    let t = new Uint8Array(e);
    return Object.setPrototypeOf(t, T.prototype), t;
  }
  function T(e, t, r) {
    if (typeof e == 'number') {
      if (typeof t == 'string')
        throw new TypeError('The "string" argument must be of type string. Received type number');
      return Zr(e);
    }
    return Yn(e, t, r);
  }
  T.poolSize = 8192;
  function Yn(e, t, r) {
    if (typeof e == 'string') return na(e, t);
    if (ArrayBuffer.isView(e)) return ia(e);
    if (e == null)
      throw new TypeError(
        'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' +
          typeof e,
      );
    if (
      me(e, ArrayBuffer) ||
      (e && me(e.buffer, ArrayBuffer)) ||
      (typeof SharedArrayBuffer < 'u' && (me(e, SharedArrayBuffer) || (e && me(e.buffer, SharedArrayBuffer))))
    )
      return Xn(e, t, r);
    if (typeof e == 'number')
      throw new TypeError('The "value" argument must not be of type number. Received type number');
    let n = e.valueOf && e.valueOf();
    if (n != null && n !== e) return T.from(n, t, r);
    let i = oa(e);
    if (i) return i;
    if (typeof Symbol < 'u' && Symbol.toPrimitive != null && typeof e[Symbol.toPrimitive] == 'function')
      return T.from(e[Symbol.toPrimitive]('string'), t, r);
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' +
        typeof e,
    );
  }
  T.from = function (e, t, r) {
    return Yn(e, t, r);
  };
  Object.setPrototypeOf(T.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(T, Uint8Array);
  function Zn(e) {
    if (typeof e != 'number') throw new TypeError('"size" argument must be of type number');
    if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"');
  }
  function ra(e, t, r) {
    return Zn(e), e <= 0 ? we(e) : t !== void 0 ? (typeof r == 'string' ? we(e).fill(t, r) : we(e).fill(t)) : we(e);
  }
  T.alloc = function (e, t, r) {
    return ra(e, t, r);
  };
  function Zr(e) {
    return Zn(e), we(e < 0 ? 0 : Xr(e) | 0);
  }
  T.allocUnsafe = function (e) {
    return Zr(e);
  };
  T.allocUnsafeSlow = function (e) {
    return Zr(e);
  };
  function na(e, t) {
    if (((typeof t != 'string' || t === '') && (t = 'utf8'), !T.isEncoding(t)))
      throw new TypeError('Unknown encoding: ' + t);
    let r = ei(e, t) | 0,
      n = we(r),
      i = n.write(e, t);
    return i !== r && (n = n.slice(0, i)), n;
  }
  function zr(e) {
    let t = e.length < 0 ? 0 : Xr(e.length) | 0,
      r = we(t);
    for (let n = 0; n < t; n += 1) r[n] = e[n] & 255;
    return r;
  }
  function ia(e) {
    if (me(e, Uint8Array)) {
      let t = new Uint8Array(e);
      return Xn(t.buffer, t.byteOffset, t.byteLength);
    }
    return zr(e);
  }
  function Xn(e, t, r) {
    if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
    if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return (
      t === void 0 && r === void 0
        ? (n = new Uint8Array(e))
        : r === void 0
        ? (n = new Uint8Array(e, t))
        : (n = new Uint8Array(e, t, r)),
      Object.setPrototypeOf(n, T.prototype),
      n
    );
  }
  function oa(e) {
    if (T.isBuffer(e)) {
      let t = Xr(e.length) | 0,
        r = we(t);
      return r.length === 0 || e.copy(r, 0, 0, t), r;
    }
    if (e.length !== void 0) return typeof e.length != 'number' || tn(e.length) ? we(0) : zr(e);
    if (e.type === 'Buffer' && Array.isArray(e.data)) return zr(e.data);
  }
  function Xr(e) {
    if (e >= or)
      throw new RangeError('Attempt to allocate Buffer larger than maximum size: 0x' + or.toString(16) + ' bytes');
    return e | 0;
  }
  function sa(e) {
    return +e != e && (e = 0), T.alloc(+e);
  }
  T.isBuffer = function (e) {
    return e != null && e._isBuffer === !0 && e !== T.prototype;
  };
  T.compare = function (e, t) {
    if (
      (me(e, Uint8Array) && (e = T.from(e, e.offset, e.byteLength)),
      me(t, Uint8Array) && (t = T.from(t, t.offset, t.byteLength)),
      !T.isBuffer(e) || !T.isBuffer(t))
    )
      throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    if (e === t) return 0;
    let r = e.length,
      n = t.length;
    for (let i = 0, o = Math.min(r, n); i < o; ++i)
      if (e[i] !== t[i]) {
        (r = e[i]), (n = t[i]);
        break;
      }
    return r < n ? -1 : n < r ? 1 : 0;
  };
  T.isEncoding = function (e) {
    switch (String(e).toLowerCase()) {
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
        return !0;
      default:
        return !1;
    }
  };
  T.concat = function (e, t) {
    if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (e.length === 0) return T.alloc(0);
    let r;
    if (t === void 0) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
    let n = T.allocUnsafe(t),
      i = 0;
    for (r = 0; r < e.length; ++r) {
      let o = e[r];
      if (me(o, Uint8Array))
        i + o.length > n.length
          ? (T.isBuffer(o) || (o = T.from(o)), o.copy(n, i))
          : Uint8Array.prototype.set.call(n, o, i);
      else if (T.isBuffer(o)) o.copy(n, i);
      else throw new TypeError('"list" argument must be an Array of Buffers');
      i += o.length;
    }
    return n;
  };
  function ei(e, t) {
    if (T.isBuffer(e)) return e.length;
    if (ArrayBuffer.isView(e) || me(e, ArrayBuffer)) return e.byteLength;
    if (typeof e != 'string')
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e,
      );
    let r = e.length,
      n = arguments.length > 2 && arguments[2] === !0;
    if (!n && r === 0) return 0;
    let i = !1;
    for (;;)
      switch (t) {
        case 'ascii':
        case 'latin1':
        case 'binary':
          return r;
        case 'utf8':
        case 'utf-8':
          return Yr(e).length;
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return r * 2;
        case 'hex':
          return r >>> 1;
        case 'base64':
          return ui(e).length;
        default:
          if (i) return n ? -1 : Yr(e).length;
          (t = ('' + t).toLowerCase()), (i = !0);
      }
  }
  T.byteLength = ei;
  function aa(e, t, r) {
    let n = !1;
    if (
      ((t === void 0 || t < 0) && (t = 0),
      t > this.length ||
        ((r === void 0 || r > this.length) && (r = this.length), r <= 0) ||
        ((r >>>= 0), (t >>>= 0), r <= t))
    )
      return '';
    for (e || (e = 'utf8'); ; )
      switch (e) {
        case 'hex':
          return ya(this, t, r);
        case 'utf8':
        case 'utf-8':
          return ri(this, t, r);
        case 'ascii':
          return ga(this, t, r);
        case 'latin1':
        case 'binary':
          return ha(this, t, r);
        case 'base64':
          return da(this, t, r);
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return wa(this, t, r);
        default:
          if (n) throw new TypeError('Unknown encoding: ' + e);
          (e = (e + '').toLowerCase()), (n = !0);
      }
  }
  T.prototype._isBuffer = !0;
  function Le(e, t, r) {
    let n = e[t];
    (e[t] = e[r]), (e[r] = n);
  }
  T.prototype.swap16 = function () {
    let e = this.length;
    if (e % 2 !== 0) throw new RangeError('Buffer size must be a multiple of 16-bits');
    for (let t = 0; t < e; t += 2) Le(this, t, t + 1);
    return this;
  };
  T.prototype.swap32 = function () {
    let e = this.length;
    if (e % 4 !== 0) throw new RangeError('Buffer size must be a multiple of 32-bits');
    for (let t = 0; t < e; t += 4) Le(this, t, t + 3), Le(this, t + 1, t + 2);
    return this;
  };
  T.prototype.swap64 = function () {
    let e = this.length;
    if (e % 8 !== 0) throw new RangeError('Buffer size must be a multiple of 64-bits');
    for (let t = 0; t < e; t += 8)
      Le(this, t, t + 7), Le(this, t + 1, t + 6), Le(this, t + 2, t + 5), Le(this, t + 3, t + 4);
    return this;
  };
  T.prototype.toString = function () {
    let e = this.length;
    return e === 0 ? '' : arguments.length === 0 ? ri(this, 0, e) : aa.apply(this, arguments);
  };
  T.prototype.toLocaleString = T.prototype.toString;
  T.prototype.equals = function (e) {
    if (!T.isBuffer(e)) throw new TypeError('Argument must be a Buffer');
    return this === e ? !0 : T.compare(this, e) === 0;
  };
  T.prototype.inspect = function () {
    let e = '',
      t = ze.INSPECT_MAX_BYTES;
    return (
      (e = this.toString('hex', 0, t)
        .replace(/(.{2})/g, '$1 ')
        .trim()),
      this.length > t && (e += ' ... '),
      '<Buffer ' + e + '>'
    );
  };
  Qn && (T.prototype[Qn] = T.prototype.inspect);
  T.prototype.compare = function (e, t, r, n, i) {
    if ((me(e, Uint8Array) && (e = T.from(e, e.offset, e.byteLength)), !T.isBuffer(e)))
      throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
    if (
      (t === void 0 && (t = 0),
      r === void 0 && (r = e ? e.length : 0),
      n === void 0 && (n = 0),
      i === void 0 && (i = this.length),
      t < 0 || r > e.length || n < 0 || i > this.length)
    )
      throw new RangeError('out of range index');
    if (n >= i && t >= r) return 0;
    if (n >= i) return -1;
    if (t >= r) return 1;
    if (((t >>>= 0), (r >>>= 0), (n >>>= 0), (i >>>= 0), this === e)) return 0;
    let o = i - n,
      s = r - t,
      a = Math.min(o, s),
      l = this.slice(n, i),
      u = e.slice(t, r);
    for (let g = 0; g < a; ++g)
      if (l[g] !== u[g]) {
        (o = l[g]), (s = u[g]);
        break;
      }
    return o < s ? -1 : s < o ? 1 : 0;
  };
  function ti(e, t, r, n, i) {
    if (e.length === 0) return -1;
    if (
      (typeof r == 'string'
        ? ((n = r), (r = 0))
        : r > 2147483647
        ? (r = 2147483647)
        : r < -2147483648 && (r = -2147483648),
      (r = +r),
      tn(r) && (r = i ? 0 : e.length - 1),
      r < 0 && (r = e.length + r),
      r >= e.length)
    ) {
      if (i) return -1;
      r = e.length - 1;
    } else if (r < 0)
      if (i) r = 0;
      else return -1;
    if ((typeof t == 'string' && (t = T.from(t, n)), T.isBuffer(t))) return t.length === 0 ? -1 : Hn(e, t, r, n, i);
    if (typeof t == 'number')
      return (
        (t = t & 255),
        typeof Uint8Array.prototype.indexOf == 'function'
          ? i
            ? Uint8Array.prototype.indexOf.call(e, t, r)
            : Uint8Array.prototype.lastIndexOf.call(e, t, r)
          : Hn(e, [t], r, n, i)
      );
    throw new TypeError('val must be string, number or Buffer');
  }
  function Hn(e, t, r, n, i) {
    let o = 1,
      s = e.length,
      a = t.length;
    if (
      n !== void 0 &&
      ((n = String(n).toLowerCase()), n === 'ucs2' || n === 'ucs-2' || n === 'utf16le' || n === 'utf-16le')
    ) {
      if (e.length < 2 || t.length < 2) return -1;
      (o = 2), (s /= 2), (a /= 2), (r /= 2);
    }
    function l(g, h) {
      return o === 1 ? g[h] : g.readUInt16BE(h * o);
    }
    let u;
    if (i) {
      let g = -1;
      for (u = r; u < s; u++)
        if (l(e, u) === l(t, g === -1 ? 0 : u - g)) {
          if ((g === -1 && (g = u), u - g + 1 === a)) return g * o;
        } else g !== -1 && (u -= u - g), (g = -1);
    } else
      for (r + a > s && (r = s - a), u = r; u >= 0; u--) {
        let g = !0;
        for (let h = 0; h < a; h++)
          if (l(e, u + h) !== l(t, h)) {
            g = !1;
            break;
          }
        if (g) return u;
      }
    return -1;
  }
  T.prototype.includes = function (e, t, r) {
    return this.indexOf(e, t, r) !== -1;
  };
  T.prototype.indexOf = function (e, t, r) {
    return ti(this, e, t, r, !0);
  };
  T.prototype.lastIndexOf = function (e, t, r) {
    return ti(this, e, t, r, !1);
  };
  function la(e, t, r, n) {
    r = Number(r) || 0;
    let i = e.length - r;
    n ? ((n = Number(n)), n > i && (n = i)) : (n = i);
    let o = t.length;
    n > o / 2 && (n = o / 2);
    let s;
    for (s = 0; s < n; ++s) {
      let a = parseInt(t.substr(s * 2, 2), 16);
      if (tn(a)) return s;
      e[r + s] = a;
    }
    return s;
  }
  function ua(e, t, r, n) {
    return sr(Yr(t, e.length - r), e, r, n);
  }
  function ca(e, t, r, n) {
    return sr(Pa(t), e, r, n);
  }
  function pa(e, t, r, n) {
    return sr(ui(t), e, r, n);
  }
  function ma(e, t, r, n) {
    return sr(va(t, e.length - r), e, r, n);
  }
  T.prototype.write = function (e, t, r, n) {
    if (t === void 0) (n = 'utf8'), (r = this.length), (t = 0);
    else if (r === void 0 && typeof t == 'string') (n = t), (r = this.length), (t = 0);
    else if (isFinite(t))
      (t = t >>> 0), isFinite(r) ? ((r = r >>> 0), n === void 0 && (n = 'utf8')) : ((n = r), (r = void 0));
    else throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
    let i = this.length - t;
    if (((r === void 0 || r > i) && (r = i), (e.length > 0 && (r < 0 || t < 0)) || t > this.length))
      throw new RangeError('Attempt to write outside buffer bounds');
    n || (n = 'utf8');
    let o = !1;
    for (;;)
      switch (n) {
        case 'hex':
          return la(this, e, t, r);
        case 'utf8':
        case 'utf-8':
          return ua(this, e, t, r);
        case 'ascii':
        case 'latin1':
        case 'binary':
          return ca(this, e, t, r);
        case 'base64':
          return pa(this, e, t, r);
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return ma(this, e, t, r);
        default:
          if (o) throw new TypeError('Unknown encoding: ' + n);
          (n = ('' + n).toLowerCase()), (o = !0);
      }
  };
  T.prototype.toJSON = function () {
    return { type: 'Buffer', data: Array.prototype.slice.call(this._arr || this, 0) };
  };
  function da(e, t, r) {
    return t === 0 && r === e.length ? Kr.fromByteArray(e) : Kr.fromByteArray(e.slice(t, r));
  }
  function ri(e, t, r) {
    r = Math.min(e.length, r);
    let n = [],
      i = t;
    for (; i < r; ) {
      let o = e[i],
        s = null,
        a = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
      if (i + a <= r) {
        let l, u, g, h;
        switch (a) {
          case 1:
            o < 128 && (s = o);
            break;
          case 2:
            (l = e[i + 1]), (l & 192) === 128 && ((h = ((o & 31) << 6) | (l & 63)), h > 127 && (s = h));
            break;
          case 3:
            (l = e[i + 1]),
              (u = e[i + 2]),
              (l & 192) === 128 &&
                (u & 192) === 128 &&
                ((h = ((o & 15) << 12) | ((l & 63) << 6) | (u & 63)), h > 2047 && (h < 55296 || h > 57343) && (s = h));
            break;
          case 4:
            (l = e[i + 1]),
              (u = e[i + 2]),
              (g = e[i + 3]),
              (l & 192) === 128 &&
                (u & 192) === 128 &&
                (g & 192) === 128 &&
                ((h = ((o & 15) << 18) | ((l & 63) << 12) | ((u & 63) << 6) | (g & 63)),
                h > 65535 && h < 1114112 && (s = h));
        }
      }
      s === null
        ? ((s = 65533), (a = 1))
        : s > 65535 && ((s -= 65536), n.push(((s >>> 10) & 1023) | 55296), (s = 56320 | (s & 1023))),
        n.push(s),
        (i += a);
    }
    return fa(n);
  }
  var Wn = 4096;
  function fa(e) {
    let t = e.length;
    if (t <= Wn) return String.fromCharCode.apply(String, e);
    let r = '',
      n = 0;
    for (; n < t; ) r += String.fromCharCode.apply(String, e.slice(n, (n += Wn)));
    return r;
  }
  function ga(e, t, r) {
    let n = '';
    r = Math.min(e.length, r);
    for (let i = t; i < r; ++i) n += String.fromCharCode(e[i] & 127);
    return n;
  }
  function ha(e, t, r) {
    let n = '';
    r = Math.min(e.length, r);
    for (let i = t; i < r; ++i) n += String.fromCharCode(e[i]);
    return n;
  }
  function ya(e, t, r) {
    let n = e.length;
    (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
    let i = '';
    for (let o = t; o < r; ++o) i += Ta[e[o]];
    return i;
  }
  function wa(e, t, r) {
    let n = e.slice(t, r),
      i = '';
    for (let o = 0; o < n.length - 1; o += 2) i += String.fromCharCode(n[o] + n[o + 1] * 256);
    return i;
  }
  T.prototype.slice = function (e, t) {
    let r = this.length;
    (e = ~~e),
      (t = t === void 0 ? r : ~~t),
      e < 0 ? ((e += r), e < 0 && (e = 0)) : e > r && (e = r),
      t < 0 ? ((t += r), t < 0 && (t = 0)) : t > r && (t = r),
      t < e && (t = e);
    let n = this.subarray(e, t);
    return Object.setPrototypeOf(n, T.prototype), n;
  };
  function H(e, t, r) {
    if (e % 1 !== 0 || e < 0) throw new RangeError('offset is not uint');
    if (e + t > r) throw new RangeError('Trying to access beyond buffer length');
  }
  T.prototype.readUintLE = T.prototype.readUIntLE = function (e, t, r) {
    (e = e >>> 0), (t = t >>> 0), r || H(e, t, this.length);
    let n = this[e],
      i = 1,
      o = 0;
    for (; ++o < t && (i *= 256); ) n += this[e + o] * i;
    return n;
  };
  T.prototype.readUintBE = T.prototype.readUIntBE = function (e, t, r) {
    (e = e >>> 0), (t = t >>> 0), r || H(e, t, this.length);
    let n = this[e + --t],
      i = 1;
    for (; t > 0 && (i *= 256); ) n += this[e + --t] * i;
    return n;
  };
  T.prototype.readUint8 = T.prototype.readUInt8 = function (e, t) {
    return (e = e >>> 0), t || H(e, 1, this.length), this[e];
  };
  T.prototype.readUint16LE = T.prototype.readUInt16LE = function (e, t) {
    return (e = e >>> 0), t || H(e, 2, this.length), this[e] | (this[e + 1] << 8);
  };
  T.prototype.readUint16BE = T.prototype.readUInt16BE = function (e, t) {
    return (e = e >>> 0), t || H(e, 2, this.length), (this[e] << 8) | this[e + 1];
  };
  T.prototype.readUint32LE = T.prototype.readUInt32LE = function (e, t) {
    return (
      (e = e >>> 0),
      t || H(e, 4, this.length),
      (this[e] | (this[e + 1] << 8) | (this[e + 2] << 16)) + this[e + 3] * 16777216
    );
  };
  T.prototype.readUint32BE = T.prototype.readUInt32BE = function (e, t) {
    return (
      (e = e >>> 0),
      t || H(e, 4, this.length),
      this[e] * 16777216 + ((this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3])
    );
  };
  T.prototype.readBigUInt64LE = Ae(function (e) {
    (e = e >>> 0), Ke(e, 'offset');
    let t = this[e],
      r = this[e + 7];
    (t === void 0 || r === void 0) && Et(e, this.length - 8);
    let n = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24,
      i = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + r * 2 ** 24;
    return BigInt(n) + (BigInt(i) << BigInt(32));
  });
  T.prototype.readBigUInt64BE = Ae(function (e) {
    (e = e >>> 0), Ke(e, 'offset');
    let t = this[e],
      r = this[e + 7];
    (t === void 0 || r === void 0) && Et(e, this.length - 8);
    let n = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e],
      i = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + r;
    return (BigInt(n) << BigInt(32)) + BigInt(i);
  });
  T.prototype.readIntLE = function (e, t, r) {
    (e = e >>> 0), (t = t >>> 0), r || H(e, t, this.length);
    let n = this[e],
      i = 1,
      o = 0;
    for (; ++o < t && (i *= 256); ) n += this[e + o] * i;
    return (i *= 128), n >= i && (n -= Math.pow(2, 8 * t)), n;
  };
  T.prototype.readIntBE = function (e, t, r) {
    (e = e >>> 0), (t = t >>> 0), r || H(e, t, this.length);
    let n = t,
      i = 1,
      o = this[e + --n];
    for (; n > 0 && (i *= 256); ) o += this[e + --n] * i;
    return (i *= 128), o >= i && (o -= Math.pow(2, 8 * t)), o;
  };
  T.prototype.readInt8 = function (e, t) {
    return (e = e >>> 0), t || H(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
  };
  T.prototype.readInt16LE = function (e, t) {
    (e = e >>> 0), t || H(e, 2, this.length);
    let r = this[e] | (this[e + 1] << 8);
    return r & 32768 ? r | 4294901760 : r;
  };
  T.prototype.readInt16BE = function (e, t) {
    (e = e >>> 0), t || H(e, 2, this.length);
    let r = this[e + 1] | (this[e] << 8);
    return r & 32768 ? r | 4294901760 : r;
  };
  T.prototype.readInt32LE = function (e, t) {
    return (
      (e = e >>> 0), t || H(e, 4, this.length), this[e] | (this[e + 1] << 8) | (this[e + 2] << 16) | (this[e + 3] << 24)
    );
  };
  T.prototype.readInt32BE = function (e, t) {
    return (
      (e = e >>> 0), t || H(e, 4, this.length), (this[e] << 24) | (this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3]
    );
  };
  T.prototype.readBigInt64LE = Ae(function (e) {
    (e = e >>> 0), Ke(e, 'offset');
    let t = this[e],
      r = this[e + 7];
    (t === void 0 || r === void 0) && Et(e, this.length - 8);
    let n = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (r << 24);
    return (BigInt(n) << BigInt(32)) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
  });
  T.prototype.readBigInt64BE = Ae(function (e) {
    (e = e >>> 0), Ke(e, 'offset');
    let t = this[e],
      r = this[e + 7];
    (t === void 0 || r === void 0) && Et(e, this.length - 8);
    let n = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
    return (BigInt(n) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + r);
  });
  T.prototype.readFloatLE = function (e, t) {
    return (e = e >>> 0), t || H(e, 4, this.length), We.read(this, e, !0, 23, 4);
  };
  T.prototype.readFloatBE = function (e, t) {
    return (e = e >>> 0), t || H(e, 4, this.length), We.read(this, e, !1, 23, 4);
  };
  T.prototype.readDoubleLE = function (e, t) {
    return (e = e >>> 0), t || H(e, 8, this.length), We.read(this, e, !0, 52, 8);
  };
  T.prototype.readDoubleBE = function (e, t) {
    return (e = e >>> 0), t || H(e, 8, this.length), We.read(this, e, !1, 52, 8);
  };
  function re(e, t, r, n, i, o) {
    if (!T.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');
    if (r + n > e.length) throw new RangeError('Index out of range');
  }
  T.prototype.writeUintLE = T.prototype.writeUIntLE = function (e, t, r, n) {
    if (((e = +e), (t = t >>> 0), (r = r >>> 0), !n)) {
      let s = Math.pow(2, 8 * r) - 1;
      re(this, e, t, r, s, 0);
    }
    let i = 1,
      o = 0;
    for (this[t] = e & 255; ++o < r && (i *= 256); ) this[t + o] = (e / i) & 255;
    return t + r;
  };
  T.prototype.writeUintBE = T.prototype.writeUIntBE = function (e, t, r, n) {
    if (((e = +e), (t = t >>> 0), (r = r >>> 0), !n)) {
      let s = Math.pow(2, 8 * r) - 1;
      re(this, e, t, r, s, 0);
    }
    let i = r - 1,
      o = 1;
    for (this[t + i] = e & 255; --i >= 0 && (o *= 256); ) this[t + i] = (e / o) & 255;
    return t + r;
  };
  T.prototype.writeUint8 = T.prototype.writeUInt8 = function (e, t, r) {
    return (e = +e), (t = t >>> 0), r || re(this, e, t, 1, 255, 0), (this[t] = e & 255), t + 1;
  };
  T.prototype.writeUint16LE = T.prototype.writeUInt16LE = function (e, t, r) {
    return (
      (e = +e), (t = t >>> 0), r || re(this, e, t, 2, 65535, 0), (this[t] = e & 255), (this[t + 1] = e >>> 8), t + 2
    );
  };
  T.prototype.writeUint16BE = T.prototype.writeUInt16BE = function (e, t, r) {
    return (
      (e = +e), (t = t >>> 0), r || re(this, e, t, 2, 65535, 0), (this[t] = e >>> 8), (this[t + 1] = e & 255), t + 2
    );
  };
  T.prototype.writeUint32LE = T.prototype.writeUInt32LE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || re(this, e, t, 4, 4294967295, 0),
      (this[t + 3] = e >>> 24),
      (this[t + 2] = e >>> 16),
      (this[t + 1] = e >>> 8),
      (this[t] = e & 255),
      t + 4
    );
  };
  T.prototype.writeUint32BE = T.prototype.writeUInt32BE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || re(this, e, t, 4, 4294967295, 0),
      (this[t] = e >>> 24),
      (this[t + 1] = e >>> 16),
      (this[t + 2] = e >>> 8),
      (this[t + 3] = e & 255),
      t + 4
    );
  };
  function ni(e, t, r, n, i) {
    li(t, n, i, e, r, 7);
    let o = Number(t & BigInt(4294967295));
    (e[r++] = o), (o = o >> 8), (e[r++] = o), (o = o >> 8), (e[r++] = o), (o = o >> 8), (e[r++] = o);
    let s = Number((t >> BigInt(32)) & BigInt(4294967295));
    return (e[r++] = s), (s = s >> 8), (e[r++] = s), (s = s >> 8), (e[r++] = s), (s = s >> 8), (e[r++] = s), r;
  }
  function ii(e, t, r, n, i) {
    li(t, n, i, e, r, 7);
    let o = Number(t & BigInt(4294967295));
    (e[r + 7] = o), (o = o >> 8), (e[r + 6] = o), (o = o >> 8), (e[r + 5] = o), (o = o >> 8), (e[r + 4] = o);
    let s = Number((t >> BigInt(32)) & BigInt(4294967295));
    return (e[r + 3] = s), (s = s >> 8), (e[r + 2] = s), (s = s >> 8), (e[r + 1] = s), (s = s >> 8), (e[r] = s), r + 8;
  }
  T.prototype.writeBigUInt64LE = Ae(function (e, t = 0) {
    return ni(this, e, t, BigInt(0), BigInt('0xffffffffffffffff'));
  });
  T.prototype.writeBigUInt64BE = Ae(function (e, t = 0) {
    return ii(this, e, t, BigInt(0), BigInt('0xffffffffffffffff'));
  });
  T.prototype.writeIntLE = function (e, t, r, n) {
    if (((e = +e), (t = t >>> 0), !n)) {
      let a = Math.pow(2, 8 * r - 1);
      re(this, e, t, r, a - 1, -a);
    }
    let i = 0,
      o = 1,
      s = 0;
    for (this[t] = e & 255; ++i < r && (o *= 256); )
      e < 0 && s === 0 && this[t + i - 1] !== 0 && (s = 1), (this[t + i] = (((e / o) >> 0) - s) & 255);
    return t + r;
  };
  T.prototype.writeIntBE = function (e, t, r, n) {
    if (((e = +e), (t = t >>> 0), !n)) {
      let a = Math.pow(2, 8 * r - 1);
      re(this, e, t, r, a - 1, -a);
    }
    let i = r - 1,
      o = 1,
      s = 0;
    for (this[t + i] = e & 255; --i >= 0 && (o *= 256); )
      e < 0 && s === 0 && this[t + i + 1] !== 0 && (s = 1), (this[t + i] = (((e / o) >> 0) - s) & 255);
    return t + r;
  };
  T.prototype.writeInt8 = function (e, t, r) {
    return (
      (e = +e), (t = t >>> 0), r || re(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), (this[t] = e & 255), t + 1
    );
  };
  T.prototype.writeInt16LE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || re(this, e, t, 2, 32767, -32768),
      (this[t] = e & 255),
      (this[t + 1] = e >>> 8),
      t + 2
    );
  };
  T.prototype.writeInt16BE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || re(this, e, t, 2, 32767, -32768),
      (this[t] = e >>> 8),
      (this[t + 1] = e & 255),
      t + 2
    );
  };
  T.prototype.writeInt32LE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || re(this, e, t, 4, 2147483647, -2147483648),
      (this[t] = e & 255),
      (this[t + 1] = e >>> 8),
      (this[t + 2] = e >>> 16),
      (this[t + 3] = e >>> 24),
      t + 4
    );
  };
  T.prototype.writeInt32BE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || re(this, e, t, 4, 2147483647, -2147483648),
      e < 0 && (e = 4294967295 + e + 1),
      (this[t] = e >>> 24),
      (this[t + 1] = e >>> 16),
      (this[t + 2] = e >>> 8),
      (this[t + 3] = e & 255),
      t + 4
    );
  };
  T.prototype.writeBigInt64LE = Ae(function (e, t = 0) {
    return ni(this, e, t, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
  });
  T.prototype.writeBigInt64BE = Ae(function (e, t = 0) {
    return ii(this, e, t, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
  });
  function oi(e, t, r, n, i, o) {
    if (r + n > e.length) throw new RangeError('Index out of range');
    if (r < 0) throw new RangeError('Index out of range');
  }
  function si(e, t, r, n, i) {
    return (
      (t = +t),
      (r = r >>> 0),
      i || oi(e, t, r, 4, 34028234663852886e22, -34028234663852886e22),
      We.write(e, t, r, n, 23, 4),
      r + 4
    );
  }
  T.prototype.writeFloatLE = function (e, t, r) {
    return si(this, e, t, !0, r);
  };
  T.prototype.writeFloatBE = function (e, t, r) {
    return si(this, e, t, !1, r);
  };
  function ai(e, t, r, n, i) {
    return (
      (t = +t),
      (r = r >>> 0),
      i || oi(e, t, r, 8, 17976931348623157e292, -17976931348623157e292),
      We.write(e, t, r, n, 52, 8),
      r + 8
    );
  }
  T.prototype.writeDoubleLE = function (e, t, r) {
    return ai(this, e, t, !0, r);
  };
  T.prototype.writeDoubleBE = function (e, t, r) {
    return ai(this, e, t, !1, r);
  };
  T.prototype.copy = function (e, t, r, n) {
    if (!T.isBuffer(e)) throw new TypeError('argument should be a Buffer');
    if (
      (r || (r = 0),
      !n && n !== 0 && (n = this.length),
      t >= e.length && (t = e.length),
      t || (t = 0),
      n > 0 && n < r && (n = r),
      n === r || e.length === 0 || this.length === 0)
    )
      return 0;
    if (t < 0) throw new RangeError('targetStart out of bounds');
    if (r < 0 || r >= this.length) throw new RangeError('Index out of range');
    if (n < 0) throw new RangeError('sourceEnd out of bounds');
    n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
    let i = n - r;
    return (
      this === e && typeof Uint8Array.prototype.copyWithin == 'function'
        ? this.copyWithin(t, r, n)
        : Uint8Array.prototype.set.call(e, this.subarray(r, n), t),
      i
    );
  };
  T.prototype.fill = function (e, t, r, n) {
    if (typeof e == 'string') {
      if (
        (typeof t == 'string'
          ? ((n = t), (t = 0), (r = this.length))
          : typeof r == 'string' && ((n = r), (r = this.length)),
        n !== void 0 && typeof n != 'string')
      )
        throw new TypeError('encoding must be a string');
      if (typeof n == 'string' && !T.isEncoding(n)) throw new TypeError('Unknown encoding: ' + n);
      if (e.length === 1) {
        let o = e.charCodeAt(0);
        ((n === 'utf8' && o < 128) || n === 'latin1') && (e = o);
      }
    } else typeof e == 'number' ? (e = e & 255) : typeof e == 'boolean' && (e = Number(e));
    if (t < 0 || this.length < t || this.length < r) throw new RangeError('Out of range index');
    if (r <= t) return this;
    (t = t >>> 0), (r = r === void 0 ? this.length : r >>> 0), e || (e = 0);
    let i;
    if (typeof e == 'number') for (i = t; i < r; ++i) this[i] = e;
    else {
      let o = T.isBuffer(e) ? e : T.from(e, n),
        s = o.length;
      if (s === 0) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
      for (i = 0; i < r - t; ++i) this[i + t] = o[i % s];
    }
    return this;
  };
  var He = {};
  function en(e, t, r) {
    He[e] = class extends r {
      constructor() {
        super(),
          Object.defineProperty(this, 'message', { value: t.apply(this, arguments), writable: !0, configurable: !0 }),
          (this.name = `${this.name} [${e}]`),
          this.stack,
          delete this.name;
      }
      get code() {
        return e;
      }
      set code(n) {
        Object.defineProperty(this, 'code', { configurable: !0, enumerable: !0, value: n, writable: !0 });
      }
      toString() {
        return `${this.name} [${e}]: ${this.message}`;
      }
    };
  }
  en(
    'ERR_BUFFER_OUT_OF_BOUNDS',
    function (e) {
      return e ? `${e} is outside of buffer bounds` : 'Attempt to access memory outside buffer bounds';
    },
    RangeError,
  );
  en(
    'ERR_INVALID_ARG_TYPE',
    function (e, t) {
      return `The "${e}" argument must be of type number. Received type ${typeof t}`;
    },
    TypeError,
  );
  en(
    'ERR_OUT_OF_RANGE',
    function (e, t, r) {
      let n = `The value of "${e}" is out of range.`,
        i = r;
      return (
        Number.isInteger(r) && Math.abs(r) > 2 ** 32
          ? (i = Kn(String(r)))
          : typeof r == 'bigint' &&
            ((i = String(r)),
            (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (i = Kn(i)),
            (i += 'n')),
        (n += ` It must be ${t}. Received ${i}`),
        n
      );
    },
    RangeError,
  );
  function Kn(e) {
    let t = '',
      r = e.length,
      n = e[0] === '-' ? 1 : 0;
    for (; r >= n + 4; r -= 3) t = `_${e.slice(r - 3, r)}${t}`;
    return `${e.slice(0, r)}${t}`;
  }
  function Ea(e, t, r) {
    Ke(t, 'offset'), (e[t] === void 0 || e[t + r] === void 0) && Et(t, e.length - (r + 1));
  }
  function li(e, t, r, n, i, o) {
    if (e > r || e < t) {
      let s = typeof t == 'bigint' ? 'n' : '',
        a;
      throw (
        (o > 3
          ? t === 0 || t === BigInt(0)
            ? (a = `>= 0${s} and < 2${s} ** ${(o + 1) * 8}${s}`)
            : (a = `>= -(2${s} ** ${(o + 1) * 8 - 1}${s}) and < 2 ** ${(o + 1) * 8 - 1}${s}`)
          : (a = `>= ${t}${s} and <= ${r}${s}`),
        new He.ERR_OUT_OF_RANGE('value', a, e))
      );
    }
    Ea(n, i, o);
  }
  function Ke(e, t) {
    if (typeof e != 'number') throw new He.ERR_INVALID_ARG_TYPE(t, 'number', e);
  }
  function Et(e, t, r) {
    throw Math.floor(e) !== e
      ? (Ke(e, r), new He.ERR_OUT_OF_RANGE(r || 'offset', 'an integer', e))
      : t < 0
      ? new He.ERR_BUFFER_OUT_OF_BOUNDS()
      : new He.ERR_OUT_OF_RANGE(r || 'offset', `>= ${r ? 1 : 0} and <= ${t}`, e);
  }
  var ba = /[^+/0-9A-Za-z-_]/g;
  function xa(e) {
    if (((e = e.split('=')[0]), (e = e.trim().replace(ba, '')), e.length < 2)) return '';
    for (; e.length % 4 !== 0; ) e = e + '=';
    return e;
  }
  function Yr(e, t) {
    t = t || 1 / 0;
    let r,
      n = e.length,
      i = null,
      o = [];
    for (let s = 0; s < n; ++s) {
      if (((r = e.charCodeAt(s)), r > 55295 && r < 57344)) {
        if (!i) {
          if (r > 56319) {
            (t -= 3) > -1 && o.push(239, 191, 189);
            continue;
          } else if (s + 1 === n) {
            (t -= 3) > -1 && o.push(239, 191, 189);
            continue;
          }
          i = r;
          continue;
        }
        if (r < 56320) {
          (t -= 3) > -1 && o.push(239, 191, 189), (i = r);
          continue;
        }
        r = (((i - 55296) << 10) | (r - 56320)) + 65536;
      } else i && (t -= 3) > -1 && o.push(239, 191, 189);
      if (((i = null), r < 128)) {
        if ((t -= 1) < 0) break;
        o.push(r);
      } else if (r < 2048) {
        if ((t -= 2) < 0) break;
        o.push((r >> 6) | 192, (r & 63) | 128);
      } else if (r < 65536) {
        if ((t -= 3) < 0) break;
        o.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (r & 63) | 128);
      } else if (r < 1114112) {
        if ((t -= 4) < 0) break;
        o.push((r >> 18) | 240, ((r >> 12) & 63) | 128, ((r >> 6) & 63) | 128, (r & 63) | 128);
      } else throw new Error('Invalid code point');
    }
    return o;
  }
  function Pa(e) {
    let t = [];
    for (let r = 0; r < e.length; ++r) t.push(e.charCodeAt(r) & 255);
    return t;
  }
  function va(e, t) {
    let r,
      n,
      i,
      o = [];
    for (let s = 0; s < e.length && !((t -= 2) < 0); ++s)
      (r = e.charCodeAt(s)), (n = r >> 8), (i = r % 256), o.push(i), o.push(n);
    return o;
  }
  function ui(e) {
    return Kr.toByteArray(xa(e));
  }
  function sr(e, t, r, n) {
    let i;
    for (i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
    return i;
  }
  function me(e, t) {
    return (
      e instanceof t ||
      (e != null && e.constructor != null && e.constructor.name != null && e.constructor.name === t.name)
    );
  }
  function tn(e) {
    return e !== e;
  }
  var Ta = (function () {
    let e = '0123456789abcdef',
      t = new Array(256);
    for (let r = 0; r < 16; ++r) {
      let n = r * 16;
      for (let i = 0; i < 16; ++i) t[n + i] = e[r] + e[i];
    }
    return t;
  })();
  function Ae(e) {
    return typeof BigInt > 'u' ? Aa : e;
  }
  function Aa() {
    throw new Error('BigInt not supported');
  }
});
var w,
  f = Te(() => {
    'use strict';
    w = _e(ci());
  });
function Ca() {
  return !1;
}
var Ra,
  Sa,
  hi,
  yi = Te(() => {
    'use strict';
    f();
    c();
    p();
    m();
    d();
    (Ra = {}), (Sa = { existsSync: Ca, promises: Ra }), (hi = Sa);
  });
function Na(...e) {
  return e.join('/');
}
function Fa(...e) {
  return e.join('/');
}
var Di,
  _a,
  La,
  xt,
  Mi = Te(() => {
    'use strict';
    f();
    c();
    p();
    m();
    d();
    (Di = '/'), (_a = { sep: Di }), (La = { resolve: Na, posix: _a, join: Fa, sep: Di }), (xt = La);
  });
var cr,
  Fi = Te(() => {
    'use strict';
    f();
    c();
    p();
    m();
    d();
    cr = class {
      constructor() {
        this.events = {};
      }
      on(t, r) {
        return this.events[t] || (this.events[t] = []), this.events[t].push(r), this;
      }
      emit(t, ...r) {
        return this.events[t]
          ? (this.events[t].forEach((n) => {
              n(...r);
            }),
            !0)
          : !1;
      }
    };
  });
var Li = Fe((Xm, _i) => {
  'use strict';
  f();
  c();
  p();
  m();
  d();
  _i.exports = (e, t = 1, r) => {
    if (((r = { indent: ' ', includeEmptyLines: !1, ...r }), typeof e != 'string'))
      throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e}\``);
    if (typeof t != 'number') throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof t}\``);
    if (typeof r.indent != 'string')
      throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof r.indent}\``);
    if (t === 0) return e;
    let n = r.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
    return e.replace(n, r.indent.repeat(t));
  };
});
var $i = Fe((pd, Ui) => {
  'use strict';
  f();
  c();
  p();
  m();
  d();
  Ui.exports = ({ onlyFirst: e = !1 } = {}) => {
    let t = [
      '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
      '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
    ].join('|');
    return new RegExp(t, e ? void 0 : 'g');
  };
});
var Vi = Fe((yd, qi) => {
  'use strict';
  f();
  c();
  p();
  m();
  d();
  var ja = $i();
  qi.exports = (e) => (typeof e == 'string' ? e.replace(ja(), '') : e);
});
var Ji = Fe((yh, Wa) => {
  Wa.exports = {
    name: '@prisma/engines-version',
    version: '5.18.0-25.4c784e32044a8a016d99474bd02a3b6123742169',
    main: 'index.js',
    types: 'index.d.ts',
    license: 'Apache-2.0',
    author: 'Tim Suchanek <suchanek@prisma.io>',
    prisma: { enginesVersion: '4c784e32044a8a016d99474bd02a3b6123742169' },
    repository: {
      type: 'git',
      url: 'https://github.com/prisma/engines-wrapper.git',
      directory: 'packages/engines-version',
    },
    devDependencies: { '@types/node': '18.19.34', typescript: '4.9.5' },
    files: ['index.js', 'index.d.ts'],
    scripts: { build: 'tsc -d' },
  };
});
var Qi = Fe(() => {
  'use strict';
  f();
  c();
  p();
  m();
  d();
});
var Bn = Fe((i2, is) => {
  'use strict';
  f();
  c();
  p();
  m();
  d();
  is.exports = (function () {
    function e(t, r, n, i, o) {
      return t < r || n < r ? (t > n ? n + 1 : t + 1) : i === o ? r : r + 1;
    }
    return function (t, r) {
      if (t === r) return 0;
      if (t.length > r.length) {
        var n = t;
        (t = r), (r = n);
      }
      for (var i = t.length, o = r.length; i > 0 && t.charCodeAt(i - 1) === r.charCodeAt(o - 1); ) i--, o--;
      for (var s = 0; s < i && t.charCodeAt(s) === r.charCodeAt(s); ) s++;
      if (((i -= s), (o -= s), i === 0 || o < 3)) return o;
      var a = 0,
        l,
        u,
        g,
        h,
        v,
        S,
        C,
        R,
        M,
        F,
        B,
        D,
        O = [];
      for (l = 0; l < i; l++) O.push(l + 1), O.push(t.charCodeAt(s + l));
      for (var oe = O.length - 1; a < o - 3; )
        for (
          M = r.charCodeAt(s + (u = a)),
            F = r.charCodeAt(s + (g = a + 1)),
            B = r.charCodeAt(s + (h = a + 2)),
            D = r.charCodeAt(s + (v = a + 3)),
            S = a += 4,
            l = 0;
          l < oe;
          l += 2
        )
          (C = O[l]),
            (R = O[l + 1]),
            (u = e(C, u, g, M, R)),
            (g = e(u, g, h, F, R)),
            (h = e(g, h, v, B, R)),
            (S = e(h, v, S, D, R)),
            (O[l] = S),
            (v = h),
            (h = g),
            (g = u),
            (u = C);
      for (; a < o; )
        for (M = r.charCodeAt(s + (u = a)), S = ++a, l = 0; l < oe; l += 2)
          (C = O[l]), (O[l] = S = e(C, u, S, M, O[l + 1])), (u = C);
      return S;
    };
  })();
});
f();
c();
p();
m();
d();
var di = {};
Wr(di, { defineExtension: () => pi, getExtensionContext: () => mi });
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function pi(e) {
  return typeof e == 'function' ? e : (t) => t.$extends(e);
}
f();
c();
p();
m();
d();
function mi(e) {
  return e;
}
var gi = {};
Wr(gi, { validator: () => fi });
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function fi(...e) {
  return (t) => t;
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var rn,
  wi,
  Ei,
  bi,
  xi = !0;
typeof y < 'u' &&
  (({ FORCE_COLOR: rn, NODE_DISABLE_COLORS: wi, NO_COLOR: Ei, TERM: bi } = y.env || {}),
  (xi = y.stdout && y.stdout.isTTY));
var Oa = { enabled: !wi && Ei == null && bi !== 'dumb' && ((rn != null && rn !== '0') || xi) };
function V(e, t) {
  let r = new RegExp(`\\x1b\\[${t}m`, 'g'),
    n = `\x1B[${e}m`,
    i = `\x1B[${t}m`;
  return function (o) {
    return !Oa.enabled || o == null ? o : n + (~('' + o).indexOf(i) ? o.replace(r, i + n) : o) + i;
  };
}
var _p = V(0, 0),
  ar = V(1, 22),
  lr = V(2, 22),
  Lp = V(3, 23),
  Pi = V(4, 24),
  Bp = V(7, 27),
  Up = V(8, 28),
  $p = V(9, 29),
  qp = V(30, 39),
  Ye = V(31, 39),
  vi = V(32, 39),
  Ti = V(33, 39),
  Ai = V(34, 39),
  Vp = V(35, 39),
  Ci = V(36, 39),
  jp = V(37, 39),
  Ri = V(90, 39),
  Gp = V(90, 39),
  Jp = V(40, 49),
  Qp = V(41, 49),
  Hp = V(42, 49),
  Wp = V(43, 49),
  Kp = V(44, 49),
  zp = V(45, 49),
  Yp = V(46, 49),
  Zp = V(47, 49);
f();
c();
p();
m();
d();
var Ia = 100,
  Si = ['green', 'yellow', 'blue', 'magenta', 'cyan', 'red'],
  ur = [],
  Oi = Date.now(),
  ka = 0,
  nn = typeof y < 'u' ? y.env : {};
globalThis.DEBUG ??= nn.DEBUG ?? '';
globalThis.DEBUG_COLORS ??= nn.DEBUG_COLORS ? nn.DEBUG_COLORS === 'true' : !0;
var bt = {
  enable(e) {
    typeof e == 'string' && (globalThis.DEBUG = e);
  },
  disable() {
    let e = globalThis.DEBUG;
    return (globalThis.DEBUG = ''), e;
  },
  enabled(e) {
    let t = globalThis.DEBUG.split(',').map((i) => i.replace(/[.+?^${}()|[\]\\]/g, '\\$&')),
      r = t.some((i) => (i === '' || i[0] === '-' ? !1 : e.match(RegExp(i.split('*').join('.*') + '$')))),
      n = t.some((i) => (i === '' || i[0] !== '-' ? !1 : e.match(RegExp(i.slice(1).split('*').join('.*') + '$'))));
    return r && !n;
  },
  log: (...e) => {
    let [t, r, ...n] = e;
    (console.warn ?? console.log)(`${t} ${r}`, ...n);
  },
  formatters: {},
};
function Da(e) {
  let t = { color: Si[ka++ % Si.length], enabled: bt.enabled(e), namespace: e, log: bt.log, extend: () => {} },
    r = (...n) => {
      let { enabled: i, namespace: o, color: s, log: a } = t;
      if ((n.length !== 0 && ur.push([o, ...n]), ur.length > Ia && ur.shift(), bt.enabled(o) || i)) {
        let l = n.map((g) => (typeof g == 'string' ? g : Ma(g))),
          u = `+${Date.now() - Oi}ms`;
        (Oi = Date.now()), a(o, ...l, u);
      }
    };
  return new Proxy(r, { get: (n, i) => t[i], set: (n, i, o) => (t[i] = o) });
}
var Ii = new Proxy(Da, { get: (e, t) => bt[t], set: (e, t, r) => (bt[t] = r) });
function Ma(e, t = 2) {
  let r = new Set();
  return JSON.stringify(
    e,
    (n, i) => {
      if (typeof i == 'object' && i !== null) {
        if (r.has(i)) return '[Circular *]';
        r.add(i);
      } else if (typeof i == 'bigint') return i.toString();
      return i;
    },
    t,
  );
}
function ki() {
  ur.length = 0;
}
var ee = Ii;
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var Ni = 'library';
function Pt(e) {
  let t = Ba();
  return t || (e?.config.engineType === 'library' ? 'library' : e?.config.engineType === 'binary' ? 'binary' : Ni);
}
function Ba() {
  let e = y.env.PRISMA_CLIENT_ENGINE_TYPE;
  return e === 'library' ? 'library' : e === 'binary' ? 'binary' : void 0;
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var Be;
((t) => {
  let e;
  ((O) => (
    (O.findUnique = 'findUnique'),
    (O.findUniqueOrThrow = 'findUniqueOrThrow'),
    (O.findFirst = 'findFirst'),
    (O.findFirstOrThrow = 'findFirstOrThrow'),
    (O.findMany = 'findMany'),
    (O.create = 'create'),
    (O.createMany = 'createMany'),
    (O.createManyAndReturn = 'createManyAndReturn'),
    (O.update = 'update'),
    (O.updateMany = 'updateMany'),
    (O.upsert = 'upsert'),
    (O.delete = 'delete'),
    (O.deleteMany = 'deleteMany'),
    (O.groupBy = 'groupBy'),
    (O.count = 'count'),
    (O.aggregate = 'aggregate'),
    (O.findRaw = 'findRaw'),
    (O.aggregateRaw = 'aggregateRaw')
  ))((e = t.ModelAction ||= {}));
})((Be ||= {}));
var Tt = {};
Wr(Tt, {
  error: () => qa,
  info: () => $a,
  log: () => Ua,
  query: () => Va,
  should: () => Bi,
  tags: () => vt,
  warn: () => on,
});
f();
c();
p();
m();
d();
var vt = { error: Ye('prisma:error'), warn: Ti('prisma:warn'), info: Ci('prisma:info'), query: Ai('prisma:query') },
  Bi = { warn: () => !y.env.PRISMA_DISABLE_WARNINGS };
function Ua(...e) {
  console.log(...e);
}
function on(e, ...t) {
  Bi.warn() && console.warn(`${vt.warn} ${e}`, ...t);
}
function $a(e, ...t) {
  console.info(`${vt.info} ${e}`, ...t);
}
function qa(e, ...t) {
  console.error(`${vt.error} ${e}`, ...t);
}
function Va(e, ...t) {
  console.log(`${vt.query} ${e}`, ...t);
}
f();
c();
p();
m();
d();
function Ee(e, t) {
  throw new Error(t);
}
f();
c();
p();
m();
d();
function sn(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
f();
c();
p();
m();
d();
var an = (e, t) => e.reduce((r, n) => ((r[t(n)] = n), r), {});
f();
c();
p();
m();
d();
function Ze(e, t) {
  let r = {};
  for (let n of Object.keys(e)) r[n] = t(e[n], n);
  return r;
}
f();
c();
p();
m();
d();
function ln(e, t) {
  if (e.length === 0) return;
  let r = e[0];
  for (let n = 1; n < e.length; n++) t(r, e[n]) < 0 && (r = e[n]);
  return r;
}
f();
c();
p();
m();
d();
function N(e, t) {
  Object.defineProperty(e, 'name', { value: t, configurable: !0 });
}
f();
c();
p();
m();
d();
var ji = new Set(),
  pr = (e, t, ...r) => {
    ji.has(e) || (ji.add(e), on(t, ...r));
  };
f();
c();
p();
m();
d();
var K = class extends Error {
  constructor(t, { code: r, clientVersion: n, meta: i, batchRequestIdx: o }) {
    super(t),
      (this.name = 'PrismaClientKnownRequestError'),
      (this.code = r),
      (this.clientVersion = n),
      (this.meta = i),
      Object.defineProperty(this, 'batchRequestIdx', { value: o, enumerable: !1, writable: !0 });
  }
  get [Symbol.toStringTag]() {
    return 'PrismaClientKnownRequestError';
  }
};
N(K, 'PrismaClientKnownRequestError');
var Ce = class extends K {
  constructor(t, r) {
    super(t, { code: 'P2025', clientVersion: r }), (this.name = 'NotFoundError');
  }
};
N(Ce, 'NotFoundError');
f();
c();
p();
m();
d();
var J = class e extends Error {
  constructor(t, r, n) {
    super(t),
      (this.name = 'PrismaClientInitializationError'),
      (this.clientVersion = r),
      (this.errorCode = n),
      Error.captureStackTrace(e);
  }
  get [Symbol.toStringTag]() {
    return 'PrismaClientInitializationError';
  }
};
N(J, 'PrismaClientInitializationError');
f();
c();
p();
m();
d();
var Re = class extends Error {
  constructor(t, r) {
    super(t), (this.name = 'PrismaClientRustPanicError'), (this.clientVersion = r);
  }
  get [Symbol.toStringTag]() {
    return 'PrismaClientRustPanicError';
  }
};
N(Re, 'PrismaClientRustPanicError');
f();
c();
p();
m();
d();
var se = class extends Error {
  constructor(t, { clientVersion: r, batchRequestIdx: n }) {
    super(t),
      (this.name = 'PrismaClientUnknownRequestError'),
      (this.clientVersion = r),
      Object.defineProperty(this, 'batchRequestIdx', { value: n, writable: !0, enumerable: !1 });
  }
  get [Symbol.toStringTag]() {
    return 'PrismaClientUnknownRequestError';
  }
};
N(se, 'PrismaClientUnknownRequestError');
f();
c();
p();
m();
d();
var Z = class extends Error {
  constructor(r, { clientVersion: n }) {
    super(r);
    this.name = 'PrismaClientValidationError';
    this.clientVersion = n;
  }
  get [Symbol.toStringTag]() {
    return 'PrismaClientValidationError';
  }
};
N(Z, 'PrismaClientValidationError');
f();
c();
p();
m();
d();
var At = class {
  constructor(t) {
    this._engine = t;
  }
  prometheus(t) {
    return this._engine.metrics({ format: 'prometheus', ...t });
  }
  json(t) {
    return this._engine.metrics({ format: 'json', ...t });
  }
};
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function Ct(e) {
  let t;
  return {
    get() {
      return t || (t = { value: e() }), t.value;
    },
  };
}
function Ga(e, t) {
  let r = Ct(() => Ja(t));
  Object.defineProperty(e, 'dmmf', { get: () => r.get() });
}
function Ja(e) {
  return { datamodel: { models: un(e.models), enums: un(e.enums), types: un(e.types) } };
}
function un(e) {
  return Object.entries(e).map(([t, r]) => ({ name: t, ...r }));
}
f();
c();
p();
m();
d();
var mr = Symbol(),
  cn = new WeakMap(),
  be = class {
    constructor(t) {
      t === mr
        ? cn.set(this, `Prisma.${this._getName()}`)
        : cn.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
    }
    _getName() {
      return this.constructor.name;
    }
    toString() {
      return cn.get(this);
    }
  },
  Rt = class extends be {
    _getNamespace() {
      return 'NullTypes';
    }
  },
  St = class extends Rt {};
mn(St, 'DbNull');
var Ot = class extends Rt {};
mn(Ot, 'JsonNull');
var It = class extends Rt {};
mn(It, 'AnyNull');
var pn = {
  classes: { DbNull: St, JsonNull: Ot, AnyNull: It },
  instances: { DbNull: new St(mr), JsonNull: new Ot(mr), AnyNull: new It(mr) },
};
function mn(e, t) {
  Object.defineProperty(e, 'name', { value: t, configurable: !0 });
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function kt(e) {
  return {
    ok: !1,
    error: e,
    map() {
      return kt(e);
    },
    flatMap() {
      return kt(e);
    },
  };
}
var dn = class {
    constructor() {
      this.registeredErrors = [];
    }
    consumeError(t) {
      return this.registeredErrors[t];
    }
    registerNewError(t) {
      let r = 0;
      for (; this.registeredErrors[r] !== void 0; ) r++;
      return (this.registeredErrors[r] = { error: t }), r;
    }
  },
  fn = (e) => {
    let t = new dn(),
      r = Ue(t, e.startTransaction.bind(e)),
      n = {
        adapterName: e.adapterName,
        errorRegistry: t,
        queryRaw: Ue(t, e.queryRaw.bind(e)),
        executeRaw: Ue(t, e.executeRaw.bind(e)),
        provider: e.provider,
        startTransaction: async (...i) => (await r(...i)).map((s) => Qa(t, s)),
      };
    return e.getConnectionInfo && (n.getConnectionInfo = Ha(t, e.getConnectionInfo.bind(e))), n;
  },
  Qa = (e, t) => ({
    adapterName: t.adapterName,
    provider: t.provider,
    options: t.options,
    queryRaw: Ue(e, t.queryRaw.bind(t)),
    executeRaw: Ue(e, t.executeRaw.bind(t)),
    commit: Ue(e, t.commit.bind(t)),
    rollback: Ue(e, t.rollback.bind(t)),
  });
function Ue(e, t) {
  return async (...r) => {
    try {
      return await t(...r);
    } catch (n) {
      let i = e.registerNewError(n);
      return kt({ kind: 'GenericJs', id: i });
    }
  };
}
function Ha(e, t) {
  return (...r) => {
    try {
      return t(...r);
    } catch (n) {
      let i = e.registerNewError(n);
      return kt({ kind: 'GenericJs', id: i });
    }
  };
}
var Qs = _e(Ji());
var wk = _e(Qi());
Fi();
yi();
Mi();
f();
c();
p();
m();
d();
var ae = class e {
  constructor(t, r) {
    if (t.length - 1 !== r.length)
      throw t.length === 0
        ? new TypeError('Expected at least 1 string')
        : new TypeError(`Expected ${t.length} strings to have ${t.length - 1} values`);
    let n = r.reduce((s, a) => s + (a instanceof e ? a.values.length : 1), 0);
    (this.values = new Array(n)), (this.strings = new Array(n + 1)), (this.strings[0] = t[0]);
    let i = 0,
      o = 0;
    for (; i < r.length; ) {
      let s = r[i++],
        a = t[i];
      if (s instanceof e) {
        this.strings[o] += s.strings[0];
        let l = 0;
        for (; l < s.values.length; ) (this.values[o++] = s.values[l++]), (this.strings[o] = s.strings[l]);
        this.strings[o] += a;
      } else (this.values[o++] = s), (this.strings[o] = a);
    }
  }
  get sql() {
    let t = this.strings.length,
      r = 1,
      n = this.strings[0];
    for (; r < t; ) n += `?${this.strings[r++]}`;
    return n;
  }
  get statement() {
    let t = this.strings.length,
      r = 1,
      n = this.strings[0];
    for (; r < t; ) n += `:${r}${this.strings[r++]}`;
    return n;
  }
  get text() {
    let t = this.strings.length,
      r = 1,
      n = this.strings[0];
    for (; r < t; ) n += `$${r}${this.strings[r++]}`;
    return n;
  }
  inspect() {
    return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
  }
};
function Ka(e, t = ',', r = '', n = '') {
  if (e.length === 0)
    throw new TypeError('Expected `join([])` to be called with an array of multiple elements, but got an empty array');
  return new ae([r, ...Array(e.length - 1).fill(t), n], e);
}
function Hi(e) {
  return new ae([e], []);
}
var za = Hi('');
function Wi(e, ...t) {
  return new ae(e, t);
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function Dt(e) {
  return {
    getKeys() {
      return Object.keys(e);
    },
    getPropertyValue(t) {
      return e[t];
    },
  };
}
f();
c();
p();
m();
d();
function te(e, t) {
  return {
    getKeys() {
      return [e];
    },
    getPropertyValue() {
      return t();
    },
  };
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var de = class {
  constructor() {
    this._map = new Map();
  }
  get(t) {
    return this._map.get(t)?.value;
  }
  set(t, r) {
    this._map.set(t, { value: r });
  }
  getOrCreate(t, r) {
    let n = this._map.get(t);
    if (n) return n.value;
    let i = r();
    return this.set(t, i), i;
  }
};
function $e(e) {
  let t = new de();
  return {
    getKeys() {
      return e.getKeys();
    },
    getPropertyValue(r) {
      return t.getOrCreate(r, () => e.getPropertyValue(r));
    },
    getPropertyDescriptor(r) {
      return e.getPropertyDescriptor?.(r);
    },
  };
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var dr = { enumerable: !0, configurable: !0, writable: !0 };
function fr(e) {
  let t = new Set(e);
  return {
    getOwnPropertyDescriptor: () => dr,
    has: (r, n) => t.has(n),
    set: (r, n, i) => t.add(n) && Reflect.set(r, n, i),
    ownKeys: () => [...t],
  };
}
var Ki = Symbol.for('nodejs.util.inspect.custom');
function fe(e, t) {
  let r = Ya(t),
    n = new Set(),
    i = new Proxy(e, {
      get(o, s) {
        if (n.has(s)) return o[s];
        let a = r.get(s);
        return a ? a.getPropertyValue(s) : o[s];
      },
      has(o, s) {
        if (n.has(s)) return !0;
        let a = r.get(s);
        return a ? a.has?.(s) ?? !0 : Reflect.has(o, s);
      },
      ownKeys(o) {
        let s = zi(Reflect.ownKeys(o), r),
          a = zi(Array.from(r.keys()), r);
        return [...new Set([...s, ...a, ...n])];
      },
      set(o, s, a) {
        return r.get(s)?.getPropertyDescriptor?.(s)?.writable === !1 ? !1 : (n.add(s), Reflect.set(o, s, a));
      },
      getOwnPropertyDescriptor(o, s) {
        let a = Reflect.getOwnPropertyDescriptor(o, s);
        if (a && !a.configurable) return a;
        let l = r.get(s);
        return l ? (l.getPropertyDescriptor ? { ...dr, ...l?.getPropertyDescriptor(s) } : dr) : a;
      },
      defineProperty(o, s, a) {
        return n.add(s), Reflect.defineProperty(o, s, a);
      },
    });
  return (
    (i[Ki] = function () {
      let o = { ...this };
      return delete o[Ki], o;
    }),
    i
  );
}
function Ya(e) {
  let t = new Map();
  for (let r of e) {
    let n = r.getKeys();
    for (let i of n) t.set(i, r);
  }
  return t;
}
function zi(e, t) {
  return e.filter((r) => t.get(r)?.has?.(r) ?? !0);
}
f();
c();
p();
m();
d();
function Xe(e) {
  return {
    getKeys() {
      return e;
    },
    has() {
      return !1;
    },
    getPropertyValue() {},
  };
}
f();
c();
p();
m();
d();
function gr(e, t) {
  return { batch: e, transaction: t?.kind === 'batch' ? { isolationLevel: t.options.isolationLevel } : void 0 };
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var et = class {
  constructor(t = 0, r) {
    this.context = r;
    this.lines = [];
    this.currentLine = '';
    this.currentIndent = 0;
    this.currentIndent = t;
  }
  write(t) {
    return typeof t == 'string' ? (this.currentLine += t) : t.write(this), this;
  }
  writeJoined(t, r, n = (i, o) => o.write(i)) {
    let i = r.length - 1;
    for (let o = 0; o < r.length; o++) n(r[o], this), o !== i && this.write(t);
    return this;
  }
  writeLine(t) {
    return this.write(t).newLine();
  }
  newLine() {
    this.lines.push(this.indentedCurrentLine()), (this.currentLine = ''), (this.marginSymbol = void 0);
    let t = this.afterNextNewLineCallback;
    return (this.afterNextNewLineCallback = void 0), t?.(), this;
  }
  withIndent(t) {
    return this.indent(), t(this), this.unindent(), this;
  }
  afterNextNewline(t) {
    return (this.afterNextNewLineCallback = t), this;
  }
  indent() {
    return this.currentIndent++, this;
  }
  unindent() {
    return this.currentIndent > 0 && this.currentIndent--, this;
  }
  addMarginSymbol(t) {
    return (this.marginSymbol = t), this;
  }
  toString() {
    return this.lines.concat(this.indentedCurrentLine()).join(`
`);
  }
  getCurrentLineLength() {
    return this.currentLine.length;
  }
  indentedCurrentLine() {
    let t = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
    return this.marginSymbol ? this.marginSymbol + t.slice(1) : t;
  }
};
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function Yi(e) {
  return e.substring(0, 1).toLowerCase() + e.substring(1);
}
f();
c();
p();
m();
d();
function tt(e) {
  return e instanceof Date || Object.prototype.toString.call(e) === '[object Date]';
}
function hr(e) {
  return e.toString() !== 'Invalid Date';
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var rt = 9e15,
  ke = 1e9,
  gn = '0123456789abcdef',
  wr =
    '2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058',
  Er =
    '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789',
  hn = { precision: 20, rounding: 4, modulo: 1, toExpNeg: -7, toExpPos: 21, minE: -rt, maxE: rt, crypto: !1 },
  to,
  xe,
  _ = !0,
  xr = '[DecimalError] ',
  Ie = xr + 'Invalid argument: ',
  ro = xr + 'Precision limit exceeded',
  no = xr + 'crypto unavailable',
  io = '[object Decimal]',
  X = Math.floor,
  Q = Math.pow,
  Za = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
  Xa = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
  el = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
  oo = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
  pe = 1e7,
  k = 7,
  tl = 9007199254740991,
  rl = wr.length - 1,
  yn = Er.length - 1,
  A = { toStringTag: io };
A.absoluteValue = A.abs = function () {
  var e = new this.constructor(this);
  return e.s < 0 && (e.s = 1), I(e);
};
A.ceil = function () {
  return I(new this.constructor(this), this.e + 1, 2);
};
A.clampedTo = A.clamp = function (e, t) {
  var r,
    n = this,
    i = n.constructor;
  if (((e = new i(e)), (t = new i(t)), !e.s || !t.s)) return new i(NaN);
  if (e.gt(t)) throw Error(Ie + t);
  return (r = n.cmp(e)), r < 0 ? e : n.cmp(t) > 0 ? t : new i(n);
};
A.comparedTo = A.cmp = function (e) {
  var t,
    r,
    n,
    i,
    o = this,
    s = o.d,
    a = (e = new o.constructor(e)).d,
    l = o.s,
    u = e.s;
  if (!s || !a) return !l || !u ? NaN : l !== u ? l : s === a ? 0 : !s ^ (l < 0) ? 1 : -1;
  if (!s[0] || !a[0]) return s[0] ? l : a[0] ? -u : 0;
  if (l !== u) return l;
  if (o.e !== e.e) return (o.e > e.e) ^ (l < 0) ? 1 : -1;
  for (n = s.length, i = a.length, t = 0, r = n < i ? n : i; t < r; ++t)
    if (s[t] !== a[t]) return (s[t] > a[t]) ^ (l < 0) ? 1 : -1;
  return n === i ? 0 : (n > i) ^ (l < 0) ? 1 : -1;
};
A.cosine = A.cos = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return r.d
    ? r.d[0]
      ? ((e = n.precision),
        (t = n.rounding),
        (n.precision = e + Math.max(r.e, r.sd()) + k),
        (n.rounding = 1),
        (r = nl(n, co(n, r))),
        (n.precision = e),
        (n.rounding = t),
        I(xe == 2 || xe == 3 ? r.neg() : r, e, t, !0))
      : new n(1)
    : new n(NaN);
};
A.cubeRoot = A.cbrt = function () {
  var e,
    t,
    r,
    n,
    i,
    o,
    s,
    a,
    l,
    u,
    g = this,
    h = g.constructor;
  if (!g.isFinite() || g.isZero()) return new h(g);
  for (
    _ = !1,
      o = g.s * Q(g.s * g, 1 / 3),
      !o || Math.abs(o) == 1 / 0
        ? ((r = z(g.d)),
          (e = g.e),
          (o = (e - r.length + 1) % 3) && (r += o == 1 || o == -2 ? '0' : '00'),
          (o = Q(r, 1 / 3)),
          (e = X((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2))),
          o == 1 / 0 ? (r = '5e' + e) : ((r = o.toExponential()), (r = r.slice(0, r.indexOf('e') + 1) + e)),
          (n = new h(r)),
          (n.s = g.s))
        : (n = new h(o.toString())),
      s = (e = h.precision) + 3;
    ;

  )
    if (
      ((a = n),
      (l = a.times(a).times(a)),
      (u = l.plus(g)),
      (n = $(u.plus(g).times(a), u.plus(l), s + 2, 1)),
      z(a.d).slice(0, s) === (r = z(n.d)).slice(0, s))
    )
      if (((r = r.slice(s - 3, s + 1)), r == '9999' || (!i && r == '4999'))) {
        if (!i && (I(a, e + 1, 0), a.times(a).times(a).eq(g))) {
          n = a;
          break;
        }
        (s += 4), (i = 1);
      } else {
        (!+r || (!+r.slice(1) && r.charAt(0) == '5')) && (I(n, e + 1, 1), (t = !n.times(n).times(n).eq(g)));
        break;
      }
  return (_ = !0), I(n, e, h.rounding, t);
};
A.decimalPlaces = A.dp = function () {
  var e,
    t = this.d,
    r = NaN;
  if (t) {
    if (((e = t.length - 1), (r = (e - X(this.e / k)) * k), (e = t[e]), e)) for (; e % 10 == 0; e /= 10) r--;
    r < 0 && (r = 0);
  }
  return r;
};
A.dividedBy = A.div = function (e) {
  return $(this, new this.constructor(e));
};
A.dividedToIntegerBy = A.divToInt = function (e) {
  var t = this,
    r = t.constructor;
  return I($(t, new r(e), 0, 1, 1), r.precision, r.rounding);
};
A.equals = A.eq = function (e) {
  return this.cmp(e) === 0;
};
A.floor = function () {
  return I(new this.constructor(this), this.e + 1, 3);
};
A.greaterThan = A.gt = function (e) {
  return this.cmp(e) > 0;
};
A.greaterThanOrEqualTo = A.gte = function (e) {
  var t = this.cmp(e);
  return t == 1 || t === 0;
};
A.hyperbolicCosine = A.cosh = function () {
  var e,
    t,
    r,
    n,
    i,
    o = this,
    s = o.constructor,
    a = new s(1);
  if (!o.isFinite()) return new s(o.s ? 1 / 0 : NaN);
  if (o.isZero()) return a;
  (r = s.precision),
    (n = s.rounding),
    (s.precision = r + Math.max(o.e, o.sd()) + 4),
    (s.rounding = 1),
    (i = o.d.length),
    i < 32
      ? ((e = Math.ceil(i / 3)), (t = (1 / vr(4, e)).toString()))
      : ((e = 16), (t = '2.3283064365386962890625e-10')),
    (o = nt(s, 1, o.times(t), new s(1), !0));
  for (var l, u = e, g = new s(8); u--; ) (l = o.times(o)), (o = a.minus(l.times(g.minus(l.times(g)))));
  return I(o, (s.precision = r), (s.rounding = n), !0);
};
A.hyperbolicSine = A.sinh = function () {
  var e,
    t,
    r,
    n,
    i = this,
    o = i.constructor;
  if (!i.isFinite() || i.isZero()) return new o(i);
  if (
    ((t = o.precision),
    (r = o.rounding),
    (o.precision = t + Math.max(i.e, i.sd()) + 4),
    (o.rounding = 1),
    (n = i.d.length),
    n < 3)
  )
    i = nt(o, 2, i, i, !0);
  else {
    (e = 1.4 * Math.sqrt(n)), (e = e > 16 ? 16 : e | 0), (i = i.times(1 / vr(5, e))), (i = nt(o, 2, i, i, !0));
    for (var s, a = new o(5), l = new o(16), u = new o(20); e--; )
      (s = i.times(i)), (i = i.times(a.plus(s.times(l.times(s).plus(u)))));
  }
  return (o.precision = t), (o.rounding = r), I(i, t, r, !0);
};
A.hyperbolicTangent = A.tanh = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return r.isFinite()
    ? r.isZero()
      ? new n(r)
      : ((e = n.precision),
        (t = n.rounding),
        (n.precision = e + 7),
        (n.rounding = 1),
        $(r.sinh(), r.cosh(), (n.precision = e), (n.rounding = t)))
    : new n(r.s);
};
A.inverseCosine = A.acos = function () {
  var e,
    t = this,
    r = t.constructor,
    n = t.abs().cmp(1),
    i = r.precision,
    o = r.rounding;
  return n !== -1
    ? n === 0
      ? t.isNeg()
        ? ce(r, i, o)
        : new r(0)
      : new r(NaN)
    : t.isZero()
    ? ce(r, i + 4, o).times(0.5)
    : ((r.precision = i + 6),
      (r.rounding = 1),
      (t = t.asin()),
      (e = ce(r, i + 4, o).times(0.5)),
      (r.precision = i),
      (r.rounding = o),
      e.minus(t));
};
A.inverseHyperbolicCosine = A.acosh = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return r.lte(1)
    ? new n(r.eq(1) ? 0 : NaN)
    : r.isFinite()
    ? ((e = n.precision),
      (t = n.rounding),
      (n.precision = e + Math.max(Math.abs(r.e), r.sd()) + 4),
      (n.rounding = 1),
      (_ = !1),
      (r = r.times(r).minus(1).sqrt().plus(r)),
      (_ = !0),
      (n.precision = e),
      (n.rounding = t),
      r.ln())
    : new n(r);
};
A.inverseHyperbolicSine = A.asinh = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return !r.isFinite() || r.isZero()
    ? new n(r)
    : ((e = n.precision),
      (t = n.rounding),
      (n.precision = e + 2 * Math.max(Math.abs(r.e), r.sd()) + 6),
      (n.rounding = 1),
      (_ = !1),
      (r = r.times(r).plus(1).sqrt().plus(r)),
      (_ = !0),
      (n.precision = e),
      (n.rounding = t),
      r.ln());
};
A.inverseHyperbolicTangent = A.atanh = function () {
  var e,
    t,
    r,
    n,
    i = this,
    o = i.constructor;
  return i.isFinite()
    ? i.e >= 0
      ? new o(i.abs().eq(1) ? i.s / 0 : i.isZero() ? i : NaN)
      : ((e = o.precision),
        (t = o.rounding),
        (n = i.sd()),
        Math.max(n, e) < 2 * -i.e - 1
          ? I(new o(i), e, t, !0)
          : ((o.precision = r = n - i.e),
            (i = $(i.plus(1), new o(1).minus(i), r + e, 1)),
            (o.precision = e + 4),
            (o.rounding = 1),
            (i = i.ln()),
            (o.precision = e),
            (o.rounding = t),
            i.times(0.5)))
    : new o(NaN);
};
A.inverseSine = A.asin = function () {
  var e,
    t,
    r,
    n,
    i = this,
    o = i.constructor;
  return i.isZero()
    ? new o(i)
    : ((t = i.abs().cmp(1)),
      (r = o.precision),
      (n = o.rounding),
      t !== -1
        ? t === 0
          ? ((e = ce(o, r + 4, n).times(0.5)), (e.s = i.s), e)
          : new o(NaN)
        : ((o.precision = r + 6),
          (o.rounding = 1),
          (i = i.div(new o(1).minus(i.times(i)).sqrt().plus(1)).atan()),
          (o.precision = r),
          (o.rounding = n),
          i.times(2)));
};
A.inverseTangent = A.atan = function () {
  var e,
    t,
    r,
    n,
    i,
    o,
    s,
    a,
    l,
    u = this,
    g = u.constructor,
    h = g.precision,
    v = g.rounding;
  if (u.isFinite()) {
    if (u.isZero()) return new g(u);
    if (u.abs().eq(1) && h + 4 <= yn) return (s = ce(g, h + 4, v).times(0.25)), (s.s = u.s), s;
  } else {
    if (!u.s) return new g(NaN);
    if (h + 4 <= yn) return (s = ce(g, h + 4, v).times(0.5)), (s.s = u.s), s;
  }
  for (g.precision = a = h + 10, g.rounding = 1, r = Math.min(28, (a / k + 2) | 0), e = r; e; --e)
    u = u.div(u.times(u).plus(1).sqrt().plus(1));
  for (_ = !1, t = Math.ceil(a / k), n = 1, l = u.times(u), s = new g(u), i = u; e !== -1; )
    if (
      ((i = i.times(l)),
      (o = s.minus(i.div((n += 2)))),
      (i = i.times(l)),
      (s = o.plus(i.div((n += 2)))),
      s.d[t] !== void 0)
    )
      for (e = t; s.d[e] === o.d[e] && e--; );
  return r && (s = s.times(2 << (r - 1))), (_ = !0), I(s, (g.precision = h), (g.rounding = v), !0);
};
A.isFinite = function () {
  return !!this.d;
};
A.isInteger = A.isInt = function () {
  return !!this.d && X(this.e / k) > this.d.length - 2;
};
A.isNaN = function () {
  return !this.s;
};
A.isNegative = A.isNeg = function () {
  return this.s < 0;
};
A.isPositive = A.isPos = function () {
  return this.s > 0;
};
A.isZero = function () {
  return !!this.d && this.d[0] === 0;
};
A.lessThan = A.lt = function (e) {
  return this.cmp(e) < 0;
};
A.lessThanOrEqualTo = A.lte = function (e) {
  return this.cmp(e) < 1;
};
A.logarithm = A.log = function (e) {
  var t,
    r,
    n,
    i,
    o,
    s,
    a,
    l,
    u = this,
    g = u.constructor,
    h = g.precision,
    v = g.rounding,
    S = 5;
  if (e == null) (e = new g(10)), (t = !0);
  else {
    if (((e = new g(e)), (r = e.d), e.s < 0 || !r || !r[0] || e.eq(1))) return new g(NaN);
    t = e.eq(10);
  }
  if (((r = u.d), u.s < 0 || !r || !r[0] || u.eq(1)))
    return new g(r && !r[0] ? -1 / 0 : u.s != 1 ? NaN : r ? 0 : 1 / 0);
  if (t)
    if (r.length > 1) o = !0;
    else {
      for (i = r[0]; i % 10 === 0; ) i /= 10;
      o = i !== 1;
    }
  if (
    ((_ = !1),
    (a = h + S),
    (s = Oe(u, a)),
    (n = t ? br(g, a + 10) : Oe(e, a)),
    (l = $(s, n, a, 1)),
    Mt(l.d, (i = h), v))
  )
    do
      if (((a += 10), (s = Oe(u, a)), (n = t ? br(g, a + 10) : Oe(e, a)), (l = $(s, n, a, 1)), !o)) {
        +z(l.d).slice(i + 1, i + 15) + 1 == 1e14 && (l = I(l, h + 1, 0));
        break;
      }
    while (Mt(l.d, (i += 10), v));
  return (_ = !0), I(l, h, v);
};
A.minus = A.sub = function (e) {
  var t,
    r,
    n,
    i,
    o,
    s,
    a,
    l,
    u,
    g,
    h,
    v,
    S = this,
    C = S.constructor;
  if (((e = new C(e)), !S.d || !e.d))
    return !S.s || !e.s ? (e = new C(NaN)) : S.d ? (e.s = -e.s) : (e = new C(e.d || S.s !== e.s ? S : NaN)), e;
  if (S.s != e.s) return (e.s = -e.s), S.plus(e);
  if (((u = S.d), (v = e.d), (a = C.precision), (l = C.rounding), !u[0] || !v[0])) {
    if (v[0]) e.s = -e.s;
    else if (u[0]) e = new C(S);
    else return new C(l === 3 ? -0 : 0);
    return _ ? I(e, a, l) : e;
  }
  if (((r = X(e.e / k)), (g = X(S.e / k)), (u = u.slice()), (o = g - r), o)) {
    for (
      h = o < 0,
        h ? ((t = u), (o = -o), (s = v.length)) : ((t = v), (r = g), (s = u.length)),
        n = Math.max(Math.ceil(a / k), s) + 2,
        o > n && ((o = n), (t.length = 1)),
        t.reverse(),
        n = o;
      n--;

    )
      t.push(0);
    t.reverse();
  } else {
    for (n = u.length, s = v.length, h = n < s, h && (s = n), n = 0; n < s; n++)
      if (u[n] != v[n]) {
        h = u[n] < v[n];
        break;
      }
    o = 0;
  }
  for (h && ((t = u), (u = v), (v = t), (e.s = -e.s)), s = u.length, n = v.length - s; n > 0; --n) u[s++] = 0;
  for (n = v.length; n > o; ) {
    if (u[--n] < v[n]) {
      for (i = n; i && u[--i] === 0; ) u[i] = pe - 1;
      --u[i], (u[n] += pe);
    }
    u[n] -= v[n];
  }
  for (; u[--s] === 0; ) u.pop();
  for (; u[0] === 0; u.shift()) --r;
  return u[0] ? ((e.d = u), (e.e = Pr(u, r)), _ ? I(e, a, l) : e) : new C(l === 3 ? -0 : 0);
};
A.modulo = A.mod = function (e) {
  var t,
    r = this,
    n = r.constructor;
  return (
    (e = new n(e)),
    !r.d || !e.s || (e.d && !e.d[0])
      ? new n(NaN)
      : !e.d || (r.d && !r.d[0])
      ? I(new n(r), n.precision, n.rounding)
      : ((_ = !1),
        n.modulo == 9 ? ((t = $(r, e.abs(), 0, 3, 1)), (t.s *= e.s)) : (t = $(r, e, 0, n.modulo, 1)),
        (t = t.times(e)),
        (_ = !0),
        r.minus(t))
  );
};
A.naturalExponential = A.exp = function () {
  return wn(this);
};
A.naturalLogarithm = A.ln = function () {
  return Oe(this);
};
A.negated = A.neg = function () {
  var e = new this.constructor(this);
  return (e.s = -e.s), I(e);
};
A.plus = A.add = function (e) {
  var t,
    r,
    n,
    i,
    o,
    s,
    a,
    l,
    u,
    g,
    h = this,
    v = h.constructor;
  if (((e = new v(e)), !h.d || !e.d))
    return !h.s || !e.s ? (e = new v(NaN)) : h.d || (e = new v(e.d || h.s === e.s ? h : NaN)), e;
  if (h.s != e.s) return (e.s = -e.s), h.minus(e);
  if (((u = h.d), (g = e.d), (a = v.precision), (l = v.rounding), !u[0] || !g[0]))
    return g[0] || (e = new v(h)), _ ? I(e, a, l) : e;
  if (((o = X(h.e / k)), (n = X(e.e / k)), (u = u.slice()), (i = o - n), i)) {
    for (
      i < 0 ? ((r = u), (i = -i), (s = g.length)) : ((r = g), (n = o), (s = u.length)),
        o = Math.ceil(a / k),
        s = o > s ? o + 1 : s + 1,
        i > s && ((i = s), (r.length = 1)),
        r.reverse();
      i--;

    )
      r.push(0);
    r.reverse();
  }
  for (s = u.length, i = g.length, s - i < 0 && ((i = s), (r = g), (g = u), (u = r)), t = 0; i; )
    (t = ((u[--i] = u[i] + g[i] + t) / pe) | 0), (u[i] %= pe);
  for (t && (u.unshift(t), ++n), s = u.length; u[--s] == 0; ) u.pop();
  return (e.d = u), (e.e = Pr(u, n)), _ ? I(e, a, l) : e;
};
A.precision = A.sd = function (e) {
  var t,
    r = this;
  if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(Ie + e);
  return r.d ? ((t = so(r.d)), e && r.e + 1 > t && (t = r.e + 1)) : (t = NaN), t;
};
A.round = function () {
  var e = this,
    t = e.constructor;
  return I(new t(e), e.e + 1, t.rounding);
};
A.sine = A.sin = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return r.isFinite()
    ? r.isZero()
      ? new n(r)
      : ((e = n.precision),
        (t = n.rounding),
        (n.precision = e + Math.max(r.e, r.sd()) + k),
        (n.rounding = 1),
        (r = ol(n, co(n, r))),
        (n.precision = e),
        (n.rounding = t),
        I(xe > 2 ? r.neg() : r, e, t, !0))
    : new n(NaN);
};
A.squareRoot = A.sqrt = function () {
  var e,
    t,
    r,
    n,
    i,
    o,
    s = this,
    a = s.d,
    l = s.e,
    u = s.s,
    g = s.constructor;
  if (u !== 1 || !a || !a[0]) return new g(!u || (u < 0 && (!a || a[0])) ? NaN : a ? s : 1 / 0);
  for (
    _ = !1,
      u = Math.sqrt(+s),
      u == 0 || u == 1 / 0
        ? ((t = z(a)),
          (t.length + l) % 2 == 0 && (t += '0'),
          (u = Math.sqrt(t)),
          (l = X((l + 1) / 2) - (l < 0 || l % 2)),
          u == 1 / 0 ? (t = '5e' + l) : ((t = u.toExponential()), (t = t.slice(0, t.indexOf('e') + 1) + l)),
          (n = new g(t)))
        : (n = new g(u.toString())),
      r = (l = g.precision) + 3;
    ;

  )
    if (((o = n), (n = o.plus($(s, o, r + 2, 1)).times(0.5)), z(o.d).slice(0, r) === (t = z(n.d)).slice(0, r)))
      if (((t = t.slice(r - 3, r + 1)), t == '9999' || (!i && t == '4999'))) {
        if (!i && (I(o, l + 1, 0), o.times(o).eq(s))) {
          n = o;
          break;
        }
        (r += 4), (i = 1);
      } else {
        (!+t || (!+t.slice(1) && t.charAt(0) == '5')) && (I(n, l + 1, 1), (e = !n.times(n).eq(s)));
        break;
      }
  return (_ = !0), I(n, l, g.rounding, e);
};
A.tangent = A.tan = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return r.isFinite()
    ? r.isZero()
      ? new n(r)
      : ((e = n.precision),
        (t = n.rounding),
        (n.precision = e + 10),
        (n.rounding = 1),
        (r = r.sin()),
        (r.s = 1),
        (r = $(r, new n(1).minus(r.times(r)).sqrt(), e + 10, 0)),
        (n.precision = e),
        (n.rounding = t),
        I(xe == 2 || xe == 4 ? r.neg() : r, e, t, !0))
    : new n(NaN);
};
A.times = A.mul = function (e) {
  var t,
    r,
    n,
    i,
    o,
    s,
    a,
    l,
    u,
    g = this,
    h = g.constructor,
    v = g.d,
    S = (e = new h(e)).d;
  if (((e.s *= g.s), !v || !v[0] || !S || !S[0]))
    return new h(!e.s || (v && !v[0] && !S) || (S && !S[0] && !v) ? NaN : !v || !S ? e.s / 0 : e.s * 0);
  for (
    r = X(g.e / k) + X(e.e / k),
      l = v.length,
      u = S.length,
      l < u && ((o = v), (v = S), (S = o), (s = l), (l = u), (u = s)),
      o = [],
      s = l + u,
      n = s;
    n--;

  )
    o.push(0);
  for (n = u; --n >= 0; ) {
    for (t = 0, i = l + n; i > n; ) (a = o[i] + S[n] * v[i - n - 1] + t), (o[i--] = a % pe | 0), (t = (a / pe) | 0);
    o[i] = (o[i] + t) % pe | 0;
  }
  for (; !o[--s]; ) o.pop();
  return t ? ++r : o.shift(), (e.d = o), (e.e = Pr(o, r)), _ ? I(e, h.precision, h.rounding) : e;
};
A.toBinary = function (e, t) {
  return bn(this, 2, e, t);
};
A.toDecimalPlaces = A.toDP = function (e, t) {
  var r = this,
    n = r.constructor;
  return (
    (r = new n(r)),
    e === void 0 ? r : (ne(e, 0, ke), t === void 0 ? (t = n.rounding) : ne(t, 0, 8), I(r, e + r.e + 1, t))
  );
};
A.toExponential = function (e, t) {
  var r,
    n = this,
    i = n.constructor;
  return (
    e === void 0
      ? (r = ge(n, !0))
      : (ne(e, 0, ke),
        t === void 0 ? (t = i.rounding) : ne(t, 0, 8),
        (n = I(new i(n), e + 1, t)),
        (r = ge(n, !0, e + 1))),
    n.isNeg() && !n.isZero() ? '-' + r : r
  );
};
A.toFixed = function (e, t) {
  var r,
    n,
    i = this,
    o = i.constructor;
  return (
    e === void 0
      ? (r = ge(i))
      : (ne(e, 0, ke),
        t === void 0 ? (t = o.rounding) : ne(t, 0, 8),
        (n = I(new o(i), e + i.e + 1, t)),
        (r = ge(n, !1, e + n.e + 1))),
    i.isNeg() && !i.isZero() ? '-' + r : r
  );
};
A.toFraction = function (e) {
  var t,
    r,
    n,
    i,
    o,
    s,
    a,
    l,
    u,
    g,
    h,
    v,
    S = this,
    C = S.d,
    R = S.constructor;
  if (!C) return new R(S);
  if (
    ((u = r = new R(1)),
    (n = l = new R(0)),
    (t = new R(n)),
    (o = t.e = so(C) - S.e - 1),
    (s = o % k),
    (t.d[0] = Q(10, s < 0 ? k + s : s)),
    e == null)
  )
    e = o > 0 ? t : u;
  else {
    if (((a = new R(e)), !a.isInt() || a.lt(u))) throw Error(Ie + a);
    e = a.gt(t) ? (o > 0 ? t : u) : a;
  }
  for (
    _ = !1, a = new R(z(C)), g = R.precision, R.precision = o = C.length * k * 2;
    (h = $(a, t, 0, 1, 1)), (i = r.plus(h.times(n))), i.cmp(e) != 1;

  )
    (r = n), (n = i), (i = u), (u = l.plus(h.times(i))), (l = i), (i = t), (t = a.minus(h.times(i))), (a = i);
  return (
    (i = $(e.minus(r), n, 0, 1, 1)),
    (l = l.plus(i.times(u))),
    (r = r.plus(i.times(n))),
    (l.s = u.s = S.s),
    (v =
      $(u, n, o, 1)
        .minus(S)
        .abs()
        .cmp($(l, r, o, 1).minus(S).abs()) < 1
        ? [u, n]
        : [l, r]),
    (R.precision = g),
    (_ = !0),
    v
  );
};
A.toHexadecimal = A.toHex = function (e, t) {
  return bn(this, 16, e, t);
};
A.toNearest = function (e, t) {
  var r = this,
    n = r.constructor;
  if (((r = new n(r)), e == null)) {
    if (!r.d) return r;
    (e = new n(1)), (t = n.rounding);
  } else {
    if (((e = new n(e)), t === void 0 ? (t = n.rounding) : ne(t, 0, 8), !r.d)) return e.s ? r : e;
    if (!e.d) return e.s && (e.s = r.s), e;
  }
  return e.d[0] ? ((_ = !1), (r = $(r, e, 0, t, 1).times(e)), (_ = !0), I(r)) : ((e.s = r.s), (r = e)), r;
};
A.toNumber = function () {
  return +this;
};
A.toOctal = function (e, t) {
  return bn(this, 8, e, t);
};
A.toPower = A.pow = function (e) {
  var t,
    r,
    n,
    i,
    o,
    s,
    a = this,
    l = a.constructor,
    u = +(e = new l(e));
  if (!a.d || !e.d || !a.d[0] || !e.d[0]) return new l(Q(+a, u));
  if (((a = new l(a)), a.eq(1))) return a;
  if (((n = l.precision), (o = l.rounding), e.eq(1))) return I(a, n, o);
  if (((t = X(e.e / k)), t >= e.d.length - 1 && (r = u < 0 ? -u : u) <= tl))
    return (i = ao(l, a, r, n)), e.s < 0 ? new l(1).div(i) : I(i, n, o);
  if (((s = a.s), s < 0)) {
    if (t < e.d.length - 1) return new l(NaN);
    if ((e.d[t] & 1 || (s = 1), a.e == 0 && a.d[0] == 1 && a.d.length == 1)) return (a.s = s), a;
  }
  return (
    (r = Q(+a, u)),
    (t = r == 0 || !isFinite(r) ? X(u * (Math.log('0.' + z(a.d)) / Math.LN10 + a.e + 1)) : new l(r + '').e),
    t > l.maxE + 1 || t < l.minE - 1
      ? new l(t > 0 ? s / 0 : 0)
      : ((_ = !1),
        (l.rounding = a.s = 1),
        (r = Math.min(12, (t + '').length)),
        (i = wn(e.times(Oe(a, n + r)), n)),
        i.d &&
          ((i = I(i, n + 5, 1)),
          Mt(i.d, n, o) &&
            ((t = n + 10),
            (i = I(wn(e.times(Oe(a, t + r)), t), t + 5, 1)),
            +z(i.d).slice(n + 1, n + 15) + 1 == 1e14 && (i = I(i, n + 1, 0)))),
        (i.s = s),
        (_ = !0),
        (l.rounding = o),
        I(i, n, o))
  );
};
A.toPrecision = function (e, t) {
  var r,
    n = this,
    i = n.constructor;
  return (
    e === void 0
      ? (r = ge(n, n.e <= i.toExpNeg || n.e >= i.toExpPos))
      : (ne(e, 1, ke),
        t === void 0 ? (t = i.rounding) : ne(t, 0, 8),
        (n = I(new i(n), e, t)),
        (r = ge(n, e <= n.e || n.e <= i.toExpNeg, e))),
    n.isNeg() && !n.isZero() ? '-' + r : r
  );
};
A.toSignificantDigits = A.toSD = function (e, t) {
  var r = this,
    n = r.constructor;
  return (
    e === void 0
      ? ((e = n.precision), (t = n.rounding))
      : (ne(e, 1, ke), t === void 0 ? (t = n.rounding) : ne(t, 0, 8)),
    I(new n(r), e, t)
  );
};
A.toString = function () {
  var e = this,
    t = e.constructor,
    r = ge(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
  return e.isNeg() && !e.isZero() ? '-' + r : r;
};
A.truncated = A.trunc = function () {
  return I(new this.constructor(this), this.e + 1, 1);
};
A.valueOf = A.toJSON = function () {
  var e = this,
    t = e.constructor,
    r = ge(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
  return e.isNeg() ? '-' + r : r;
};
function z(e) {
  var t,
    r,
    n,
    i = e.length - 1,
    o = '',
    s = e[0];
  if (i > 0) {
    for (o += s, t = 1; t < i; t++) (n = e[t] + ''), (r = k - n.length), r && (o += Se(r)), (o += n);
    (s = e[t]), (n = s + ''), (r = k - n.length), r && (o += Se(r));
  } else if (s === 0) return '0';
  for (; s % 10 === 0; ) s /= 10;
  return o + s;
}
function ne(e, t, r) {
  if (e !== ~~e || e < t || e > r) throw Error(Ie + e);
}
function Mt(e, t, r, n) {
  var i, o, s, a;
  for (o = e[0]; o >= 10; o /= 10) --t;
  return (
    --t < 0 ? ((t += k), (i = 0)) : ((i = Math.ceil((t + 1) / k)), (t %= k)),
    (o = Q(10, k - t)),
    (a = e[i] % o | 0),
    n == null
      ? t < 3
        ? (t == 0 ? (a = (a / 100) | 0) : t == 1 && (a = (a / 10) | 0),
          (s = (r < 4 && a == 99999) || (r > 3 && a == 49999) || a == 5e4 || a == 0))
        : (s =
            (((r < 4 && a + 1 == o) || (r > 3 && a + 1 == o / 2)) && ((e[i + 1] / o / 100) | 0) == Q(10, t - 2) - 1) ||
            ((a == o / 2 || a == 0) && ((e[i + 1] / o / 100) | 0) == 0))
      : t < 4
      ? (t == 0 ? (a = (a / 1e3) | 0) : t == 1 ? (a = (a / 100) | 0) : t == 2 && (a = (a / 10) | 0),
        (s = ((n || r < 4) && a == 9999) || (!n && r > 3 && a == 4999)))
      : (s =
          (((n || r < 4) && a + 1 == o) || (!n && r > 3 && a + 1 == o / 2)) &&
          ((e[i + 1] / o / 1e3) | 0) == Q(10, t - 3) - 1),
    s
  );
}
function yr(e, t, r) {
  for (var n, i = [0], o, s = 0, a = e.length; s < a; ) {
    for (o = i.length; o--; ) i[o] *= t;
    for (i[0] += gn.indexOf(e.charAt(s++)), n = 0; n < i.length; n++)
      i[n] > r - 1 && (i[n + 1] === void 0 && (i[n + 1] = 0), (i[n + 1] += (i[n] / r) | 0), (i[n] %= r));
  }
  return i.reverse();
}
function nl(e, t) {
  var r, n, i;
  if (t.isZero()) return t;
  (n = t.d.length),
    n < 32
      ? ((r = Math.ceil(n / 3)), (i = (1 / vr(4, r)).toString()))
      : ((r = 16), (i = '2.3283064365386962890625e-10')),
    (e.precision += r),
    (t = nt(e, 1, t.times(i), new e(1)));
  for (var o = r; o--; ) {
    var s = t.times(t);
    t = s.times(s).minus(s).times(8).plus(1);
  }
  return (e.precision -= r), t;
}
var $ = (function () {
  function e(n, i, o) {
    var s,
      a = 0,
      l = n.length;
    for (n = n.slice(); l--; ) (s = n[l] * i + a), (n[l] = s % o | 0), (a = (s / o) | 0);
    return a && n.unshift(a), n;
  }
  function t(n, i, o, s) {
    var a, l;
    if (o != s) l = o > s ? 1 : -1;
    else
      for (a = l = 0; a < o; a++)
        if (n[a] != i[a]) {
          l = n[a] > i[a] ? 1 : -1;
          break;
        }
    return l;
  }
  function r(n, i, o, s) {
    for (var a = 0; o--; ) (n[o] -= a), (a = n[o] < i[o] ? 1 : 0), (n[o] = a * s + n[o] - i[o]);
    for (; !n[0] && n.length > 1; ) n.shift();
  }
  return function (n, i, o, s, a, l) {
    var u,
      g,
      h,
      v,
      S,
      C,
      R,
      M,
      F,
      B,
      D,
      O,
      oe,
      G,
      jr,
      rr,
      wt,
      Gr,
      ue,
      nr,
      ir = n.constructor,
      Jr = n.s == i.s ? 1 : -1,
      Y = n.d,
      q = i.d;
    if (!Y || !Y[0] || !q || !q[0])
      return new ir(!n.s || !i.s || (Y ? q && Y[0] == q[0] : !q) ? NaN : (Y && Y[0] == 0) || !q ? Jr * 0 : Jr / 0);
    for (
      l ? ((S = 1), (g = n.e - i.e)) : ((l = pe), (S = k), (g = X(n.e / S) - X(i.e / S))),
        ue = q.length,
        wt = Y.length,
        F = new ir(Jr),
        B = F.d = [],
        h = 0;
      q[h] == (Y[h] || 0);
      h++
    );
    if (
      (q[h] > (Y[h] || 0) && g--,
      o == null ? ((G = o = ir.precision), (s = ir.rounding)) : a ? (G = o + (n.e - i.e) + 1) : (G = o),
      G < 0)
    )
      B.push(1), (C = !0);
    else {
      if (((G = (G / S + 2) | 0), (h = 0), ue == 1)) {
        for (v = 0, q = q[0], G++; (h < wt || v) && G--; h++)
          (jr = v * l + (Y[h] || 0)), (B[h] = (jr / q) | 0), (v = jr % q | 0);
        C = v || h < wt;
      } else {
        for (
          v = (l / (q[0] + 1)) | 0,
            v > 1 && ((q = e(q, v, l)), (Y = e(Y, v, l)), (ue = q.length), (wt = Y.length)),
            rr = ue,
            D = Y.slice(0, ue),
            O = D.length;
          O < ue;

        )
          D[O++] = 0;
        (nr = q.slice()), nr.unshift(0), (Gr = q[0]), q[1] >= l / 2 && ++Gr;
        do
          (v = 0),
            (u = t(q, D, ue, O)),
            u < 0
              ? ((oe = D[0]),
                ue != O && (oe = oe * l + (D[1] || 0)),
                (v = (oe / Gr) | 0),
                v > 1
                  ? (v >= l && (v = l - 1),
                    (R = e(q, v, l)),
                    (M = R.length),
                    (O = D.length),
                    (u = t(R, D, M, O)),
                    u == 1 && (v--, r(R, ue < M ? nr : q, M, l)))
                  : (v == 0 && (u = v = 1), (R = q.slice())),
                (M = R.length),
                M < O && R.unshift(0),
                r(D, R, O, l),
                u == -1 && ((O = D.length), (u = t(q, D, ue, O)), u < 1 && (v++, r(D, ue < O ? nr : q, O, l))),
                (O = D.length))
              : u === 0 && (v++, (D = [0])),
            (B[h++] = v),
            u && D[0] ? (D[O++] = Y[rr] || 0) : ((D = [Y[rr]]), (O = 1));
        while ((rr++ < wt || D[0] !== void 0) && G--);
        C = D[0] !== void 0;
      }
      B[0] || B.shift();
    }
    if (S == 1) (F.e = g), (to = C);
    else {
      for (h = 1, v = B[0]; v >= 10; v /= 10) h++;
      (F.e = h + g * S - 1), I(F, a ? o + F.e + 1 : o, s, C);
    }
    return F;
  };
})();
function I(e, t, r, n) {
  var i,
    o,
    s,
    a,
    l,
    u,
    g,
    h,
    v,
    S = e.constructor;
  e: if (t != null) {
    if (((h = e.d), !h)) return e;
    for (i = 1, a = h[0]; a >= 10; a /= 10) i++;
    if (((o = t - i), o < 0)) (o += k), (s = t), (g = h[(v = 0)]), (l = (g / Q(10, i - s - 1)) % 10 | 0);
    else if (((v = Math.ceil((o + 1) / k)), (a = h.length), v >= a))
      if (n) {
        for (; a++ <= v; ) h.push(0);
        (g = l = 0), (i = 1), (o %= k), (s = o - k + 1);
      } else break e;
    else {
      for (g = a = h[v], i = 1; a >= 10; a /= 10) i++;
      (o %= k), (s = o - k + i), (l = s < 0 ? 0 : (g / Q(10, i - s - 1)) % 10 | 0);
    }
    if (
      ((n = n || t < 0 || h[v + 1] !== void 0 || (s < 0 ? g : g % Q(10, i - s - 1))),
      (u =
        r < 4
          ? (l || n) && (r == 0 || r == (e.s < 0 ? 3 : 2))
          : l > 5 ||
            (l == 5 &&
              (r == 4 ||
                n ||
                (r == 6 && (o > 0 ? (s > 0 ? g / Q(10, i - s) : 0) : h[v - 1]) % 10 & 1) ||
                r == (e.s < 0 ? 8 : 7)))),
      t < 1 || !h[0])
    )
      return (
        (h.length = 0), u ? ((t -= e.e + 1), (h[0] = Q(10, (k - (t % k)) % k)), (e.e = -t || 0)) : (h[0] = e.e = 0), e
      );
    if (
      (o == 0
        ? ((h.length = v), (a = 1), v--)
        : ((h.length = v + 1), (a = Q(10, k - o)), (h[v] = s > 0 ? ((g / Q(10, i - s)) % Q(10, s) | 0) * a : 0)),
      u)
    )
      for (;;)
        if (v == 0) {
          for (o = 1, s = h[0]; s >= 10; s /= 10) o++;
          for (s = h[0] += a, a = 1; s >= 10; s /= 10) a++;
          o != a && (e.e++, h[0] == pe && (h[0] = 1));
          break;
        } else {
          if (((h[v] += a), h[v] != pe)) break;
          (h[v--] = 0), (a = 1);
        }
    for (o = h.length; h[--o] === 0; ) h.pop();
  }
  return _ && (e.e > S.maxE ? ((e.d = null), (e.e = NaN)) : e.e < S.minE && ((e.e = 0), (e.d = [0]))), e;
}
function ge(e, t, r) {
  if (!e.isFinite()) return uo(e);
  var n,
    i = e.e,
    o = z(e.d),
    s = o.length;
  return (
    t
      ? (r && (n = r - s) > 0
          ? (o = o.charAt(0) + '.' + o.slice(1) + Se(n))
          : s > 1 && (o = o.charAt(0) + '.' + o.slice(1)),
        (o = o + (e.e < 0 ? 'e' : 'e+') + e.e))
      : i < 0
      ? ((o = '0.' + Se(-i - 1) + o), r && (n = r - s) > 0 && (o += Se(n)))
      : i >= s
      ? ((o += Se(i + 1 - s)), r && (n = r - i - 1) > 0 && (o = o + '.' + Se(n)))
      : ((n = i + 1) < s && (o = o.slice(0, n) + '.' + o.slice(n)),
        r && (n = r - s) > 0 && (i + 1 === s && (o += '.'), (o += Se(n)))),
    o
  );
}
function Pr(e, t) {
  var r = e[0];
  for (t *= k; r >= 10; r /= 10) t++;
  return t;
}
function br(e, t, r) {
  if (t > rl) throw ((_ = !0), r && (e.precision = r), Error(ro));
  return I(new e(wr), t, 1, !0);
}
function ce(e, t, r) {
  if (t > yn) throw Error(ro);
  return I(new e(Er), t, r, !0);
}
function so(e) {
  var t = e.length - 1,
    r = t * k + 1;
  if (((t = e[t]), t)) {
    for (; t % 10 == 0; t /= 10) r--;
    for (t = e[0]; t >= 10; t /= 10) r++;
  }
  return r;
}
function Se(e) {
  for (var t = ''; e--; ) t += '0';
  return t;
}
function ao(e, t, r, n) {
  var i,
    o = new e(1),
    s = Math.ceil(n / k + 4);
  for (_ = !1; ; ) {
    if ((r % 2 && ((o = o.times(t)), Xi(o.d, s) && (i = !0)), (r = X(r / 2)), r === 0)) {
      (r = o.d.length - 1), i && o.d[r] === 0 && ++o.d[r];
      break;
    }
    (t = t.times(t)), Xi(t.d, s);
  }
  return (_ = !0), o;
}
function Zi(e) {
  return e.d[e.d.length - 1] & 1;
}
function lo(e, t, r) {
  for (var n, i = new e(t[0]), o = 0; ++o < t.length; )
    if (((n = new e(t[o])), n.s)) i[r](n) && (i = n);
    else {
      i = n;
      break;
    }
  return i;
}
function wn(e, t) {
  var r,
    n,
    i,
    o,
    s,
    a,
    l,
    u = 0,
    g = 0,
    h = 0,
    v = e.constructor,
    S = v.rounding,
    C = v.precision;
  if (!e.d || !e.d[0] || e.e > 17)
    return new v(e.d ? (e.d[0] ? (e.s < 0 ? 0 : 1 / 0) : 1) : e.s ? (e.s < 0 ? 0 : e) : NaN);
  for (t == null ? ((_ = !1), (l = C)) : (l = t), a = new v(0.03125); e.e > -2; ) (e = e.times(a)), (h += 5);
  for (n = ((Math.log(Q(2, h)) / Math.LN10) * 2 + 5) | 0, l += n, r = o = s = new v(1), v.precision = l; ; ) {
    if (
      ((o = I(o.times(e), l, 1)),
      (r = r.times(++g)),
      (a = s.plus($(o, r, l, 1))),
      z(a.d).slice(0, l) === z(s.d).slice(0, l))
    ) {
      for (i = h; i--; ) s = I(s.times(s), l, 1);
      if (t == null)
        if (u < 3 && Mt(s.d, l - n, S, u)) (v.precision = l += 10), (r = o = a = new v(1)), (g = 0), u++;
        else return I(s, (v.precision = C), S, (_ = !0));
      else return (v.precision = C), s;
    }
    s = a;
  }
}
function Oe(e, t) {
  var r,
    n,
    i,
    o,
    s,
    a,
    l,
    u,
    g,
    h,
    v,
    S = 1,
    C = 10,
    R = e,
    M = R.d,
    F = R.constructor,
    B = F.rounding,
    D = F.precision;
  if (R.s < 0 || !M || !M[0] || (!R.e && M[0] == 1 && M.length == 1))
    return new F(M && !M[0] ? -1 / 0 : R.s != 1 ? NaN : M ? 0 : R);
  if (
    (t == null ? ((_ = !1), (g = D)) : (g = t),
    (F.precision = g += C),
    (r = z(M)),
    (n = r.charAt(0)),
    Math.abs((o = R.e)) < 15e14)
  ) {
    for (; (n < 7 && n != 1) || (n == 1 && r.charAt(1) > 3); ) (R = R.times(e)), (r = z(R.d)), (n = r.charAt(0)), S++;
    (o = R.e), n > 1 ? ((R = new F('0.' + r)), o++) : (R = new F(n + '.' + r.slice(1)));
  } else
    return (
      (u = br(F, g + 2, D).times(o + '')),
      (R = Oe(new F(n + '.' + r.slice(1)), g - C).plus(u)),
      (F.precision = D),
      t == null ? I(R, D, B, (_ = !0)) : R
    );
  for (h = R, l = s = R = $(R.minus(1), R.plus(1), g, 1), v = I(R.times(R), g, 1), i = 3; ; ) {
    if (((s = I(s.times(v), g, 1)), (u = l.plus($(s, new F(i), g, 1))), z(u.d).slice(0, g) === z(l.d).slice(0, g)))
      if (
        ((l = l.times(2)),
        o !== 0 && (l = l.plus(br(F, g + 2, D).times(o + ''))),
        (l = $(l, new F(S), g, 1)),
        t == null)
      )
        if (Mt(l.d, g - C, B, a))
          (F.precision = g += C), (u = s = R = $(h.minus(1), h.plus(1), g, 1)), (v = I(R.times(R), g, 1)), (i = a = 1);
        else return I(l, (F.precision = D), B, (_ = !0));
      else return (F.precision = D), l;
    (l = u), (i += 2);
  }
}
function uo(e) {
  return String((e.s * e.s) / 0);
}
function En(e, t) {
  var r, n, i;
  for (
    (r = t.indexOf('.')) > -1 && (t = t.replace('.', '')),
      (n = t.search(/e/i)) > 0
        ? (r < 0 && (r = n), (r += +t.slice(n + 1)), (t = t.substring(0, n)))
        : r < 0 && (r = t.length),
      n = 0;
    t.charCodeAt(n) === 48;
    n++
  );
  for (i = t.length; t.charCodeAt(i - 1) === 48; --i);
  if (((t = t.slice(n, i)), t)) {
    if (((i -= n), (e.e = r = r - n - 1), (e.d = []), (n = (r + 1) % k), r < 0 && (n += k), n < i)) {
      for (n && e.d.push(+t.slice(0, n)), i -= k; n < i; ) e.d.push(+t.slice(n, (n += k)));
      (t = t.slice(n)), (n = k - t.length);
    } else n -= i;
    for (; n--; ) t += '0';
    e.d.push(+t),
      _ &&
        (e.e > e.constructor.maxE ? ((e.d = null), (e.e = NaN)) : e.e < e.constructor.minE && ((e.e = 0), (e.d = [0])));
  } else (e.e = 0), (e.d = [0]);
  return e;
}
function il(e, t) {
  var r, n, i, o, s, a, l, u, g;
  if (t.indexOf('_') > -1) {
    if (((t = t.replace(/(\d)_(?=\d)/g, '$1')), oo.test(t))) return En(e, t);
  } else if (t === 'Infinity' || t === 'NaN') return +t || (e.s = NaN), (e.e = NaN), (e.d = null), e;
  if (Xa.test(t)) (r = 16), (t = t.toLowerCase());
  else if (Za.test(t)) r = 2;
  else if (el.test(t)) r = 8;
  else throw Error(Ie + t);
  for (
    o = t.search(/p/i),
      o > 0 ? ((l = +t.slice(o + 1)), (t = t.substring(2, o))) : (t = t.slice(2)),
      o = t.indexOf('.'),
      s = o >= 0,
      n = e.constructor,
      s && ((t = t.replace('.', '')), (a = t.length), (o = a - o), (i = ao(n, new n(r), o, o * 2))),
      u = yr(t, r, pe),
      g = u.length - 1,
      o = g;
    u[o] === 0;
    --o
  )
    u.pop();
  return o < 0
    ? new n(e.s * 0)
    : ((e.e = Pr(u, g)),
      (e.d = u),
      (_ = !1),
      s && (e = $(e, i, a * 4)),
      l && (e = e.times(Math.abs(l) < 54 ? Q(2, l) : qe.pow(2, l))),
      (_ = !0),
      e);
}
function ol(e, t) {
  var r,
    n = t.d.length;
  if (n < 3) return t.isZero() ? t : nt(e, 2, t, t);
  (r = 1.4 * Math.sqrt(n)), (r = r > 16 ? 16 : r | 0), (t = t.times(1 / vr(5, r))), (t = nt(e, 2, t, t));
  for (var i, o = new e(5), s = new e(16), a = new e(20); r--; )
    (i = t.times(t)), (t = t.times(o.plus(i.times(s.times(i).minus(a)))));
  return t;
}
function nt(e, t, r, n, i) {
  var o,
    s,
    a,
    l,
    u = 1,
    g = e.precision,
    h = Math.ceil(g / k);
  for (_ = !1, l = r.times(r), a = new e(n); ; ) {
    if (
      ((s = $(a.times(l), new e(t++ * t++), g, 1)),
      (a = i ? n.plus(s) : n.minus(s)),
      (n = $(s.times(l), new e(t++ * t++), g, 1)),
      (s = a.plus(n)),
      s.d[h] !== void 0)
    ) {
      for (o = h; s.d[o] === a.d[o] && o--; );
      if (o == -1) break;
    }
    (o = a), (a = n), (n = s), (s = o), u++;
  }
  return (_ = !0), (s.d.length = h + 1), s;
}
function vr(e, t) {
  for (var r = e; --t; ) r *= e;
  return r;
}
function co(e, t) {
  var r,
    n = t.s < 0,
    i = ce(e, e.precision, 1),
    o = i.times(0.5);
  if (((t = t.abs()), t.lte(o))) return (xe = n ? 4 : 1), t;
  if (((r = t.divToInt(i)), r.isZero())) xe = n ? 3 : 2;
  else {
    if (((t = t.minus(r.times(i))), t.lte(o))) return (xe = Zi(r) ? (n ? 2 : 3) : n ? 4 : 1), t;
    xe = Zi(r) ? (n ? 1 : 4) : n ? 3 : 2;
  }
  return t.minus(i).abs();
}
function bn(e, t, r, n) {
  var i,
    o,
    s,
    a,
    l,
    u,
    g,
    h,
    v,
    S = e.constructor,
    C = r !== void 0;
  if (
    (C ? (ne(r, 1, ke), n === void 0 ? (n = S.rounding) : ne(n, 0, 8)) : ((r = S.precision), (n = S.rounding)),
    !e.isFinite())
  )
    g = uo(e);
  else {
    for (
      g = ge(e),
        s = g.indexOf('.'),
        C ? ((i = 2), t == 16 ? (r = r * 4 - 3) : t == 8 && (r = r * 3 - 2)) : (i = t),
        s >= 0 &&
          ((g = g.replace('.', '')),
          (v = new S(1)),
          (v.e = g.length - s),
          (v.d = yr(ge(v), 10, i)),
          (v.e = v.d.length)),
        h = yr(g, 10, i),
        o = l = h.length;
      h[--l] == 0;

    )
      h.pop();
    if (!h[0]) g = C ? '0p+0' : '0';
    else {
      if (
        (s < 0
          ? o--
          : ((e = new S(e)), (e.d = h), (e.e = o), (e = $(e, v, r, n, 0, i)), (h = e.d), (o = e.e), (u = to)),
        (s = h[r]),
        (a = i / 2),
        (u = u || h[r + 1] !== void 0),
        (u =
          n < 4
            ? (s !== void 0 || u) && (n === 0 || n === (e.s < 0 ? 3 : 2))
            : s > a || (s === a && (n === 4 || u || (n === 6 && h[r - 1] & 1) || n === (e.s < 0 ? 8 : 7)))),
        (h.length = r),
        u)
      )
        for (; ++h[--r] > i - 1; ) (h[r] = 0), r || (++o, h.unshift(1));
      for (l = h.length; !h[l - 1]; --l);
      for (s = 0, g = ''; s < l; s++) g += gn.charAt(h[s]);
      if (C) {
        if (l > 1)
          if (t == 16 || t == 8) {
            for (s = t == 16 ? 4 : 3, --l; l % s; l++) g += '0';
            for (h = yr(g, i, t), l = h.length; !h[l - 1]; --l);
            for (s = 1, g = '1.'; s < l; s++) g += gn.charAt(h[s]);
          } else g = g.charAt(0) + '.' + g.slice(1);
        g = g + (o < 0 ? 'p' : 'p+') + o;
      } else if (o < 0) {
        for (; ++o; ) g = '0' + g;
        g = '0.' + g;
      } else if (++o > l) for (o -= l; o--; ) g += '0';
      else o < l && (g = g.slice(0, o) + '.' + g.slice(o));
    }
    g = (t == 16 ? '0x' : t == 2 ? '0b' : t == 8 ? '0o' : '') + g;
  }
  return e.s < 0 ? '-' + g : g;
}
function Xi(e, t) {
  if (e.length > t) return (e.length = t), !0;
}
function sl(e) {
  return new this(e).abs();
}
function al(e) {
  return new this(e).acos();
}
function ll(e) {
  return new this(e).acosh();
}
function ul(e, t) {
  return new this(e).plus(t);
}
function cl(e) {
  return new this(e).asin();
}
function pl(e) {
  return new this(e).asinh();
}
function ml(e) {
  return new this(e).atan();
}
function dl(e) {
  return new this(e).atanh();
}
function fl(e, t) {
  (e = new this(e)), (t = new this(t));
  var r,
    n = this.precision,
    i = this.rounding,
    o = n + 4;
  return (
    !e.s || !t.s
      ? (r = new this(NaN))
      : !e.d && !t.d
      ? ((r = ce(this, o, 1).times(t.s > 0 ? 0.25 : 0.75)), (r.s = e.s))
      : !t.d || e.isZero()
      ? ((r = t.s < 0 ? ce(this, n, i) : new this(0)), (r.s = e.s))
      : !e.d || t.isZero()
      ? ((r = ce(this, o, 1).times(0.5)), (r.s = e.s))
      : t.s < 0
      ? ((this.precision = o),
        (this.rounding = 1),
        (r = this.atan($(e, t, o, 1))),
        (t = ce(this, o, 1)),
        (this.precision = n),
        (this.rounding = i),
        (r = e.s < 0 ? r.minus(t) : r.plus(t)))
      : (r = this.atan($(e, t, o, 1))),
    r
  );
}
function gl(e) {
  return new this(e).cbrt();
}
function hl(e) {
  return I((e = new this(e)), e.e + 1, 2);
}
function yl(e, t, r) {
  return new this(e).clamp(t, r);
}
function wl(e) {
  if (!e || typeof e != 'object') throw Error(xr + 'Object expected');
  var t,
    r,
    n,
    i = e.defaults === !0,
    o = [
      'precision',
      1,
      ke,
      'rounding',
      0,
      8,
      'toExpNeg',
      -rt,
      0,
      'toExpPos',
      0,
      rt,
      'maxE',
      0,
      rt,
      'minE',
      -rt,
      0,
      'modulo',
      0,
      9,
    ];
  for (t = 0; t < o.length; t += 3)
    if (((r = o[t]), i && (this[r] = hn[r]), (n = e[r]) !== void 0))
      if (X(n) === n && n >= o[t + 1] && n <= o[t + 2]) this[r] = n;
      else throw Error(Ie + r + ': ' + n);
  if (((r = 'crypto'), i && (this[r] = hn[r]), (n = e[r]) !== void 0))
    if (n === !0 || n === !1 || n === 0 || n === 1)
      if (n)
        if (typeof crypto < 'u' && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[r] = !0;
        else throw Error(no);
      else this[r] = !1;
    else throw Error(Ie + r + ': ' + n);
  return this;
}
function El(e) {
  return new this(e).cos();
}
function bl(e) {
  return new this(e).cosh();
}
function po(e) {
  var t, r, n;
  function i(o) {
    var s,
      a,
      l,
      u = this;
    if (!(u instanceof i)) return new i(o);
    if (((u.constructor = i), eo(o))) {
      (u.s = o.s),
        _
          ? !o.d || o.e > i.maxE
            ? ((u.e = NaN), (u.d = null))
            : o.e < i.minE
            ? ((u.e = 0), (u.d = [0]))
            : ((u.e = o.e), (u.d = o.d.slice()))
          : ((u.e = o.e), (u.d = o.d ? o.d.slice() : o.d));
      return;
    }
    if (((l = typeof o), l === 'number')) {
      if (o === 0) {
        (u.s = 1 / o < 0 ? -1 : 1), (u.e = 0), (u.d = [0]);
        return;
      }
      if ((o < 0 ? ((o = -o), (u.s = -1)) : (u.s = 1), o === ~~o && o < 1e7)) {
        for (s = 0, a = o; a >= 10; a /= 10) s++;
        _
          ? s > i.maxE
            ? ((u.e = NaN), (u.d = null))
            : s < i.minE
            ? ((u.e = 0), (u.d = [0]))
            : ((u.e = s), (u.d = [o]))
          : ((u.e = s), (u.d = [o]));
        return;
      } else if (o * 0 !== 0) {
        o || (u.s = NaN), (u.e = NaN), (u.d = null);
        return;
      }
      return En(u, o.toString());
    } else if (l !== 'string') throw Error(Ie + o);
    return (
      (a = o.charCodeAt(0)) === 45 ? ((o = o.slice(1)), (u.s = -1)) : (a === 43 && (o = o.slice(1)), (u.s = 1)),
      oo.test(o) ? En(u, o) : il(u, o)
    );
  }
  if (
    ((i.prototype = A),
    (i.ROUND_UP = 0),
    (i.ROUND_DOWN = 1),
    (i.ROUND_CEIL = 2),
    (i.ROUND_FLOOR = 3),
    (i.ROUND_HALF_UP = 4),
    (i.ROUND_HALF_DOWN = 5),
    (i.ROUND_HALF_EVEN = 6),
    (i.ROUND_HALF_CEIL = 7),
    (i.ROUND_HALF_FLOOR = 8),
    (i.EUCLID = 9),
    (i.config = i.set = wl),
    (i.clone = po),
    (i.isDecimal = eo),
    (i.abs = sl),
    (i.acos = al),
    (i.acosh = ll),
    (i.add = ul),
    (i.asin = cl),
    (i.asinh = pl),
    (i.atan = ml),
    (i.atanh = dl),
    (i.atan2 = fl),
    (i.cbrt = gl),
    (i.ceil = hl),
    (i.clamp = yl),
    (i.cos = El),
    (i.cosh = bl),
    (i.div = xl),
    (i.exp = Pl),
    (i.floor = vl),
    (i.hypot = Tl),
    (i.ln = Al),
    (i.log = Cl),
    (i.log10 = Sl),
    (i.log2 = Rl),
    (i.max = Ol),
    (i.min = Il),
    (i.mod = kl),
    (i.mul = Dl),
    (i.pow = Ml),
    (i.random = Nl),
    (i.round = Fl),
    (i.sign = _l),
    (i.sin = Ll),
    (i.sinh = Bl),
    (i.sqrt = Ul),
    (i.sub = $l),
    (i.sum = ql),
    (i.tan = Vl),
    (i.tanh = jl),
    (i.trunc = Gl),
    e === void 0 && (e = {}),
    e && e.defaults !== !0)
  )
    for (
      n = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'maxE', 'minE', 'modulo', 'crypto'], t = 0;
      t < n.length;

    )
      e.hasOwnProperty((r = n[t++])) || (e[r] = this[r]);
  return i.config(e), i;
}
function xl(e, t) {
  return new this(e).div(t);
}
function Pl(e) {
  return new this(e).exp();
}
function vl(e) {
  return I((e = new this(e)), e.e + 1, 3);
}
function Tl() {
  var e,
    t,
    r = new this(0);
  for (_ = !1, e = 0; e < arguments.length; )
    if (((t = new this(arguments[e++])), t.d)) r.d && (r = r.plus(t.times(t)));
    else {
      if (t.s) return (_ = !0), new this(1 / 0);
      r = t;
    }
  return (_ = !0), r.sqrt();
}
function eo(e) {
  return e instanceof qe || (e && e.toStringTag === io) || !1;
}
function Al(e) {
  return new this(e).ln();
}
function Cl(e, t) {
  return new this(e).log(t);
}
function Rl(e) {
  return new this(e).log(2);
}
function Sl(e) {
  return new this(e).log(10);
}
function Ol() {
  return lo(this, arguments, 'lt');
}
function Il() {
  return lo(this, arguments, 'gt');
}
function kl(e, t) {
  return new this(e).mod(t);
}
function Dl(e, t) {
  return new this(e).mul(t);
}
function Ml(e, t) {
  return new this(e).pow(t);
}
function Nl(e) {
  var t,
    r,
    n,
    i,
    o = 0,
    s = new this(1),
    a = [];
  if ((e === void 0 ? (e = this.precision) : ne(e, 1, ke), (n = Math.ceil(e / k)), this.crypto))
    if (crypto.getRandomValues)
      for (t = crypto.getRandomValues(new Uint32Array(n)); o < n; )
        (i = t[o]), i >= 429e7 ? (t[o] = crypto.getRandomValues(new Uint32Array(1))[0]) : (a[o++] = i % 1e7);
    else if (crypto.randomBytes) {
      for (t = crypto.randomBytes((n *= 4)); o < n; )
        (i = t[o] + (t[o + 1] << 8) + (t[o + 2] << 16) + ((t[o + 3] & 127) << 24)),
          i >= 214e7 ? crypto.randomBytes(4).copy(t, o) : (a.push(i % 1e7), (o += 4));
      o = n / 4;
    } else throw Error(no);
  else for (; o < n; ) a[o++] = (Math.random() * 1e7) | 0;
  for (n = a[--o], e %= k, n && e && ((i = Q(10, k - e)), (a[o] = ((n / i) | 0) * i)); a[o] === 0; o--) a.pop();
  if (o < 0) (r = 0), (a = [0]);
  else {
    for (r = -1; a[0] === 0; r -= k) a.shift();
    for (n = 1, i = a[0]; i >= 10; i /= 10) n++;
    n < k && (r -= k - n);
  }
  return (s.e = r), (s.d = a), s;
}
function Fl(e) {
  return I((e = new this(e)), e.e + 1, this.rounding);
}
function _l(e) {
  return (e = new this(e)), e.d ? (e.d[0] ? e.s : 0 * e.s) : e.s || NaN;
}
function Ll(e) {
  return new this(e).sin();
}
function Bl(e) {
  return new this(e).sinh();
}
function Ul(e) {
  return new this(e).sqrt();
}
function $l(e, t) {
  return new this(e).sub(t);
}
function ql() {
  var e = 0,
    t = arguments,
    r = new this(t[e]);
  for (_ = !1; r.s && ++e < t.length; ) r = r.plus(t[e]);
  return (_ = !0), I(r, this.precision, this.rounding);
}
function Vl(e) {
  return new this(e).tan();
}
function jl(e) {
  return new this(e).tanh();
}
function Gl(e) {
  return I((e = new this(e)), e.e + 1, 1);
}
A[Symbol.for('nodejs.util.inspect.custom')] = A.toString;
A[Symbol.toStringTag] = 'Decimal';
var qe = (A.constructor = po(hn));
wr = new qe(wr);
Er = new qe(Er);
var Pe = qe;
function it(e) {
  return qe.isDecimal(e)
    ? !0
    : e !== null &&
        typeof e == 'object' &&
        typeof e.s == 'number' &&
        typeof e.e == 'number' &&
        typeof e.toFixed == 'function' &&
        Array.isArray(e.d);
}
f();
c();
p();
m();
d();
var Nt = class {
  constructor(t, r, n, i, o) {
    (this.modelName = t), (this.name = r), (this.typeName = n), (this.isList = i), (this.isEnum = o);
  }
  _toGraphQLInputType() {
    let t = this.isList ? 'List' : '',
      r = this.isEnum ? 'Enum' : '';
    return `${t}${r}${this.typeName}FieldRefInput<${this.modelName}>`;
  }
};
function ot(e) {
  return e instanceof Nt;
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var Tr = class {
  constructor(t) {
    this.value = t;
  }
  write(t) {
    t.write(this.value);
  }
  markAsError() {
    this.value.markAsError();
  }
};
f();
c();
p();
m();
d();
var Ar = (e) => e,
  Cr = { bold: Ar, red: Ar, green: Ar, dim: Ar, enabled: !1 },
  mo = { bold: ar, red: Ye, green: vi, dim: lr, enabled: !0 },
  st = {
    write(e) {
      e.writeLine(',');
    },
  };
f();
c();
p();
m();
d();
var he = class {
  constructor(t) {
    this.contents = t;
    this.isUnderlined = !1;
    this.color = (t) => t;
  }
  underline() {
    return (this.isUnderlined = !0), this;
  }
  setColor(t) {
    return (this.color = t), this;
  }
  write(t) {
    let r = t.getCurrentLineLength();
    t.write(this.color(this.contents)),
      this.isUnderlined &&
        t.afterNextNewline(() => {
          t.write(' '.repeat(r)).writeLine(this.color('~'.repeat(this.contents.length)));
        });
  }
};
f();
c();
p();
m();
d();
var De = class {
  constructor() {
    this.hasError = !1;
  }
  markAsError() {
    return (this.hasError = !0), this;
  }
};
var at = class extends De {
  constructor() {
    super(...arguments);
    this.items = [];
  }
  addItem(r) {
    return this.items.push(new Tr(r)), this;
  }
  getField(r) {
    return this.items[r];
  }
  getPrintWidth() {
    return this.items.length === 0 ? 2 : Math.max(...this.items.map((n) => n.value.getPrintWidth())) + 2;
  }
  write(r) {
    if (this.items.length === 0) {
      this.writeEmpty(r);
      return;
    }
    this.writeWithItems(r);
  }
  writeEmpty(r) {
    let n = new he('[]');
    this.hasError && n.setColor(r.context.colors.red).underline(), r.write(n);
  }
  writeWithItems(r) {
    let { colors: n } = r.context;
    r
      .writeLine('[')
      .withIndent(() => r.writeJoined(st, this.items).newLine())
      .write(']'),
      this.hasError &&
        r.afterNextNewline(() => {
          r.writeLine(n.red('~'.repeat(this.getPrintWidth())));
        });
  }
  asObject() {}
};
f();
c();
p();
m();
d();
var fo = ': ',
  Rr = class {
    constructor(t, r) {
      this.name = t;
      this.value = r;
      this.hasError = !1;
    }
    markAsError() {
      this.hasError = !0;
    }
    getPrintWidth() {
      return this.name.length + this.value.getPrintWidth() + fo.length;
    }
    write(t) {
      let r = new he(this.name);
      this.hasError && r.underline().setColor(t.context.colors.red), t.write(r).write(fo).write(this.value);
    }
  };
f();
c();
p();
m();
d();
var lt = class e extends De {
  constructor() {
    super(...arguments);
    this.fields = {};
    this.suggestions = [];
  }
  addField(r) {
    this.fields[r.name] = r;
  }
  addSuggestion(r) {
    this.suggestions.push(r);
  }
  getField(r) {
    return this.fields[r];
  }
  getDeepField(r) {
    let [n, ...i] = r,
      o = this.getField(n);
    if (!o) return;
    let s = o;
    for (let a of i) {
      let l;
      if (
        (s.value instanceof e ? (l = s.value.getField(a)) : s.value instanceof at && (l = s.value.getField(Number(a))),
        !l)
      )
        return;
      s = l;
    }
    return s;
  }
  getDeepFieldValue(r) {
    return r.length === 0 ? this : this.getDeepField(r)?.value;
  }
  hasField(r) {
    return !!this.getField(r);
  }
  removeAllFields() {
    this.fields = {};
  }
  removeField(r) {
    delete this.fields[r];
  }
  getFields() {
    return this.fields;
  }
  isEmpty() {
    return Object.keys(this.fields).length === 0;
  }
  getFieldValue(r) {
    return this.getField(r)?.value;
  }
  getDeepSubSelectionValue(r) {
    let n = this;
    for (let i of r) {
      if (!(n instanceof e)) return;
      let o = n.getSubSelectionValue(i);
      if (!o) return;
      n = o;
    }
    return n;
  }
  getDeepSelectionParent(r) {
    let n = this.getSelectionParent();
    if (!n) return;
    let i = n;
    for (let o of r) {
      let s = i.value.getFieldValue(o);
      if (!s || !(s instanceof e)) return;
      let a = s.getSelectionParent();
      if (!a) return;
      i = a;
    }
    return i;
  }
  getSelectionParent() {
    let r = this.getField('select')?.value.asObject();
    if (r) return { kind: 'select', value: r };
    let n = this.getField('include')?.value.asObject();
    if (n) return { kind: 'include', value: n };
  }
  getSubSelectionValue(r) {
    return this.getSelectionParent()?.value.fields[r].value;
  }
  getPrintWidth() {
    let r = Object.values(this.fields);
    return r.length == 0 ? 2 : Math.max(...r.map((i) => i.getPrintWidth())) + 2;
  }
  write(r) {
    let n = Object.values(this.fields);
    if (n.length === 0 && this.suggestions.length === 0) {
      this.writeEmpty(r);
      return;
    }
    this.writeWithContents(r, n);
  }
  asObject() {
    return this;
  }
  writeEmpty(r) {
    let n = new he('{}');
    this.hasError && n.setColor(r.context.colors.red).underline(), r.write(n);
  }
  writeWithContents(r, n) {
    r.writeLine('{').withIndent(() => {
      r.writeJoined(st, [...n, ...this.suggestions]).newLine();
    }),
      r.write('}'),
      this.hasError &&
        r.afterNextNewline(() => {
          r.writeLine(r.context.colors.red('~'.repeat(this.getPrintWidth())));
        });
  }
};
f();
c();
p();
m();
d();
var W = class extends De {
  constructor(r) {
    super();
    this.text = r;
  }
  getPrintWidth() {
    return this.text.length;
  }
  write(r) {
    let n = new he(this.text);
    this.hasError && n.underline().setColor(r.context.colors.red), r.write(n);
  }
  asObject() {}
};
var xn = class {
  constructor(t) {
    this.errorMessages = [];
    this.arguments = t;
  }
  write(t) {
    t.write(this.arguments);
  }
  addErrorMessage(t) {
    this.errorMessages.push(t);
  }
  renderAllMessages(t) {
    return this.errorMessages.map((r) => r(t)).join(`
`);
  }
};
function ut(e) {
  return new xn(go(e));
}
function go(e) {
  let t = new lt();
  for (let [r, n] of Object.entries(e)) {
    let i = new Rr(r, ho(n));
    t.addField(i);
  }
  return t;
}
function ho(e) {
  if (typeof e == 'string') return new W(JSON.stringify(e));
  if (typeof e == 'number' || typeof e == 'boolean') return new W(String(e));
  if (typeof e == 'bigint') return new W(`${e}n`);
  if (e === null) return new W('null');
  if (e === void 0) return new W('undefined');
  if (it(e)) return new W(`new Prisma.Decimal("${e.toFixed()}")`);
  if (e instanceof Uint8Array)
    return w.Buffer.isBuffer(e) ? new W(`Buffer.alloc(${e.byteLength})`) : new W(`new Uint8Array(${e.byteLength})`);
  if (e instanceof Date) {
    let t = hr(e) ? e.toISOString() : 'Invalid Date';
    return new W(`new Date("${t}")`);
  }
  return e instanceof be
    ? new W(`Prisma.${e._getName()}`)
    : ot(e)
    ? new W(`prisma.${Yi(e.modelName)}.$fields.${e.name}`)
    : Array.isArray(e)
    ? Ql(e)
    : typeof e == 'object'
    ? go(e)
    : new W(Object.prototype.toString.call(e));
}
function Ql(e) {
  let t = new at();
  for (let r of e) t.addItem(ho(r));
  return t;
}
function Sr(e, t) {
  let r = t === 'pretty' ? mo : Cr,
    n = e.renderAllMessages(r),
    i = new et(0, { colors: r }).write(e).toString();
  return { message: n, args: i };
}
function yo(e) {
  if (e === void 0) return '';
  let t = ut(e);
  return new et(0, { colors: Cr }).write(t).toString();
}
f();
c();
p();
m();
d();
var Hl = 'P2037';
function Ft({ error: e, user_facing_error: t }, r, n) {
  return t.error_code
    ? new K(Wl(t, n), { code: t.error_code, clientVersion: r, meta: t.meta, batchRequestIdx: t.batch_request_idx })
    : new se(e, { clientVersion: r, batchRequestIdx: t.batch_request_idx });
}
function Wl(e, t) {
  let r = e.message;
  return (
    (t === 'postgresql' || t === 'postgres' || t === 'mysql') &&
      e.error_code === Hl &&
      (r += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`),
    r
  );
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var Pn = class {
  getLocation() {
    return null;
  }
};
function Me(e) {
  return typeof $EnabledCallSite == 'function' && e !== 'minimal' ? new $EnabledCallSite() : new Pn();
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var wo = { _avg: !0, _count: !0, _sum: !0, _min: !0, _max: !0 };
function ct(e = {}) {
  let t = zl(e);
  return Object.entries(t).reduce((n, [i, o]) => (wo[i] !== void 0 ? (n.select[i] = { select: o }) : (n[i] = o), n), {
    select: {},
  });
}
function zl(e = {}) {
  return typeof e._count == 'boolean' ? { ...e, _count: { _all: e._count } } : e;
}
function Or(e = {}) {
  return (t) => (typeof e._count == 'boolean' && (t._count = t._count._all), t);
}
function Eo(e, t) {
  let r = Or(e);
  return t({ action: 'aggregate', unpacker: r, argsMapper: ct })(e);
}
f();
c();
p();
m();
d();
function Yl(e = {}) {
  let { select: t, ...r } = e;
  return typeof t == 'object' ? ct({ ...r, _count: t }) : ct({ ...r, _count: { _all: !0 } });
}
function Zl(e = {}) {
  return typeof e.select == 'object' ? (t) => Or(e)(t)._count : (t) => Or(e)(t)._count._all;
}
function bo(e, t) {
  return t({ action: 'count', unpacker: Zl(e), argsMapper: Yl })(e);
}
f();
c();
p();
m();
d();
function Xl(e = {}) {
  let t = ct(e);
  if (Array.isArray(t.by)) for (let r of t.by) typeof r == 'string' && (t.select[r] = !0);
  else typeof t.by == 'string' && (t.select[t.by] = !0);
  return t;
}
function eu(e = {}) {
  return (t) => (
    typeof e?._count == 'boolean' &&
      t.forEach((r) => {
        r._count = r._count._all;
      }),
    t
  );
}
function xo(e, t) {
  return t({ action: 'groupBy', unpacker: eu(e), argsMapper: Xl })(e);
}
function Po(e, t, r) {
  if (t === 'aggregate') return (n) => Eo(n, r);
  if (t === 'count') return (n) => bo(n, r);
  if (t === 'groupBy') return (n) => xo(n, r);
}
f();
c();
p();
m();
d();
function vo(e, t) {
  let r = t.fields.filter((i) => !i.relationName),
    n = an(r, (i) => i.name);
  return new Proxy(
    {},
    {
      get(i, o) {
        if (o in i || typeof o == 'symbol') return i[o];
        let s = n[o];
        if (s) return new Nt(e, o, s.type, s.isList, s.kind === 'enum');
      },
      ...fr(Object.keys(n)),
    },
  );
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var To = (e) => (Array.isArray(e) ? e : e.split('.')),
  vn = (e, t) => To(t).reduce((r, n) => r && r[n], e),
  Ao = (e, t, r) => To(t).reduceRight((n, i, o, s) => Object.assign({}, vn(e, s.slice(0, o)), { [i]: n }), r);
function tu(e, t) {
  return e === void 0 || t === void 0 ? [] : [...t, 'select', e];
}
function ru(e, t, r) {
  return t === void 0 ? e ?? {} : Ao(t, r, e || !0);
}
function Tn(e, t, r, n, i, o) {
  let a = e._runtimeDataModel.models[t].fields.reduce((l, u) => ({ ...l, [u.name]: u }), {});
  return (l) => {
    let u = Me(e._errorFormat),
      g = tu(n, i),
      h = ru(l, o, g),
      v = r({ dataPath: g, callsite: u })(h),
      S = nu(e, t);
    return new Proxy(v, {
      get(C, R) {
        if (!S.includes(R)) return C[R];
        let F = [a[R].type, r, R],
          B = [g, h];
        return Tn(e, ...F, ...B);
      },
      ...fr([...S, ...Object.getOwnPropertyNames(v)]),
    });
  };
}
function nu(e, t) {
  return e._runtimeDataModel.models[t].fields.filter((r) => r.kind === 'object').map((r) => r.name);
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var iu = _e(Li());
var ou = { red: Ye, gray: Ri, dim: lr, bold: ar, underline: Pi, highlightSource: (e) => e.highlight() },
  su = { red: (e) => e, gray: (e) => e, dim: (e) => e, bold: (e) => e, underline: (e) => e, highlightSource: (e) => e };
function au({ message: e, originalMethod: t, isPanic: r, callArguments: n }) {
  return { functionName: `prisma.${t}()`, message: e, isPanic: r ?? !1, callArguments: n };
}
function lu({ functionName: e, location: t, message: r, isPanic: n, contextLines: i, callArguments: o }, s) {
  let a = [''],
    l = t ? ' in' : ':';
  if (
    (n
      ? (a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold('on us')}, you did nothing wrong.`)),
        a.push(s.red(`It occurred in the ${s.bold(`\`${e}\``)} invocation${l}`)))
      : a.push(s.red(`Invalid ${s.bold(`\`${e}\``)} invocation${l}`)),
    t && a.push(s.underline(uu(t))),
    i)
  ) {
    a.push('');
    let u = [i.toString()];
    o && (u.push(o), u.push(s.dim(')'))), a.push(u.join('')), o && a.push('');
  } else a.push(''), o && a.push(o), a.push('');
  return (
    a.push(r),
    a.join(`
`)
  );
}
function uu(e) {
  let t = [e.fileName];
  return e.lineNumber && t.push(String(e.lineNumber)), e.columnNumber && t.push(String(e.columnNumber)), t.join(':');
}
function pt(e) {
  let t = e.showColors ? ou : su,
    r;
  return typeof $getTemplateParameters < 'u' ? (r = $getTemplateParameters(e, t)) : (r = au(e)), lu(r, t);
}
function Co(e, t, r, n) {
  return e === Be.ModelAction.findFirstOrThrow || e === Be.ModelAction.findUniqueOrThrow ? cu(t, r, n) : n;
}
function cu(e, t, r) {
  return async (n) => {
    if ('rejectOnNotFound' in n.args) {
      let o = pt({
        originalMethod: n.clientMethod,
        callsite: n.callsite,
        message: "'rejectOnNotFound' option is not supported",
      });
      throw new Z(o, { clientVersion: t });
    }
    return await r(n).catch((o) => {
      throw o instanceof K && o.code === 'P2025' ? new Ce(`No ${e} found`, t) : o;
    });
  };
}
f();
c();
p();
m();
d();
function ye(e) {
  return e.replace(/^./, (t) => t.toLowerCase());
}
var pu = ['findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow', 'create', 'update', 'upsert', 'delete'],
  mu = ['aggregate', 'count', 'groupBy'];
function An(e, t) {
  let r = e._extensions.getAllModelExtensions(t) ?? {},
    n = [du(e, t), gu(e, t), Dt(r), te('name', () => t), te('$name', () => t), te('$parent', () => e._appliedParent)];
  return fe({}, n);
}
function du(e, t) {
  let r = ye(t),
    n = Object.keys(Be.ModelAction).concat('count');
  return {
    getKeys() {
      return n;
    },
    getPropertyValue(i) {
      let o = i,
        s = (l) => e._request(l);
      s = Co(o, t, e._clientVersion, s);
      let a = (l) => (u) => {
        let g = Me(e._errorFormat);
        return e._createPrismaPromise((h) => {
          let v = {
            args: u,
            dataPath: [],
            action: o,
            model: t,
            clientMethod: `${r}.${i}`,
            jsModelName: r,
            transaction: h,
            callsite: g,
          };
          return s({ ...v, ...l });
        });
      };
      return pu.includes(o) ? Tn(e, t, a) : fu(i) ? Po(e, i, a) : a({});
    },
  };
}
function fu(e) {
  return mu.includes(e);
}
function gu(e, t) {
  return $e(
    te('fields', () => {
      let r = e._runtimeDataModel.models[t];
      return vo(t, r);
    }),
  );
}
f();
c();
p();
m();
d();
function Ro(e) {
  return e.replace(/^./, (t) => t.toUpperCase());
}
var Cn = Symbol();
function _t(e) {
  let t = [hu(e), te(Cn, () => e), te('$parent', () => e._appliedParent)],
    r = e._extensions.getAllClientExtensions();
  return r && t.push(Dt(r)), fe(e, t);
}
function hu(e) {
  let t = Object.keys(e._runtimeDataModel.models),
    r = t.map(ye),
    n = [...new Set(t.concat(r))];
  return $e({
    getKeys() {
      return n;
    },
    getPropertyValue(i) {
      let o = Ro(i);
      if (e._runtimeDataModel.models[o] !== void 0) return An(e, o);
      if (e._runtimeDataModel.models[i] !== void 0) return An(e, i);
    },
    getPropertyDescriptor(i) {
      if (!r.includes(i)) return { enumerable: !1 };
    },
  });
}
function So(e) {
  return e[Cn] ? e[Cn] : e;
}
function Oo(e) {
  if (typeof e == 'function') return e(this);
  if (e.client?.__AccelerateEngine) {
    let r = e.client.__AccelerateEngine;
    this._originalClient._engine = new r(this._originalClient._accelerateEngineConfig);
  }
  let t = Object.create(this._originalClient, {
    _extensions: { value: this._extensions.append(e) },
    _appliedParent: { value: this, configurable: !0 },
    $use: { value: void 0 },
    $on: { value: void 0 },
  });
  return _t(t);
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function Io({ result: e, modelName: t, select: r, omit: n, extensions: i }) {
  let o = i.getAllComputedFields(t);
  if (!o) return e;
  let s = [],
    a = [];
  for (let l of Object.values(o)) {
    if (n) {
      if (n[l.name]) continue;
      let u = l.needs.filter((g) => n[g]);
      u.length > 0 && a.push(Xe(u));
    } else if (r) {
      if (!r[l.name]) continue;
      let u = l.needs.filter((g) => !r[g]);
      u.length > 0 && a.push(Xe(u));
    }
    yu(e, l.needs) && s.push(wu(l, fe(e, s)));
  }
  return s.length > 0 || a.length > 0 ? fe(e, [...s, ...a]) : e;
}
function yu(e, t) {
  return t.every((r) => sn(e, r));
}
function wu(e, t) {
  return $e(te(e.name, () => e.compute(t)));
}
f();
c();
p();
m();
d();
function Ir({ visitor: e, result: t, args: r, runtimeDataModel: n, modelName: i }) {
  if (Array.isArray(t)) {
    for (let s = 0; s < t.length; s++)
      t[s] = Ir({ result: t[s], args: r, modelName: i, runtimeDataModel: n, visitor: e });
    return t;
  }
  let o = e(t, i, r) ?? t;
  return (
    r.include && ko({ includeOrSelect: r.include, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }),
    r.select && ko({ includeOrSelect: r.select, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }),
    o
  );
}
function ko({ includeOrSelect: e, result: t, parentModelName: r, runtimeDataModel: n, visitor: i }) {
  for (let [o, s] of Object.entries(e)) {
    if (!s || t[o] == null) continue;
    let l = n.models[r].fields.find((g) => g.name === o);
    if (!l || l.kind !== 'object' || !l.relationName) continue;
    let u = typeof s == 'object' ? s : {};
    t[o] = Ir({ visitor: i, result: t[o], args: u, modelName: l.type, runtimeDataModel: n });
  }
}
function Do({ result: e, modelName: t, args: r, extensions: n, runtimeDataModel: i, globalOmit: o }) {
  return n.isEmpty() || e == null || typeof e != 'object' || !i.models[t]
    ? e
    : Ir({
        result: e,
        args: r ?? {},
        modelName: t,
        runtimeDataModel: i,
        visitor: (a, l, u) => {
          let g = ye(l);
          return Io({
            result: a,
            modelName: g,
            select: u.select,
            omit: u.select ? void 0 : { ...o?.[g], ...u.omit },
            extensions: n,
          });
        },
      });
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function Mo(e) {
  if (e instanceof ae) return Eu(e);
  if (Array.isArray(e)) {
    let r = [e[0]];
    for (let n = 1; n < e.length; n++) r[n] = Lt(e[n]);
    return r;
  }
  let t = {};
  for (let r in e) t[r] = Lt(e[r]);
  return t;
}
function Eu(e) {
  return new ae(e.strings, e.values);
}
function Lt(e) {
  if (typeof e != 'object' || e == null || e instanceof be || ot(e)) return e;
  if (it(e)) return new Pe(e.toFixed());
  if (tt(e)) return new Date(+e);
  if (ArrayBuffer.isView(e)) return e.slice(0);
  if (Array.isArray(e)) {
    let t = e.length,
      r;
    for (r = Array(t); t--; ) r[t] = Lt(e[t]);
    return r;
  }
  if (typeof e == 'object') {
    let t = {};
    for (let r in e)
      r === '__proto__'
        ? Object.defineProperty(t, r, { value: Lt(e[r]), configurable: !0, enumerable: !0, writable: !0 })
        : (t[r] = Lt(e[r]));
    return t;
  }
  Ee(e, 'Unknown value');
}
function Fo(e, t, r, n = 0) {
  return e._createPrismaPromise((i) => {
    let o = t.customDataProxyFetch;
    return (
      'transaction' in t &&
        i !== void 0 &&
        (t.transaction?.kind === 'batch' && t.transaction.lock.then(), (t.transaction = i)),
      n === r.length
        ? e._executeRequest(t)
        : r[n]({
            model: t.model,
            operation: t.model ? t.action : t.clientMethod,
            args: Mo(t.args ?? {}),
            __internalParams: t,
            query: (s, a = t) => {
              let l = a.customDataProxyFetch;
              return (a.customDataProxyFetch = Uo(o, l)), (a.args = s), Fo(e, a, r, n + 1);
            },
          })
    );
  });
}
function _o(e, t) {
  let { jsModelName: r, action: n, clientMethod: i } = t,
    o = r ? n : i;
  if (e._extensions.isEmpty()) return e._executeRequest(t);
  let s = e._extensions.getAllQueryCallbacks(r ?? '$none', o);
  return Fo(e, t, s);
}
function Lo(e) {
  return (t) => {
    let r = { requests: t },
      n = t[0].extensions.getAllBatchQueryCallbacks();
    return n.length ? Bo(r, n, 0, e) : e(r);
  };
}
function Bo(e, t, r, n) {
  if (r === t.length) return n(e);
  let i = e.customDataProxyFetch,
    o = e.requests[0].transaction;
  return t[r]({
    args: {
      queries: e.requests.map((s) => ({ model: s.modelName, operation: s.action, args: s.args })),
      transaction: o ? { isolationLevel: o.kind === 'batch' ? o.isolationLevel : void 0 } : void 0,
    },
    __internalParams: e,
    query(s, a = e) {
      let l = a.customDataProxyFetch;
      return (a.customDataProxyFetch = Uo(i, l)), Bo(a, t, r + 1, n);
    },
  });
}
var No = (e) => e;
function Uo(e = No, t = No) {
  return (r) => e(t(r));
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function qo(e, t, r) {
  let n = ye(r);
  return !t.result || !(t.result.$allModels || t.result[n])
    ? e
    : bu({ ...e, ...$o(t.name, e, t.result.$allModels), ...$o(t.name, e, t.result[n]) });
}
function bu(e) {
  let t = new de(),
    r = (n, i) =>
      t.getOrCreate(n, () => (i.has(n) ? [n] : (i.add(n), e[n] ? e[n].needs.flatMap((o) => r(o, i)) : [n])));
  return Ze(e, (n) => ({ ...n, needs: r(n.name, new Set()) }));
}
function $o(e, t, r) {
  return r
    ? Ze(r, ({ needs: n, compute: i }, o) => ({
        name: o,
        needs: n ? Object.keys(n).filter((s) => n[s]) : [],
        compute: xu(t, o, i),
      }))
    : {};
}
function xu(e, t, r) {
  let n = e?.[t]?.compute;
  return n ? (i) => r({ ...i, [t]: n(i) }) : r;
}
function Vo(e, t) {
  if (!t) return e;
  let r = { ...e };
  for (let n of Object.values(t)) if (e[n.name]) for (let i of n.needs) r[i] = !0;
  return r;
}
function jo(e, t) {
  if (!t) return e;
  let r = { ...e };
  for (let n of Object.values(t)) if (!e[n.name]) for (let i of n.needs) delete r[i];
  return r;
}
var kr = class {
    constructor(t, r) {
      this.extension = t;
      this.previous = r;
      this.computedFieldsCache = new de();
      this.modelExtensionsCache = new de();
      this.queryCallbacksCache = new de();
      this.clientExtensions = Ct(() =>
        this.extension.client
          ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client }
          : this.previous?.getAllClientExtensions(),
      );
      this.batchCallbacks = Ct(() => {
        let t = this.previous?.getAllBatchQueryCallbacks() ?? [],
          r = this.extension.query?.$__internalBatch;
        return r ? t.concat(r) : t;
      });
    }
    getAllComputedFields(t) {
      return this.computedFieldsCache.getOrCreate(t, () =>
        qo(this.previous?.getAllComputedFields(t), this.extension, t),
      );
    }
    getAllClientExtensions() {
      return this.clientExtensions.get();
    }
    getAllModelExtensions(t) {
      return this.modelExtensionsCache.getOrCreate(t, () => {
        let r = ye(t);
        return !this.extension.model || !(this.extension.model[r] || this.extension.model.$allModels)
          ? this.previous?.getAllModelExtensions(t)
          : {
              ...this.previous?.getAllModelExtensions(t),
              ...this.extension.model.$allModels,
              ...this.extension.model[r],
            };
      });
    }
    getAllQueryCallbacks(t, r) {
      return this.queryCallbacksCache.getOrCreate(`${t}:${r}`, () => {
        let n = this.previous?.getAllQueryCallbacks(t, r) ?? [],
          i = [],
          o = this.extension.query;
        return !o || !(o[t] || o.$allModels || o[r] || o.$allOperations)
          ? n
          : (o[t] !== void 0 &&
              (o[t][r] !== void 0 && i.push(o[t][r]), o[t].$allOperations !== void 0 && i.push(o[t].$allOperations)),
            t !== '$none' &&
              o.$allModels !== void 0 &&
              (o.$allModels[r] !== void 0 && i.push(o.$allModels[r]),
              o.$allModels.$allOperations !== void 0 && i.push(o.$allModels.$allOperations)),
            o[r] !== void 0 && i.push(o[r]),
            o.$allOperations !== void 0 && i.push(o.$allOperations),
            n.concat(i));
      });
    }
    getAllBatchQueryCallbacks() {
      return this.batchCallbacks.get();
    }
  },
  Dr = class e {
    constructor(t) {
      this.head = t;
    }
    static empty() {
      return new e();
    }
    static single(t) {
      return new e(new kr(t));
    }
    isEmpty() {
      return this.head === void 0;
    }
    append(t) {
      return new e(new kr(t, this.head));
    }
    getAllComputedFields(t) {
      return this.head?.getAllComputedFields(t);
    }
    getAllClientExtensions() {
      return this.head?.getAllClientExtensions();
    }
    getAllModelExtensions(t) {
      return this.head?.getAllModelExtensions(t);
    }
    getAllQueryCallbacks(t, r) {
      return this.head?.getAllQueryCallbacks(t, r) ?? [];
    }
    getAllBatchQueryCallbacks() {
      return this.head?.getAllBatchQueryCallbacks() ?? [];
    }
  };
f();
c();
p();
m();
d();
var Go = ee('prisma:client'),
  Jo = { Vercel: 'vercel', 'Netlify CI': 'netlify' };
function Qo({ postinstall: e, ciName: t, clientVersion: r }) {
  if ((Go('checkPlatformCaching:postinstall', e), Go('checkPlatformCaching:ciName', t), e === !0 && t && t in Jo)) {
    let n = `Prisma has detected that this project was built on ${t}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${Jo[t]}-build`;
    throw (console.error(n), new J(n, r));
  }
}
f();
c();
p();
m();
d();
function Ho(e, t) {
  return e ? (e.datasources ? e.datasources : e.datasourceUrl ? { [t[0]]: { url: e.datasourceUrl } } : {}) : {};
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var Pu = 'Cloudflare-Workers',
  vu = 'node';
function Wo() {
  return typeof Netlify == 'object'
    ? 'netlify'
    : typeof EdgeRuntime == 'string'
    ? 'edge-light'
    : globalThis.navigator?.userAgent === Pu
    ? 'workerd'
    : globalThis.Deno
    ? 'deno'
    : globalThis.__lagon__
    ? 'lagon'
    : globalThis.process?.release?.name === vu
    ? 'node'
    : globalThis.Bun
    ? 'bun'
    : globalThis.fastly
    ? 'fastly'
    : 'unknown';
}
var Tu = {
  node: 'Node.js',
  workerd: 'Cloudflare Workers',
  deno: 'Deno and Deno Deploy',
  netlify: 'Netlify Edge Functions',
  'edge-light':
    'Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)',
};
function Rn() {
  let e = Wo();
  return { id: e, prettyName: Tu[e] || e, isEdge: ['workerd', 'deno', 'netlify', 'edge-light'].includes(e) };
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function mt({ inlineDatasources: e, overrideDatasources: t, env: r, clientVersion: n }) {
  let i,
    o = Object.keys(e)[0],
    s = e[o]?.url,
    a = t[o]?.url;
  if (
    (o === void 0 ? (i = void 0) : a ? (i = a) : s?.value ? (i = s.value) : s?.fromEnvVar && (i = r[s.fromEnvVar]),
    s?.fromEnvVar !== void 0 && i === void 0)
  )
    throw Rn().id === 'workerd'
      ? new J(
          `error: Environment variable not found: ${s.fromEnvVar}.

In Cloudflare module Workers, environment variables are available only in the Worker's \`env\` parameter of \`fetch\`.
To solve this, provide the connection string directly: https://pris.ly/d/cloudflare-datasource-url`,
          n,
        )
      : new J(`error: Environment variable not found: ${s.fromEnvVar}.`, n);
  if (i === void 0) throw new J('error: Missing URL environment variable, value, or override.', n);
  return i;
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var Mr = class extends Error {
  constructor(t, r) {
    super(t), (this.clientVersion = r.clientVersion), (this.cause = r.cause);
  }
  get [Symbol.toStringTag]() {
    return this.name;
  }
};
var ie = class extends Mr {
  constructor(t, r) {
    super(t, r), (this.isRetryable = r.isRetryable ?? !0);
  }
};
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function L(e, t) {
  return { ...e, isRetryable: t };
}
var dt = class extends ie {
  constructor(r) {
    super('This request must be retried', L(r, !0));
    this.name = 'ForcedRetryError';
    this.code = 'P5001';
  }
};
N(dt, 'ForcedRetryError');
f();
c();
p();
m();
d();
var Ve = class extends ie {
  constructor(r, n) {
    super(r, L(n, !1));
    this.name = 'InvalidDatasourceError';
    this.code = 'P6001';
  }
};
N(Ve, 'InvalidDatasourceError');
f();
c();
p();
m();
d();
var je = class extends ie {
  constructor(r, n) {
    super(r, L(n, !1));
    this.name = 'NotImplementedYetError';
    this.code = 'P5004';
  }
};
N(je, 'NotImplementedYetError');
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var j = class extends ie {
  constructor(t, r) {
    super(t, r), (this.response = r.response);
    let n = this.response.headers.get('prisma-request-id');
    if (n) {
      let i = `(The request id was: ${n})`;
      this.message = this.message + ' ' + i;
    }
  }
};
var Ge = class extends j {
  constructor(r) {
    super('Schema needs to be uploaded', L(r, !0));
    this.name = 'SchemaMissingError';
    this.code = 'P5005';
  }
};
N(Ge, 'SchemaMissingError');
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var Sn = 'This request could not be understood by the server',
  Bt = class extends j {
    constructor(r, n, i) {
      super(n || Sn, L(r, !1));
      this.name = 'BadRequestError';
      this.code = 'P5000';
      i && (this.code = i);
    }
  };
N(Bt, 'BadRequestError');
f();
c();
p();
m();
d();
var Ut = class extends j {
  constructor(r, n) {
    super('Engine not started: healthcheck timeout', L(r, !0));
    this.name = 'HealthcheckTimeoutError';
    this.code = 'P5013';
    this.logs = n;
  }
};
N(Ut, 'HealthcheckTimeoutError');
f();
c();
p();
m();
d();
var $t = class extends j {
  constructor(r, n, i) {
    super(n, L(r, !0));
    this.name = 'EngineStartupError';
    this.code = 'P5014';
    this.logs = i;
  }
};
N($t, 'EngineStartupError');
f();
c();
p();
m();
d();
var qt = class extends j {
  constructor(r) {
    super('Engine version is not supported', L(r, !1));
    this.name = 'EngineVersionNotSupportedError';
    this.code = 'P5012';
  }
};
N(qt, 'EngineVersionNotSupportedError');
f();
c();
p();
m();
d();
var On = 'Request timed out',
  Vt = class extends j {
    constructor(r, n = On) {
      super(n, L(r, !1));
      this.name = 'GatewayTimeoutError';
      this.code = 'P5009';
    }
  };
N(Vt, 'GatewayTimeoutError');
f();
c();
p();
m();
d();
var Au = 'Interactive transaction error',
  jt = class extends j {
    constructor(r, n = Au) {
      super(n, L(r, !1));
      this.name = 'InteractiveTransactionError';
      this.code = 'P5015';
    }
  };
N(jt, 'InteractiveTransactionError');
f();
c();
p();
m();
d();
var Cu = 'Request parameters are invalid',
  Gt = class extends j {
    constructor(r, n = Cu) {
      super(n, L(r, !1));
      this.name = 'InvalidRequestError';
      this.code = 'P5011';
    }
  };
N(Gt, 'InvalidRequestError');
f();
c();
p();
m();
d();
var In = 'Requested resource does not exist',
  Jt = class extends j {
    constructor(r, n = In) {
      super(n, L(r, !1));
      this.name = 'NotFoundError';
      this.code = 'P5003';
    }
  };
N(Jt, 'NotFoundError');
f();
c();
p();
m();
d();
var kn = 'Unknown server error',
  ft = class extends j {
    constructor(r, n, i) {
      super(n || kn, L(r, !0));
      this.name = 'ServerError';
      this.code = 'P5006';
      this.logs = i;
    }
  };
N(ft, 'ServerError');
f();
c();
p();
m();
d();
var Dn = 'Unauthorized, check your connection string',
  Qt = class extends j {
    constructor(r, n = Dn) {
      super(n, L(r, !1));
      this.name = 'UnauthorizedError';
      this.code = 'P5007';
    }
  };
N(Qt, 'UnauthorizedError');
f();
c();
p();
m();
d();
var Mn = 'Usage exceeded, retry again later',
  Ht = class extends j {
    constructor(r, n = Mn) {
      super(n, L(r, !0));
      this.name = 'UsageExceededError';
      this.code = 'P5008';
    }
  };
N(Ht, 'UsageExceededError');
async function Ru(e) {
  let t;
  try {
    t = await e.text();
  } catch {
    return { type: 'EmptyError' };
  }
  try {
    let r = JSON.parse(t);
    if (typeof r == 'string')
      switch (r) {
        case 'InternalDataProxyError':
          return { type: 'DataProxyError', body: r };
        default:
          return { type: 'UnknownTextError', body: r };
      }
    if (typeof r == 'object' && r !== null) {
      if ('is_panic' in r && 'message' in r && 'error_code' in r) return { type: 'QueryEngineError', body: r };
      if ('EngineNotStarted' in r || 'InteractiveTransactionMisrouted' in r || 'InvalidRequestError' in r) {
        let n = Object.values(r)[0].reason;
        return typeof n == 'string' && !['SchemaMissing', 'EngineVersionNotSupported'].includes(n)
          ? { type: 'UnknownJsonError', body: r }
          : { type: 'DataProxyError', body: r };
      }
    }
    return { type: 'UnknownJsonError', body: r };
  } catch {
    return t === '' ? { type: 'EmptyError' } : { type: 'UnknownTextError', body: t };
  }
}
async function Wt(e, t) {
  if (e.ok) return;
  let r = { clientVersion: t, response: e },
    n = await Ru(e);
  if (n.type === 'QueryEngineError') throw new K(n.body.message, { code: n.body.error_code, clientVersion: t });
  if (n.type === 'DataProxyError') {
    if (n.body === 'InternalDataProxyError') throw new ft(r, 'Internal Data Proxy error');
    if ('EngineNotStarted' in n.body) {
      if (n.body.EngineNotStarted.reason === 'SchemaMissing') return new Ge(r);
      if (n.body.EngineNotStarted.reason === 'EngineVersionNotSupported') throw new qt(r);
      if ('EngineStartupError' in n.body.EngineNotStarted.reason) {
        let { msg: i, logs: o } = n.body.EngineNotStarted.reason.EngineStartupError;
        throw new $t(r, i, o);
      }
      if ('KnownEngineStartupError' in n.body.EngineNotStarted.reason) {
        let { msg: i, error_code: o } = n.body.EngineNotStarted.reason.KnownEngineStartupError;
        throw new J(i, t, o);
      }
      if ('HealthcheckTimeout' in n.body.EngineNotStarted.reason) {
        let { logs: i } = n.body.EngineNotStarted.reason.HealthcheckTimeout;
        throw new Ut(r, i);
      }
    }
    if ('InteractiveTransactionMisrouted' in n.body) {
      let i = {
        IDParseError: 'Could not parse interactive transaction ID',
        NoQueryEngineFoundError: 'Could not find Query Engine for the specified host and transaction ID',
        TransactionStartError: 'Could not start interactive transaction',
      };
      throw new jt(r, i[n.body.InteractiveTransactionMisrouted.reason]);
    }
    if ('InvalidRequestError' in n.body) throw new Gt(r, n.body.InvalidRequestError.reason);
  }
  if (e.status === 401 || e.status === 403) throw new Qt(r, gt(Dn, n));
  if (e.status === 404) return new Jt(r, gt(In, n));
  if (e.status === 429) throw new Ht(r, gt(Mn, n));
  if (e.status === 504) throw new Vt(r, gt(On, n));
  if (e.status >= 500) throw new ft(r, gt(kn, n));
  if (e.status >= 400) throw new Bt(r, gt(Sn, n));
}
function gt(e, t) {
  return t.type === 'EmptyError' ? e : `${e}: ${JSON.stringify(t)}`;
}
f();
c();
p();
m();
d();
function Ko(e) {
  let t = Math.pow(2, e) * 50,
    r = Math.ceil(Math.random() * t) - Math.ceil(t / 2),
    n = t + r;
  return new Promise((i) => setTimeout(() => i(n), n));
}
f();
c();
p();
m();
d();
var ve = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function zo(e) {
  let t = new TextEncoder().encode(e),
    r = '',
    n = t.byteLength,
    i = n % 3,
    o = n - i,
    s,
    a,
    l,
    u,
    g;
  for (let h = 0; h < o; h = h + 3)
    (g = (t[h] << 16) | (t[h + 1] << 8) | t[h + 2]),
      (s = (g & 16515072) >> 18),
      (a = (g & 258048) >> 12),
      (l = (g & 4032) >> 6),
      (u = g & 63),
      (r += ve[s] + ve[a] + ve[l] + ve[u]);
  return (
    i == 1
      ? ((g = t[o]), (s = (g & 252) >> 2), (a = (g & 3) << 4), (r += ve[s] + ve[a] + '=='))
      : i == 2 &&
        ((g = (t[o] << 8) | t[o + 1]),
        (s = (g & 64512) >> 10),
        (a = (g & 1008) >> 4),
        (l = (g & 15) << 2),
        (r += ve[s] + ve[a] + ve[l] + '=')),
    r
  );
}
f();
c();
p();
m();
d();
function Yo(e) {
  if (!!e.generator?.previewFeatures.some((r) => r.toLowerCase().includes('metrics')))
    throw new J(
      'The `metrics` preview feature is not yet available with Accelerate.\nPlease remove `metrics` from the `previewFeatures` in your schema.\n\nMore information about Accelerate: https://pris.ly/d/accelerate',
      e.clientVersion,
    );
}
f();
c();
p();
m();
d();
function Su(e) {
  return e[0] * 1e3 + e[1] / 1e6;
}
function Zo(e) {
  return new Date(Su(e));
}
f();
c();
p();
m();
d();
var Xo = {
  '@prisma/debug': 'workspace:*',
  '@prisma/engines-version': '5.18.0-25.4c784e32044a8a016d99474bd02a3b6123742169',
  '@prisma/fetch-engine': 'workspace:*',
  '@prisma/get-platform': 'workspace:*',
};
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var Kt = class extends ie {
  constructor(r, n) {
    super(
      `Cannot fetch data from service:
${r}`,
      L(n, !0),
    );
    this.name = 'RequestError';
    this.code = 'P5010';
  }
};
N(Kt, 'RequestError');
async function Je(e, t, r = (n) => n) {
  let n = t.clientVersion;
  try {
    return typeof fetch == 'function' ? await r(fetch)(e, t) : await r(Nn)(e, t);
  } catch (i) {
    let o = i.message ?? 'Unknown error';
    throw new Kt(o, { clientVersion: n });
  }
}
function Iu(e) {
  return { ...e.headers, 'Content-Type': 'application/json' };
}
function ku(e) {
  return { method: e.method, headers: Iu(e) };
}
function Du(e, t) {
  return {
    text: () => Promise.resolve(w.Buffer.concat(e).toString()),
    json: () => Promise.resolve().then(() => JSON.parse(w.Buffer.concat(e).toString())),
    ok: t.statusCode >= 200 && t.statusCode <= 299,
    status: t.statusCode,
    url: t.url,
    headers: new Fn(t.headers),
  };
}
async function Nn(e, t = {}) {
  let r = Mu('https'),
    n = ku(t),
    i = [],
    { origin: o } = new URL(e);
  return new Promise((s, a) => {
    let l = r.request(e, n, (u) => {
      let {
        statusCode: g,
        headers: { location: h },
      } = u;
      g >= 301 && g <= 399 && h && (h.startsWith('http') === !1 ? s(Nn(`${o}${h}`, t)) : s(Nn(h, t))),
        u.on('data', (v) => i.push(v)),
        u.on('end', () => s(Du(i, u))),
        u.on('error', a);
    });
    l.on('error', a), l.end(t.body ?? '');
  });
}
var Mu = typeof Hr < 'u' ? Hr : () => {},
  Fn = class {
    constructor(t = {}) {
      this.headers = new Map();
      for (let [r, n] of Object.entries(t))
        if (typeof n == 'string') this.headers.set(r, n);
        else if (Array.isArray(n)) for (let i of n) this.headers.set(r, i);
    }
    append(t, r) {
      this.headers.set(t, r);
    }
    delete(t) {
      this.headers.delete(t);
    }
    get(t) {
      return this.headers.get(t) ?? null;
    }
    has(t) {
      return this.headers.has(t);
    }
    set(t, r) {
      this.headers.set(t, r);
    }
    forEach(t, r) {
      for (let [n, i] of this.headers) t.call(r, i, n, this);
    }
  };
var Nu = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/,
  es = ee('prisma:client:dataproxyEngine');
async function Fu(e, t) {
  let r = Xo['@prisma/engines-version'],
    n = t.clientVersion ?? 'unknown';
  if (y.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION) return y.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;
  if (e.includes('accelerate') && n !== '0.0.0' && n !== 'in-memory') return n;
  let [i, o] = n?.split('-') ?? [];
  if (o === void 0 && Nu.test(i)) return i;
  if (o !== void 0 || n === '0.0.0' || n === 'in-memory') {
    if (e.startsWith('localhost') || e.startsWith('127.0.0.1')) return '0.0.0';
    let [s] = r.split('-') ?? [],
      [a, l, u] = s.split('.'),
      g = _u(`<=${a}.${l}.${u}`),
      h = await Je(g, { clientVersion: n });
    if (!h.ok)
      throw new Error(
        `Failed to fetch stable Prisma version, unpkg.com status ${h.status} ${h.statusText}, response body: ${
          (await h.text()) || '<empty body>'
        }`,
      );
    let v = await h.text();
    es('length of body fetched from unpkg.com', v.length);
    let S;
    try {
      S = JSON.parse(v);
    } catch (C) {
      throw (console.error('JSON.parse error: body fetched from unpkg.com: ', v), C);
    }
    return S.version;
  }
  throw new je('Only `major.minor.patch` versions are supported by Accelerate.', { clientVersion: n });
}
async function ts(e, t) {
  let r = await Fu(e, t);
  return es('version', r), r;
}
function _u(e) {
  return encodeURI(`https://unpkg.com/prisma@${e}/package.json`);
}
var rs = 3,
  _n = ee('prisma:client:dataproxyEngine'),
  Ln = class {
    constructor({ apiKey: t, tracingHelper: r, logLevel: n, logQueries: i, engineHash: o }) {
      (this.apiKey = t), (this.tracingHelper = r), (this.logLevel = n), (this.logQueries = i), (this.engineHash = o);
    }
    build({ traceparent: t, interactiveTransaction: r } = {}) {
      let n = { Authorization: `Bearer ${this.apiKey}`, 'Prisma-Engine-Hash': this.engineHash };
      this.tracingHelper.isEnabled() && (n.traceparent = t ?? this.tracingHelper.getTraceParent()),
        r && (n['X-transaction-id'] = r.id);
      let i = this.buildCaptureSettings();
      return i.length > 0 && (n['X-capture-telemetry'] = i.join(', ')), n;
    }
    buildCaptureSettings() {
      let t = [];
      return (
        this.tracingHelper.isEnabled() && t.push('tracing'),
        this.logLevel && t.push(this.logLevel),
        this.logQueries && t.push('query'),
        t
      );
    }
  },
  zt = class {
    constructor(t) {
      this.name = 'DataProxyEngine';
      Yo(t),
        (this.config = t),
        (this.env = { ...t.env, ...(typeof y < 'u' ? y.env : {}) }),
        (this.inlineSchema = zo(t.inlineSchema)),
        (this.inlineDatasources = t.inlineDatasources),
        (this.inlineSchemaHash = t.inlineSchemaHash),
        (this.clientVersion = t.clientVersion),
        (this.engineHash = t.engineVersion),
        (this.logEmitter = t.logEmitter),
        (this.tracingHelper = t.tracingHelper);
    }
    apiKey() {
      return this.headerBuilder.apiKey;
    }
    version() {
      return this.engineHash;
    }
    async start() {
      this.startPromise !== void 0 && (await this.startPromise),
        (this.startPromise = (async () => {
          let [t, r] = this.extractHostAndApiKey();
          (this.host = t),
            (this.headerBuilder = new Ln({
              apiKey: r,
              tracingHelper: this.tracingHelper,
              logLevel: this.config.logLevel,
              logQueries: this.config.logQueries,
              engineHash: this.engineHash,
            })),
            (this.remoteClientVersion = await ts(t, this.config)),
            _n('host', this.host);
        })()),
        await this.startPromise;
    }
    async stop() {}
    propagateResponseExtensions(t) {
      t?.logs?.length &&
        t.logs.forEach((r) => {
          switch (r.level) {
            case 'debug':
            case 'error':
            case 'trace':
            case 'warn':
            case 'info':
              break;
            case 'query': {
              let n = typeof r.attributes.query == 'string' ? r.attributes.query : '';
              if (!this.tracingHelper.isEnabled()) {
                let [i] = n.split('/* traceparent');
                n = i;
              }
              this.logEmitter.emit('query', {
                query: n,
                timestamp: Zo(r.timestamp),
                duration: Number(r.attributes.duration_ms),
                params: r.attributes.params,
                target: r.attributes.target,
              });
            }
          }
        }),
        t?.traces?.length && this.tracingHelper.createEngineSpan({ span: !0, spans: t.traces });
    }
    onBeforeExit() {
      throw new Error('"beforeExit" hook is not applicable to the remote query engine');
    }
    async url(t) {
      return await this.start(), `https://${this.host}/${this.remoteClientVersion}/${this.inlineSchemaHash}/${t}`;
    }
    async uploadSchema() {
      let t = { name: 'schemaUpload', internal: !0 };
      return this.tracingHelper.runInChildSpan(t, async () => {
        let r = await Je(await this.url('schema'), {
          method: 'PUT',
          headers: this.headerBuilder.build(),
          body: this.inlineSchema,
          clientVersion: this.clientVersion,
        });
        r.ok || _n('schema response status', r.status);
        let n = await Wt(r, this.clientVersion);
        if (n)
          throw (
            (this.logEmitter.emit('warn', {
              message: `Error while uploading schema: ${n.message}`,
              timestamp: new Date(),
              target: '',
            }),
            n)
          );
        this.logEmitter.emit('info', {
          message: `Schema (re)uploaded (hash: ${this.inlineSchemaHash})`,
          timestamp: new Date(),
          target: '',
        });
      });
    }
    request(t, { traceparent: r, interactiveTransaction: n, customDataProxyFetch: i }) {
      return this.requestInternal({ body: t, traceparent: r, interactiveTransaction: n, customDataProxyFetch: i });
    }
    async requestBatch(t, { traceparent: r, transaction: n, customDataProxyFetch: i }) {
      let o = n?.kind === 'itx' ? n.options : void 0,
        s = gr(t, n),
        { batchResult: a, elapsed: l } = await this.requestInternal({
          body: s,
          customDataProxyFetch: i,
          interactiveTransaction: o,
          traceparent: r,
        });
      return a.map((u) =>
        'errors' in u && u.errors.length > 0
          ? Ft(u.errors[0], this.clientVersion, this.config.activeProvider)
          : { data: u, elapsed: l },
      );
    }
    requestInternal({ body: t, traceparent: r, customDataProxyFetch: n, interactiveTransaction: i }) {
      return this.withRetry({
        actionGerund: 'querying',
        callback: async ({ logHttpCall: o }) => {
          let s = i ? `${i.payload.endpoint}/graphql` : await this.url('graphql');
          o(s);
          let a = await Je(
            s,
            {
              method: 'POST',
              headers: this.headerBuilder.build({ traceparent: r, interactiveTransaction: i }),
              body: JSON.stringify(t),
              clientVersion: this.clientVersion,
            },
            n,
          );
          a.ok || _n('graphql response status', a.status), await this.handleError(await Wt(a, this.clientVersion));
          let l = await a.json(),
            u = l.extensions;
          if ((u && this.propagateResponseExtensions(u), l.errors))
            throw l.errors.length === 1
              ? Ft(l.errors[0], this.config.clientVersion, this.config.activeProvider)
              : new se(l.errors, { clientVersion: this.config.clientVersion });
          return l;
        },
      });
    }
    async transaction(t, r, n) {
      let i = { start: 'starting', commit: 'committing', rollback: 'rolling back' };
      return this.withRetry({
        actionGerund: `${i[t]} transaction`,
        callback: async ({ logHttpCall: o }) => {
          if (t === 'start') {
            let s = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel }),
              a = await this.url('transaction/start');
            o(a);
            let l = await Je(a, {
              method: 'POST',
              headers: this.headerBuilder.build({ traceparent: r.traceparent }),
              body: s,
              clientVersion: this.clientVersion,
            });
            await this.handleError(await Wt(l, this.clientVersion));
            let u = await l.json(),
              g = u.extensions;
            g && this.propagateResponseExtensions(g);
            let h = u.id,
              v = u['data-proxy'].endpoint;
            return { id: h, payload: { endpoint: v } };
          } else {
            let s = `${n.payload.endpoint}/${t}`;
            o(s);
            let a = await Je(s, {
              method: 'POST',
              headers: this.headerBuilder.build({ traceparent: r.traceparent }),
              clientVersion: this.clientVersion,
            });
            await this.handleError(await Wt(a, this.clientVersion));
            let u = (await a.json()).extensions;
            u && this.propagateResponseExtensions(u);
            return;
          }
        },
      });
    }
    extractHostAndApiKey() {
      let t = { clientVersion: this.clientVersion },
        r = Object.keys(this.inlineDatasources)[0],
        n = mt({
          inlineDatasources: this.inlineDatasources,
          overrideDatasources: this.config.overrideDatasources,
          clientVersion: this.clientVersion,
          env: this.env,
        }),
        i;
      try {
        i = new URL(n);
      } catch {
        throw new Ve(`Error validating datasource \`${r}\`: the URL must start with the protocol \`prisma://\``, t);
      }
      let { protocol: o, host: s, searchParams: a } = i;
      if (o !== 'prisma:')
        throw new Ve(`Error validating datasource \`${r}\`: the URL must start with the protocol \`prisma://\``, t);
      let l = a.get('api_key');
      if (l === null || l.length < 1)
        throw new Ve(`Error validating datasource \`${r}\`: the URL must contain a valid API key`, t);
      return [s, l];
    }
    metrics() {
      throw new je('Metrics are not yet supported for Accelerate', { clientVersion: this.clientVersion });
    }
    async withRetry(t) {
      for (let r = 0; ; r++) {
        let n = (i) => {
          this.logEmitter.emit('info', { message: `Calling ${i} (n=${r})`, timestamp: new Date(), target: '' });
        };
        try {
          return await t.callback({ logHttpCall: n });
        } catch (i) {
          if (!(i instanceof ie) || !i.isRetryable) throw i;
          if (r >= rs) throw i instanceof dt ? i.cause : i;
          this.logEmitter.emit('warn', {
            message: `Attempt ${r + 1}/${rs} failed for ${t.actionGerund}: ${i.message ?? '(unknown)'}`,
            timestamp: new Date(),
            target: '',
          });
          let o = await Ko(r);
          this.logEmitter.emit('warn', { message: `Retrying after ${o}ms`, timestamp: new Date(), target: '' });
        }
      }
    }
    async handleError(t) {
      if (t instanceof Ge) throw (await this.uploadSchema(), new dt({ clientVersion: this.clientVersion, cause: t }));
      if (t) throw t;
    }
    applyPendingMigrations() {
      throw new Error('Method not implemented.');
    }
  };
function ns({ copyEngine: e = !0 }, t) {
  let r;
  try {
    r = mt({
      inlineDatasources: t.inlineDatasources,
      overrideDatasources: t.overrideDatasources,
      env: { ...t.env, ...y.env },
      clientVersion: t.clientVersion,
    });
  } catch {}
  e &&
    r?.startsWith('prisma://') &&
    pr(
      'recommend--no-engine',
      'In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)',
    );
  let n = Pt(t.generator),
    i = !!(r?.startsWith('prisma://') || !e),
    o = !!t.adapter,
    s = n === 'library',
    a = n === 'binary';
  if ((i && o) || o) {
    let l;
    throw (
      ((l = [
        'Prisma Client was configured to use the `adapter` option but it was imported via its `/edge` endpoint.',
        'Please either remove the `/edge` endpoint or remove the `adapter` from the Prisma Client constructor.',
      ]),
      new Z(
        l.join(`
`),
        { clientVersion: t.clientVersion },
      ))
    );
  }
  if (i) return new zt(t);
  throw new Z('Invalid client engine type, please use `library` or `binary`', { clientVersion: t.clientVersion });
}
f();
c();
p();
m();
d();
function Nr({ generator: e }) {
  return e?.previewFeatures ?? [];
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
function ht(e) {
  return e.substring(0, 1).toLowerCase() + e.substring(1);
}
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var us = _e(Bn());
f();
c();
p();
m();
d();
function as(e, t, r) {
  let n = ls(e),
    i = Lu(n),
    o = Uu(i);
  o ? Fr(o, t, r) : t.addErrorMessage(() => 'Unknown error');
}
function ls(e) {
  return e.errors.flatMap((t) => (t.kind === 'Union' ? ls(t) : [t]));
}
function Lu(e) {
  let t = new Map(),
    r = [];
  for (let n of e) {
    if (n.kind !== 'InvalidArgumentType') {
      r.push(n);
      continue;
    }
    let i = `${n.selectionPath.join('.')}:${n.argumentPath.join('.')}`,
      o = t.get(i);
    o
      ? t.set(i, { ...n, argument: { ...n.argument, typeNames: Bu(o.argument.typeNames, n.argument.typeNames) } })
      : t.set(i, n);
  }
  return r.push(...t.values()), r;
}
function Bu(e, t) {
  return [...new Set(e.concat(t))];
}
function Uu(e) {
  return ln(e, (t, r) => {
    let n = os(t),
      i = os(r);
    return n !== i ? n - i : ss(t) - ss(r);
  });
}
function os(e) {
  let t = 0;
  return (
    Array.isArray(e.selectionPath) && (t += e.selectionPath.length),
    Array.isArray(e.argumentPath) && (t += e.argumentPath.length),
    t
  );
}
function ss(e) {
  switch (e.kind) {
    case 'InvalidArgumentValue':
    case 'ValueTooLarge':
      return 20;
    case 'InvalidArgumentType':
      return 10;
    case 'RequiredArgumentMissing':
      return -10;
    default:
      return 0;
  }
}
f();
c();
p();
m();
d();
var le = class {
  constructor(t, r) {
    this.name = t;
    this.value = r;
    this.isRequired = !1;
  }
  makeRequired() {
    return (this.isRequired = !0), this;
  }
  write(t) {
    let {
      colors: { green: r },
    } = t.context;
    t.addMarginSymbol(r(this.isRequired ? '+' : '?')),
      t.write(r(this.name)),
      this.isRequired || t.write(r('?')),
      t.write(r(': ')),
      typeof this.value == 'string' ? t.write(r(this.value)) : t.write(this.value);
  }
};
f();
c();
p();
m();
d();
var Yt = class {
  constructor() {
    this.fields = [];
  }
  addField(t, r) {
    return (
      this.fields.push({
        write(n) {
          let { green: i, dim: o } = n.context.colors;
          n.write(i(o(`${t}: ${r}`))).addMarginSymbol(i(o('+')));
        },
      }),
      this
    );
  }
  write(t) {
    let {
      colors: { green: r },
    } = t.context;
    t.writeLine(r('{'))
      .withIndent(() => {
        t.writeJoined(st, this.fields).newLine();
      })
      .write(r('}'))
      .addMarginSymbol(r('+'));
  }
};
function Fr(e, t, r) {
  switch (e.kind) {
    case 'MutuallyExclusiveFields':
      $u(e, t);
      break;
    case 'IncludeOnScalar':
      qu(e, t);
      break;
    case 'EmptySelection':
      Vu(e, t, r);
      break;
    case 'UnknownSelectionField':
      Qu(e, t);
      break;
    case 'UnknownArgument':
      Hu(e, t);
      break;
    case 'UnknownInputField':
      Wu(e, t);
      break;
    case 'RequiredArgumentMissing':
      Ku(e, t);
      break;
    case 'InvalidArgumentType':
      zu(e, t);
      break;
    case 'InvalidArgumentValue':
      Yu(e, t);
      break;
    case 'ValueTooLarge':
      Zu(e, t);
      break;
    case 'SomeFieldsMissing':
      Xu(e, t);
      break;
    case 'TooManyFieldsGiven':
      ec(e, t);
      break;
    case 'Union':
      as(e, t, r);
      break;
    default:
      throw new Error('not implemented: ' + e.kind);
  }
}
function $u(e, t) {
  let r = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
  r && (r.getField(e.firstField)?.markAsError(), r.getField(e.secondField)?.markAsError()),
    t.addErrorMessage(
      (n) =>
        `Please ${n.bold('either')} use ${n.green(`\`${e.firstField}\``)} or ${n.green(
          `\`${e.secondField}\``,
        )}, but ${n.red('not both')} at the same time.`,
    );
}
function qu(e, t) {
  let [r, n] = Zt(e.selectionPath),
    i = e.outputType,
    o = t.arguments.getDeepSelectionParent(r)?.value;
  if (o && (o.getField(n)?.markAsError(), i))
    for (let s of i.fields) s.isRelation && o.addSuggestion(new le(s.name, 'true'));
  t.addErrorMessage((s) => {
    let a = `Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold('include')} statement`;
    return (
      i ? (a += ` on model ${s.bold(i.name)}. ${Xt(s)}`) : (a += '.'),
      (a += `
Note that ${s.bold('include')} statements only accept relation fields.`),
      a
    );
  });
}
function Vu(e, t, r) {
  let n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
  if (n) {
    let i = n.getField('omit')?.value.asObject();
    if (i) {
      ju(e, t, i);
      return;
    }
    if (n.hasField('select')) {
      Gu(e, t);
      return;
    }
  }
  if (r?.[ht(e.outputType.name)]) {
    Ju(e, t);
    return;
  }
  t.addErrorMessage(() => `Unknown field at "${e.selectionPath.join('.')} selection"`);
}
function ju(e, t, r) {
  r.removeAllFields();
  for (let n of e.outputType.fields) r.addSuggestion(new le(n.name, 'false'));
  t.addErrorMessage(
    (n) =>
      `The ${n.red('omit')} statement includes every field of the model ${n.bold(
        e.outputType.name,
      )}. At least one field must be included in the result`,
  );
}
function Gu(e, t) {
  let r = e.outputType,
    n = t.arguments.getDeepSelectionParent(e.selectionPath)?.value,
    i = n?.isEmpty() ?? !1;
  n && (n.removeAllFields(), ms(n, r)),
    t.addErrorMessage((o) =>
      i
        ? `The ${o.red('`select`')} statement for type ${o.bold(r.name)} must not be empty. ${Xt(o)}`
        : `The ${o.red('`select`')} statement for type ${o.bold(r.name)} needs ${o.bold('at least one truthy value')}.`,
    );
}
function Ju(e, t) {
  let r = new Yt();
  for (let i of e.outputType.fields) i.isRelation || r.addField(i.name, 'false');
  let n = new le('omit', r).makeRequired();
  if (e.selectionPath.length === 0) t.arguments.addSuggestion(n);
  else {
    let [i, o] = Zt(e.selectionPath),
      a = t.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);
    if (a) {
      let l = a?.value.asObject() ?? new lt();
      l.addSuggestion(n), (a.value = l);
    }
  }
  t.addErrorMessage(
    (i) =>
      `The global ${i.red('omit')} configuration excludes every field of the model ${i.bold(
        e.outputType.name,
      )}. At least one field must be included in the result`,
  );
}
function Qu(e, t) {
  let [r, n] = Zt(e.selectionPath),
    i = t.arguments.getDeepSubSelectionValue(r)?.asObject(),
    o;
  if (i) {
    let s = i.getFieldValue('select')?.asObject(),
      a = i.getFieldValue('include')?.asObject(),
      l = i.getFieldValue('omit')?.asObject();
    s?.hasField(n)
      ? ((o = 'select'), s.getField(n)?.markAsError(), ms(s, e.outputType))
      : a?.hasField(n)
      ? ((o = 'include'), a.getField(n)?.markAsError(), tc(a, e.outputType))
      : l?.hasField(n) && ((o = 'omit'), l.getField(n)?.markAsError(), rc(l, e.outputType));
  }
  t.addErrorMessage((s) => {
    let a = [`Unknown field ${s.red(`\`${n}\``)}`];
    return (
      o && a.push(`for ${s.bold(o)} statement`),
      a.push(`on model ${s.bold(`\`${e.outputType.name}\``)}.`),
      a.push(Xt(s)),
      a.join(' ')
    );
  });
}
function Hu(e, t) {
  let r = e.argumentPath[0],
    n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
  n && (n.getField(r)?.markAsError(), nc(n, e.arguments)),
    t.addErrorMessage((i) =>
      cs(
        i,
        r,
        e.arguments.map((o) => o.name),
      ),
    );
}
function Wu(e, t) {
  let [r, n] = Zt(e.argumentPath),
    i = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
  if (i) {
    i.getDeepField(e.argumentPath)?.markAsError();
    let o = i.getDeepFieldValue(r)?.asObject();
    o && ds(o, e.inputType);
  }
  t.addErrorMessage((o) =>
    cs(
      o,
      n,
      e.inputType.fields.map((s) => s.name),
    ),
  );
}
function cs(e, t, r) {
  let n = [`Unknown argument \`${e.red(t)}\`.`],
    i = oc(t, r);
  return i && n.push(`Did you mean \`${e.green(i)}\`?`), r.length > 0 && n.push(Xt(e)), n.join(' ');
}
function Ku(e, t) {
  let r;
  t.addErrorMessage((l) =>
    r?.value instanceof W && r.value.text === 'null'
      ? `Argument \`${l.green(o)}\` must not be ${l.red('null')}.`
      : `Argument \`${l.green(o)}\` is missing.`,
  );
  let n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
  if (!n) return;
  let [i, o] = Zt(e.argumentPath),
    s = new Yt(),
    a = n.getDeepFieldValue(i)?.asObject();
  if (a)
    if (((r = a.getField(o)), r && a.removeField(o), e.inputTypes.length === 1 && e.inputTypes[0].kind === 'object')) {
      for (let l of e.inputTypes[0].fields) s.addField(l.name, l.typeNames.join(' | '));
      a.addSuggestion(new le(o, s).makeRequired());
    } else {
      let l = e.inputTypes.map(ps).join(' | ');
      a.addSuggestion(new le(o, l).makeRequired());
    }
}
function ps(e) {
  return e.kind === 'list' ? `${ps(e.elementType)}[]` : e.name;
}
function zu(e, t) {
  let r = e.argument.name,
    n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
  n && n.getDeepFieldValue(e.argumentPath)?.markAsError(),
    t.addErrorMessage((i) => {
      let o = _r(
        'or',
        e.argument.typeNames.map((s) => i.green(s)),
      );
      return `Argument \`${i.bold(r)}\`: Invalid value provided. Expected ${o}, provided ${i.red(e.inferredType)}.`;
    });
}
function Yu(e, t) {
  let r = e.argument.name,
    n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
  n && n.getDeepFieldValue(e.argumentPath)?.markAsError(),
    t.addErrorMessage((i) => {
      let o = [`Invalid value for argument \`${i.bold(r)}\``];
      if ((e.underlyingError && o.push(`: ${e.underlyingError}`), o.push('.'), e.argument.typeNames.length > 0)) {
        let s = _r(
          'or',
          e.argument.typeNames.map((a) => i.green(a)),
        );
        o.push(` Expected ${s}.`);
      }
      return o.join('');
    });
}
function Zu(e, t) {
  let r = e.argument.name,
    n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(),
    i;
  if (n) {
    let s = n.getDeepField(e.argumentPath)?.value;
    s?.markAsError(), s instanceof W && (i = s.text);
  }
  t.addErrorMessage((o) => {
    let s = ['Unable to fit value'];
    return i && s.push(o.red(i)), s.push(`into a 64-bit signed integer for field \`${o.bold(r)}\``), s.join(' ');
  });
}
function Xu(e, t) {
  let r = e.argumentPath[e.argumentPath.length - 1],
    n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
  if (n) {
    let i = n.getDeepFieldValue(e.argumentPath)?.asObject();
    i && ds(i, e.inputType);
  }
  t.addErrorMessage((i) => {
    let o = [`Argument \`${i.bold(r)}\` of type ${i.bold(e.inputType.name)} needs`];
    return (
      e.constraints.minFieldCount === 1
        ? e.constraints.requiredFields
          ? o.push(
              `${i.green('at least one of')} ${_r(
                'or',
                e.constraints.requiredFields.map((s) => `\`${i.bold(s)}\``),
              )} arguments.`,
            )
          : o.push(`${i.green('at least one')} argument.`)
        : o.push(`${i.green(`at least ${e.constraints.minFieldCount}`)} arguments.`),
      o.push(Xt(i)),
      o.join(' ')
    );
  });
}
function ec(e, t) {
  let r = e.argumentPath[e.argumentPath.length - 1],
    n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(),
    i = [];
  if (n) {
    let o = n.getDeepFieldValue(e.argumentPath)?.asObject();
    o && (o.markAsError(), (i = Object.keys(o.getFields())));
  }
  t.addErrorMessage((o) => {
    let s = [`Argument \`${o.bold(r)}\` of type ${o.bold(e.inputType.name)} needs`];
    return (
      e.constraints.minFieldCount === 1 && e.constraints.maxFieldCount == 1
        ? s.push(`${o.green('exactly one')} argument,`)
        : e.constraints.maxFieldCount == 1
        ? s.push(`${o.green('at most one')} argument,`)
        : s.push(`${o.green(`at most ${e.constraints.maxFieldCount}`)} arguments,`),
      s.push(
        `but you provided ${_r(
          'and',
          i.map((a) => o.red(a)),
        )}. Please choose`,
      ),
      e.constraints.maxFieldCount === 1 ? s.push('one.') : s.push(`${e.constraints.maxFieldCount}.`),
      s.join(' ')
    );
  });
}
function ms(e, t) {
  for (let r of t.fields) e.hasField(r.name) || e.addSuggestion(new le(r.name, 'true'));
}
function tc(e, t) {
  for (let r of t.fields) r.isRelation && !e.hasField(r.name) && e.addSuggestion(new le(r.name, 'true'));
}
function rc(e, t) {
  for (let r of t.fields) !e.hasField(r.name) && !r.isRelation && e.addSuggestion(new le(r.name, 'true'));
}
function nc(e, t) {
  for (let r of t) e.hasField(r.name) || e.addSuggestion(new le(r.name, r.typeNames.join(' | ')));
}
function ds(e, t) {
  if (t.kind === 'object')
    for (let r of t.fields) e.hasField(r.name) || e.addSuggestion(new le(r.name, r.typeNames.join(' | ')));
}
function Zt(e) {
  let t = [...e],
    r = t.pop();
  if (!r) throw new Error('unexpected empty path');
  return [t, r];
}
function Xt({ green: e, enabled: t }) {
  return 'Available options are ' + (t ? `listed in ${e('green')}` : 'marked with ?') + '.';
}
function _r(e, t) {
  if (t.length === 1) return t[0];
  let r = [...t],
    n = r.pop();
  return `${r.join(', ')} ${e} ${n}`;
}
var ic = 3;
function oc(e, t) {
  let r = 1 / 0,
    n;
  for (let i of t) {
    let o = (0, us.default)(e, i);
    o > ic || (o < r && ((r = o), (n = i)));
  }
  return n;
}
function Lr({ args: e, errors: t, errorFormat: r, callsite: n, originalMethod: i, clientVersion: o, globalOmit: s }) {
  let a = ut(e);
  for (let h of t) Fr(h, a, s);
  let { message: l, args: u } = Sr(a, r),
    g = pt({ message: l, callsite: n, originalMethod: i, showColors: r === 'pretty', callArguments: u });
  throw new Z(g, { clientVersion: o });
}
var sc = {
  findUnique: 'findUnique',
  findUniqueOrThrow: 'findUniqueOrThrow',
  findFirst: 'findFirst',
  findFirstOrThrow: 'findFirstOrThrow',
  findMany: 'findMany',
  count: 'aggregate',
  create: 'createOne',
  createMany: 'createMany',
  createManyAndReturn: 'createManyAndReturn',
  update: 'updateOne',
  updateMany: 'updateMany',
  upsert: 'upsertOne',
  delete: 'deleteOne',
  deleteMany: 'deleteMany',
  executeRaw: 'executeRaw',
  queryRaw: 'queryRaw',
  aggregate: 'aggregate',
  groupBy: 'groupBy',
  runCommandRaw: 'runCommandRaw',
  findRaw: 'findRaw',
  aggregateRaw: 'aggregateRaw',
};
function fs({
  modelName: e,
  action: t,
  args: r,
  runtimeDataModel: n,
  extensions: i,
  callsite: o,
  clientMethod: s,
  errorFormat: a,
  clientVersion: l,
  previewFeatures: u,
  globalOmit: g,
}) {
  let h = new Un({
    runtimeDataModel: n,
    modelName: e,
    action: t,
    rootArgs: r,
    callsite: o,
    extensions: i,
    selectionPath: [],
    argumentPath: [],
    originalMethod: s,
    errorFormat: a,
    clientVersion: l,
    previewFeatures: u,
    globalOmit: g,
  });
  return { modelName: e, action: sc[t], query: er(r, h) };
}
function er({ select: e, include: t, ...r } = {}, n) {
  let i;
  return (
    n.isPreviewFeatureOn('omitApi') && ((i = r.omit), delete r.omit), { arguments: hs(r, n), selection: ac(e, t, i, n) }
  );
}
function ac(e, t, r, n) {
  return e
    ? (t
        ? n.throwValidationError({
            kind: 'MutuallyExclusiveFields',
            firstField: 'include',
            secondField: 'select',
            selectionPath: n.getSelectionPath(),
          })
        : r &&
          n.isPreviewFeatureOn('omitApi') &&
          n.throwValidationError({
            kind: 'MutuallyExclusiveFields',
            firstField: 'omit',
            secondField: 'select',
            selectionPath: n.getSelectionPath(),
          }),
      pc(e, n))
    : lc(n, t, r);
}
function lc(e, t, r) {
  let n = {};
  return (
    e.modelOrType && !e.isRawAction() && ((n.$composites = !0), (n.$scalars = !0)),
    t && uc(n, t, e),
    e.isPreviewFeatureOn('omitApi') && cc(n, r, e),
    n
  );
}
function uc(e, t, r) {
  for (let [n, i] of Object.entries(t)) {
    if (i === !1) {
      e[n] = !1;
      continue;
    }
    let o = r.findField(n);
    if (
      (o &&
        o.kind !== 'object' &&
        r.throwValidationError({
          kind: 'IncludeOnScalar',
          selectionPath: r.getSelectionPath().concat(n),
          outputType: r.getOutputTypeDescription(),
        }),
      o)
    ) {
      e[n] = er(i === !0 ? {} : i, r.nestSelection(n));
      continue;
    }
    if (i === !0) {
      e[n] = !0;
      continue;
    }
    e[n] = er(i, r.nestSelection(n));
  }
}
function cc(e, t, r) {
  let n = r.getComputedFields(),
    i = { ...r.getGlobalOmit(), ...t },
    o = jo(i, n);
  for (let [s, a] of Object.entries(o)) {
    let l = r.findField(s);
    (n?.[s] && !l) || (e[s] = !a);
  }
}
function pc(e, t) {
  let r = {},
    n = t.getComputedFields(),
    i = Vo(e, n);
  for (let [o, s] of Object.entries(i)) {
    let a = t.findField(o);
    if (!(n?.[o] && !a)) {
      if (s === !1) {
        r[o] = !1;
        continue;
      }
      if (s === !0) {
        a?.kind === 'object' ? (r[o] = er({}, t.nestSelection(o))) : (r[o] = !0);
        continue;
      }
      r[o] = er(s, t.nestSelection(o));
    }
  }
  return r;
}
function gs(e, t) {
  if (e === null) return null;
  if (typeof e == 'string' || typeof e == 'number' || typeof e == 'boolean') return e;
  if (typeof e == 'bigint') return { $type: 'BigInt', value: String(e) };
  if (tt(e)) {
    if (hr(e)) return { $type: 'DateTime', value: e.toISOString() };
    t.throwValidationError({
      kind: 'InvalidArgumentValue',
      selectionPath: t.getSelectionPath(),
      argumentPath: t.getArgumentPath(),
      argument: { name: t.getArgumentName(), typeNames: ['Date'] },
      underlyingError: 'Provided Date object is invalid',
    });
  }
  if (ot(e)) return { $type: 'FieldRef', value: { _ref: e.name, _container: e.modelName } };
  if (Array.isArray(e)) return mc(e, t);
  if (ArrayBuffer.isView(e)) return { $type: 'Bytes', value: w.Buffer.from(e).toString('base64') };
  if (dc(e)) return e.values;
  if (it(e)) return { $type: 'Decimal', value: e.toFixed() };
  if (e instanceof be) {
    if (e !== pn.instances[e._getName()]) throw new Error('Invalid ObjectEnumValue');
    return { $type: 'Enum', value: e._getName() };
  }
  if (fc(e)) return e.toJSON();
  if (typeof e == 'object') return hs(e, t);
  t.throwValidationError({
    kind: 'InvalidArgumentValue',
    selectionPath: t.getSelectionPath(),
    argumentPath: t.getArgumentPath(),
    argument: { name: t.getArgumentName(), typeNames: [] },
    underlyingError: `We could not serialize ${Object.prototype.toString.call(
      e,
    )} value. Serialize the object to JSON or implement a ".toJSON()" method on it`,
  });
}
function hs(e, t) {
  if (e.$type) return { $type: 'Raw', value: e };
  let r = {};
  for (let n in e) {
    let i = e[n];
    i !== void 0 && (r[n] = gs(i, t.nestArgument(n)));
  }
  return r;
}
function mc(e, t) {
  let r = [];
  for (let n = 0; n < e.length; n++) {
    let i = t.nestArgument(String(n)),
      o = e[n];
    o === void 0 &&
      t.throwValidationError({
        kind: 'InvalidArgumentValue',
        selectionPath: i.getSelectionPath(),
        argumentPath: i.getArgumentPath(),
        argument: { name: `${t.getArgumentName()}[${n}]`, typeNames: [] },
        underlyingError: 'Can not use `undefined` value within array. Use `null` or filter out `undefined` values',
      }),
      r.push(gs(o, i));
  }
  return r;
}
function dc(e) {
  return typeof e == 'object' && e !== null && e.__prismaRawParameters__ === !0;
}
function fc(e) {
  return typeof e == 'object' && e !== null && typeof e.toJSON == 'function';
}
var Un = class e {
  constructor(t) {
    this.params = t;
    this.params.modelName &&
      (this.modelOrType =
        this.params.runtimeDataModel.models[this.params.modelName] ??
        this.params.runtimeDataModel.types[this.params.modelName]);
  }
  throwValidationError(t) {
    Lr({
      errors: [t],
      originalMethod: this.params.originalMethod,
      args: this.params.rootArgs ?? {},
      callsite: this.params.callsite,
      errorFormat: this.params.errorFormat,
      clientVersion: this.params.clientVersion,
      globalOmit: this.params.globalOmit,
    });
  }
  getSelectionPath() {
    return this.params.selectionPath;
  }
  getArgumentPath() {
    return this.params.argumentPath;
  }
  getArgumentName() {
    return this.params.argumentPath[this.params.argumentPath.length - 1];
  }
  getOutputTypeDescription() {
    if (!(!this.params.modelName || !this.modelOrType))
      return {
        name: this.params.modelName,
        fields: this.modelOrType.fields.map((t) => ({
          name: t.name,
          typeName: 'boolean',
          isRelation: t.kind === 'object',
        })),
      };
  }
  isRawAction() {
    return ['executeRaw', 'queryRaw', 'runCommandRaw', 'findRaw', 'aggregateRaw'].includes(this.params.action);
  }
  isPreviewFeatureOn(t) {
    return this.params.previewFeatures.includes(t);
  }
  getComputedFields() {
    if (this.params.modelName) return this.params.extensions.getAllComputedFields(this.params.modelName);
  }
  findField(t) {
    return this.modelOrType?.fields.find((r) => r.name === t);
  }
  nestSelection(t) {
    let r = this.findField(t),
      n = r?.kind === 'object' ? r.type : void 0;
    return new e({ ...this.params, modelName: n, selectionPath: this.params.selectionPath.concat(t) });
  }
  getGlobalOmit() {
    return this.params.modelName && this.shouldApplyGlobalOmit()
      ? this.params.globalOmit?.[ht(this.params.modelName)] ?? {}
      : {};
  }
  shouldApplyGlobalOmit() {
    switch (this.params.action) {
      case 'findFirst':
      case 'findFirstOrThrow':
      case 'findUniqueOrThrow':
      case 'findMany':
      case 'upsert':
      case 'findUnique':
      case 'createManyAndReturn':
      case 'create':
      case 'update':
      case 'delete':
        return !0;
      case 'executeRaw':
      case 'aggregateRaw':
      case 'runCommandRaw':
      case 'findRaw':
      case 'createMany':
      case 'deleteMany':
      case 'groupBy':
      case 'updateMany':
      case 'count':
      case 'aggregate':
      case 'queryRaw':
        return !1;
      default:
        Ee(this.params.action, 'Unknown action');
    }
  }
  nestArgument(t) {
    return new e({ ...this.params, argumentPath: this.params.argumentPath.concat(t) });
  }
};
f();
c();
p();
m();
d();
var ys = (e) => ({ command: e });
f();
c();
p();
m();
d();
f();
c();
p();
m();
d();
var ws = (e) => e.strings.reduce((t, r, n) => `${t}@P${n}${r}`);
f();
c();
p();
m();
d();
function tr(e) {
  try {
    return Es(e, 'fast');
  } catch {
    return Es(e, 'slow');
  }
}
function Es(e, t) {
  return JSON.stringify(e.map((r) => gc(r, t)));
}
function gc(e, t) {
  return typeof e == 'bigint'
    ? { prisma__type: 'bigint', prisma__value: e.toString() }
    : tt(e)
    ? { prisma__type: 'date', prisma__value: e.toJSON() }
    : Pe.isDecimal(e)
    ? { prisma__type: 'decimal', prisma__value: e.toJSON() }
    : w.Buffer.isBuffer(e)
    ? { prisma__type: 'bytes', prisma__value: e.toString('base64') }
    : hc(e) || ArrayBuffer.isView(e)
    ? { prisma__type: 'bytes', prisma__value: w.Buffer.from(e).toString('base64') }
    : typeof e == 'object' && t === 'slow'
    ? xs(e)
    : e;
}
function hc(e) {
  return e instanceof ArrayBuffer || e instanceof SharedArrayBuffer
    ? !0
    : typeof e == 'object' && e !== null
    ? e[Symbol.toStringTag] === 'ArrayBuffer' || e[Symbol.toStringTag] === 'SharedArrayBuffer'
    : !1;
}
function xs(e) {
  if (typeof e != 'object' || e === null) return e;
  if (typeof e.toJSON == 'function') return e.toJSON();
  if (Array.isArray(e)) return e.map(bs);
  let t = {};
  for (let r of Object.keys(e)) t[r] = bs(e[r]);
  return t;
}
function bs(e) {
  return typeof e == 'bigint' ? e.toString() : xs(e);
}
var yc = /^(\s*alter\s)/i,
  Ps = ee('prisma:client');
function $n(e, t, r, n) {
  if (!(e !== 'postgresql' && e !== 'cockroachdb') && r.length > 0 && yc.exec(t))
    throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
}
var qn =
    ({ clientMethod: e, activeProvider: t }) =>
    (r) => {
      let n = '',
        i;
      if (Array.isArray(r)) {
        let [o, ...s] = r;
        (n = o), (i = { values: tr(s || []), __prismaRawParameters__: !0 });
      } else
        switch (t) {
          case 'sqlite':
          case 'mysql': {
            (n = r.sql), (i = { values: tr(r.values), __prismaRawParameters__: !0 });
            break;
          }
          case 'cockroachdb':
          case 'postgresql':
          case 'postgres': {
            (n = r.text), (i = { values: tr(r.values), __prismaRawParameters__: !0 });
            break;
          }
          case 'sqlserver': {
            (n = ws(r)), (i = { values: tr(r.values), __prismaRawParameters__: !0 });
            break;
          }
          default:
            throw new Error(`The ${t} provider does not support ${e}`);
        }
      return i?.values ? Ps(`prisma.${e}(${n}, ${i.values})`) : Ps(`prisma.${e}(${n})`), { query: n, parameters: i };
    },
  vs = {
    requestArgsToMiddlewareArgs(e) {
      return [e.strings, ...e.values];
    },
    middlewareArgsToRequestArgs(e) {
      let [t, ...r] = e;
      return new ae(t, r);
    },
  },
  Ts = {
    requestArgsToMiddlewareArgs(e) {
      return [e];
    },
    middlewareArgsToRequestArgs(e) {
      return e[0];
    },
  };
f();
c();
p();
m();
d();
function Vn(e) {
  return function (r) {
    let n,
      i = (o = e) => {
        try {
          return o === void 0 || o?.kind === 'itx' ? (n ??= As(r(o))) : As(r(o));
        } catch (s) {
          return Promise.reject(s);
        }
      };
    return {
      then(o, s) {
        return i().then(o, s);
      },
      catch(o) {
        return i().catch(o);
      },
      finally(o) {
        return i().finally(o);
      },
      requestTransaction(o) {
        let s = i(o);
        return s.requestTransaction ? s.requestTransaction(o) : s;
      },
      [Symbol.toStringTag]: 'PrismaPromise',
    };
  };
}
function As(e) {
  return typeof e.then == 'function' ? e : Promise.resolve(e);
}
f();
c();
p();
m();
d();
var Cs = {
    isEnabled() {
      return !1;
    },
    getTraceParent() {
      return '00-10-10-00';
    },
    async createEngineSpan() {},
    getActiveContext() {},
    runInChildSpan(e, t) {
      return t();
    },
  },
  jn = class {
    isEnabled() {
      return this.getGlobalTracingHelper().isEnabled();
    }
    getTraceParent(t) {
      return this.getGlobalTracingHelper().getTraceParent(t);
    }
    createEngineSpan(t) {
      return this.getGlobalTracingHelper().createEngineSpan(t);
    }
    getActiveContext() {
      return this.getGlobalTracingHelper().getActiveContext();
    }
    runInChildSpan(t, r) {
      return this.getGlobalTracingHelper().runInChildSpan(t, r);
    }
    getGlobalTracingHelper() {
      return globalThis.PRISMA_INSTRUMENTATION?.helper ?? Cs;
    }
  };
function Rs(e) {
  return e.includes('tracing') ? new jn() : Cs;
}
f();
c();
p();
m();
d();
function Ss(e, t = () => {}) {
  let r,
    n = new Promise((i) => (r = i));
  return {
    then(i) {
      return --e === 0 && r(t()), i?.(n);
    },
  };
}
f();
c();
p();
m();
d();
var wc = ['$connect', '$disconnect', '$on', '$transaction', '$use', '$extends'],
  Os = wc;
f();
c();
p();
m();
d();
function Is(e) {
  return typeof e == 'string'
    ? e
    : e.reduce(
        (t, r) => {
          let n = typeof r == 'string' ? r : r.level;
          return n === 'query' ? t : t && (r === 'info' || t === 'info') ? 'info' : n;
        },
        void 0,
      );
}
f();
c();
p();
m();
d();
var Br = class {
  constructor() {
    this._middlewares = [];
  }
  use(t) {
    this._middlewares.push(t);
  }
  get(t) {
    return this._middlewares[t];
  }
  has(t) {
    return !!this._middlewares[t];
  }
  length() {
    return this._middlewares.length;
  }
};
f();
c();
p();
m();
d();
var Ms = _e(Vi());
f();
c();
p();
m();
d();
function Ur(e) {
  return typeof e.batchRequestIdx == 'number';
}
f();
c();
p();
m();
d();
function $r(e) {
  return e === null ? e : Array.isArray(e) ? e.map($r) : typeof e == 'object' ? (Ec(e) ? bc(e) : Ze(e, $r)) : e;
}
function Ec(e) {
  return e !== null && typeof e == 'object' && typeof e.$type == 'string';
}
function bc({ $type: e, value: t }) {
  switch (e) {
    case 'BigInt':
      return BigInt(t);
    case 'Bytes':
      return w.Buffer.from(t, 'base64');
    case 'DateTime':
      return new Date(t);
    case 'Decimal':
      return new Pe(t);
    case 'Json':
      return JSON.parse(t);
    default:
      Ee(t, 'Unknown tagged value');
  }
}
f();
c();
p();
m();
d();
function ks(e) {
  if (e.action !== 'findUnique' && e.action !== 'findUniqueOrThrow') return;
  let t = [];
  return (
    e.modelName && t.push(e.modelName),
    e.query.arguments && t.push(Gn(e.query.arguments)),
    t.push(Gn(e.query.selection)),
    t.join('')
  );
}
function Gn(e) {
  return `(${Object.keys(e)
    .sort()
    .map((r) => {
      let n = e[r];
      return typeof n == 'object' && n !== null ? `(${r} ${Gn(n)})` : r;
    })
    .join(' ')})`;
}
f();
c();
p();
m();
d();
var xc = {
  aggregate: !1,
  aggregateRaw: !1,
  createMany: !0,
  createManyAndReturn: !0,
  createOne: !0,
  deleteMany: !0,
  deleteOne: !0,
  executeRaw: !0,
  findFirst: !1,
  findFirstOrThrow: !1,
  findMany: !1,
  findRaw: !1,
  findUnique: !1,
  findUniqueOrThrow: !1,
  groupBy: !1,
  queryRaw: !1,
  runCommandRaw: !0,
  updateMany: !0,
  updateOne: !0,
  upsertOne: !0,
};
function Jn(e) {
  return xc[e];
}
f();
c();
p();
m();
d();
var qr = class {
  constructor(t) {
    this.options = t;
    this.tickActive = !1;
    this.batches = {};
  }
  request(t) {
    let r = this.options.batchBy(t);
    return r
      ? (this.batches[r] ||
          ((this.batches[r] = []),
          this.tickActive ||
            ((this.tickActive = !0),
            y.nextTick(() => {
              this.dispatchBatches(), (this.tickActive = !1);
            }))),
        new Promise((n, i) => {
          this.batches[r].push({ request: t, resolve: n, reject: i });
        }))
      : this.options.singleLoader(t);
  }
  dispatchBatches() {
    for (let t in this.batches) {
      let r = this.batches[t];
      delete this.batches[t],
        r.length === 1
          ? this.options
              .singleLoader(r[0].request)
              .then((n) => {
                n instanceof Error ? r[0].reject(n) : r[0].resolve(n);
              })
              .catch((n) => {
                r[0].reject(n);
              })
          : (r.sort((n, i) => this.options.batchOrder(n.request, i.request)),
            this.options
              .batchLoader(r.map((n) => n.request))
              .then((n) => {
                if (n instanceof Error) for (let i = 0; i < r.length; i++) r[i].reject(n);
                else
                  for (let i = 0; i < r.length; i++) {
                    let o = n[i];
                    o instanceof Error ? r[i].reject(o) : r[i].resolve(o);
                  }
              })
              .catch((n) => {
                for (let i = 0; i < r.length; i++) r[i].reject(n);
              }));
    }
  }
  get [Symbol.toStringTag]() {
    return 'DataLoader';
  }
};
f();
c();
p();
m();
d();
function Qe(e, t) {
  if (t === null) return t;
  switch (e) {
    case 'bigint':
      return BigInt(t);
    case 'bytes':
      return w.Buffer.from(t, 'base64');
    case 'decimal':
      return new Pe(t);
    case 'datetime':
    case 'date':
      return new Date(t);
    case 'time':
      return new Date(`1970-01-01T${t}Z`);
    case 'bigint-array':
      return t.map((r) => Qe('bigint', r));
    case 'bytes-array':
      return t.map((r) => Qe('bytes', r));
    case 'decimal-array':
      return t.map((r) => Qe('decimal', r));
    case 'datetime-array':
      return t.map((r) => Qe('datetime', r));
    case 'date-array':
      return t.map((r) => Qe('date', r));
    case 'time-array':
      return t.map((r) => Qe('time', r));
    default:
      return t;
  }
}
function Ds(e) {
  let t = [],
    r = Pc(e);
  for (let n = 0; n < e.rows.length; n++) {
    let i = e.rows[n],
      o = { ...r };
    for (let s = 0; s < i.length; s++) o[e.columns[s]] = Qe(e.types[s], i[s]);
    t.push(o);
  }
  return t;
}
function Pc(e) {
  let t = {};
  for (let r = 0; r < e.columns.length; r++) t[e.columns[r]] = null;
  return t;
}
var vc = ee('prisma:client:request_handler'),
  Vr = class {
    constructor(t, r) {
      (this.logEmitter = r),
        (this.client = t),
        (this.dataloader = new qr({
          batchLoader: Lo(async ({ requests: n, customDataProxyFetch: i }) => {
            let { transaction: o, otelParentCtx: s } = n[0],
              a = n.map((h) => h.protocolQuery),
              l = this.client._tracingHelper.getTraceParent(s),
              u = n.some((h) => Jn(h.protocolQuery.action));
            return (
              await this.client._engine.requestBatch(a, {
                traceparent: l,
                transaction: Tc(o),
                containsWrite: u,
                customDataProxyFetch: i,
              })
            ).map((h, v) => {
              if (h instanceof Error) return h;
              try {
                return this.mapQueryEngineResult(n[v], h);
              } catch (S) {
                return S;
              }
            });
          }),
          singleLoader: async (n) => {
            let i = n.transaction?.kind === 'itx' ? Ns(n.transaction) : void 0,
              o = await this.client._engine.request(n.protocolQuery, {
                traceparent: this.client._tracingHelper.getTraceParent(),
                interactiveTransaction: i,
                isWrite: Jn(n.protocolQuery.action),
                customDataProxyFetch: n.customDataProxyFetch,
              });
            return this.mapQueryEngineResult(n, o);
          },
          batchBy: (n) => (n.transaction?.id ? `transaction-${n.transaction.id}` : ks(n.protocolQuery)),
          batchOrder(n, i) {
            return n.transaction?.kind === 'batch' && i.transaction?.kind === 'batch'
              ? n.transaction.index - i.transaction.index
              : 0;
          },
        }));
    }
    async request(t) {
      try {
        return await this.dataloader.request(t);
      } catch (r) {
        let { clientMethod: n, callsite: i, transaction: o, args: s, modelName: a } = t;
        this.handleAndLogRequestError({
          error: r,
          clientMethod: n,
          callsite: i,
          transaction: o,
          args: s,
          modelName: a,
          globalOmit: t.globalOmit,
        });
      }
    }
    mapQueryEngineResult({ dataPath: t, unpacker: r }, n) {
      let i = n?.data,
        o = n?.elapsed,
        s = this.unpack(i, t, r);
      return y.env.PRISMA_CLIENT_GET_TIME ? { data: s, elapsed: o } : s;
    }
    handleAndLogRequestError(t) {
      try {
        this.handleRequestError(t);
      } catch (r) {
        throw (
          (this.logEmitter &&
            this.logEmitter.emit('error', { message: r.message, target: t.clientMethod, timestamp: new Date() }),
          r)
        );
      }
    }
    handleRequestError({
      error: t,
      clientMethod: r,
      callsite: n,
      transaction: i,
      args: o,
      modelName: s,
      globalOmit: a,
    }) {
      if ((vc(t), Ac(t, i) || t instanceof Ce)) throw t;
      if (t instanceof K && Cc(t)) {
        let u = Fs(t.meta);
        Lr({
          args: o,
          errors: [u],
          callsite: n,
          errorFormat: this.client._errorFormat,
          originalMethod: r,
          clientVersion: this.client._clientVersion,
          globalOmit: a,
        });
      }
      let l = t.message;
      if (
        (n &&
          (l = pt({
            callsite: n,
            originalMethod: r,
            isPanic: t.isPanic,
            showColors: this.client._errorFormat === 'pretty',
            message: l,
          })),
        (l = this.sanitizeMessage(l)),
        t.code)
      ) {
        let u = s ? { modelName: s, ...t.meta } : t.meta;
        throw new K(l, {
          code: t.code,
          clientVersion: this.client._clientVersion,
          meta: u,
          batchRequestIdx: t.batchRequestIdx,
        });
      } else {
        if (t.isPanic) throw new Re(l, this.client._clientVersion);
        if (t instanceof se)
          throw new se(l, { clientVersion: this.client._clientVersion, batchRequestIdx: t.batchRequestIdx });
        if (t instanceof J) throw new J(l, this.client._clientVersion);
        if (t instanceof Re) throw new Re(l, this.client._clientVersion);
      }
      throw ((t.clientVersion = this.client._clientVersion), t);
    }
    sanitizeMessage(t) {
      return this.client._errorFormat && this.client._errorFormat !== 'pretty' ? (0, Ms.default)(t) : t;
    }
    unpack(t, r, n) {
      if (!t || (t.data && (t = t.data), !t)) return t;
      let i = Object.keys(t)[0],
        o = Object.values(t)[0],
        s = r.filter((u) => u !== 'select' && u !== 'include'),
        a = vn(o, s),
        l = i === 'queryRaw' ? Ds(a) : $r(a);
      return n ? n(l) : l;
    }
    get [Symbol.toStringTag]() {
      return 'RequestHandler';
    }
  };
function Tc(e) {
  if (e) {
    if (e.kind === 'batch') return { kind: 'batch', options: { isolationLevel: e.isolationLevel } };
    if (e.kind === 'itx') return { kind: 'itx', options: Ns(e) };
    Ee(e, 'Unknown transaction kind');
  }
}
function Ns(e) {
  return { id: e.id, payload: e.payload };
}
function Ac(e, t) {
  return Ur(e) && t?.kind === 'batch' && e.batchRequestIdx !== t.index;
}
function Cc(e) {
  return e.code === 'P2009' || e.code === 'P2012';
}
function Fs(e) {
  if (e.kind === 'Union') return { kind: 'Union', errors: e.errors.map(Fs) };
  if (Array.isArray(e.selectionPath)) {
    let [, ...t] = e.selectionPath;
    return { ...e, selectionPath: t };
  }
  return e;
}
f();
c();
p();
m();
d();
var _s = '5.18.0';
var Ls = _s;
f();
c();
p();
m();
d();
var Vs = _e(Bn());
f();
c();
p();
m();
d();
var U = class extends Error {
  constructor(t) {
    super(
      t +
        `
Read more at https://pris.ly/d/client-constructor`,
    ),
      (this.name = 'PrismaClientConstructorValidationError');
  }
  get [Symbol.toStringTag]() {
    return 'PrismaClientConstructorValidationError';
  }
};
N(U, 'PrismaClientConstructorValidationError');
var Bs = ['datasources', 'datasourceUrl', 'errorFormat', 'adapter', 'log', 'transactionOptions', 'omit', '__internal'],
  Us = ['pretty', 'colorless', 'minimal'],
  $s = ['info', 'query', 'warn', 'error'],
  Sc = {
    datasources: (e, { datasourceNames: t }) => {
      if (e) {
        if (typeof e != 'object' || Array.isArray(e))
          throw new U(`Invalid value ${JSON.stringify(e)} for "datasources" provided to PrismaClient constructor`);
        for (let [r, n] of Object.entries(e)) {
          if (!t.includes(r)) {
            let i = yt(r, t) || ` Available datasources: ${t.join(', ')}`;
            throw new U(`Unknown datasource ${r} provided to PrismaClient constructor.${i}`);
          }
          if (typeof n != 'object' || Array.isArray(n))
            throw new U(`Invalid value ${JSON.stringify(e)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          if (n && typeof n == 'object')
            for (let [i, o] of Object.entries(n)) {
              if (i !== 'url')
                throw new U(`Invalid value ${JSON.stringify(
                  e,
                )} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
              if (typeof o != 'string')
                throw new U(`Invalid value ${JSON.stringify(
                  o,
                )} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            }
        }
      }
    },
    adapter: (e, t) => {
      if (e === null) return;
      if (e === void 0)
        throw new U('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
      if (!Nr(t).includes('driverAdapters'))
        throw new U(
          '"adapter" property can only be provided to PrismaClient constructor when "driverAdapters" preview feature is enabled.',
        );
      if (Pt() === 'binary')
        throw new U(
          'Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.',
        );
    },
    datasourceUrl: (e) => {
      if (typeof e < 'u' && typeof e != 'string')
        throw new U(`Invalid value ${JSON.stringify(e)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
    },
    errorFormat: (e) => {
      if (e) {
        if (typeof e != 'string')
          throw new U(`Invalid value ${JSON.stringify(e)} for "errorFormat" provided to PrismaClient constructor.`);
        if (!Us.includes(e)) {
          let t = yt(e, Us);
          throw new U(`Invalid errorFormat ${e} provided to PrismaClient constructor.${t}`);
        }
      }
    },
    log: (e) => {
      if (!e) return;
      if (!Array.isArray(e))
        throw new U(`Invalid value ${JSON.stringify(e)} for "log" provided to PrismaClient constructor.`);
      function t(r) {
        if (typeof r == 'string' && !$s.includes(r)) {
          let n = yt(r, $s);
          throw new U(`Invalid log level "${r}" provided to PrismaClient constructor.${n}`);
        }
      }
      for (let r of e) {
        t(r);
        let n = {
          level: t,
          emit: (i) => {
            let o = ['stdout', 'event'];
            if (!o.includes(i)) {
              let s = yt(i, o);
              throw new U(
                `Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`,
              );
            }
          },
        };
        if (r && typeof r == 'object')
          for (let [i, o] of Object.entries(r))
            if (n[i]) n[i](o);
            else throw new U(`Invalid property ${i} for "log" provided to PrismaClient constructor`);
      }
    },
    transactionOptions: (e) => {
      if (!e) return;
      let t = e.maxWait;
      if (t != null && t <= 0)
        throw new U(
          `Invalid value ${t} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`,
        );
      let r = e.timeout;
      if (r != null && r <= 0)
        throw new U(
          `Invalid value ${r} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`,
        );
    },
    omit: (e, t) => {
      if (typeof e != 'object') throw new U('"omit" option is expected to be an object.');
      if (e === null) throw new U('"omit" option can not be `null`');
      let r = [];
      for (let [n, i] of Object.entries(e)) {
        let o = Ic(n, t.runtimeDataModel);
        if (!o) {
          r.push({ kind: 'UnknownModel', modelKey: n });
          continue;
        }
        for (let [s, a] of Object.entries(i)) {
          let l = o.fields.find((u) => u.name === s);
          if (!l) {
            r.push({ kind: 'UnknownField', modelKey: n, fieldName: s });
            continue;
          }
          if (l.relationName) {
            r.push({ kind: 'RelationInOmit', modelKey: n, fieldName: s });
            continue;
          }
          typeof a != 'boolean' && r.push({ kind: 'InvalidFieldValue', modelKey: n, fieldName: s });
        }
      }
      if (r.length > 0) throw new U(kc(e, r));
    },
    __internal: (e) => {
      if (!e) return;
      let t = ['debug', 'engine', 'configOverride'];
      if (typeof e != 'object')
        throw new U(`Invalid value ${JSON.stringify(e)} for "__internal" to PrismaClient constructor`);
      for (let [r] of Object.entries(e))
        if (!t.includes(r)) {
          let n = yt(r, t);
          throw new U(
            `Invalid property ${JSON.stringify(r)} for "__internal" provided to PrismaClient constructor.${n}`,
          );
        }
    },
  };
function js(e, t) {
  for (let [r, n] of Object.entries(e)) {
    if (!Bs.includes(r)) {
      let i = yt(r, Bs);
      throw new U(`Unknown property ${r} provided to PrismaClient constructor.${i}`);
    }
    Sc[r](n, t);
  }
  if (e.datasourceUrl && e.datasources)
    throw new U('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
}
function yt(e, t) {
  if (t.length === 0 || typeof e != 'string') return '';
  let r = Oc(e, t);
  return r ? ` Did you mean "${r}"?` : '';
}
function Oc(e, t) {
  if (t.length === 0) return null;
  let r = t.map((i) => ({ value: i, distance: (0, Vs.default)(e, i) }));
  r.sort((i, o) => (i.distance < o.distance ? -1 : 1));
  let n = r[0];
  return n.distance < 3 ? n.value : null;
}
function Ic(e, t) {
  return qs(t.models, e) ?? qs(t.types, e);
}
function qs(e, t) {
  let r = Object.keys(e).find((n) => ht(n) === t);
  if (r) return e[r];
}
function kc(e, t) {
  let r = ut(e);
  for (let o of t)
    switch (o.kind) {
      case 'UnknownModel':
        r.arguments.getField(o.modelKey)?.markAsError(), r.addErrorMessage(() => `Unknown model name: ${o.modelKey}.`);
        break;
      case 'UnknownField':
        r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(),
          r.addErrorMessage(() => `Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);
        break;
      case 'RelationInOmit':
        r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(),
          r.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
        break;
      case 'InvalidFieldValue':
        r.arguments.getDeepFieldValue([o.modelKey, o.fieldName])?.markAsError(),
          r.addErrorMessage(() => 'Omit field option value must be a boolean.');
        break;
    }
  let { message: n, args: i } = Sr(r, 'colorless');
  return `Error validating "omit" option:

${i}

${n}`;
}
f();
c();
p();
m();
d();
function Gs(e) {
  return e.length === 0
    ? Promise.resolve([])
    : new Promise((t, r) => {
        let n = new Array(e.length),
          i = null,
          o = !1,
          s = 0,
          a = () => {
            o || (s++, s === e.length && ((o = !0), i ? r(i) : t(n)));
          },
          l = (u) => {
            o || ((o = !0), r(u));
          };
        for (let u = 0; u < e.length; u++)
          e[u].then(
            (g) => {
              (n[u] = g), a();
            },
            (g) => {
              if (!Ur(g)) {
                l(g);
                return;
              }
              g.batchRequestIdx === u ? l(g) : (i || (i = g), a());
            },
          );
      });
}
var Ne = ee('prisma:client');
typeof globalThis == 'object' && (globalThis.NODE_CLIENT = !0);
var Dc = { requestArgsToMiddlewareArgs: (e) => e, middlewareArgsToRequestArgs: (e) => e },
  Mc = Symbol.for('prisma.client.transaction.id'),
  Nc = {
    id: 0,
    nextId() {
      return ++this.id;
    },
  };
function Fc(e) {
  class t {
    constructor(n) {
      this._originalClient = this;
      this._middlewares = new Br();
      this._createPrismaPromise = Vn();
      this.$extends = Oo;
      (e = n?.__internal?.configOverride?.(e) ?? e), Qo(e), n && js(n, e);
      let i = new cr().on('error', () => {});
      (this._extensions = Dr.empty()),
        (this._previewFeatures = Nr(e)),
        (this._clientVersion = e.clientVersion ?? Ls),
        (this._activeProvider = e.activeProvider),
        (this._globalOmit = n?.omit),
        (this._tracingHelper = Rs(this._previewFeatures));
      let o = {
          rootEnvPath: e.relativeEnvPaths.rootEnvPath && xt.resolve(e.dirname, e.relativeEnvPaths.rootEnvPath),
          schemaEnvPath: e.relativeEnvPaths.schemaEnvPath && xt.resolve(e.dirname, e.relativeEnvPaths.schemaEnvPath),
        },
        s;
      if (n?.adapter) {
        s = fn(n.adapter);
        let l = e.activeProvider === 'postgresql' ? 'postgres' : e.activeProvider;
        if (s.provider !== l)
          throw new J(
            `The Driver Adapter \`${s.adapterName}\`, based on \`${s.provider}\`, is not compatible with the provider \`${l}\` specified in the Prisma schema.`,
            this._clientVersion,
          );
        if (n.datasources || n.datasourceUrl !== void 0)
          throw new J(
            'Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.',
            this._clientVersion,
          );
      }
      let a = e.injectableEdgeEnv?.();
      try {
        let l = n ?? {},
          u = l.__internal ?? {},
          g = u.debug === !0;
        g && ee.enable('prisma:client');
        let h = xt.resolve(e.dirname, e.relativePath);
        hi.existsSync(h) || (h = e.dirname), Ne('dirname', e.dirname), Ne('relativePath', e.relativePath), Ne('cwd', h);
        let v = u.engine || {};
        if (
          (l.errorFormat
            ? (this._errorFormat = l.errorFormat)
            : y.env.NODE_ENV === 'production'
            ? (this._errorFormat = 'minimal')
            : y.env.NO_COLOR
            ? (this._errorFormat = 'colorless')
            : (this._errorFormat = 'colorless'),
          (this._runtimeDataModel = e.runtimeDataModel),
          (this._engineConfig = {
            cwd: h,
            dirname: e.dirname,
            enableDebugLogs: g,
            allowTriggerPanic: v.allowTriggerPanic,
            datamodelPath: xt.join(e.dirname, e.filename ?? 'schema.prisma'),
            prismaPath: v.binaryPath ?? void 0,
            engineEndpoint: v.endpoint,
            generator: e.generator,
            showColors: this._errorFormat === 'pretty',
            logLevel: l.log && Is(l.log),
            logQueries:
              l.log &&
              !!(typeof l.log == 'string'
                ? l.log === 'query'
                : l.log.find((S) => (typeof S == 'string' ? S === 'query' : S.level === 'query'))),
            env: a?.parsed ?? {},
            flags: [],
            engineWasm: e.engineWasm,
            clientVersion: e.clientVersion,
            engineVersion: e.engineVersion,
            previewFeatures: this._previewFeatures,
            activeProvider: e.activeProvider,
            inlineSchema: e.inlineSchema,
            overrideDatasources: Ho(l, e.datasourceNames),
            inlineDatasources: e.inlineDatasources,
            inlineSchemaHash: e.inlineSchemaHash,
            tracingHelper: this._tracingHelper,
            transactionOptions: {
              maxWait: l.transactionOptions?.maxWait ?? 2e3,
              timeout: l.transactionOptions?.timeout ?? 5e3,
              isolationLevel: l.transactionOptions?.isolationLevel,
            },
            logEmitter: i,
            isBundled: e.isBundled,
            adapter: s,
          }),
          (this._accelerateEngineConfig = {
            ...this._engineConfig,
            accelerateUtils: {
              resolveDatasourceUrl: mt,
              getBatchRequestPayload: gr,
              prismaGraphQLToJSError: Ft,
              PrismaClientUnknownRequestError: se,
              PrismaClientInitializationError: J,
              PrismaClientKnownRequestError: K,
              debug: ee('prisma:client:accelerateEngine'),
              engineVersion: Qs.version,
              clientVersion: e.clientVersion,
            },
          }),
          Ne('clientVersion', e.clientVersion),
          (this._engine = ns(e, this._engineConfig)),
          (this._requestHandler = new Vr(this, i)),
          l.log)
        )
          for (let S of l.log) {
            let C = typeof S == 'string' ? S : S.emit === 'stdout' ? S.level : null;
            C &&
              this.$on(C, (R) => {
                Tt.log(`${Tt.tags[C] ?? ''}`, R.message || R.query);
              });
          }
        this._metrics = new At(this._engine);
      } catch (l) {
        throw ((l.clientVersion = this._clientVersion), l);
      }
      return (this._appliedParent = _t(this));
    }
    get [Symbol.toStringTag]() {
      return 'PrismaClient';
    }
    $use(n) {
      this._middlewares.use(n);
    }
    $on(n, i) {
      n === 'beforeExit' ? this._engine.onBeforeExit(i) : n && this._engineConfig.logEmitter.on(n, i);
    }
    $connect() {
      try {
        return this._engine.start();
      } catch (n) {
        throw ((n.clientVersion = this._clientVersion), n);
      }
    }
    async $disconnect() {
      try {
        await this._engine.stop();
      } catch (n) {
        throw ((n.clientVersion = this._clientVersion), n);
      } finally {
        ki();
      }
    }
    $executeRawInternal(n, i, o, s) {
      let a = this._activeProvider;
      return this._request({
        action: 'executeRaw',
        args: o,
        transaction: n,
        clientMethod: i,
        argsMapper: qn({ clientMethod: i, activeProvider: a }),
        callsite: Me(this._errorFormat),
        dataPath: [],
        middlewareArgsMapper: s,
      });
    }
    $executeRaw(n, ...i) {
      return this._createPrismaPromise((o) => {
        if (n.raw !== void 0 || n.sql !== void 0) {
          let [s, a] = Js(n, i);
          return (
            $n(
              this._activeProvider,
              s.text,
              s.values,
              Array.isArray(n) ? 'prisma.$executeRaw`<SQL>`' : 'prisma.$executeRaw(sql`<SQL>`)',
            ),
            this.$executeRawInternal(o, '$executeRaw', s, a)
          );
        }
        throw new Z(
          "`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n",
          { clientVersion: this._clientVersion },
        );
      });
    }
    $executeRawUnsafe(n, ...i) {
      return this._createPrismaPromise(
        (o) => (
          $n(this._activeProvider, n, i, 'prisma.$executeRawUnsafe(<SQL>, [...values])'),
          this.$executeRawInternal(o, '$executeRawUnsafe', [n, ...i])
        ),
      );
    }
    $runCommandRaw(n) {
      if (e.activeProvider !== 'mongodb')
        throw new Z(`The ${e.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`, {
          clientVersion: this._clientVersion,
        });
      return this._createPrismaPromise((i) =>
        this._request({
          args: n,
          clientMethod: '$runCommandRaw',
          dataPath: [],
          action: 'runCommandRaw',
          argsMapper: ys,
          callsite: Me(this._errorFormat),
          transaction: i,
        }),
      );
    }
    async $queryRawInternal(n, i, o, s) {
      let a = this._activeProvider;
      return this._request({
        action: 'queryRaw',
        args: o,
        transaction: n,
        clientMethod: i,
        argsMapper: qn({ clientMethod: i, activeProvider: a }),
        callsite: Me(this._errorFormat),
        dataPath: [],
        middlewareArgsMapper: s,
      });
    }
    $queryRaw(n, ...i) {
      return this._createPrismaPromise((o) => {
        if (n.raw !== void 0 || n.sql !== void 0) return this.$queryRawInternal(o, '$queryRaw', ...Js(n, i));
        throw new Z(
          "`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n",
          { clientVersion: this._clientVersion },
        );
      });
    }
    $queryRawUnsafe(n, ...i) {
      return this._createPrismaPromise((o) => this.$queryRawInternal(o, '$queryRawUnsafe', [n, ...i]));
    }
    _transactionWithArray({ promises: n, options: i }) {
      let o = Nc.nextId(),
        s = Ss(n.length),
        a = n.map((l, u) => {
          if (l?.[Symbol.toStringTag] !== 'PrismaPromise')
            throw new Error(
              'All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.',
            );
          let g = i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel,
            h = { kind: 'batch', id: o, index: u, isolationLevel: g, lock: s };
          return l.requestTransaction?.(h) ?? l;
        });
      return Gs(a);
    }
    async _transactionWithCallback({ callback: n, options: i }) {
      let o = { traceparent: this._tracingHelper.getTraceParent() },
        s = {
          maxWait: i?.maxWait ?? this._engineConfig.transactionOptions.maxWait,
          timeout: i?.timeout ?? this._engineConfig.transactionOptions.timeout,
          isolationLevel: i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel,
        },
        a = await this._engine.transaction('start', o, s),
        l;
      try {
        let u = { kind: 'itx', ...a };
        (l = await n(this._createItxClient(u))), await this._engine.transaction('commit', o, a);
      } catch (u) {
        throw (await this._engine.transaction('rollback', o, a).catch(() => {}), u);
      }
      return l;
    }
    _createItxClient(n) {
      return _t(
        fe(So(this), [
          te('_appliedParent', () => this._appliedParent._createItxClient(n)),
          te('_createPrismaPromise', () => Vn(n)),
          te(Mc, () => n.id),
          Xe(Os),
        ]),
      );
    }
    $transaction(n, i) {
      let o;
      typeof n == 'function'
        ? this._engineConfig.adapter?.adapterName === '@prisma/adapter-d1'
          ? (o = () => {
              throw new Error(
                'Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.',
              );
            })
          : (o = () => this._transactionWithCallback({ callback: n, options: i }))
        : (o = () => this._transactionWithArray({ promises: n, options: i }));
      let s = { name: 'transaction', attributes: { method: '$transaction' } };
      return this._tracingHelper.runInChildSpan(s, o);
    }
    _request(n) {
      n.otelParentCtx = this._tracingHelper.getActiveContext();
      let i = n.middlewareArgsMapper ?? Dc,
        o = {
          args: i.requestArgsToMiddlewareArgs(n.args),
          dataPath: n.dataPath,
          runInTransaction: !!n.transaction,
          action: n.action,
          model: n.model,
        },
        s = {
          middleware: { name: 'middleware', middleware: !0, attributes: { method: '$use' }, active: !1 },
          operation: {
            name: 'operation',
            attributes: { method: o.action, model: o.model, name: o.model ? `${o.model}.${o.action}` : o.action },
          },
        },
        a = -1,
        l = async (u) => {
          let g = this._middlewares.get(++a);
          if (g) return this._tracingHelper.runInChildSpan(s.middleware, (M) => g(u, (F) => (M?.end(), l(F))));
          let { runInTransaction: h, args: v, ...S } = u,
            C = { ...n, ...S };
          v && (C.args = i.middlewareArgsToRequestArgs(v)),
            n.transaction !== void 0 && h === !1 && delete C.transaction;
          let R = await _o(this, C);
          return C.model
            ? Do({
                result: R,
                modelName: C.model,
                args: C.args,
                extensions: this._extensions,
                runtimeDataModel: this._runtimeDataModel,
                globalOmit: this._globalOmit,
              })
            : R;
        };
      return this._tracingHelper.runInChildSpan(s.operation, () => l(o));
    }
    async _executeRequest({
      args: n,
      clientMethod: i,
      dataPath: o,
      callsite: s,
      action: a,
      model: l,
      argsMapper: u,
      transaction: g,
      unpacker: h,
      otelParentCtx: v,
      customDataProxyFetch: S,
    }) {
      try {
        n = u ? u(n) : n;
        let C = { name: 'serialize' },
          R = this._tracingHelper.runInChildSpan(C, () =>
            fs({
              modelName: l,
              runtimeDataModel: this._runtimeDataModel,
              action: a,
              args: n,
              clientMethod: i,
              callsite: s,
              extensions: this._extensions,
              errorFormat: this._errorFormat,
              clientVersion: this._clientVersion,
              previewFeatures: this._previewFeatures,
              globalOmit: this._globalOmit,
            }),
          );
        return (
          ee.enabled('prisma:client') &&
            (Ne('Prisma Client call:'),
            Ne(`prisma.${i}(${yo(n)})`),
            Ne('Generated request:'),
            Ne(
              JSON.stringify(R, null, 2) +
                `
`,
            )),
          g?.kind === 'batch' && (await g.lock),
          this._requestHandler.request({
            protocolQuery: R,
            modelName: l,
            action: a,
            clientMethod: i,
            dataPath: o,
            callsite: s,
            args: n,
            extensions: this._extensions,
            transaction: g,
            unpacker: h,
            otelParentCtx: v,
            otelChildCtx: this._tracingHelper.getActiveContext(),
            globalOmit: this._globalOmit,
            customDataProxyFetch: S,
          })
        );
      } catch (C) {
        throw ((C.clientVersion = this._clientVersion), C);
      }
    }
    get $metrics() {
      if (!this._hasPreviewFlag('metrics'))
        throw new Z('`metrics` preview feature must be enabled in order to access metrics API', {
          clientVersion: this._clientVersion,
        });
      return this._metrics;
    }
    _hasPreviewFlag(n) {
      return !!this._engineConfig.previewFeatures?.includes(n);
    }
    $applyPendingMigrations() {
      return this._engine.applyPendingMigrations();
    }
  }
  return t;
}
function Js(e, t) {
  return _c(e) ? [new ae(e, t), vs] : [e, Ts];
}
function _c(e) {
  return Array.isArray(e) && Array.isArray(e.raw);
}
f();
c();
p();
m();
d();
var Lc = new Set([
  'toJSON',
  '$$typeof',
  'asymmetricMatch',
  Symbol.iterator,
  Symbol.toStringTag,
  Symbol.isConcatSpreadable,
  Symbol.toPrimitive,
]);
function Bc(e) {
  return new Proxy(e, {
    get(t, r) {
      if (r in t) return t[r];
      if (!Lc.has(r)) throw new TypeError(`Invalid enum value: ${String(r)}`);
    },
  });
}
f();
c();
p();
m();
d();
var export_warnEnvConflicts = void 0;
export {
  Ii as Debug,
  Pe as Decimal,
  di as Extensions,
  At as MetricsClient,
  Ce as NotFoundError,
  J as PrismaClientInitializationError,
  K as PrismaClientKnownRequestError,
  Re as PrismaClientRustPanicError,
  se as PrismaClientUnknownRequestError,
  Z as PrismaClientValidationError,
  gi as Public,
  ae as Sql,
  Ga as defineDmmfProperty,
  za as empty,
  Fc as getPrismaClient,
  Rn as getRuntime,
  Ka as join,
  Bc as makeStrictEnum,
  pn as objectEnumValues,
  Hi as raw,
  Wi as sqltag,
  export_warnEnvConflicts as warnEnvConflicts,
  pr as warnOnce,
};
//# sourceMappingURL=edge-esm.js.map
