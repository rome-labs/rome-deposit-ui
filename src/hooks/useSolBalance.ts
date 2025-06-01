import { SOLANA_RPC_URL } from "@/constants";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatUnits } from "ethers";

const BALANCE_KEY = "sol-balance";

const useSolBalance = ({ address }: { address: string | null }) => {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery<number>(
    {
      queryKey: [BALANCE_KEY, address],
      queryFn: async () => {
        if (!address) {
          return 0;
        }

        const connection = new Connection(SOLANA_RPC_URL);
        const pubkey = new PublicKey(address);
        const lamports = await connection.getBalance(pubkey, "confirmed");
        const balance = Number(formatUnits(lamports, 9));
        return balance;
      },
      refetchInterval: 10_000,
      enabled: !!address,
    },
    queryClient
  );

  return {
    ...rest,
    data: data ?? 0,
    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: [BALANCE_KEY, address] }),
  };
};

export default useSolBalance;
