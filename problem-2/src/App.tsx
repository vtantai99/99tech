import { useState } from "react";
import CurrencyForm from "./CurrencyForm";
import { Skeleton } from "./components/ui/skeleton";
import { useTokenPrices } from "./hooks/useTokenPrices";

const App = () => {
	const { uniqueTokenPrices } = useTokenPrices();
	const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div className="max-w-lg mx-auto mt-10 p-4 bg-white rounded-lg shadow-lg">
			<h2 className="text-lg font-bold mb-4">Currency Swap</h2>
			<CurrencyForm
				tokenPrices={uniqueTokenPrices}
				isLoading={isLoading}
				setConvertedAmount={setConvertedAmount}
				setIsLoading={setIsLoading}
			/>
			<div className="mt-4 min-h-6">
				{isLoading ? (
					<Skeleton className="w-full h-6 rounded-lg" />
				) : (
					convertedAmount && (
						<p className="text-green-600">
							You will receive: {convertedAmount.toFixed(7)}
						</p>
					)
				)}
			</div>
		</div>
	);
};

export default App;
