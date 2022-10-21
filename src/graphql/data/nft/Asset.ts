import graphql from 'babel-plugin-relay/macro'
import { parseEther } from 'ethers/lib/utils'
import { GenieAsset } from 'nft/types'
import { loadQuery, usePaginationFragment, usePreloadedQuery } from 'react-relay'

import RelayEnvironment from '../RelayEnvironment'
import { AssetPaginationQuery } from './__generated__/AssetPaginationQuery.graphql'
import { AssetQuery, NftAssetsFilterInput, NftAssetSortableField } from './__generated__/AssetQuery.graphql'

const assetPaginationQuery = graphql`
  fragment AssetQuery_nftAssets on Query @refetchable(queryName: "AssetPaginationQuery") {
    nftAssets(
      address: $address
      orderBy: $orderBy
      asc: $asc
      filter: $filter
      first: $first
      after: $after
      last: $last
      before: $before
    ) @connection(key: "AssetQuery_nftAssets") {
      edges {
        node {
          id
          name
          ownerAddress
          image {
            url
          }
          smallImage {
            url
          }
          originalImage {
            url
          }
          tokenId
          description
          animationUrl
          suspiciousFlag
          collection {
            name
            isVerified
            image {
              url
            }
            creator {
              address
              profileImage {
                url
              }
              isVerified
            }
            nftContracts {
              address
              standard
            }
          }
          listings(first: 1) {
            edges {
              node {
                address
                createdAt
                endAt
                id
                maker
                marketplace
                marketplaceUrl
                orderHash
                price {
                  currency
                  value
                }
                quantity
                startAt
                status
                taker
                tokenId
                type
              }
              cursor
            }
          }
          rarities {
            provider
            rank
            score
          }
          nftContract {
            address
            chain
          }
          metadataUrl
        }
      }
    }
  }
`

const assetQuery = graphql`
  query AssetQuery(
    $address: String!
    $orderBy: NftAssetSortableField
    $asc: Boolean
    $filter: NftAssetsFilterInput
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    ...AssetQuery_nftAssets
  }
`

export function useAssetsQuery(
  address: string,
  orderBy: NftAssetSortableField,
  asc: boolean,
  filter: NftAssetsFilterInput,
  first?: number,
  after?: string,
  last?: number,
  before?: string
) {
  const assetsQueryReference = loadQuery<AssetQuery>(RelayEnvironment, assetQuery, {
    address,
    orderBy,
    asc,
    filter,
    first,
    after,
    last,
    before,
  })
  const queryData = usePreloadedQuery<AssetQuery>(assetQuery, assetsQueryReference)
  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment<AssetPaginationQuery, any>(
    assetPaginationQuery,
    queryData
  )

  const assets: GenieAsset[] = data.nftAssets?.edges?.map((queryAsset: { node: any }) => {
    const asset = queryAsset.node
    return {
      id: asset.id,
      address: asset.nftContract?.address,
      notForSale: asset.listings?.edges.length === 0,
      collectionName: asset.collection?.name,
      collectionSymbol: asset.collection?.image?.url,
      currentEthPrice: parseEther(asset.listings?.edges[0].node.price.value?.toString() ?? '0').toString(),
      imageUrl: asset.image?.url,
      animationUrl: asset.animationUrl,
      marketplace: asset.listings?.edges[0].node.marketplace,
      name: asset.name,
      // priceInfo: { // FE to start deriving?
      //   ETHPrice: asset.listings?.edges[0].node.price.value,
      //   USDPrice: string
      //   baseAsset: string
      //   baseDecimals: string
      //   basePrice: string
      // },
      susFlag: asset.suspiciousFlag,
      sellorders: asset.listings?.edges,
      smallImageUrl: asset.smallImage?.url,
      tokenId: asset.tokenId,
      tokenType: asset.nftContract?.standard,
      // totalCount?: number, // TODO waiting for BE changes
      collectionIsVerified: asset.collection?.isVerified,
      rarity: {
        primaryProvider: 'Rarity Sniper', // TODO update when backend adds more providers
        providers: asset.rarities,
      },
      owner: asset.ownerAddress,
      creator: {
        profile_img_url: asset.collection?.creator?.profileImage?.url,
        address: asset.collection?.creator?.address,
      },
      metadataUrl: asset.metadataUrl,
    }
  })
  return { assets, hasNext, isLoadingNext, loadNext }
}
