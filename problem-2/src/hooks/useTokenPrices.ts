import { getTokenPrices } from "@/services/token";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useTokenPrices = () => {
	const tokenPrices = useQuery({
		queryKey: ["token"],
		queryFn: getTokenPrices,
	});

	const uniqueTokenPrices = useMemo(
		() => [
			...new Map(
				(tokenPrices.data || []).map((item) => [item.currency, item]),
			).values(),
		],
		[tokenPrices.data],
	);

	return {uniqueTokenPrices};
};
