import Image from 'next/image';

type Photo = { src: string; alt: string; pos?: string };

const PHOTOS: Record<string, Photo> = {
    toddler: { src: '/landing/mother-toddler-tablet.webp', alt: 'A mother and her young daughter learning the alphabet together on the Lesson360 app' },
    pupil: { src: '/landing/pupil-writing-at-desk.webp', alt: 'A pupil in school uniform writing in her workbook beside a tablet', pos: 'center 35%' },
    teacher: { src: '/landing/teacher-leading-class.webp', alt: 'A teacher holding a tablet while leading a class discussion', pos: 'center 30%' },
    teens: { src: '/landing/teens-studying-laptop.webp', alt: 'Three teenagers studying together for exams on a laptop', pos: 'center 40%' },
    classroom: { src: '/landing/teacher-with-pupils.webp', alt: 'A smiling teacher helping three pupils with their work in class' },
    progress: { src: '/landing/mother-son-progress.webp', alt: 'A mother and son checking his progress on the Lesson360 dashboard', pos: '38% center' },
};

// Different orders per column so the same photo never sits side by side.
const COLUMNS: { photos: Photo[]; className: string }[] = [
    { photos: [PHOTOS.toddler, PHOTOS.teens, PHOTOS.classroom], className: '' },
    { photos: [PHOTOS.pupil, PHOTOS.progress, PHOTOS.teacher], className: 'is-offset' },
];

/**
 * Two columns of photos drifting upward forever. Each column renders its list
 * twice and slides by exactly one copy, so the loop has no visible seam.
 */
export function HeroPhotoColumns() {
    return (
        <div className="hero-columns relative grid h-[min(62svh,560px)] grid-cols-2 gap-3 overflow-hidden sm:gap-4 min-[760px]:h-[min(86svh,820px)]">
            {COLUMNS.map((col, c) => (
                <div key={c} className={`hero-column ${col.className}`}>
                    {[0, 1].map(copy => col.photos.map((p, i) => (
                        <div key={`${copy}-${i}`} aria-hidden={copy === 1 || undefined} className="pb-3 sm:pb-4">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-ink/5 sm:rounded-3xl">
                                <Image
                                    src={p.src}
                                    alt={copy === 1 ? '' : p.alt}
                                    fill
                                    priority={copy === 0 && i === 0}
                                    sizes="(max-width: 760px) 45vw, 300px"
                                    className="object-cover"
                                    style={{ objectPosition: p.pos || 'center' }}
                                />
                            </div>
                        </div>
                    )))}
                </div>
            ))}
        </div>
    );
}
