import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "./components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./components/ui/select";
import { calculateExchangeRate } from "./lib/calculateExchangeRate";
import { generateTokenIcon } from "./lib/generateTokenIcon";
import type { SelectOption } from "./types/form";
import type { TokenPrice } from "./types/token";

type Props = {
	tokenPrices: TokenPrice[];
	isLoading: boolean;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	setConvertedAmount: Dispatch<SetStateAction<number | null>>;
};

const defaultValues = {
	fromCurrency: "",
	toCurrency: "",
	amount: "0",
};

const CurrencyForm = (props: Props) => {
	const { tokenPrices, isLoading, setIsLoading, setConvertedAmount } = props;

	const form = useForm({
		defaultValues,
		mode: "onChange",
	});

	const selectOptions: SelectOption[] = useMemo(
		() =>
			tokenPrices.map((tokenPrice) => ({
				value: tokenPrice.currency,
				label: (
					<div className="flex items-center gap-3">
						<img
							src={generateTokenIcon(tokenPrice.currency)}
							alt="token-icon"
						/>
						<span>{tokenPrice.currency}</span>
					</div>
				),
			})),
		[tokenPrices],
	);

	const onSubmit = (values: typeof defaultValues) => {
		const { fromCurrency, toCurrency, amount } = values;
		const numericAmount = Number.parseFloat(amount);

		if (fromCurrency && toCurrency && numericAmount > 0) {
			setIsLoading(true);

			setTimeout(() => {
				const result = calculateExchangeRate({
					fromCurrency,
					toCurrency,
					amount: numericAmount,
					tokenPrices: tokenPrices,
				});
				if (result) {
					setConvertedAmount(result);
				} else {
					toast("Error!", {
						description: "Could not calculate the exchange rate",
					});
				}
				setIsLoading(false);
			}, 1500);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				{/* From Currency Field */}
				<FormField
					control={form.control}
					name="fromCurrency"
					rules={{ required: "Please select a currency" }}
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>From Currency</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select currency" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{selectOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fieldState.error && (
								<p className="text-red-500">{fieldState.error.message}</p>
							)}
						</FormItem>
					)}
				/>

				{/* To Currency Field */}
				<FormField
					control={form.control}
					name="toCurrency"
					rules={{ required: "Please select a currency" }}
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>To Currency</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select currency" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{selectOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fieldState.error && (
								<p className="text-red-500">{fieldState.error.message}</p>
							)}
						</FormItem>
					)}
				/>
				{/* Amount Input Field */}
				<FormField
					control={form.control}
					name="amount"
					rules={{
						required: "Please enter an amount",
						min: { value: 0.01, message: "Amount must be greater than 0" },
					}}
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input type="number" placeholder="Amount" {...field} />
							</FormControl>
							{fieldState.error && (
								<p className="text-red-500">{fieldState.error.message}</p>
							)}
						</FormItem>
					)}
				/>
				<Button type="submit" className="mt-3" disabled={isLoading}>
					{isLoading ? "Processing..." : "Swap"}
				</Button>
			</form>
		</Form>
	);
};

export default CurrencyForm;
