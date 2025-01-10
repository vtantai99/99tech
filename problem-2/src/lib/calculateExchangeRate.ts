import type { TokenPrice } from "@/types/token";

export const calculateExchangeRate = ({
	fromCurrency,
	toCurrency,
	amount,
	tokenPrices,
}: {
	fromCurrency: string;
	toCurrency: string;
	amount: number;
	tokenPrices: TokenPrice[];
}) => {
	const fromToken = tokenPrices.find(
		(token) => token.currency === fromCurrency,
	);
	const toToken = tokenPrices.find((token) => token.currency === toCurrency);

	if (fromToken && toToken && amount > 0) {
		const result = (amount * fromToken.price) / toToken.price;
		return result;
	}
	return null;
};
