import type { TokenPrice } from "@/types/token";

export const generateTokenIcon = (currency: TokenPrice["currency"]) =>
	`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`;
