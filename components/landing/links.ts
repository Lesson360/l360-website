export const AFFILIATE_URL = process.env.NEXT_PUBLIC_AFFILIATE_URL || '/signup';

// Store badges only render once the app listings exist, so we never ship dead links.
export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || '';
export const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL || '';

export const CONTACT = {
    email: 'info@lesson360.org',
    phone: '+234 814 544 8426',
    phoneHref: 'tel:+2348145448426',
    address: 'Lesson360 Online School, Okosisi Aguata PHD Street, off Mopol Base, Agu Awka, Awka South, Anambra State, Nigeria',
    instagram: 'https://www.instagram.com/lesson_360/',
};
