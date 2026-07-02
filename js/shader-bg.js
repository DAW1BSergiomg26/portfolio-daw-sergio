(function () {
  'use strict';

  var canvas = document.createElement('canvas');
  canvas.className = 'particles-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  var gl = canvas.getContext('webgl', { alpha: true, antialias: false });
  if (!gl) {
    canvas.style.display = 'none';
    return;
  }

  // Remove old particle canvas if present
  var old = document.querySelector('.particles-canvas');
  if (old && old !== canvas) old.remove();

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var mouse = { x: 0.5, y: 0.5 };
  var theme = 'dark';
  var uniforms = {};

  // Shader sources
  var vsSrc = [
    'attribute vec2 aPos;',
    'attribute vec2 aUV;',
    'varying vec2 vUV;',
    'void main() {',
    '  vUV = aUV;',
    '  gl_Position = vec4(aPos, 0.0, 1.0);',
    '}'
  ].join('\n');

  var fsSrc = [
    'precision highp float;',
    'varying vec2 vUV;',
    'uniform vec2 uRes;',
    'uniform float uTime;',
    'uniform vec2 uMouse;',
    'uniform vec3 uCol1;',
    'uniform vec3 uCol2;',
    'uniform vec3 uCol3;',
    'uniform float uOpacity;',
    '',
    'void main() {',
    '  vec2 uv = vUV;',
    '  float t = uTime;',
    '',
    '  // Mouse bend',
    '  float mDist = distance(uv, uMouse);',
    '  float mInfluence = 0.06 * (1.0 - smoothstep(0.0, 0.6, mDist));',
    '',
    '  // Layered waves',
    '  float w1 = sin(uv.x * 2.8 + t * 0.35) * 0.10;',
    '  float w2 = sin(uv.x * 4.2 + t * 0.55 + 1.7) * 0.07;',
    '  float w3 = cos(uv.x * 3.5 + t * 0.45 + 2.3) * 0.06;',
    '  float w4 = sin(uv.x * 5.8 + t * 0.70 + 0.9) * 0.04;',
    '',
    '  // Mouse wave distortion',
    '  float mw = sin(uv.x * 3.0 + t * 0.25) * mInfluence;',
    '',
    '  float y = uv.y + w1 + w2 + w3 + w4 + mw;',
    '',
    '  // Aurora bands',
    '  float b1 = exp(-pow(abs(y - 0.55), 2.0) * 28.0) * 0.70;',
    '  float b2 = exp(-pow(abs(y - 0.40), 2.0) * 35.0) * 0.55;',
    '  float b3 = exp(-pow(abs(y - 0.70), 2.0) * 32.0) * 0.45;',
    '  float b4 = exp(-pow(abs(y - 0.28), 2.0) * 50.0) * 0.25;',
    '',
    '  // Color mixing',
    '  vec3 col = vec3(0.0);',
    '  col += uCol1 * b1;',
    '  col += uCol2 * b2;',
    '  col += uCol3 * b3;',
    '  col += mix(uCol1, uCol2, 0.5) * b4;',
    '',
    '  // Time-based shimmer',
    '  float shimmer = sin(uv.x * 10.0 + t * 1.2) * 0.08 + 0.92;',
    '  col *= shimmer;',
    '',
    '  // Fade edges',
    '  float fade = 1.0 - pow(abs(uv.y - 0.5) * 1.6, 2.0);',
    '  col *= smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);',
    '  col *= fade;',
    '',
    '  // Vignette',
    '  float vig = 1.0 - pow(mDist * 0.9, 2.0);',
    '  col *= vig;',
    '',
    '  gl_FragColor = vec4(col, uOpacity);',
    '}'
  ].join('\n');

  function compileShader(src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('[Shader] compile error:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  var vs = compileShader(vsSrc, gl.VERTEX_SHADER);
  var fs = compileShader(fsSrc, gl.FRAGMENT_SHADER);
  if (!vs || !fs) { canvas.style.display = 'none'; return; }

  var program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[Shader] link error');
    canvas.style.display = 'none';
    return;
  }
  gl.useProgram(program);

  // Full-screen quad
  var positions = new Float32Array([
    -1, -1,   1, -1,   -1, 1,
    -1, 1,    1, -1,   1, 1
  ]);
  var uvs = new Float32Array([
    0, 0,   1, 0,   0, 1,
    0, 1,   1, 0,   1, 1
  ]);

  var posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  var posLoc = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  var uvBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
  var uvLoc = gl.getAttribLocation(program, 'aUV');
  gl.enableVertexAttribArray(uvLoc);
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations
  uniforms = {
    uRes: gl.getUniformLocation(program, 'uRes'),
    uTime: gl.getUniformLocation(program, 'uTime'),
    uMouse: gl.getUniformLocation(program, 'uMouse'),
    uCol1: gl.getUniformLocation(program, 'uCol1'),
    uCol2: gl.getUniformLocation(program, 'uCol2'),
    uCol3: gl.getUniformLocation(program, 'uCol3'),
    uOpacity: gl.getUniformLocation(program, 'uOpacity'),
  };

  function getColors() {
    var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    theme = isDark ? 'dark' : 'light';
    return isDark
      ? { c1: [0.12, 0.28, 0.55], c2: [0.30, 0.18, 0.50], c3: [0.08, 0.35, 0.45], opacity: 0.15 }
      : { c1: [0.40, 0.60, 0.85], c2: [0.55, 0.40, 0.75], c3: [0.30, 0.65, 0.70], opacity: 0.25 };
  }

  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var cw = Math.round(w * dpr);
    var ch = Math.round(h * dpr);
    canvas.width = cw;
    canvas.height = ch;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    gl.viewport(0, 0, cw, ch);
  }

  function render(time) {
    var cols = getColors();
    resize();

    gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
    gl.uniform1f(uniforms.uTime, time * 0.001);
    gl.uniform2f(uniforms.uMouse, mouse.x, mouse.y);
    gl.uniform3fv(uniforms.uCol1, cols.c1);
    gl.uniform3fv(uniforms.uCol2, cols.c2);
    gl.uniform3fv(uniforms.uCol3, cols.c3);
    gl.uniform1f(uniforms.uOpacity, cols.opacity);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  function init() {
    resize();

    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - e.clientY / window.innerHeight;
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      mouse.x = 0.5;
      mouse.y = 0.5;
    }, { passive: true });

    window.addEventListener('resize', resize, { passive: true });

    var observer = new MutationObserver(function () {
      // Colors will update on next frame
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
