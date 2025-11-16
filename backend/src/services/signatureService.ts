import { recoverMessageAddress, type Hex } from "viem"

export async function recoverAddress(message: any, signature: Hex) {
  const msg = JSON.stringify(message)
  return recoverMessageAddress({ message: msg, signature })
}