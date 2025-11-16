import "dotenv/config";

export const env = {
  rpc: process.env.RPC_URL as string,
  privateKey: process.env.PRIVATE_KEY as string,
  contractAddress: process.env.CONTRACT_ADDRESS as string,
  port: Number(process.env.PORT || 4000),
  chain: process.env.CHAIN as string
}