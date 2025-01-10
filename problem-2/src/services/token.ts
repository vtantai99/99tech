import axiosInstance from "@/config/axiosInstance";
import type { TokenPrice } from "@/types/token";

export const getTokenPrices = async (): Promise<TokenPrice[]> => {
	return axiosInstance.get("https://interview.switcheo.com/prices.json");
};
