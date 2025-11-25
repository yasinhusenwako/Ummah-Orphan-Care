/**
 * Ethiopian Birr Currency Utilities
 * 
 * Ethiopian Birr (ETB) - ብር
 * Symbol: ብር or ETB
 * Code: ETB
 */

export const CURRENCY = {
  code: 'ETB',
  symbol: 'ብር',
  name: 'Ethiopian Birr',
  nameLatin: 'Birr',
  symbolLatin: 'ETB'
} as const;

/**
 * Format amount in Ethiopian Birr
 * @param amount - Amount to format
 * @param showBoth - Show both Amharic and Latin symbols
 * @returns Formatted currency string
 */
export function formatBirr(amount: number, showBoth: boolean = true): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  if (showBoth) {
    return `ብር ${formatted} (ETB ${formatted})`;
  }

  return `ብር ${formatted}`;
}

/**
 * Format amount with just the symbol
 * @param amount - Amount to format
 * @returns Formatted currency string with symbol only
 */
export function formatBirrShort(amount: number): string {
  return `ብር ${amount.toLocaleString()}`;
}

/**
 * Format amount with Latin symbol only
 * @param amount - Amount to format
 * @returns Formatted currency string with ETB
 */
export function formatETB(amount: number): string {
  return `ETB ${amount.toLocaleString()}`;
}

/**
 * Parse Birr string to number
 * @param birrString - String like "ብር 1,000" or "ETB 1000"
 * @returns Parsed number
 */
export function parseBirr(birrString: string): number {
  const cleaned = birrString.replace(/[ብር,ETB\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format for API (always use ETB code)
 * @param amount - Amount
 * @returns Object with amount and currency code
 */
export function formatForAPI(amount: number) {
  return {
    amount,
    currency: CURRENCY.code.toLowerCase()
  };
}

/**
 * Common donation amounts in Birr
 */
export const COMMON_AMOUNTS = {
  small: 500,      // ~$9 USD
  medium: 1000,    // ~$18 USD
  large: 2500,     // ~$45 USD
  xlarge: 5000     // ~$90 USD
} as const;

/**
 * Format donation amount with context
 * @param amount - Amount in Birr
 * @param period - Payment period
 * @returns Formatted string
 */
export function formatDonation(amount: number, period: 'monthly' | 'one-time' = 'monthly'): string {
  const formatted = formatBirrShort(amount);
  return period === 'monthly' ? `${formatted}/month` : formatted;
}
