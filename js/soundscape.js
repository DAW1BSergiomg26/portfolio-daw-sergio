(function () {
  'use strict';

  var ctx = null;
  var activeNodes = [];
  var currentMode = null;
  var btn, panel, volumeSlider, modeBtns;

  var MODES = {
    rain: { label: 'Lluvia', labelEn: 'Rain' },
    synth: { label: 'Sintetica', labelEn: 'Synth' },
    drone: { label: 'Profundo', labelEn: 'Deep' },
  };

  function isEn() { return (document.documentElement.lang || 'es') === 'en'; }

  function label(mode) {
    return isEn() ? MODES[mode].labelEn : MODES[mode].label;
  }

  function stopAll() {
    activeNodes.forEach(function (n) {
      try { n.stop(); } catch(e) {}
      try { n.disconnect(); } catch(e) {}
    });
    activeNodes = [];
    currentMode = null;
    if (btn) btn.classList.remove('is-active');
  }

  function startRain() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    var duration = 4;
    var sampleRate = ctx.sampleRate;
    var length = sampleRate * duration;
    var buffer = ctx.createBuffer(1, length, sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    var source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    var lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 800;
    lpf.Q.value = 0.5;

    var hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 100;

    var gain = ctx.createGain();
    gain.gain.value = 0.25;

    // LFO for amplitude variation
    var lfo = ctx.createOscillator();
    lfo.frequency.value = 0.3;
    var lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    source.connect(hpf);
    hpf.connect(lpf);
    lpf.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    activeNodes = [source, lfo];
  }

  function startSynth() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();

    var gain = ctx.createGain();
    gain.gain.value = 0.08;

    // Reverb via convolver (simple delay-based)
    var delay = ctx.createDelay();
    delay.delayTime.value = 0.3;
    var feedback = ctx.createGain();
    feedback.gain.value = 0.3;
    var wetGain = ctx.createGain();
    wetGain.gain.value = 0.3;

    gain.connect(ctx.destination);

    // Arpeggio pattern
    var notes = [261.63, 329.63, 392.00, 440.00, 392.00, 329.63]; // C4, E4, G4, A4, G4, E4
    var noteIdx = 0;
    var bpm = 70;
    var beatDuration = 60 / bpm / 2;

    function playNote() {
      if (currentMode !== 'synth') return;
      var osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = notes[noteIdx % notes.length];

      var noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
      noteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + beatDuration * 0.8);

      // Sub oscillator
      var sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.value = notes[noteIdx % notes.length] / 2;
      var subGain = ctx.createGain();
      subGain.gain.value = 0.2;

      var lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 1200 + Math.sin(noteIdx * 0.5) * 400;

      osc.connect(noteGain);
      noteGain.connect(lpf);
      sub.connect(subGain);
      subGain.connect(lpf);
      lpf.connect(gain);

      osc.start();
      sub.start();
      osc.stop(ctx.currentTime + beatDuration);
      sub.stop(ctx.currentTime + beatDuration);

      activeNodes.push(osc);
      activeNodes.push(sub);

      noteIdx++;
      setTimeout(playNote, beatDuration * 1000);
    }

    playNote();
  }

  function startDrone() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();

    var gain = ctx.createGain();
    gain.gain.value = 0.10;

    var freqs = [55, 65.41, 82.41, 110]; // A1, C2, E2, A2
    freqs.forEach(function (freq, i) {
      var osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      var oscGain = ctx.createGain();
      oscGain.gain.value = 0.3 + Math.random() * 0.1;

      // Slow LFO on gain
      var lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + Math.random() * 0.1;
      var lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.15;
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();

      var lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 300 + i * 100;
      lpf.Q.value = 1;

      osc.connect(oscGain);
      oscGain.connect(lpf);
      lpf.connect(gain);

      osc.start();
      activeNodes.push(osc);
      activeNodes.push(lfo);
    });

    gain.connect(ctx.destination);
  }

  function startMode(mode) {
    stopAll();
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();

    currentMode = mode;
    if (btn) btn.classList.add('is-active');

    switch (mode) {
      case 'rain': startRain(); break;
      case 'synth': startSynth(); break;
      case 'drone': startDrone(); break;
    }
  }

  function toggle(mode) {
    if (currentMode === mode) {
      stopAll();
    } else {
      startMode(mode);
    }
    updateUI();
  }

  function updateUI() {
    if (!modeBtns) return;
    modeBtns.forEach(function (b) {
      var m = b.getAttribute('data-mode');
      b.classList.toggle('is-active', m === currentMode);
    });
    if (panel) {
      panel.classList.toggle('is-open', currentMode !== null);
    }
  }

  function buildUI() {
    panel = document.createElement('div');
    panel.className = 'soundscape-panel';

    modeBtns = [];
    Object.keys(MODES).forEach(function (mode) {
      var b = document.createElement('button');
      b.className = 'soundscape-mode';
      b.setAttribute('data-mode', mode);
      b.textContent = label(mode);
      b.addEventListener('click', function () { toggle(mode); });
      modeBtns.push(b);
      panel.appendChild(b);
    });

    var stopBtn = document.createElement('button');
    stopBtn.className = 'soundscape-stop';
    stopBtn.textContent = isEn() ? 'Stop' : 'Detener';
    stopBtn.addEventListener('click', stopAll);
    panel.appendChild(stopBtn);

    document.body.appendChild(panel);
  }

  function init() {
    btn = document.getElementById('sound-toggle');
    if (!btn) return;

    buildUI();

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.classList.toggle('is-open');
    });

    document.addEventListener('click', function (e) {
      if (panel && !panel.contains(e.target) && e.target !== btn) {
        panel.classList.remove('is-open');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
