import type * as THREE_NS from 'three';
import { PHONE_COLORS, SW, SH, drawScreen, drawTablet, drawKeys, drawLaptop, screenFontSamples } from './screens';

type Three = typeof THREE_NS;

/*
 * Scroll-driven landing stage, ported from the Lesson360 landing design.
 *
 * The page markup describes the choreography through data attributes:
 *   [data-section][data-bg]   sections whose colours blend into the fixed background
 *   [data-slot="hero"|"cta"]  where the phones spin as a ring
 *   [data-feature=N] [data-slot]  where the phones stack (or a tablet/laptop takes over)
 *   [data-nodevice]           sections that hide the devices entirely
 *   [data-speed]              parallax factor for decorative elements
 *   [data-reveal][data-delay] fade-up on first view
 */

const SPIN_DEG_PER_SEC = 10;
const N = PHONE_COLORS.length;

// Feature sections where a tablet or laptop replaces the phone stack.
const DEVICES: { k: number; type: 'tablet' | 'laptop'; kind?: 'video' | 'exam' }[] = [
    { k: 1, type: 'tablet' },
    { k: 4, type: 'laptop', kind: 'video' },
    { k: 7, type: 'laptop', kind: 'exam' },
];

interface Options {
    root: HTMLElement;
    canvas: HTMLCanvasElement;
    bgLayer: HTMLElement;
    reducedMotion: boolean;
    /** Called if WebGL or three.js is unavailable, so the page can collapse the device slots. */
    onUnavailable: () => void;
}

interface Box { x: number; y: number; w: number; h: number }

export function createStage({ root, canvas, bgLayer, reducedMotion, onUnavailable }: Options) {
    let alive = true;
    let raf = 0;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
        window.addEventListener(type, fn, opts);
        cleanups.push(() => window.removeEventListener(type, fn));
    };

    // ── DOM wiring ──────────────────────────────────────────────────────────
    const q = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s));
    const hex = (h?: string) => { const n = parseInt((h || '#FFFFFF').slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };

    const heroSlot = root.querySelector<HTMLElement>('[data-slot="hero"]')!;
    const ctaSlot = root.querySelector<HTMLElement>('[data-slot="cta"]')!;
    const heroSec = heroSlot.closest('section')!;
    const feats = q('[data-feature]')
        .sort((a, b) => Number(a.dataset.feature) - Number(b.dataset.feature))
        .map(sec => ({ sec, slot: sec.querySelector<HTMLElement>('[data-slot]')! }));
    const sections = q('[data-section]').map(el => ({ el, rgb: hex(el.dataset.bg) }));
    const noDev = q('[data-nodevice]');
    const speeds = q('[data-speed]').map(el => ({ el, s: Number(el.dataset.speed) }));

    // These are written every frame; the app-wide `* { transition }` rule would make them lag.
    [canvas, bgLayer, ...speeds.map(p => p.el)].forEach(el => { el.style.transition = 'none'; });

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, nx: 0, ny: 0, inside: false, target: null as Element | null };
    on('pointermove', e => {
        mouse.tx = e.clientX / innerWidth * 2 - 1; mouse.ty = e.clientY / innerHeight * 2 - 1;
        mouse.nx = mouse.tx; mouse.ny = -mouse.ty; mouse.inside = e.pointerType === 'mouse'; mouse.target = e.target as Element;
    }, { passive: true });

    let hovered = -1;
    on('click', e => {
        if (hovered < 0) return;
        if ((e.target as Element).closest?.('a,button,input')) return;
        const top = feats[hovered].sec.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    // On one-column layouts the device slot moves above the copy and gets a shorter height.
    const orderSlots = () => {
        [heroSlot, ...feats.map(f => f.slot)].forEach(sl => {
            const cols = getComputedStyle(sl.parentElement!).gridTemplateColumns.trim().split(/\s+/).length;
            const one = cols <= 1;
            sl.style.order = one && sl !== heroSlot ? '-1' : '';
            sl.style.minHeight = one ? (sl === heroSlot ? '46vh' : '58vh') : (sl === heroSlot ? 'min(72vh, 660px)' : 'min(80vh, 760px)');
        });
    };
    orderSlots();
    on('resize', orderSlots);

    // ── Reveal on scroll ────────────────────────────────────────────────────
    let reveals: HTMLElement[] = [];
    const show = (el: HTMLElement) => {
        const delay = Number(el.dataset.delay || 0);
        el.style.transitionDelay = `${delay}ms`;
        el.style.opacity = '1';
        el.style.transform = 'none';
        // Hand transform/transition back to the element's own classes (hover lifts etc.).
        const t = window.setTimeout(() => {
            el.style.removeProperty('opacity');
            el.style.removeProperty('transform');
            el.style.removeProperty('transition');
            el.style.removeProperty('transition-delay');
        }, delay + 1300);
        cleanups.push(() => clearTimeout(t));
    };
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            show(en.target as HTMLElement);
            io.unobserve(en.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    cleanups.push(() => io.disconnect());

    if (!reducedMotion) {
        const vh = innerHeight;
        q('[data-reveal]').forEach(el => {
            if (el.closest('section') === heroSec) return;
            if (vh > 200 && el.getBoundingClientRect().top < vh * 0.95) return;
            reveals.push(el);
            el.style.opacity = '0';
            el.style.transform = 'translate3d(0, 56px, 0)';
            el.style.transition = 'opacity 1.1s cubic-bezier(.2,.7,.2,1), transform 1.2s cubic-bezier(.2,.7,.2,1)';
            io.observe(el);
        });
    }
    // Safety net for fast scrolls/anchor jumps that skip the observer threshold.
    const revealTimer = window.setInterval(() => {
        if (!reveals.length) return;
        const vh = innerHeight;
        reveals = reveals.filter(el => {
            if (el.style.opacity !== '0') return false;
            const r = el.getBoundingClientRect();
            if (r.top < vh * 0.92 && r.bottom > 0) { io.unobserve(el); show(el); return false; }
            return true;
        });
    }, 250);
    cleanups.push(() => clearInterval(revealTimer));

    // ── Background blend + parallax ─────────────────────────────────────────
    const tickBg = () => {
        const vh = innerHeight, vc = vh / 2;
        let bw = 0; const rgb = [0, 0, 0];
        for (const s of sections) {
            const rc = s.el.getBoundingClientRect();
            const dist = rc.top > vc ? rc.top - vc : rc.bottom < vc ? vc - rc.bottom : 0;
            const w = Math.exp(-Math.pow(dist / (vh * 0.14), 2)) + 1e-6;
            bw += w; rgb[0] += w * s.rgb[0]; rgb[1] += w * s.rgb[1]; rgb[2] += w * s.rgb[2];
        }
        bgLayer.style.backgroundColor = `rgb(${rgb.map(v => Math.round(v / bw)).join(',')})`;
        if (reducedMotion) return;
        speeds.forEach(p => {
            const rc = p.el.parentElement!.getBoundingClientRect();
            p.el.style.transform = `translate3d(0, ${-(rc.top + rc.height / 2 - vc) * p.s}px, 0)`;
        });
    };

    // ── 3D scene ────────────────────────────────────────────────────────────
    let three: Awaited<ReturnType<typeof buildScene>> | null = null;

    async function buildScene() {
        const THREE: Three = await import('three');
        try {
            await Promise.race([
                Promise.all(screenFontSamples().map(f => document.fonts.load(f))),
                new Promise(r => setTimeout(r, 2500)),
            ]);
        } catch { /* paint with fallback fonts */ }

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        const env = new THREE.Scene();
        env.add(new THREE.Mesh(new THREE.BoxGeometry(20, 14, 20), new THREE.MeshBasicMaterial({ color: '#4a4660', side: THREE.BackSide })));
        const panel = (col: string, w: number, h: number, x: number, y: number, z: number, ry: number, rx = 0) => {
            const mm = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
            mm.position.set(x, y, z); mm.rotation.set(rx, ry, 0); env.add(mm);
        };
        panel('#ffffff', 10, 3, 0, 6.8, 0, 0, Math.PI / 2);
        panel('#fff3e6', 4, 8, -9.8, 1, 2, Math.PI / 2);
        panel('#e8e4ff', 4, 8, 9.8, 1, -2, -Math.PI / 2);
        panel('#ffffff', 8, 5, 0, 1, 9.8, Math.PI);
        panel('#ffd9c2', 6, 2, 0, -6.8, 0, 0, -Math.PI / 2);
        scene.environment = pmrem.fromScene(env, 0.04).texture;

        const camera = new THREE.PerspectiveCamera(28, innerWidth / innerHeight, 0.1, 100);
        camera.position.set(0, 0, 16);
        const key = new THREE.DirectionalLight('#ffffff', 1.6); key.position.set(4, 6, 8); scene.add(key);
        const rim = new THREE.DirectionalLight('#b9a6ff', 2.2); rim.position.set(-6, 2, -5); scene.add(rim);
        const warm = new THREE.DirectionalLight('#ffd2b0', 0.8); warm.position.set(6, -3, 2); scene.add(warm);

        const rounded = (w: number, h: number, r: number) => {
            const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
            s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
            s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
            s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
            return s;
        };
        const flat = (w: number, h: number, r: number) => {
            const g = new THREE.ShapeGeometry(rounded(w, h, r), 16);
            const p = g.attributes.position, uv = new Float32Array(p.count * 2);
            for (let k = 0; k < p.count; k++) { uv[k * 2] = (p.getX(k) + w / 2) / w; uv[k * 2 + 1] = (p.getY(k) + h / 2) / h; }
            g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
            return g;
        };
        const maxAniso = renderer.capabilities.getMaxAnisotropy();
        const repaints: (() => void)[] = [];
        const mkTex = (w: number, h: number, paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
            const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
            const ctx = cv.getContext('2d')!;
            paint(ctx, w, h);
            const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso;
            repaints.push(() => { ctx.clearRect(0, 0, w, h); paint(ctx, w, h); t.needsUpdate = true; });
            return t;
        };
        // If the webfonts were still loading when we painted, repaint once they're in.
        document.fonts.ready.then(() => { if (alive) repaints.forEach(fn => fn()); });
        const screenMat = (tex: THREE_NS.Texture) => new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#ffffff', emissiveMap: tex, roughness: 0.1, metalness: 0, toneMapped: false });
        const bodyMatFor = (col: string) => new THREE.MeshPhysicalMaterial({ color: col, metalness: 0.5, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.12 });

        const bodyGeo = new THREE.ExtrudeGeometry(rounded(1.44, 3.02, 0.2), { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 5, curveSegments: 20 });
        bodyGeo.translate(0, 0, -0.06);
        const bumpGeo = new THREE.ExtrudeGeometry(rounded(0.58, 0.6, 0.15), { depth: 0.03, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 12 });
        const glassGeo = flat(1.46, 3.04, 0.2), screenGeo = flat(1.36, 2.94, 0.15), islandGeo = flat(0.36, 0.1, 0.05);
        const lensGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.045, 32); lensGeo.rotateX(Math.PI / 2);
        const lensRingGeo = new THREE.TorusGeometry(0.1, 0.014, 10, 32);
        const btnGeo = new THREE.BoxGeometry(0.03, 0.3, 0.07);
        const glassMat = new THREE.MeshPhysicalMaterial({ color: '#08070f', roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03 });
        const lensMat = new THREE.MeshPhysicalMaterial({ color: '#0b0a14', roughness: 0.05, metalness: 0.6, clearcoat: 1 });
        const islandMat = new THREE.MeshBasicMaterial({ color: '#000000' });

        const phones: { root: THREE_NS.Group; inner: THREE_NS.Group; front: THREE_NS.Group; h: number }[] = [];
        const pickables: THREE_NS.Object3D[] = [];
        PHONE_COLORS.forEach((col, i) => {
            const root = new THREE.Group(), inner = new THREE.Group(), front = new THREE.Group();
            root.add(inner);
            const bodyMat = bodyMatFor(col);
            const body = new THREE.Mesh(bodyGeo, bodyMat); inner.add(body);
            const bump = new THREE.Mesh(bumpGeo, bodyMat); bump.position.set(-0.36, 1.06, -0.135); inner.add(bump);
            [[-0.5, 1.2], [-0.5, 0.92], [-0.22, 1.06]].forEach(([x, y]) => {
                const l = new THREE.Mesh(lensGeo, lensMat); l.position.set(x, y, -0.16); inner.add(l);
                const ring = new THREE.Mesh(lensRingGeo, bodyMat); ring.position.set(x, y, -0.18); inner.add(ring);
            });
            const b1 = new THREE.Mesh(btnGeo, bodyMat); b1.position.set(0.765, 0.55, 0); inner.add(b1);
            const b2 = new THREE.Mesh(btnGeo, bodyMat); b2.position.set(-0.765, 0.75, 0); b2.scale.y = 0.6; inner.add(b2);
            const b3 = new THREE.Mesh(btnGeo, bodyMat); b3.position.set(-0.765, 0.42, 0); b3.scale.y = 0.6; inner.add(b3);
            const glass = new THREE.Mesh(glassGeo, glassMat); front.add(glass);
            const screen = new THREE.Mesh(screenGeo, screenMat(mkTex(SW, SH, ctx => drawScreen(i, ctx)))); screen.position.z = 0.002; front.add(screen);
            const island = new THREE.Mesh(islandGeo, islandMat); island.position.set(0, 1.33, 0.004); front.add(island);
            front.position.z = 0.0905; inner.add(front);
            [body, screen, glass].forEach(m => { m.userData.idx = i; pickables.push(m); });
            scene.add(root);
            phones.push({ root, inner, front, h: 0 });
        });

        const devs = DEVICES.map(d => {
            const root = new THREE.Group(), inner = new THREE.Group(); root.add(inner);
            const bodyMat = bodyMatFor(PHONE_COLORS[d.k]);
            let lid: THREE_NS.Group | null = null;
            if (d.type === 'tablet') {
                const bg = new THREE.ExtrudeGeometry(rounded(2.3, 3.04, 0.2), { depth: 0.09, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 5, curveSegments: 20 });
                bg.translate(0, 0, -0.045);
                inner.add(new THREE.Mesh(bg, bodyMat));
                const glass = new THREE.Mesh(flat(2.33, 3.07, 0.2), glassMat); glass.position.z = 0.072; inner.add(glass);
                const scr = new THREE.Mesh(flat(2.13, 2.87, 0.1), screenMat(mkTex(960, 1294, drawTablet))); scr.position.z = 0.075; inner.add(scr);
                const lens = new THREE.Mesh(lensGeo, lensMat); lens.position.set(-0.8, 1.2, -0.08); inner.add(lens);
            } else {
                const base = new THREE.Mesh(new THREE.ExtrudeGeometry(rounded(3.6, 2.4, 0.14), { depth: 0.09, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 4, curveSegments: 16 }), bodyMat);
                base.rotation.x = -Math.PI / 2; inner.add(base);
                const kb = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.2), new THREE.MeshStandardMaterial({ map: mkTex(1024, 384, drawKeys), roughness: 0.7 }));
                kb.rotation.x = -Math.PI / 2; kb.position.set(0, 0.114, -0.36); inner.add(kb);
                const pad = new THREE.Mesh(flat(1.2, 0.66, 0.06), new THREE.MeshStandardMaterial({ color: '#000000', transparent: true, opacity: 0.14, roughness: 0.4 }));
                pad.rotation.x = -Math.PI / 2; pad.position.set(0, 0.114, 0.66); inner.add(pad);
                lid = new THREE.Group(); lid.position.set(0, 0.1, -1.17); inner.add(lid);
                const lidBody = new THREE.Mesh(new THREE.ExtrudeGeometry(rounded(3.6, 2.36, 0.14), { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 4, curveSegments: 16 }), bodyMat);
                lidBody.position.set(0, 1.18, -0.065); lid.add(lidBody);
                const lg = new THREE.Mesh(flat(3.6, 2.36, 0.14), glassMat); lg.position.set(0, 1.18, 0.002); lid.add(lg);
                const kind = d.kind!;
                const ls = new THREE.Mesh(flat(3.36, 2.1, 0.03), screenMat(mkTex(1280, 800, (cx, w, h) => drawLaptop(kind, cx, w, h)))); ls.position.set(0, 1.21, 0.005); lid.add(ls);
                inner.position.set(0, -1.15, -0.1);
            }
            root.visible = false; scene.add(root);
            return { ...d, root, inner, lid };
        });

        const onResize = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); };
        onResize();
        on('resize', onResize);

        return {
            THREE, renderer, scene, camera, phones, pickables, devs,
            raycaster: new THREE.Raycaster(),
            ndc: new THREE.Vector2(),
            up: new THREE.Vector3(0, 1, 0),
            tmp: {
                p1: new THREE.Vector3(), p2: new THREE.Vector3(), q1: new THREE.Quaternion(), q2: new THREE.Quaternion(),
                e: new THREE.Euler(), e0: new THREE.Euler(), qi: new THREE.Quaternion(),
                tilt: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.22, 0, 0)),
            },
            dispose() {
                scene.traverse(obj => {
                    const m = obj as THREE_NS.Mesh;
                    m.geometry?.dispose();
                    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
                    mats.forEach(mat => { (mat as THREE_NS.MeshStandardMaterial).emissiveMap?.dispose(); (mat as THREE_NS.MeshStandardMaterial).map?.dispose(); mat.dispose(); });
                });
                scene.environment?.dispose();
                pmrem.dispose();
                renderer.dispose();
            },
        };
    }

    // Smoothed state carried between frames.
    let cur: { x: number; y: number; s: number; f: number; ring: number; rs: number; ss: number } | null = null;
    let vis: number | null = null;
    let hide = 0;
    let ringAngle = 0;

    function tick3d(now: number, dt: number) {
        const t = three!;
        const { THREE, camera, tmp: tm } = t;
        const vw = innerWidth, vh = innerHeight, vc = vh / 2;
        const spin = reducedMotion ? 0 : SPIN_DEG_PER_SEC * Math.PI / 180;

        const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        const halfW = halfH * camera.aspect;
        const box = (el: Element): Box => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; };
        const wide = vw >= 900;
        const stackS = (b: Box) => Math.max(0.3, Math.min(b.h / vh * 2 * halfH * (wide ? 0.88 : 0.8) / 3.08, b.w / vw * 2 * halfW * (wide ? 0.75 : 0.5) / 1.5, wide ? 2.0 : 1.6));
        const ringS = (b: Box) => wide
            ? Math.max(0.2, Math.min(b.w / vw * 2 * halfW / 8.4, b.h / vh * 2 * halfH / 4.2))
            : Math.max(0.2, Math.min(b.w / vw * 2 * halfW / 10, b.h / vh * 2 * halfH / 4.8));
        const sm = (a: number, b: number, x: number) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
        const cl = (x: number) => Math.min(1, Math.max(0, x));
        const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
        const centerOf = (el: Element) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2; };
        const cs = feats.map(f => centerOf(f.sec));
        const F = feats.length;

        // Where are we in the choreography? hero ring → feature stacks → CTA ring.
        let f: number, ring: number, A: Box, B: Box, e: number, sA: number, sB: number, rsT: number | null = null, ssT: number | null = null;
        if (vc <= cs[0]) {
            const hc = centerOf(heroSec);
            e = sm(0.15, 0.85, cl((vc - hc) / (cs[0] - hc)));
            A = box(heroSlot); B = box(feats[0].slot); sA = ringS(A); sB = stackS(B); rsT = sA; ssT = sB;
            ring = 1 - e; f = 0;
        } else if (vc >= cs[F - 1]) {
            const cc = centerOf(ctaSlot);
            e = sm(0.2, 0.8, cl((vc - cs[F - 1]) / (cc - cs[F - 1])));
            A = box(feats[F - 1].slot); B = box(ctaSlot); sA = stackS(A); sB = ringS(B); rsT = sB; ssT = sA;
            ring = e; f = F - 1;
        } else {
            let k = 0; while (k < F - 2 && vc >= cs[k + 1]) k++;
            e = sm(0.32, 0.68, (vc - cs[k]) / (cs[k + 1] - cs[k]));
            A = box(feats[k].slot); B = box(feats[k + 1].slot); sA = stackS(A); sB = stackS(B);
            ring = 0; f = k + e;
        }
        const narrow = !wide;
        const tx = lerp(A.x, B.x, e);
        const slotY = lerp(A.y, B.y, e);
        const ty = narrow ? slotY : lerp(vc, slotY, ring);

        // On narrow screens only show devices while their slot is on screen.
        let v = 1;
        if (narrow) {
            const ov = (b: Box) => Math.max(0, Math.min(vh, b.y + b.h / 2) - Math.max(0, b.y - b.h / 2)) / Math.max(1, Math.min(b.h, vh));
            v = Math.min(1, Math.max(0, (lerp(ov(A), ov(B), e) - 0.35) / 0.45));
        }
        hide = 0;
        noDev.forEach(el => { const r = el.getBoundingClientRect(); hide = Math.max(hide, cl(Math.min(vc - r.top, r.bottom - vc) / (vh * 0.3))); });
        v *= 1 - hide;
        vis = (vis ?? v) + (v - (vis ?? v)) * (1 - Math.exp(-dt * 8));
        canvas.style.opacity = vis.toFixed(3);

        const ts = lerp(sA, sB, e); if (rsT == null || ssT == null) { rsT = ts; ssT = ts; }
        if (!cur) cur = { x: tx, y: ty, s: ts, f, ring, rs: rsT, ss: ssT };
        const c = cur, k1 = 1 - Math.exp(-dt * 6);
        c.x += (tx - c.x) * k1; c.y += (ty - c.y) * k1; c.s += (ts - c.s) * k1; c.f += (f - c.f) * k1;
        c.ring += (ring - c.ring) * k1; c.rs += (rsT - c.rs) * k1; c.ss += (ssT - c.ss) * k1;

        const m = mouse, km = 1 - Math.exp(-dt * 3);
        m.x += (m.tx - m.x) * km; m.y += (m.ty - m.y) * km;

        // Tablets/laptops take over their sections.
        let devMax = 0;
        t.devs.forEach(d => {
            let w = cl(1 - Math.abs(c.f - d.k) * 1.3) * cl(1 - c.ring * 2.5); w = w * w * (3 - 2 * w);
            devMax = Math.max(devMax, w);
            if (w < 0.003) { d.root.visible = false; return; }
            d.root.visible = true;
            const b = box(feats[d.k].slot), sd = b.x >= vw / 2 ? 1 : -1, fl = 1 - w;
            const s = d.type === 'tablet'
                ? Math.max(0.3, Math.min(b.h / vh * 2 * halfH * 0.86 / 3.1, b.w / vw * 2 * halfW * (wide ? 0.8 : 0.82) / 2.35, 1.9))
                : Math.max(0.3, Math.min(b.h / vh * 2 * halfH * 0.84 / 3.3, b.w / vw * 2 * halfW * (wide ? 1.0 : 0.95) / 3.7, 1.6));
            const dx = (b.x / vw * 2 - 1) * halfW, dy = (1 - b.y / vh * 2) * halfH;
            d.root.position.set(dx + sd * fl * 1.2 * s, dy - fl * 0.9 * s + Math.sin(now * 1.2 + d.k) * 0.04 * s, -fl * 2.5);
            d.root.scale.setScalar(Math.max(1e-4, s * (0.5 + 0.5 * w)));
            if (d.type === 'tablet') d.root.rotation.set(0.05 - m.y * 0.1, -sd * 0.3 + m.x * 0.18 + sd * fl * 1.6, sd * 0.02 - sd * fl * 0.3);
            else { d.root.rotation.set(0.32 - m.y * 0.08, -sd * 0.3 + m.x * 0.16 + sd * fl * 1.4, 0); d.lid!.rotation.x = lerp(1.45, -0.16, sm(0.25, 1, w)); }
        });
        const phoneVis = 1 - devMax;

        const gx = (c.x / vw * 2 - 1) * halfW, gy = (1 - c.y / vh * 2) * halfH;
        const sa = gx >= 0 ? 1 : -1;

        // Hover picking (mouse only — touch has no hover).
        let hov = -1;
        if (m.inside && hide < 0.5 && !m.target?.closest?.('a,button,nav,[data-reveal]')) {
            t.ndc.set(m.nx, m.ny);
            t.raycaster.setFromCamera(t.ndc, camera);
            const hit = t.raycaster.intersectObjects(t.pickables, false)[0];
            if (hit) hov = hit.object.userData.idx;
        }
        if (hov !== hovered) { hovered = hov; root.style.cursor = hov >= 0 ? 'pointer' : ''; }
        const anyH = t.phones.reduce((a, p) => Math.max(a, p.h), 0);
        ringAngle += dt * spin * (1 - anyH * 0.92);

        // Neighbours part to make room for the hovered phone.
        const spread = (i: number) => {
            if (hovered < 0) return 0;
            const H = t.phones[hovered].h; let d = ((i - hovered) % N + N) % N; if (d > N / 2) d -= N; if (d === 0) return 0;
            return Math.sign(d) * Math.max(0, 0.2 - (Math.abs(d) - 1) * 0.07) * H;
        };

        const kh = 1 - Math.exp(-dt * 7);
        t.phones.forEach((ph, i) => {
            ph.h += ((hov === i ? 1 : 0) - ph.h) * kh;
            const h = ph.h;
            // stack pose
            const u = i - c.f; const r = ((u % N) + N) % N;
            const stackAt = (rr: number, out: THREE_NS.Vector3, eul: THREE_NS.Euler) => {
                out.set(sa * rr * 0.06, rr * 0.05, -rr * 0.34);
                eul.set(0.04 - m.y * 0.1, -sa * 0.32 + m.x * 0.18, sa * rr * 0.012);
            };
            if (r > N - 1) {
                const td = N - r, ee = td * td * (3 - 2 * td), sw = Math.sin(Math.PI * td);
                stackAt(0, tm.p1, tm.e); tm.e0.copy(tm.e);
                stackAt(N - 1, tm.p2, tm.e);
                tm.p1.lerp(tm.p2, ee);
                tm.p1.x += sa * sw * 2.2; tm.p1.y += sw * 0.35; tm.p1.z += sw * 1.1;
                tm.e.set(lerp(tm.e0.x, tm.e.x, ee), lerp(tm.e0.y, tm.e.y, ee) + sa * sw * 0.9, lerp(tm.e0.z, tm.e.z, ee) - sa * sw * 0.22);
            } else {
                stackAt(r, tm.p1, tm.e);
                if (r < 1) tm.p1.y += Math.sin(now * 1.3) * 0.04 * (1 - r);
            }
            tm.q1.setFromEuler(tm.e);
            // ring pose
            const a = ringAngle + i * Math.PI * 2 / N + spread(i), R = (wide ? 3.0 : 3.7) + h * 0.6;
            tm.p2.set(Math.sin(a) * R, h * 0.12, Math.cos(a) * R).applyQuaternion(tm.tilt);
            tm.q2.setFromAxisAngle(t.up, a).premultiply(tm.tilt);
            tm.qi.identity(); tm.q2.slerp(tm.qi, h * 0.85);
            const rk = r > N - 1 ? 0 : r; let mi = Math.min(1, Math.max(0, c.ring * 1.6 - (rk / N) * 0.6)); mi = mi * mi * (3 - 2 * mi);
            ph.root.position.lerpVectors(tm.p1, tm.p2, mi);
            if (mi > 0 && mi < 1) ph.root.position.z += Math.sin(Math.PI * mi) * (1.2 - rk * 0.25);
            ph.root.quaternion.slerpQuaternions(tm.q1, tm.q2, mi);
            ph.root.scale.setScalar(1 + h * 0.1 * c.ring + h * 0.04);
            // hover: the screen lifts off the body
            ph.inner.rotation.y = 0; ph.front.position.z = 0.0905 + h * 0.34; ph.inner.rotation.x = -h * 0.08;
            const scl = lerp(c.ss, c.rs, mi); ph.root.position.multiplyScalar(scl).add(tm.p1.set(gx, gy, 0));
            ph.root.scale.multiplyScalar(scl * Math.max(1e-4, phoneVis)); ph.root.visible = phoneVis > 0.003;
        });
        t.renderer.render(t.scene, camera);
    }

    // ── Frame loop ──────────────────────────────────────────────────────────
    let last: number | null = null;
    let warned = false;
    const tick = (ms: number) => {
        if (!alive) return;
        raf = requestAnimationFrame(tick);
        const now = ms / 1000; const dt = Math.min(0.05, now - (last ?? now)); last = now;
        tickBg();
        if (!three) return;
        try { tick3d(now, dt); } catch (err) {
            if (!warned) { warned = true; console.error('[landing] 3d frame failed', err); }
        }
    };
    raf = requestAnimationFrame(tick);

    buildScene()
        .then(scene => { if (alive) three = scene; else scene.dispose(); })
        .catch(err => { console.warn('[landing] 3D stage unavailable', err); if (alive) onUnavailable(); });

    return function destroy() {
        alive = false;
        cancelAnimationFrame(raf);
        cleanups.forEach(fn => fn());
        three?.dispose();
        root.style.cursor = '';
    };
}
