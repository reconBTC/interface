import { Order } from 'nft/types'

export const OrderFetcher = async (tokenId: string, contractAddress: string, offset: number): Promise<Order[]> => {
  const url = `${process.env.REACT_APP_GENIE_V3_API_URL}/orders?token_id=${tokenId}&address=${contractAddress}&limit=10&offset=${offset}`

  const r = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await r.json()
  return data.data.orders
}
