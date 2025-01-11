interface WalletBalance {
  currency: string;
  amount: number;
  // Issue 1: Adding 'blockchain' because it's needed in getPriority.
  // Refactor: Add 'blockchain' for type safety.
  // I will use a union type because all blockchain values are handled in the switch-case of the getPriority function.
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

// Issue 2: Use `PropsWithChildren` for better clarity (This is not an issue, but I want more clarity)..
// Refactor: Use `PropsWithChildren<Props>` to allow children in the component.
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Issue 3: The blockchain parameter should not be of type any.
  // Refactor: Use a union type as I mentioned in issue 1.
  const getPriority = (blockchain: any): number => {
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
        // Issue 4: Default case should not occur if blockchain is valid.
        // Refactor: Ensure blockchain is always valid to avoid reaching default.
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // Issue 5: Typo or undeclared variable `lhsPriority`.
        // Refactor: Change `lhsPriority` to `balancePriority`.
        const lhsPriority = getPriority(balance.blockchain);
        // Issue 6: Two nested if statements are unnecessary.
        // Refactor: Combine the two if statements for readability.
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // Issue 7: Nested if-else statements are redundant.
        // Refactor: Use `return leftPriority - rightPriority` to simplify.
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
    // Issue 8: `prices` is not needed in the dependency array.
    // Refactor: Remove `prices` from dependencies as it's not used.
  }, [balances, prices]);

  // Issue 9: `formattedBalances` is never used.
  // Refactor: Use `formattedBalances` for the `rows` logic, as it already contains the `formatted` field.
  // This avoids recalculating `formatted` in `rows` and ensures the correct use of pre-computed data.
  // MUST useMemo to memorize the result for performance.
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      };
    });
  }, [sortedBalances]);

  // Issue 10: `usdValue` is calculated in `rows`, which leads to repeated calculations.
  // Refactor: Combine the `usdValue` calculation with `formattedBalances` to avoid redundant calculations.
  // We now calculate `usdValue` once along with `formatted` data inside `formattedBalances`.
  // This ensures that `rows` are computed more efficiently and only require referencing the pre-calculated data.
  // MUST useMemo for memorization to ensure the array is not recalculated unnecessarily.
  const rows = useMemo(() => {
    return sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // Issue 11: Using `index` as key is not stable.
          // Refactor: Use `balance.currency` as key for stability.
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [sortedBalances, prices]);

  return (
    <div {...rest}>
      {/* Issue 12: Spreading props like `{...rest}` can cause unexpected behavior */}
      {/* Refactor: Pass only necessary props explicitly instead of spreading. */}
      {rows}
    </div>
  );
};
