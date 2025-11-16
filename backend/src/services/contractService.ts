import { createPublicClient, createWalletClient, http, parseAbi } from "viem"
import { env } from "../config/env"
import { privateKeyToAccount } from "viem/accounts"
import { resolveChain } from "../config/chain"

const abi = parseAbi([
  "function grantPoints(address user, uint256 amount)",
  "function points(address user) view returns (uint256)"
])

const account = privateKeyToAccount(env.privateKey as `0x${string}`)

const chain = resolveChain(env.chain)

const publicClient = createPublicClient({
  chain: chain,
  transport: http(env.rpc)
})

const walletClient = createWalletClient({
  account,
  chain: chain,
  transport: http(env.rpc)
})

export async function writePoints(wallet: string, amount: number) {
  return walletClient.writeContract({
    account,
    address: env.contractAddress as `0x${string}`,
    abi,
    functionName: "grantPoints",
    args: [wallet as `0x${string}`, BigInt(amount)]
  })
}

export async function readPoints(wallet: string) {
  return publicClient.readContract({
    address: env.contractAddress as `0x${string}`,
    abi,
    functionName: "points",
    args: [wallet as `0x${string}`]
  })
}