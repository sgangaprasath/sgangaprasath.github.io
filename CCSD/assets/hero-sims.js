/* Live line-art simulations for the homepage banner, one per CCSD research
   theme. Each <canvas data-sim="..."> in the page gets its simulation, and
   an element with data-readout in the same tile shows a live quantity.
   Simulations run only while visible on screen, and draw one still frame
   when the visitor prefers reduced motion. */
(function () {
  const C = {
    bg: '#161232',
    ink: 'rgba(245,245,251,0.88)',
    dim: 'rgba(188,194,239,0.30)',
    faint: 'rgba(188,194,239,0.13)',
    gold: '#dcae43',
    goldSoft: 'rgba(220,174,67,0.55)',
    lilac: '#9d7be0',
  };
  const TAU = Math.PI * 2;

  // Small seeded random generator, so every visit starts from the same state.
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) {
    return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(TAU * r());
  }
  function clear(g, w, h) { g.fillStyle = C.bg; g.fillRect(0, 0, w, h); }

  /* ---- Control & estimation: a Kalman filter tracking a drone ---- */
  function kalman() {
    const r = rng(7), sig = 0.045, q = 3, dt = 1 / 60, every = 4;
    // One constant-velocity filter per axis: state [position, velocity]
    function axis(p0) { return { p: p0, v: 0, P: [[0.05, 0], [0, 0.5]] }; }
    const fx = axis(0.5), fy = axis(0.5);
    function predict(a) {
      a.p += a.v * dt;
      const [[a0, a1], [a2, a3]] = a.P;
      const P00 = a0 + dt * (a1 + a2) + dt * dt * a3, P01 = a1 + dt * a3, P10 = a2 + dt * a3, P11 = a3;
      a.P = [[P00 + q * dt ** 4 / 4, P01 + q * dt ** 3 / 2], [P10 + q * dt ** 3 / 2, P11 + q * dt * dt]];
    }
    function update(a, z) {
      const [[P00, P01], [P10, P11]] = a.P, S = P00 + sig * sig, K0 = P00 / S, K1 = P10 / S, e = z - a.p;
      a.p += K0 * e; a.v += K1 * e;
      a.P = [[(1 - K0) * P00, (1 - K0) * P01], [P10 - K1 * P00, P11 - K1 * P01]];
    }
    // The drone flies a figure-eight survey loop, pushed about by gusts
    const truth = t => [0.5 + 0.36 * Math.sin(0.6 * t) + 0.03 * Math.sin(2.3 * t) * Math.cos(1.1 * t),
                        0.5 + 0.26 * Math.sin(1.2 * t) + 0.03 * Math.cos(1.7 * t + 0.5)];
    let t = 0, k = 0, err = 0;
    const path = [], est = [], meas = [];
    return {
      step() {
        t += dt * 1.6; k++;
        predict(fx); predict(fy);
        const [x, y] = truth(t);
        if (k % every === 0) {
          const zx = x + sig * gauss(r), zy = y + sig * gauss(r);
          update(fx, zx); update(fy, zy);
          meas.push([zx, zy]); if (meas.length > 14) meas.shift();
        }
        path.push([x, y]); if (path.length > 420) path.shift();
        est.push([fx.p, fy.p]); if (est.length > 420) est.shift();
        err = 0.97 * err + 0.03 * Math.hypot(fx.p - x, fy.p - y);
      },
      draw(g, w, h) {
        clear(g, w, h);
        const X = u => w * (0.06 + 0.88 * u), Y = v => h * (0.06 + 0.88 * v);
        const line = (pts, style, lw) => {
          g.strokeStyle = style; g.lineWidth = lw; g.beginPath();
          pts.forEach((p, i) => i ? g.lineTo(X(p[0]), Y(p[1])) : g.moveTo(X(p[0]), Y(p[1])));
          g.stroke();
        };
        line(path, C.dim, 1);                      // true path
        meas.forEach((m, i) => {                   // noisy measurements, fading
          g.strokeStyle = `rgba(245,245,251,${0.15 + 0.7 * i / meas.length})`; g.lineWidth = 1;
          const px = X(m[0]), py = Y(m[1]);
          g.beginPath(); g.moveTo(px - 2.5, py); g.lineTo(px + 2.5, py); g.moveTo(px, py - 2.5); g.lineTo(px, py + 2.5); g.stroke();
        });
        line(est, C.goldSoft, 1.3);                // estimate
        if (path.length > 1) {                     // the drone, at its true position
          const [x, y] = path[path.length - 1], [x1, y1] = path[path.length - 2];
          const px = X(x), py = Y(y), hd = Math.atan2(Y(y) - Y(y1), X(x) - X(x1));
          const arm = Math.min(w, h) * 0.06, rot = Math.min(w, h) * 0.028;
          g.strokeStyle = C.ink; g.lineWidth = 1.1;
          for (let k = 0; k < 4; k++) {
            const a = hd + Math.PI / 4 + k * Math.PI / 2, rx = px + arm * Math.cos(a), ry = py + arm * Math.sin(a);
            g.beginPath(); g.moveTo(px, py); g.lineTo(rx, ry); g.stroke();
            g.beginPath(); g.arc(rx, ry, rot, 0, TAU); g.stroke();
            const sp = t * 40 + k;                 // spinning blades
            g.beginPath(); g.moveTo(rx - rot * Math.cos(sp), ry - rot * Math.sin(sp)); g.lineTo(rx + rot * Math.cos(sp), ry + rot * Math.sin(sp)); g.stroke();
          }
          g.fillStyle = C.ink; g.beginPath(); g.arc(px, py, arm * 0.35, 0, TAU); g.fill();
        }
        if (est.length) {                          // 2-sigma uncertainty ellipse
          const [ex, ey] = est[est.length - 1];
          g.strokeStyle = C.gold; g.lineWidth = 1; g.beginPath();
          g.ellipse(X(ex), Y(ey), 0.88 * w * 2 * Math.sqrt(fx.P[0][0]), 0.88 * h * 2 * Math.sqrt(fy.P[0][0]), 0, 0, TAU);
          g.stroke();
          g.fillStyle = C.gold; g.beginPath(); g.arc(X(ex), Y(ey), 2.4, 0, TAU); g.fill();
        }
      },
      readout: () => 'tracking error ' + err.toFixed(3),
    };
  }

  /* ---- Nonlinear dynamics: the Lorenz attractor ---- */
  function lorenz() {
    let x = 1, y = 1, z = 1, a = 0.6;
    const tr = [];
    const f = (x, y, z) => [10 * (y - x), x * (28 - z) - y, x * y - (8 / 3) * z];
    function rk(dt) {
      const k1 = f(x, y, z);
      const k2 = f(x + dt / 2 * k1[0], y + dt / 2 * k1[1], z + dt / 2 * k1[2]);
      const k3 = f(x + dt / 2 * k2[0], y + dt / 2 * k2[1], z + dt / 2 * k2[2]);
      const k4 = f(x + dt * k3[0], y + dt * k3[1], z + dt * k3[2]);
      x += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
      y += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      z += dt / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
    }
    for (let i = 0; i < 400; i++) rk(0.006);
    return {
      step() {
        for (let s = 0; s < 3; s++) { rk(0.006); tr.push([x, y, z]); }
        while (tr.length > 1100) tr.shift();
        a += 0.0025;
      },
      draw(g, w, h) {
        clear(g, w, h);
        const s = Math.min(w, h) / 58, ca = Math.cos(a), sa = Math.sin(a);
        const pr = p => [w / 2 + s * (p[0] * ca - p[1] * sa), h * 0.9 - s * (p[2] - 4)];
        g.lineWidth = 1;
        const n = tr.length, chunk = 40;
        for (let k = 0; k < n - 1; k += chunk) {
          g.strokeStyle = `rgba(188,194,239,${0.06 + 0.6 * (k / n)})`;
          g.beginPath();
          let q = pr(tr[k]); g.moveTo(q[0], q[1]);
          for (let m = k + 1; m <= Math.min(k + chunk, n - 1); m++) { q = pr(tr[m]); g.lineTo(q[0], q[1]); }
          g.stroke();
        }
        if (n) { const q = pr(tr[n - 1]); g.fillStyle = C.gold; g.beginPath(); g.arc(q[0], q[1], 2.6, 0, TAU); g.fill(); }
      },
      readout: () => 'σ 10 · ρ 28 · β 8/3',
    };
  }

  /* ---- Neuroscience: place cells firing as a mouse runs a maze ---- */
  function neurons() {
    // A mouse tours a small maze. Each hippocampal place cell fires (Poisson
    // spikes) when the mouse is near its own spot; spikes flash there, and the
    // raster below, with cells sorted along the route, shows them in sequence.
    const r = rng(19), COLS = 8, ROWS = 4, win = 6;
    const id = (c, k) => k * COLS + c;
    const open = Array.from({ length: COLS * ROWS }, () => new Set());
    // Carve a maze by depth-first search; the full traversal, backtracking
    // included, is a closed tour through every cell that the mouse repeats.
    const tour = [], seen = new Set([0]), stack = [0];
    tour.push(0);
    while (stack.length) {
      const cur = stack[stack.length - 1], c = cur % COLS, k = Math.floor(cur / COLS);
      const nb = [[c + 1, k], [c - 1, k], [c, k + 1], [c, k - 1]]
        .filter(([a, b]) => a >= 0 && a < COLS && b >= 0 && b < ROWS && !seen.has(id(a, b)));
      if (nb.length) {
        const [a, b] = nb[Math.floor(r() * nb.length)], nx = id(a, b);
        open[cur].add(nx); open[nx].add(cur); seen.add(nx); stack.push(nx); tour.push(nx);
      } else {
        stack.pop();
        if (stack.length) tour.push(stack[stack.length - 1]);
      }
    }
    tour.pop(); // the tour ends where it began
    // Place cells: fields spread along the order in which cells are first visited
    const first = [];
    tour.forEach(n => { if (!first.includes(n)) first.push(n); });
    const NC = 16, fields = [];
    for (let j = 0; j < NC; j++) {
      const n = first[Math.floor((j + 0.5) * first.length / NC)];
      fields.push([n % COLS + 0.5 + 0.3 * (r() - 0.5), Math.floor(n / COLS) + 0.5 + 0.3 * (r() - 0.5)]);
    }
    const spikes = [], flash = new Array(NC).fill(0);
    let s = 0, t = 0, mx = 0.5, my = 0.5, hd = 0, active = 0;
    return {
      step() {
        const dt = 1 / 60;
        t += dt; s = (s + 2.2 * dt) % tour.length;
        const a = tour[Math.floor(s)], b = tour[(Math.floor(s) + 1) % tour.length], f = s % 1;
        const e = f * f * (3 - 2 * f); // ease at each cell centre, like a mouse pausing
        const ax = a % COLS + 0.5, ay = Math.floor(a / COLS) + 0.5, bx = b % COLS + 0.5, by = Math.floor(b / COLS) + 0.5;
        const nx = ax + (bx - ax) * e, ny = ay + (by - ay) * e;
        if (Math.hypot(nx - mx, ny - my) > 1e-4) hd = Math.atan2(ny - my, nx - mx);
        mx = nx; my = ny;
        active = 0;
        for (let j = 0; j < NC; j++) {
          const d2 = (mx - fields[j][0]) ** 2 + (my - fields[j][1]) ** 2;
          const rate = 40 * Math.exp(-d2 / (2 * 0.45 * 0.45)) + 0.4; // Hz
          if (rate > 8) active++;
          if (r() < rate * dt) { spikes.push([t, j]); flash[j] = 1; }
          flash[j] *= 0.9;
        }
        while (spikes.length && spikes[0][0] < t - win) spikes.shift();
      },
      draw(g, w, h) {
        clear(g, w, h);
        const x0 = w * 0.06, y0 = h * 0.06, cw = (w * 0.88) / COLS, ch = (h * 0.58) / ROWS;
        const X = u => x0 + u * cw, Y = v => y0 + v * ch;
        // Maze walls
        g.strokeStyle = C.dim; g.lineWidth = 1; g.lineCap = 'square'; g.beginPath();
        g.rect(X(0), Y(0), COLS * cw, ROWS * ch);
        for (let k = 0; k < ROWS; k++) for (let c = 0; c < COLS; c++) {
          const n = id(c, k);
          if (c < COLS - 1 && !open[n].has(id(c + 1, k))) { g.moveTo(X(c + 1), Y(k)); g.lineTo(X(c + 1), Y(k + 1)); }
          if (k < ROWS - 1 && !open[n].has(id(c, k + 1))) { g.moveTo(X(c), Y(k + 1)); g.lineTo(X(c + 1), Y(k + 1)); }
        }
        g.stroke();
        // Place fields light up where their cell fires
        for (let j = 0; j < NC; j++) if (flash[j] > 0.05) {
          g.fillStyle = `rgba(220,174,67,${0.55 * flash[j]})`;
          g.beginPath(); g.arc(X(fields[j][0]), Y(fields[j][1]), Math.min(cw, ch) * (0.25 + 0.2 * (1 - flash[j])), 0, TAU); g.fill();
        }
        // The mouse: body, head and tail along its heading
        const px = X(mx), py = Y(my), sz = Math.min(cw, ch) * 0.2, ch_ = Math.cos(hd), sh = Math.sin(hd);
        g.strokeStyle = C.ink; g.lineWidth = 1; g.beginPath();
        g.moveTo(px - ch_ * sz * 1.3, py - sh * sz * 1.3);
        g.quadraticCurveTo(px - ch_ * sz * 2.4 + sh * sz, py - sh * sz * 2.4 - ch_ * sz, px - ch_ * sz * 3.2, py - sh * sz * 3.2);
        g.stroke();
        g.fillStyle = C.ink; g.beginPath(); g.ellipse(px, py, sz * 1.5, sz * 0.95, hd, 0, TAU); g.fill();
        g.beginPath(); g.arc(px + ch_ * sz * 1.5, py + sh * sz * 1.5, sz * 0.6, 0, TAU); g.fill();
        // Spike raster, cells ordered along the route
        const r0 = h * 0.72, rh = h * 0.24, T = u => w * (0.06 + 0.88 * (u - (t - win)) / win);
        g.fillStyle = C.faint; g.fillRect(w * 0.06, r0 - 4, w * 0.88, 1);
        for (const [u, j] of spikes) {
          g.fillStyle = t - u < 0.4 ? C.gold : C.ink;
          g.fillRect(T(u) - 0.6, r0 + rh * j / NC, 1.2, Math.max(1.5, rh / NC - 1));
        }
      },
      readout: () => 'cells firing ' + active + '/' + NC,
    };
  }

  /* ---- Complexity & optimisation: simulated annealing on a rugged landscape ---- */
  function anneal() {
    const r = rng(23), M = 9;
    const f = x => 0.09 * x * x + 0.32 * Math.sin(4.2 * x + 0.6) + 0.18 * Math.sin(11 * x);
    let ws, t, T;
    function reset() { ws = []; for (let i = 0; i < M; i++) ws.push(-3 + 6 * r()); t = 0; }
    reset();
    return {
      step() {
        t += 1 / 60;
        T = 0.9 * Math.exp(-t / 3.2);
        for (let k = 0; k < 4; k++) {
          for (let i = 0; i < M; i++) {
            const y = Math.max(-3, Math.min(3, ws[i] + 0.35 * gauss(r)));
            const dE = f(y) - f(ws[i]);
            if (dE < 0 || r() < Math.exp(-dE / Math.max(T, 1e-4))) ws[i] = y;
          }
        }
        if (t > 15) reset();
      },
      draw(g, w, h) {
        clear(g, w, h);
        const X = u => w * (0.08 + 0.84 * (u + 3) / 6);
        const Y = v => h * (0.3 + 0.48 * (v + 0.55) / 1.9);
        g.strokeStyle = C.dim; g.lineWidth = 1; g.beginPath();
        for (let k = 0; k <= 200; k++) { const u = -3 + 6 * k / 200; k ? g.lineTo(X(u), Y(f(u))) : g.moveTo(X(u), Y(f(u))); }
        g.stroke();
        // Temperature gauge along the bottom
        g.fillStyle = C.faint; g.fillRect(w * 0.08, h * 0.9, w * 0.84, 2);
        g.fillStyle = C.goldSoft; g.fillRect(w * 0.08, h * 0.9, w * 0.84 * Math.min(1, T / 0.9), 2);
        for (const x of ws) { g.fillStyle = C.gold; g.beginPath(); g.arc(X(x), Y(f(x)) - 3, 3, 0, TAU); g.fill(); }
      },
      readout: () => 'temperature ' + (T || 0).toFixed(2),
    };
  }

  /* ---- Biocomplexity: a flock forming and breaking up (Vicsek model) ---- */
  function flock() {
    const r = rng(5), N = 80, px = [], py = [], ang = [];
    for (let i = 0; i < N; i++) { px.push(r()); py.push(r()); ang.push(r() * TAU); }
    let t = 0, phi = 0;
    return {
      step() {
        // Noise falls and rises over 20 s: order emerges, then dissolves.
        const eta = 0.25 + 2.4 * (0.5 + 0.5 * Math.cos(TAU * t / 20));
        const R2 = 0.09 * 0.09, v = 0.0035, na = new Array(N);
        let sx = 0, sy = 0;
        for (let i = 0; i < N; i++) {
          let cx = 0, cy = 0;
          for (let j = 0; j < N; j++) {
            let dx = px[j] - px[i], dy = py[j] - py[i];
            dx -= Math.round(dx); dy -= Math.round(dy);
            if (dx * dx + dy * dy < R2) { cx += Math.cos(ang[j]); cy += Math.sin(ang[j]); }
          }
          na[i] = Math.atan2(cy, cx) + eta * (r() - 0.5);
        }
        for (let i = 0; i < N; i++) {
          ang[i] = na[i];
          px[i] = (px[i] + v * Math.cos(ang[i]) + 1) % 1;
          py[i] = (py[i] + v * Math.sin(ang[i]) + 1) % 1;
          sx += Math.cos(ang[i]); sy += Math.sin(ang[i]);
        }
        phi = Math.hypot(sx, sy) / N;
        t += 1 / 60;
      },
      draw(g, w, h) {
        clear(g, w, h);
        const L = Math.min(w, h) * 0.035;
        g.lineWidth = 1.3; g.lineCap = 'round';
        for (let i = 0; i < N; i++) {
          const x = px[i] * w, y = py[i] * h, dx = Math.cos(ang[i]) * L, dy = Math.sin(ang[i]) * L;
          g.strokeStyle = C.dim; g.beginPath(); g.moveTo(x - dx, y - dy); g.lineTo(x, y); g.stroke();
          g.fillStyle = C.ink; g.beginPath(); g.arc(x, y, 1.4, 0, TAU); g.fill();
        }
      },
      readout: () => 'alignment φ = ' + phi.toFixed(2),
    };
  }

  /* ---- Scientific ML: a VAE encoder compressing images onto a latent manifold ---- */
  function learn() {
    // A black-and-white image goes in. Convolution and dense layers compress it
    // to a mean mu and spread sigma; a sample z = mu + sigma * eps lands on a
    // two-dimensional latent plane, where images of the same kind sit together.
    const N = 16, T = 6.2, ORDER = [1, 0, 3, 2];          // ring, spiral, wake, cross
    const MU = [[-0.95, 0.70], [0.95, 0.80], [-0.85, -0.85], [1.0, -0.75]];
    const SD = [[0.34, 0.19], [0.30, 0.21], [0.36, 0.19], [0.30, 0.21]];
    const ROT = [0.6, -0.5, -0.3, 0.9];
    const r = rng(31);
    const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
    const sm = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
    const mix = (a, b, t) => a + (b - a) * t;
    const hash = (a, b) => { const v = Math.sin((a + 1) * 12.9898 + (b + 1) * 78.233) * 43758.5453; return v - Math.floor(v); };

    function sample(k) {
      const a = gauss(r) * SD[k][0], b = gauss(r) * SD[k][1], c = Math.cos(ROT[k]), s = Math.sin(ROT[k]);
      return [clamp(MU[k][0] + a * c - b * s, -2.15, 2.15), clamp(MU[k][1] + a * s + b * c, -2.15, 2.15)];
    }
    const cloud = MU.map((_, k) => Array.from({ length: 36 }, () => sample(k)));

    // Input images: a ring, a spiral (vortex), a vortex street and a cross
    function image(k) {
      const jx = (r() - 0.5) * 0.24, jy = (r() - 0.5) * 0.24, rot = (r() - 0.5) * 0.6, sc = 0.92 + r() * 0.22;
      const co = Math.cos(rot), si = Math.sin(rot), g = new Uint8Array(N * N);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const x = ((i + 0.5) / N * 2 - 1 - jx) / sc, y = ((j + 0.5) / N * 2 - 1 - jy) / sc;
        const xr = co * x + si * y, yr = -si * x + co * y, rr = Math.hypot(xr, yr), th = Math.atan2(yr, xr);
        let on = false;
        if (k === 0) on = Math.abs(rr - 0.62) < 0.15;
        else if (k === 1) { const u = rr / 0.31 - th / TAU; on = rr < 0.92 && rr > 0.1 && (u - Math.floor(u)) < 0.45; }
        else if (k === 2) {
          for (let m = 0; m < 5; m++) { const dx = xr - (-0.8 + m * 0.4), dy = yr - (m % 2 ? 0.34 : -0.34); if (dx * dx + dy * dy < 0.03) { on = true; break; } }
        } else on = (Math.abs(xr) < 0.14 && Math.abs(yr) < 0.86) || (Math.abs(yr) < 0.14 && Math.abs(xr) < 0.86);
        if (r() < 0.01) on = !on;                          // a little pixel noise
        g[j * N + i] = on ? 1 : 0;
      }
      return g;
    }
    const pool = (a, n) => {
      const m = n / 2, o = new Float32Array(m * m);
      for (let j = 0; j < m; j++) for (let i = 0; i < m; i++)
        o[j * m + i] = (a[2 * j * n + 2 * i] + a[2 * j * n + 2 * i + 1] + a[(2 * j + 1) * n + 2 * i] + a[(2 * j + 1) * n + 2 * i + 1]) / 4;
      return o;
    };

    let cycle = -1, t = 0, cur = null;
    function next() {
      cycle++;
      const k = ORDER[cycle % 4], img = image(k), f1 = pool(img, N), f2 = pool(f1, N / 2);
      const mu = sample(k), s = [0.16 + 0.06 * r(), 0.16 + 0.06 * r()];
      const z = [mu[0] + s[0] * gauss(r), mu[1] + s[1] * gauss(r)];
      const act = n => Array.from({ length: n }, (_, i) => clamp(0.25 + 0.75 * hash(k + 3 * n, i) + (r() - 0.5) * 0.2, 0, 1));
      cur = { k, img, f1, f2, mu, s, z, dense: act(6), ms: act(4) };
    }
    next();

    return {
      step() { t += 1 / 60; if (t >= T) { t = 0; next(); } },
      draw(g, w, h) {
        clear(g, w, h);
        const fo = clamp((T - t) / 0.5, 0, 1);               // fade at the end of each cycle
        const pk = c => 0.45 + 0.3 * c;                      // when the wave reaches stage c
        const on = c => sm((t - pk(c) + 0.15) / 0.25) * fo;
        const pulse = c => Math.exp(-Math.pow((t - pk(c)) / 0.2, 2));
        const cyE = 0.32 * h, s = 0.25 * w, ix = 0.04 * w, iy = cyE - s / 2;

        // Encoder funnel
        const x0 = 0.30 * w, x1 = 0.85 * w, hs = s / 2 + 7, he = 0.11 * h;
        g.strokeStyle = C.faint; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x0, cyE - hs); g.lineTo(x1, cyE - he); g.lineTo(x1, cyE + he); g.lineTo(x0, cyE + hs); g.closePath(); g.stroke();

        // Input image (black and white)
        g.globalAlpha = sm(t / 0.3) * fo;
        g.fillStyle = '#06050f'; g.fillRect(ix, iy, s, s);
        g.fillStyle = C.ink; const p = s / N;
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) if (cur.img[j * N + i]) g.fillRect(ix + i * p, iy + j * p, p + 0.4, p + 0.4);
        g.globalAlpha = 1;
        g.strokeStyle = C.dim; g.strokeRect(ix, iy, s, s);

        // Convolution stages: stacked feature maps, pooled from the image
        const slab = (cx, side, n, map, a) => {
          const x = cx - side / 2, y = cyE - side / 2, q = side / n;
          g.strokeStyle = C.dim; g.fillStyle = C.bg;
          [2, 1].forEach(o => { g.fillRect(x + o * 4, y - o * 4, side, side); g.strokeRect(x + o * 4, y - o * 4, side, side); });
          g.fillRect(x, y, side, side);
          for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
            g.fillStyle = 'rgba(245,245,251,' + (a * 0.85 * Math.sqrt(map[j * n + i])).toFixed(3) + ')';
            g.fillRect(x + i * q, y + j * q, q + 0.3, q + 0.3);
          }
          g.strokeStyle = 'rgba(188,194,239,' + (0.3 + 0.5 * a).toFixed(3) + ')'; g.strokeRect(x, y, side, side);
        };
        const c1x = 0.39 * w, s1 = 0.12 * w, c2x = 0.545 * w, s2 = 0.085 * w;

        // Wires between stages, brightened as the signal passes
        const wire = (ax, ay, bx, by, a) => { g.strokeStyle = 'rgba(188,194,239,' + a.toFixed(3) + ')'; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke(); };
        const gap = 0.062 * h, gd = 0.048 * h, dx = 0.65 * w, mx = 0.73 * w, zx = 0.82 * w;
        const dN = cur.dense.map((_, i) => [dx, cyE + (i - 2.5) * gd]);
        const mN = cur.ms.map((_, i) => [mx, cyE + (i - 1.5) * gap]);
        const zN = [[zx, cyE - 0.5 * gap], [zx, cyE + 0.5 * gap]];
        g.lineWidth = 1;
        wire(ix + s, iy, c1x - s1 / 2, cyE - s1 / 2, 0.1 + 0.5 * pulse(0.5));
        wire(ix + s, iy + s, c1x - s1 / 2, cyE + s1 / 2, 0.1 + 0.5 * pulse(0.5));
        wire(c1x + s1 / 2 + 8, cyE - s1 / 2 - 8, c2x - s2 / 2, cyE - s2 / 2, 0.1 + 0.5 * pulse(1.5));
        wire(c1x + s1 / 2, cyE + s1 / 2, c2x - s2 / 2, cyE + s2 / 2, 0.1 + 0.5 * pulse(1.5));
        dN.forEach(d => wire(c2x + s2 / 2 + 8, cyE, d[0], d[1], 0.07 + 0.12 * on(3) + 0.5 * pulse(2.5)));
        dN.forEach(d => mN.forEach(m => wire(d[0], d[1], m[0], m[1], 0.05 + 0.08 * on(4) + 0.4 * pulse(3.5))));
        [[0, 0], [2, 0], [1, 1], [3, 1]].forEach(([m, z]) => wire(mN[m][0], mN[m][1], zN[z][0], zN[z][1], 0.08 + 0.12 * on(5) + 0.5 * pulse(4.5)));

        slab(c1x, s1, N / 2, cur.f1, on(1)); slab(c2x, s2, N / 4, cur.f2, on(2));

        // Dense layer, mean and spread, and the sampled z
        const node = (pt, col, a, rad) => {
          g.fillStyle = 'rgba(' + col + ',' + clamp(a, 0, 1).toFixed(3) + ')';
          g.beginPath(); g.arc(pt[0], pt[1], rad, 0, TAU); g.fill();
          g.strokeStyle = C.dim; g.beginPath(); g.arc(pt[0], pt[1], rad, 0, TAU); g.stroke();
        };
        const rad = Math.max(2.2, 0.014 * w);
        dN.forEach((d, i) => node(d, '245,245,251', cur.dense[i] * on(3), rad));
        mN.forEach((m, i) => node(m, i < 2 ? '220,174,67' : '157,123,224', cur.ms[i] * on(4), rad));
        zN.forEach(z => node(z, '220,174,67', on(5), rad * 1.2));

        // Latent manifold
        const ps = Math.min(0.30 * w, 0.30 * h), pcx = zx, pcy = 0.64 * h + ps / 2, px = pcx - ps / 2, py = pcy - ps / 2, sc = ps / 2 / 2.4;
        const P = z => [pcx + z[0] * sc, pcy - z[1] * sc];
        g.strokeStyle = C.dim; g.strokeRect(px, py, ps, ps);
        g.strokeStyle = C.faint;
        g.beginPath(); g.moveTo(pcx, py); g.lineTo(pcx, py + ps); g.moveTo(px, pcy); g.lineTo(px + ps, pcy); g.stroke();
        g.setLineDash([2, 3]);
        [1, 2].forEach(u => { g.beginPath(); g.arc(pcx, pcy, u * sc, 0, TAU); g.stroke(); });
        g.setLineDash([]);
        g.fillStyle = C.dim;
        cloud.forEach(c => c.forEach(z => { const q = P(z); g.beginPath(); g.arc(q[0], q[1], 0.9, 0, TAU); g.fill(); }));
        const ga = 0.8 * sm((t - 2.4) / 0.4) * fo;
        g.fillStyle = 'rgba(220,174,67,' + ga.toFixed(3) + ')';
        cloud[cur.k].forEach(z => { const q = P(z); g.beginPath(); g.arc(q[0], q[1], 1.1, 0, TAU); g.fill(); });

        // Sample flies from z to its place on the manifold
        const zp = P(cur.z), mp = P(cur.mu), u = sm((t - 2.0) / 0.5), landed = t > 2.5;
        if (u > 0) {
          g.strokeStyle = 'rgba(220,174,67,' + (0.5 * fo).toFixed(3) + ')'; g.setLineDash([2, 3]);
          g.beginPath(); g.moveTo(zx, cyE + 0.5 * gap + rad); g.lineTo(zp[0], zp[1]); g.stroke(); g.setLineDash([]);
        }
        if (u > 0 && !landed) {
          g.fillStyle = C.ink; g.beginPath(); g.arc(mix(zx, zp[0], u), mix(cyE + 0.5 * gap, zp[1], u), 1.8, 0, TAU); g.fill();
        }
        if (landed) {
          const a = sm((t - 2.5) / 0.2) * fo, v = clamp((t - 2.5) / 0.9, 0, 1);
          g.strokeStyle = 'rgba(157,123,224,' + a.toFixed(3) + ')'; g.setLineDash([2, 2]);
          g.beginPath(); g.ellipse(mp[0], mp[1], cur.s[0] * sc, cur.s[1] * sc, 0, 0, TAU); g.stroke(); g.setLineDash([]);
          g.strokeStyle = 'rgba(220,174,67,' + (0.8 * (1 - v) * fo).toFixed(3) + ')';
          g.beginPath(); g.arc(zp[0], zp[1], 2.5 + 7 * v, 0, TAU); g.stroke();
          g.globalAlpha = a; g.fillStyle = C.ink; g.beginPath(); g.arc(zp[0], zp[1], 2.1, 0, TAU); g.fill();
          g.strokeStyle = C.gold; g.beginPath(); g.arc(zp[0], zp[1], 2.1, 0, TAU); g.stroke(); g.globalAlpha = 1;
        }
      },
      readout: () => t > 2.5 ? 'z = (' + cur.z[0].toFixed(2) + ', ' + cur.z[1].toFixed(2) + ')' : 'encoding…',
    };
  }

  const makers = { kalman, lorenz, neurons, anneal, flock, learn };
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tiles = [];

  document.querySelectorAll('canvas[data-sim]').forEach(cv => {
    const make = makers[cv.dataset.sim];
    if (!make) return;
    const sim = make(), g = cv.getContext('2d');
    const out = cv.closest('figure') && cv.closest('figure').querySelector('[data-readout]');
    const tile = { cv, g, sim, out, w: 0, h: 0, visible: false };
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), b = cv.getBoundingClientRect();
      tile.w = b.width; tile.h = b.height;
      cv.width = Math.round(b.width * dpr); cv.height = Math.round(b.height * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      sim.draw(g, tile.w, tile.h);
    }
    new ResizeObserver(size).observe(cv);
    if (reduce) {
      // One still frame from a settled state, no animation
      for (let k = 0; k < 600; k++) sim.step();
    }
    tiles.push(tile);
  });
  if (!tiles.length) return;

  function paintAll() {
    tiles.forEach(t => { if (t.w) { t.sim.draw(t.g, t.w, t.h); if (t.out) t.out.textContent = t.sim.readout(); } });
  }
  if (reduce) { requestAnimationFrame(paintAll); return; }

  const io = new IntersectionObserver(es => es.forEach(e => {
    const t = tiles.find(x => x.cv === e.target);
    if (t) t.visible = e.isIntersecting;
  }));
  tiles.forEach(t => io.observe(t.cv));

  let frame = 0, last = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    if (document.hidden || now - last < 15) return; // about 60 fps at most
    last = now; frame++;
    for (const t of tiles) {
      if (!t.visible || !t.w) continue;
      t.sim.step();
      t.sim.draw(t.g, t.w, t.h);
      if (t.out && frame % 8 === 0) t.out.textContent = t.sim.readout();
    }
  }
  requestAnimationFrame(loop);
})();
