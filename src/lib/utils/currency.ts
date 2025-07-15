export interface Currency {
  code: string;
  symbol: string;
  rate: number; // Rate relative to MYR (base currency)
}

// Exchange rates relative to MYR (Malaysian Ringgit) as base
export const CURRENCIES: Currency[] = [
  { code: "MYR", symbol: "RM", rate: 1.0 },
  { code: "USD", symbol: "$", rate: 0.22 }, // 1 MYR ≈ 0.22 USD
  { code: "SGD", symbol: "S$", rate: 0.3 }, // 1 MYR ≈ 0.30 SGD
  { code: "GBP", symbol: "£", rate: 0.18 }, // 1 MYR ≈ 0.18 GBP
];

export const currencyUtils = {
  // Convert price from base currency (MYR) to target currency
  convertPrice(basePriceMYR: number, targetCurrencyCode: string): number {
    const targetCurrency = CURRENCIES.find(
      (c) => c.code === targetCurrencyCode
    );
    if (!targetCurrency) {
      console.warn(`Currency ${targetCurrencyCode} not found, using MYR`);
      return basePriceMYR;
    }

    return Math.round(basePriceMYR * targetCurrency.rate * 100) / 100;
  },

  // Get currency object by code
  getCurrency(code: string): Currency | null {
    return CURRENCIES.find((c) => c.code === code) || null;
  },

  // Format price with currency symbol
  formatPrice(price: number, currencyCode: string): string {
    const currency = this.getCurrency(currencyCode);
    if (!currency) return `${price}`;

    return `${currency.symbol}${price.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  },

  // Calculate original price with discount
  calculateOriginalPrice(
    discountedPrice: number,
    discountPercentage: number
  ): number {
    return (
      Math.round((discountedPrice / (1 - discountPercentage / 100)) * 100) / 100
    );
  },

  // Calculate discount percentage
  calculateDiscountPercentage(
    originalPrice: number,
    discountedPrice: number
  ): number {
    if (originalPrice <= 0) return 0;
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  },

  // Get all available currencies
  getAllCurrencies(): Currency[] {
    return CURRENCIES;
  },
};
