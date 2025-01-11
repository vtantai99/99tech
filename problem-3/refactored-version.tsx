// Refactored: Added blockchain with union type for better type safety.
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  usdValue: number; // Added `usdValue` to the interface because it's used in rows.
}

interface Props extends BoxProps {}

// Refactored: Using `PropsWithChildren<Props>` for better clarity and to explicitly allow children in the component.
const WalletPage: React.FC<PropsWithChildren<Props>> = (props: PropsWithChildren<Props>) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Refactored: Specified blockchain type as union for better type safety.
  const getPriority = (blockchain: Blockchain): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        // Refactored: Ensured blockchain is always valid to avoid reaching default.
        throw new Error("Invalid blockchain");
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Refactored: Rename lhsPriority -> balancePriority
        // Combined nested if statements for readability.
        return balancePriority > -99 && balance.amount <= 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // Refactored: Simplified sorting logic.
        return leftPriority - rightPriority;
      });
    // Refactored: Removed `prices` from dependencies since it's not used here.
  }, [balances]);

  // Refactored: Combined the logic for formatting with row rendering.
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      const usdValue = prices[balance.currency] * balance.amount; // Calculate `usdValue` here.
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
        usdValue, // Include `usdValue` in the result
      };
    });
  }, [sortedBalances, prices]); // Add `prices` to the dependency array since `usdValue` depends on it.

  // Refactored: Memorized the `rows` to avoid redundant calculations.
  const rows = useMemo(() => {
    return formattedBalances.map((formattedBalance: FormattedWalletBalance) => {
      return (
        <WalletRow
          className={classes.row}
          // Refactored: Used `balance.currency` as key for stability.
          key={formattedBalance.currency}
          amount={formattedBalance.amount}
          usdValue={formattedBalance.usdValue}
          formattedAmount={formattedBalance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return (
    <div {...rest}>
      {/* I can't determine which props are passed from the parent component. */}
      {/* If I knew the props, I could explicitly pass only the necessary ones. */}
      {rows}
    </div>
  );
};
