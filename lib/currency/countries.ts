// Local currency for the countries we're most likely to see. Anything not
// listed falls back to US dollars, the currency we charge international
// customers in.

const EUROZONE = ['AT', 'BE', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'SI', 'SK'];

const COUNTRY_CURRENCY: Record<string, string> = {
    NG: 'NGN',
    US: 'USD',
    GB: 'GBP',
    CA: 'CAD',
    AU: 'AUD',
    NZ: 'NZD',
    IE: 'EUR',
    GH: 'GHS',
    KE: 'KES',
    ZA: 'ZAR',
    UG: 'UGX',
    RW: 'RWF',
    TZ: 'TZS',
    CM: 'XAF',
    SN: 'XOF',
    CI: 'XOF',
    BJ: 'XOF',
    TG: 'XOF',
    EG: 'EGP',
    MA: 'MAD',
    AE: 'AED',
    SA: 'SAR',
    QA: 'QAR',
    IN: 'INR',
    CN: 'CNY',
    JP: 'JPY',
    SG: 'SGD',
    MY: 'MYR',
    CH: 'CHF',
    SE: 'SEK',
    NO: 'NOK',
    DK: 'DKK',
    PL: 'PLN',
    BR: 'BRL',
    MX: 'MXN',
    ...Object.fromEntries(EUROZONE.map(c => [c, 'EUR'])),
};

export const DEFAULT_CURRENCY = 'NGN';
export const FALLBACK_FOREIGN_CURRENCY = 'USD';

/** Local currency for an ISO country code (e.g. "GB" → "GBP"). */
export function currencyForCountry(country: string | null | undefined): string {
    if (!country) return DEFAULT_CURRENCY;
    return COUNTRY_CURRENCY[country.toUpperCase()] || FALLBACK_FOREIGN_CURRENCY;
}

/** Currencies offered in the switcher, in display order. */
export const PICKER_CURRENCIES = ['NGN', 'USD', 'GBP', 'EUR', 'CAD', 'AUD', 'GHS', 'KES', 'ZAR', 'AED', 'INR'];
