import { sepolia, baseSepolia, polygonAmoy, mainnet } from "viem/chains"

export function resolveChain(name: string) {
  if (name === "sepolia") return sepolia
  if (name === "base-sepolia") return baseSepolia
  if (name === "polygon-amoy") return polygonAmoy
  if (name === "mainnet") return mainnet
  throw new Error("Unsupported chain: " + name)
}