const DECIMAL_PLACES = 2;
const THOUSANDS_SEPARATOR_REGEX = /\B(?=(\d{3})+(?!\d))/g;
const CURRENCY_SYMBOL = '₽';

export function formatAmount(value: number): string {
    const [integerPart, decimalPart] = value.toFixed(DECIMAL_PLACES).split('.');
    const spacedInteger = integerPart.replace(THOUSANDS_SEPARATOR_REGEX, ' ');

    return `${spacedInteger},${decimalPart} ${CURRENCY_SYMBOL}`;
}
