// Screen artwork painted onto the 3D devices' canvas textures.
// Ported from the Lesson360 landing design; coordinates are in texture pixels.

export const PHONE_COLORS = ['#FF4A00', '#5B7BEA', '#3FB57A', '#8A63E0', '#F5B935', '#6FAF2E', '#2FAFAA', '#EC6FA0', '#FF8A3D'];
export const SW = 600;
export const SH = 1316;

const INK = '#17153A', CREAM = '#FFF8EC', GREY = '#5A5778';
// Canvas `font` strings can't read CSS variables, so the page passes in the
// concrete family names next/font generated (see setScreenFonts).
let FD = '"Bricolage Grotesque", sans-serif';
let FS = '"DM Sans", sans-serif';
let FM = '"JetBrains Mono", monospace';

export function setScreenFonts(fonts: { display: string; body: string; mono: string }) {
  FD = `${fonts.display}, sans-serif`;
  FS = `${fonts.body}, sans-serif`;
  FM = `${fonts.mono}, monospace`;
}

/** Font strings the screens use; callers wait for these to load before painting. */
export function screenFontSamples() {
  return [`800 60px ${FD}`, `700 30px ${FD}`, `500 26px ${FS}`, `700 26px ${FS}`, `700 22px ${FM}`];
}

type Paint = string | null | undefined;
type Label = string | number | boolean;

function kit(ctx: CanvasRenderingContext2D) {
  const rr = (x: number, y: number, w: number, h: number, r: number, fill?: Paint, stroke?: Paint, lw?: number) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 3; ctx.stroke(); } };
  const tx = (s: Label, x: number, y: number, font: string, color: string, align?: CanvasTextAlign) => { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align || 'left'; ctx.fillText(String(s), x, y); };
  const wrap = (s: string, x: number, y: number, mw: number, lh: number, font: string, color: string) => { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'left'; let line = '', yy = y; for (const w of s.split(' ')) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > mw && line) { ctx.fillText(line, x, yy); line = w; yy += lh; } else line = t; } ctx.fillText(line, x, yy); return yy; };
  const circ = (x: number, y: number, r: number, fill?: Paint, stroke?: Paint, lw?: number) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 4; ctx.stroke(); } };
  const check = (x: number, y: number, s: number, color: string) => { ctx.beginPath(); ctx.moveTo(x - s * .5, y); ctx.lineTo(x - s * .12, y + s * .38); ctx.lineTo(x + s * .55, y - s * .4); ctx.strokeStyle = color; ctx.lineWidth = s * .2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); };
  const play = (x: number, y: number, s: number, color: string) => { ctx.beginPath(); ctx.moveTo(x - s * .4, y - s * .55); ctx.lineTo(x + s * .6, y); ctx.lineTo(x - s * .4, y + s * .55); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); };
  const status = (color: string) => { tx('9:41', 56, 62, `700 26px ${FS}`, color); rr(486, 42, 54, 26, 8, null, color, 3); rr(491, 47, 38, 16, 4, color); };
  const button = (label: string, y: number, fill: string, color: string) => { rr(40, y, 520, 100, 50, fill); tx(label, 300, y + 63, `700 32px ${FS}`, color, 'center'); };
  const star = (cx: number, cy: number, R: number, fill: string) => { ctx.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? R * .45 : R; const a = -Math.PI / 2 + k * Math.PI / 5; ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
  const pill = (label: string, x: number, y: number, w: number, h: number, fill: string, color: string, size?: number) => { rr(x, y, w, h, h / 2, fill); tx(label, x + w / 2, y + h / 2 + (size || 26) * 0.36, `700 ${size || 26}px ${FS}`, color, 'center'); };
  return { rr, tx, wrap, circ, check, play, status, button, star, pill };
}

export function drawScreen(i: number, ctx: CanvasRenderingContext2D) {
  const W = SW, H = SH;
  const { rr, tx, wrap, circ, check, status, button, star, pill } = kit(ctx);
  const c = PHONE_COLORS[i];

  if (i === 0) {
    // App dashboard — quiz card + feature tiles
    ctx.fillStyle = CREAM; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = c; ctx.fillRect(0, 0, W, 520);
    status(INK);
    tx('WELCOME BACK', 48, 168, `700 22px ${FM}`, INK);
    wrap('Ready to learn today, Tobi?', 48, 240, 500, 66, `800 60px ${FD}`, INK);
    rr(36, 380, 528, 300, 34, INK);
    tx('TAKE QUIZ', 76, 440, `700 22px ${FM}`, c);
    wrap('Test what you have learned with 10 fun questions!', 76, 486, 440, 38, `700 30px ${FD}`, CREAM);
    pill('Start Quiz', 76, 590, 220, 60, c, INK, 26);
    const tiles = [['Performance Assessment', 'Monitor your progress', '#3FB57A'], ['Enrichment Courses', 'Master new subjects', '#5B7BEA'], ['Live Videos', 'Real-time learning', '#8A63E0']];
    tiles.forEach(([t, s, col], k) => {
      const y = 712 + k * 140;
      rr(36, y, 528, 120, 30, '#FFFFFF');
      circ(100, y + 60, 32, col);
      tx(t, 152, y + 54, `700 29px ${FD}`, INK);
      tx(s, 152, y + 92, `500 24px ${FS}`, GREY);
    });
    button('View All', 1150, INK, CREAM);
  }
  if (i === 1) {
    // Pre-school worksheet — counting activity
    ctx.fillStyle = '#EEF2FF'; ctx.fillRect(0, 0, W, H);
    status(INK);
    tx('PRE-SCHOOL · WORKSHEET', 48, 168, `700 22px ${FM}`, '#3A55C2');
    wrap('How many apples can you count?', 48, 240, 500, 64, `800 56px ${FD}`, INK);
    rr(36, 390, 528, 360, 36, '#FFFFFF');
    const ap = [[140, 490], [260, 480], [380, 495], [470, 560], [200, 610], [320, 630], [430, 680]];
    ap.forEach(([x, y]) => {
      circ(x, y, 46, '#F2765A');
      circ(x - 14, y - 14, 12, 'rgba(255,255,255,.45)');
      rr(x - 4, y - 64, 8, 22, 4, '#6B4A2B');
      ctx.beginPath(); ctx.ellipse(x + 18, y - 56, 18, 9, -0.5, 0, Math.PI * 2); ctx.fillStyle = '#3FB57A'; ctx.fill();
    });
    ['5', '7', '9'].forEach((n, k) => {
      const x = 36 + k * 184, sel = k === 1;
      rr(x, 790, 160, 160, 34, sel ? c : '#FFFFFF', sel ? null : '#D9DFF5', 3);
      tx(n, x + 80, 900, `800 84px ${FD}`, sel ? CREAM : INK, 'center');
      if (sel) { circ(x + 136, 814, 24, CREAM); check(x + 136, 814, 22, INK); }
    });
    tx('Activity 3 of 8', 48, 1028, `600 26px ${FS}`, GREY);
    rr(48, 1050, 504, 14, 7, '#D9DFF5'); rr(48, 1050, 504 * 3 / 8, 14, 7, c);
    button('Next activity', 1150, INK, CREAM);
  }
  if (i === 2) {
    // Guardian reviews
    ctx.fillStyle = CREAM; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = c; ctx.fillRect(0, 0, W, 500);
    status(INK);
    tx('GUARDIAN REVIEWS', 48, 168, `700 22px ${FM}`, INK);
    wrap('What guardians are saying', 48, 240, 500, 66, `800 60px ${FD}`, INK);
    for (let k = 0; k < 5; k++) star(100 + k * 100, 420, 40, INK);
    rr(36, 540, 528, 300, 32, '#FFFFFF');
    wrap('“My daughter asks to do her quizzes now. Screen time finally feels like learning time.”', 70, 610, 460, 44, `500 31px ${FS}`, INK);
    circ(96, 790, 28, '#F5B935'); tx('Micheal Adewale · Guardian', 140, 800, `700 26px ${FS}`, INK);
    rr(36, 870, 528, 240, 32, '#FFFFFF');
    wrap('“Progress reports show me where my son needs help.”', 70, 940, 460, 44, `500 31px ${FS}`, INK);
    circ(96, 1062, 28, '#EC6FA0'); tx('Anabelle Joseph · Guardian', 140, 1072, `700 26px ${FS}`, INK);
    button('View All', 1150, INK, CREAM);
  }
  if (i === 3) {
    // Affiliate earnings
    ctx.fillStyle = '#221E4F'; ctx.fillRect(0, 0, W, H);
    status(CREAM);
    tx('AFFILIATE PROGRAM', 48, 168, `700 22px ${FM}`, '#CDB8FF');
    tx('Total earnings', 48, 236, `500 28px ${FS}`, '#CFCBE8');
    tx('₦48,500', 44, 350, `800 112px ${FD}`, CREAM);
    rr(36, 410, 528, 250, 36, c);
    tx('YOUR REFERRAL LINK', 72, 470, `700 22px ${FM}`, CREAM);
    rr(72, 500, 456, 80, 24, 'rgba(23,21,58,.35)');
    tx('lesson360.org/r/tobi', 100, 552, `600 28px ${FS}`, CREAM);
    tx('Share education. Earn rewards.', 72, 630, `500 25px ${FS}`, CREAM);
    [['Referrals', '23', '#F5B935'], ['This month', '₦12k', '#3FB57A']].forEach(([t, v, col], k) => {
      const x = 36 + k * 274;
      rr(x, 690, 254, 210, 32, '#34306B');
      circ(x + 52, 746, 22, col);
      tx(v, x + 32, 838, `800 64px ${FD}`, CREAM);
      tx(t, x + 32, 878, `500 24px ${FS}`, '#CFCBE8');
    });
    const hs = [.3, .45, .4, .62, .55, .78, .92];
    hs.forEach((h, k) => { const bh = 150 * h; rr(48 + k * 74, 1100 - bh, 56, bh, 12, k > 4 ? c : '#3A3570'); });
    button('Start Earning', 1150, CREAM, INK);
  }
  if (i === 4) {
    // Video lesson player
    ctx.fillStyle = CREAM; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = INK; ctx.fillRect(0, 0, W, 580);
    status(CREAM);
    rr(36, 110, 528, 380, 30, '#2A2760');
    circ(300, 300, 74, c);
    ctx.beginPath(); ctx.moveTo(280, 262); ctx.lineTo(332, 300); ctx.lineTo(280, 338); ctx.closePath(); ctx.fillStyle = INK; ctx.fill();
    rr(48, 528, 504, 10, 5, 'rgba(255,248,236,.25)'); rr(48, 528, 312, 10, 5, c); circ(360, 533, 14, CREAM);
    tx('VIDEOS · PRIMARY 5', 48, 650, `700 22px ${FM}`, '#8A6200');
    tx('Fractions made easy', 48, 718, `800 52px ${FD}`, INK);
    tx('Lesson 2 of 12 · 12 min', 48, 770, `500 26px ${FS}`, GREY);
    const items = [['Halves and quarters', 2], ['Adding fractions', 1], ['Equivalent fractions', 0], ['Word problems', 0]];
    items.forEach(([t, st], k) => {
      const y = 820 + k * 118;
      rr(36, y, 528, 100, 26, st === 1 ? '#FCEBC0' : '#FFFFFF');
      if (st === 2) { circ(90, y + 50, 24, c); check(90, y + 50, 22, INK); }
      else if (st === 1) { circ(90, y + 50, 24, INK); ctx.beginPath(); ctx.moveTo(82, y + 38); ctx.lineTo(102, y + 50); ctx.lineTo(82, y + 62); ctx.closePath(); ctx.fillStyle = CREAM; ctx.fill(); }
      else circ(90, y + 50, 22, null, '#D6D2E4', 5);
      tx(t, 134, y + 60, `${st === 1 ? 700 : 500} 28px ${FS}`, INK);
    });
  }
  if (i === 5) {
    // Digital library — search, book shelf, continue reading
    ctx.fillStyle = CREAM; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = c; ctx.fillRect(0, 0, W, 430);
    status(INK);
    tx('DIGITAL LIBRARY', 48, 168, `700 22px ${FM}`, INK);
    wrap('Read, learn and download', 48, 240, 500, 64, `800 56px ${FD}`, INK);
    rr(36, 330, 528, 76, 38, CREAM);
    circ(84, 368, 14, null, GREY, 4);
    ctx.beginPath(); ctx.moveTo(94, 378); ctx.lineTo(106, 390); ctx.strokeStyle = GREY; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
    tx('Search books, notes, worksheets', 124, 378, `500 25px ${FS}`, GREY);
    // book shelf
    const books: [string, string, string][] = [['Basic Science', 'PRIMARY 4', '#5B7BEA'], ['English Grammar', 'JSS 1', '#EC6FA0'], ['Fun with Maths', 'PRIMARY 2', '#F5B935']];
    books.forEach(([t, lvl, col], k) => {
      const x = 36 + k * 180;
      rr(x, 450, 168, 230, 22, col);
      rr(x, 450, 22, 230, 0, 'rgba(23,21,58,.14)');
      tx(lvl, x + 38, 492, `700 17px ${FM}`, INK);
      wrap(t, x + 36, 596, 118, 30, `800 25px ${FD}`, INK);
    });
    tx('Continue reading', 48, 748, `800 34px ${FD}`, INK);
    const reading: [string, string, number, string][] = [['Basic Science · Ch. 3', 'Living things', 0.62, '#5B7BEA'], ['English · Notes', 'Parts of speech', 0.35, '#EC6FA0']];
    reading.forEach(([t, s, p, col], k) => {
      const y = 780 + k * 170;
      rr(36, y, 528, 150, 30, '#FFFFFF');
      rr(64, y + 26, 70, 98, 12, col);
      tx(t, 160, y + 58, `700 27px ${FS}`, INK);
      tx(s, 160, y + 94, `500 23px ${FS}`, GREY);
      rr(160, y + 116, 300, 10, 5, '#E7E3D6'); rr(160, y + 116, 300 * p, 10, 5, c);
      tx(`${Math.round(p * 100)}%`, 532, y + 126, `700 22px ${FS}`, INK, 'right');
    });
    button('Open library', 1150, INK, CREAM);
  }
  if (i === 6) {
    // Maths quiz question
    ctx.fillStyle = '#E6F6F5'; ctx.fillRect(0, 0, W, H);
    status(INK);
    tx('MATHEMATICS QUIZ · 3 / 10', 48, 168, `700 22px ${FM}`, '#13807B');
    for (let k = 0; k < 10; k++) rr(48 + k * 51, 192, 42, 10, 5, k < 3 ? c : '#C5E6E4');
    wrap('What is 7 × 8?', 48, 300, 504, 66, `800 64px ${FD}`, INK);
    const opts = ['54', '56', '64', '48'];
    opts.forEach((t, k) => {
      const y = 400 + k * 124; const ok = k === 1;
      rr(36, y, 528, 104, 30, ok ? c : '#FFFFFF');
      circ(92, y + 52, 26, ok ? INK : '#E6F6F5'); tx('ABCD'[k], 92, y + 62, `700 26px ${FS}`, ok ? CREAM : INK, 'center');
      tx(t, 138, y + 63, `${ok ? 700 : 500} 32px ${FS}`, INK);
      if (ok) { circ(510, y + 52, 26, INK); check(510, y + 52, 24, CREAM); }
    });
    rr(36, 920, 528, 210, 32, '#FFFFFF');
    tx('WHY', 70, 976, `700 22px ${FM}`, '#13807B');
    wrap('7 groups of 8 make 56. Great work — keep going!', 70, 1026, 460, 40, `500 30px ${FS}`, INK);
    rr(36, 1160, 528, 90, 45, INK); tx('+10 reward points', 300, 1216, `700 28px ${FS}`, CREAM, 'center');
  }
  if (i === 7) {
    // Exams — subject list
    ctx.fillStyle = '#FFF0F5'; ctx.fillRect(0, 0, W, H);
    status(INK);
    tx('EXAMS', 48, 168, `700 22px ${FM}`, '#B83A6E');
    wrap('Explore varieties of subjects', 48, 240, 500, 62, `800 56px ${FD}`, INK);
    const subs = [['Mathematics', 'Algebra, geometry & more', '#F2765A'], ['Physics', 'Motion, energy & more', '#5B7BEA'], ['Chemistry', 'Atoms, reactions & more', '#3FB57A']];
    subs.forEach(([t, s, col], k) => {
      const y = 380 + k * 240;
      rr(36, y, 528, 216, 32, '#FFFFFF');
      circ(96, y + 64, 30, col);
      tx(t, 146, y + 76, `800 38px ${FD}`, INK);
      tx(s, 70, y + 134, `500 25px ${FS}`, GREY);
      tx('24 PRACTICE QUESTIONS', 70, y + 182, `700 20px ${FM}`, '#B83A6E');
      pill('Start', 418, y + 146, 120, 54, c, INK, 24);
    });
    button('Test your knowledge', 1150, INK, CREAM);
  }
  if (i === 8) {
    // Learning level picker
    ctx.fillStyle = CREAM; ctx.fillRect(0, 0, W, H);
    status(INK);
    tx('SELECT LEVEL', 48, 168, `700 22px ${FM}`, '#C2541A');
    wrap('Support for every learning level', 48, 240, 500, 62, `800 56px ${FD}`, INK);
    const opts = [['Early Years', 'Play-based foundations', false], ['Nursery', 'Pre-school topics', false], ['Primary', 'Core subjects', true], ['Secondary', 'Exam practice', false]];
    opts.forEach(([t, s, sel], k) => {
      const y = 380 + k * 178;
      rr(36, y, 528, 158, 34, sel ? c : '#FFFFFF', sel ? null : '#EADFD3', 3);
      tx(t, 76, y + 74, `800 44px ${FD}`, INK);
      tx(s, 76, y + 118, `${sel ? 600 : 500} 25px ${FS}`, sel ? INK : GREY);
      if (sel) { circ(492, y + 79, 32, CREAM); check(492, y + 79, 30, INK); } else circ(492, y + 79, 30, null, '#E2D6C8', 5);
    });
    button('Continue', 1150, INK, CREAM);
  }
}

export function drawTablet(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const { rr, tx, circ, check } = kit(ctx);
  const c = '#5B7BEA';
  ctx.fillStyle = '#EEF2FF'; ctx.fillRect(0, 0, W, H);
  tx('9:41', 60, 64, `700 30px ${FS}`, INK);
  rr(800, 40, 100, 32, 10, null, INK, 3); rr(806, 46, 74, 20, 5, INK);
  rr(48, 110, 864, 232, 40, c);
  tx('PRE-SCHOOL · WORKSHEET 3', 92, 172, `700 26px ${FM}`, CREAM);
  tx('How many apples', 92, 244, `800 58px ${FD}`, CREAM);
  tx('can you count?', 92, 308, `800 58px ${FD}`, 'rgba(255,248,236,.75)');
  rr(48, 370, 864, 470, 44, '#FFFFFF');
  const ap = [[190, 510], [350, 490], [520, 510], [690, 495], [270, 700], [440, 720], [610, 700], [770, 740]].slice(0, 7);
  ap.forEach(([x, y]) => {
    circ(x, y, 66, '#F2765A');
    circ(x - 20, y - 20, 17, 'rgba(255,255,255,.45)');
    rr(x - 6, y - 92, 12, 32, 6, '#6B4A2B');
    ctx.beginPath(); ctx.ellipse(x + 26, y - 80, 26, 13, -0.5, 0, Math.PI * 2); ctx.fillStyle = '#3FB57A'; ctx.fill();
  });
  ['5', '6', '7', '8'].forEach((n, k) => {
    const x = 48 + k * 222, sel = k === 2;
    rr(x, 878, 198, 198, 40, sel ? c : '#FFFFFF', sel ? null : '#D9DFF5', 4);
    tx(n, x + 99, 1013, `800 110px ${FD}`, sel ? CREAM : INK, 'center');
    if (sel) { circ(x + 166, 910, 30, CREAM); check(x + 166, 910, 28, INK); }
  });
  tx('Great job! That’s 7 apples.', 48, 1136, `700 34px ${FS}`, INK);
  tx('Activity 3 of 8', 48, 1182, `500 28px ${FS}`, GREY);
  rr(48, 1206, 864, 18, 9, '#D9DFF5'); rr(48, 1206, 864 * 3 / 8, 18, 9, c);
  rr(380, 1250, 200, 10, 5, 'rgba(23,21,58,.25)');
}

export function drawKeys(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const { rr } = kit(ctx);
  ctx.fillStyle = '#1b1930'; ctx.fillRect(0, 0, W, H);
  const rows = 5, cols = 14, g = 8, kw = (W - g * (cols + 1)) / cols, kh = (H - g * (rows + 1)) / rows;
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    if (r === 4 && k > 3 && k < 10) { if (k === 4) rr(g + k * (kw + g), g + r * (kh + g), kw * 6 + g * 5, kh, 8, '#2c2948'); continue; }
    rr(g + k * (kw + g), g + r * (kh + g), kw, kh, 8, '#2c2948');
  }
}

export function drawLaptop(kind: 'video' | 'exam', ctx: CanvasRenderingContext2D, W: number, H: number) {
  const { rr, tx, circ, check, play } = kit(ctx);
  if (kind === 'video') {
    const c = '#F5B935';
    ctx.fillStyle = '#FFF8EC'; ctx.fillRect(0, 0, W, H);
    rr(0, 0, 230, H, 0, INK);
    tx('Lesson360', 36, 70, `800 32px ${FD}`, '#FF8A3D');
    ['Home', 'Videos', 'Quizzes', 'Exams', 'Progress'].forEach((t, k) => {
      const y = 130 + k * 64, on = k === 1;
      if (on) rr(20, y - 38, 190, 54, 16, c);
      tx(t, 40, y, `${on ? 700 : 500} 24px ${FS}`, on ? INK : '#CFCBE8');
    });
    tx('VIDEOS · PRIMARY 5 · MATHS', 270, 64, `700 18px ${FM}`, '#8A6200');
    rr(270, 90, 640, 360, 24, '#2A2760');
    circ(590, 270, 56, c); play(594, 270, 40, INK);
    rr(298, 410, 584, 8, 4, 'rgba(255,248,236,.25)'); rr(298, 410, 360, 8, 4, c); circ(658, 414, 11, CREAM);
    tx('Fractions made easy', 270, 512, `800 40px ${FD}`, INK);
    tx('Lesson 2 of 12 · 12 min · Interactive video', 270, 552, `500 22px ${FS}`, GREY);
    [['Notes', '#FFFFFF'], ['Quiz after video', '#FFFFFF'], ['Download', '#FFFFFF']].forEach(([t], k) => { rr(270 + k * 214, 584, 200, 56, 28, '#FFFFFF', '#EADFB8', 2); tx(t, 370 + k * 214, 620, `600 20px ${FS}`, INK, 'center'); });
    rr(270, 664, 640, 100, 22, '#FCEBC0');
    tx('Tip: pause any time and replay the hard bits.', 300, 724, `600 22px ${FS}`, INK);
    tx('UP NEXT', 940, 64, `700 18px ${FM}`, GREY);
    [['Adding fractions', '10 min', 1], ['Equivalent fractions', '9 min', 0], ['Word problems', '14 min', 0], ['Fractions quiz', '10 Qs', 0]].forEach(([t, s, on], k) => {
      const y = 90 + k * 168;
      rr(940, y, 310, 150, 20, on ? '#FCEBC0' : '#FFFFFF');
      rr(956, y + 16, 120, 76, 12, on ? INK : '#E8E3F2'); play(1020, y + 54, 22, on ? c : '#B9B3CC');
      tx(t, 956, y + 124, `700 20px ${FS}`, INK); tx(s, 1234, y + 124, `500 18px ${FS}`, GREY, 'right');
    });
  } else {
    const c = '#EC6FA0';
    ctx.fillStyle = '#FFF0F5'; ctx.fillRect(0, 0, W, H);
    rr(0, 0, W, 84, 0, INK);
    tx('MATHEMATICS · PRACTICE EXAM', 36, 54, `700 22px ${FM}`, CREAM);
    rr(1060, 20, 184, 46, 23, c); tx('⏱ 28:45', 1152, 52, `700 24px ${FS}`, INK, 'center');
    rr(36, 112, 820, 652, 28, '#FFFFFF');
    tx('QUESTION 7 OF 24', 72, 170, `700 20px ${FM}`, '#B83A6E');
    tx('If 3x + 5 = 20,', 72, 236, `800 46px ${FD}`, INK);
    tx('what is the value of x?', 72, 292, `800 46px ${FD}`, INK);
    ['3', '5', '15', '25'].forEach((t, k) => {
      const y = 330 + k * 88, sel = k === 1;
      rr(72, y, 748, 72, 22, sel ? c : '#FFF0F5');
      circ(116, y + 36, 22, sel ? INK : '#FFFFFF'); tx('ABCD'[k], 116, y + 44, `700 22px ${FS}`, sel ? CREAM : INK, 'center');
      tx('x = ' + t, 156, y + 46, `${sel ? 700 : 500} 28px ${FS}`, INK);
      if (sel) { circ(780, y + 36, 22, INK); check(780, y + 36, 20, CREAM); }
    });
    rr(72, 694, 180, 52, 26, '#FFFFFF', '#E9C5D5', 2); tx('Previous', 162, 728, `600 22px ${FS}`, INK, 'center');
    rr(640, 694, 180, 52, 26, INK); tx('Next', 730, 728, `700 22px ${FS}`, CREAM, 'center');
    rr(880, 112, 364, 652, 28, '#FFFFFF');
    tx('QUESTIONS', 912, 168, `700 20px ${FM}`, GREY);
    for (let k = 0; k < 24; k++) {
      const x = 912 + (k % 5) * 64, y = 196 + Math.floor(k / 5) * 64, done = k < 6, cur = k === 6;
      rr(x, y, 52, 52, 12, cur ? INK : done ? c : '#FFF0F5');
      tx(String(k + 1), x + 26, y + 34, `700 20px ${FS}`, cur ? CREAM : INK, 'center');
    }
    tx('6 answered · 18 left', 912, 560, `500 20px ${FS}`, GREY);
    rr(912, 690, 300, 56, 28, c); tx('Submit exam', 1062, 726, `700 22px ${FS}`, INK, 'center');
  }
}
