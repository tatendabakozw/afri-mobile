import countries from '@/assets/countries.json';

export const countryOptions = Object.entries(countries).map(([code, country]) => ({
    value: code,
    label: `${country.flagEmoji} ${country.name} (+${country.phoneCode})`,
    phoneCode: country.phoneCode
})).sort((a, b) => a.label.localeCompare(b.label));