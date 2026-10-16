import { NextRequest, NextResponse } from 'next/server';
import { currencyForCountry } from '@/lib/currency/countries';

// Visitor country comes from a request header, so this can't be static.
export const dynamic = 'force-dynamic';

const RATES_URL = 'https://open.er-api.com/v6/latest/NGN';

/**
 * Exchange rates (base NGN) plus the visitor's detected country/currency.
 *
 * Rates come from ExchangeRate-API's free open-access endpoint, which updates
 * daily and asks callers not to poll it — so the upstream response is cached
 * on the server for an hour and every visitor shares it.
 */
export async function GET(request: NextRequest) {
    // Vercel sets x-vercel-ip-country; Cloudflare sets cf-ipcountry.
    let country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || null;
    // Local testing aid: /api/fx?country=GB (ignored in production).
    if (process.env.NODE_ENV !== 'production') {
        country = request.nextUrl.searchParams.get('country') || country;
    }

    let rates: Record<string, number> | null = null;
    let updatedAt: string | null = null;
    try {
        const res = await fetch(RATES_URL, { next: { revalidate: 3600 } });
        const json = await res.json();
        if (json?.result === 'success' && json.rates) {
            rates = json.rates;
            updatedAt = json.time_last_update_utc || null;
        }
    } catch {
        // Fall through: the site keeps showing naira prices if rates are unavailable.
    }

    return NextResponse.json(
        { country, currency: currencyForCountry(country), rates, updatedAt },
        { headers: { 'Cache-Control': 'private, max-age=600' } },
    );
}
