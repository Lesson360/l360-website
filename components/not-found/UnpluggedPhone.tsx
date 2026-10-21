const INK = '#17153A';
const FLAME = '#FF4A00';

/** One arm, plug and cable for the left side; mirrored for the right. */
function PlugArm() {
    return (
        <g>
            {/* cable swinging down from the plug */}
            <path d="M134 262 C 98 262 84 340 26 366" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
            {/* arm from the phone to the hand */}
            <path d="M207 250 C 194 248 184 252 172 258" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
            {/* plug */}
            <rect x="132" y="248" width="32" height="26" rx="7" fill="#F5B935" stroke={INK} strokeWidth="4" />
            <rect x="140" y="256" width="4" height="10" rx="2" fill={INK} />
            <rect x="150" y="256" width="4" height="10" rx="2" fill={INK} />
            <circle cx="170" cy="259" r="9" fill={INK} />
            {/* sparks */}
            <g className="nf-spark" stroke={FLAME} strokeWidth="4" strokeLinecap="round">
                <path d="M188 224 l8 10" />
                <path d="M184 262 h11" />
                <path d="M188 296 l8 -9" />
            </g>
        </g>
    );
}

/**
 * The 404 mascot: a worried phone holding its unplugged charger. `detailed`
 * adds the orbit ring and extra doodles shown on wide screens.
 */
export function UnpluggedPhone({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 560 500" className={className} role="img" aria-label="A worried phone holding its unplugged charging cable">
            {/* backdrop */}
            <circle className="hidden lg:block" cx="280" cy="250" r="238" fill="none" stroke="#D3D0DE" strokeWidth="2.5" strokeDasharray="1 10" strokeLinecap="round" />
            <circle cx="280" cy="250" r="200" fill="#FEEFE4" />
            <text
                x="280" y="342" textAnchor="middle" fontSize="236" fontWeight="800" letterSpacing="-6"
                fill="none" stroke="#E9DCD2" strokeWidth="2" style={{ fontFamily: 'var(--font-grotesk), sans-serif' }}
                aria-hidden="true"
            >
                404
            </text>

            {/* doodles */}
            <circle cx="112" cy="72" r="13" fill="none" stroke={FLAME} strokeWidth="4" />
            <path d="M455 36 L434 72 H449 L438 104 L466 62 H451 L462 36 Z" fill="#8A63E0" />
            <path d="M44 404 q10 -12 20 0 t20 0 t20 0" fill="none" stroke="#3FB57A" strokeWidth="4" strokeLinecap="round" />
            <path d="M478 384 L493 410 H463 Z" fill="none" stroke={FLAME} strokeWidth="4" strokeLinejoin="round" />
            <g className="hidden lg:block" fill="none" stroke="#5B7BEA" strokeWidth="3.5" strokeLinecap="round">
                <circle cx="76" cy="160" r="7" />
                <circle cx="104" cy="160" r="7" />
                <circle cx="90" cy="200" r="7" />
                <path d="M78 167 L88 192 M102 167 L92 192" />
                <circle cx="508" cy="330" r="8" />
            </g>
            <g className="hidden lg:block" fill="none" stroke="#2FAFAA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M372 58 V26 M360 38 L372 26 L384 38" />
                <path d="M390 66 L402 55" />
            </g>

            {/* shadow */}
            <ellipse cx="280" cy="448" rx="112" ry="11" fill={INK} opacity="0.07" />

            {/* arms, plugs and cables */}
            <PlugArm />
            <g transform="translate(560 0) scale(-1 1)">
                <PlugArm />
            </g>

            {/* legs */}
            <path d="M264 362 L259 428 M296 362 L301 428" stroke={INK} strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="252" cy="432" rx="17" ry="8" fill={INK} />
            <ellipse cx="308" cy="432" rx="17" ry="8" fill={INK} />

            {/* phone */}
            <rect x="205" y="95" width="150" height="270" rx="34" fill={FLAME} />
            <rect x="219" y="109" width="122" height="242" rx="22" fill="#FFF8EC" />
            <rect x="258" y="122" width="44" height="9" rx="4.5" fill={INK} />

            {/* face */}
            <path d="M242 196 L264 188 M296 188 L318 196" stroke={INK} strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="256" cy="214" rx="10" ry="12" fill={INK} />
            <ellipse cx="304" cy="214" rx="10" ry="12" fill={INK} />
            <circle cx="259" cy="209" r="3.5" fill="#fff" />
            <circle cx="307" cy="209" r="3.5" fill="#fff" />
            <circle cx="236" cy="240" r="9" fill="#FFB89A" />
            <circle cx="324" cy="240" r="9" fill="#FFB89A" />
            <path d="M266 256 q7 -8 14 0 t14 0" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />

            {/* stalled progress */}
            <rect x="238" y="286" width="84" height="9" rx="4.5" fill="#E7E2DA" />
            <rect x="238" y="286" width="40" height="9" rx="4.5" fill="#3FB57A" />
            <path d="M282 284 l5 6.5 l-5 6.5" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="250" y="310" width="60" height="8" rx="4" fill="#E7E2DA" />
        </svg>
    );
}
