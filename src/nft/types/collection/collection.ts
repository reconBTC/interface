import { Markets, TokenType } from '../common'
export interface AssetPayload {
  filters: {
    traits?: Record<string, string[]>
    address: string
    currentEthPrice?: {
      $gte?: number
      $lte?: number
    }
    numTraits?: { traitCount: string }[]
    name?: string
    searchText?: string
    notForSale?: boolean
    tokenId?: string
  }
  fields?: Record<string, number>
  limit: number
  offset?: number
  sort?: CollectionSort
  markets?: string[]
}

export interface CollectionInfoForAsset {
  collectionSymbol: string
  collectionDescription: string | null
  collectionImageUrl: string
  collectionName: string
  isVerified: boolean
  totalSupply: number
}

export type CollectionSort = Record<
  string,
  'asc' | 'desc' | 1 | -1 | { $gte?: string | number; $lte?: string | number } | string | number
>

export enum UniformHeights {
  unset,
  notUniform,
}

export type UniformHeight = UniformHeights | number

export enum ActivityEventType {
  Listing = 'LISTING',
  Sale = 'SALE',
  CancelListing = 'CANCEL_LISTING',
  Transfer = 'TRANSFER',
}

export enum ActivityEventTypeDisplay {
  'LISTING' = 'Listed',
  'SALE' = 'Sold',
  'TRANSFER' = 'Transferred',
  'CANCEL_LISTING' = 'Cancelled',
}

export enum OrderStatus {
  VALID = 'VALID',
  EXECUTED = 'EXECUTED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface ActivityFilter {
  collectionAddress?: string
  eventTypes?: ActivityEventType[]
  marketplaces?: Markets[]
}

export interface ActivityEventResponse {
  events: ActivityEvent[]
  cursor?: string
}

export interface Order {
  collectionAddress: Lowercase<string>
  tokenId: string
  price: string
  currency: string
  decimal: number
  quantity: number
  orderHash?: Lowercase<string>
  status: string
  createdAt: Date
  startAt: Date
  endAt: Date
  marketplace: string
  marketplaceUrl: string
  maker?: Lowercase<string>
  taker?: Lowercase<string>
  auctionType?: string
}

export interface TokenRarity {
  rank: number
  score: number
  source: string
}

export interface TokenMetadata {
  name: string
  imageUrl: string
  smallImageUrl: string
  metadataUrl: string
  rarity: TokenRarity
  suspiciousFlag: boolean
  suspiciousFlaggedBy: string
  standard: TokenType
}

export interface ActivityEvent {
  collectionAddress: string
  tokenId?: string
  tokenMetadata?: TokenMetadata
  eventType: ActivityEventType
  marketplace?: Markets
  fromAddress: string
  toAddress?: string
  transactionHash?: string
  orderHash?: string
  orderStatus?: OrderStatus
  price?: string
  symbol?: string
  quantity?: number
  auctionType?: string
  url?: string
  eventTimestamp?: number
}
