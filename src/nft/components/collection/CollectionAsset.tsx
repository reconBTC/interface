import { BigNumber } from '@ethersproject/bignumber'
import { useBag } from 'nft/hooks'
import { OrderFetcher } from 'nft/queries'
import { GenieAsset, Markets, TokenType, UniformHeight } from 'nft/types'
import { formatWeiToDecimal, isAudio, isVideo, rarityProviderLogo } from 'nft/utils'
import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { QueryClient } from 'react-query'

import * as Card from './Card'

enum AssetMediaType {
  Image,
  Video,
  Audio,
}

interface CollectionAssetProps {
  asset: GenieAsset
  isMobile: boolean
  uniformHeight: UniformHeight
  setUniformHeight: (u: UniformHeight) => void
  mediaShouldBePlaying: boolean
  setCurrentTokenPlayingMedia: (tokenId: string | undefined) => void
  rarityVerified?: boolean
}

export const CollectionAsset = ({
  asset,
  isMobile,
  uniformHeight,
  setUniformHeight,
  mediaShouldBePlaying,
  setCurrentTokenPlayingMedia,
  rarityVerified,
}: CollectionAssetProps) => {
  const addAssetToBag = useBag((state) => state.addAssetToBag)
  const removeAssetFromBag = useBag((state) => state.removeAssetFromBag)
  const itemsInBag = useBag((state) => state.itemsInBag)
  const bagExpanded = useBag((state) => state.bagExpanded)
  const toggleBag = useBag((state) => state.toggleBag)

  const [possibleOrders, setPossibleOrders] = useState<string[]>([asset.currentEthPrice])
  const [orderPriceStack, setOrderPriceStack] = useState<string[]>([asset.currentEthPrice])
  const queryClient = new QueryClient()

  const { quantity, isSelected } = useMemo(() => {
    return {
      quantity: itemsInBag.filter(
        (x) => x.asset.tokenType === 'ERC1155' && x.asset.tokenId === asset.tokenId && x.asset.address === asset.address
      ).length,
      isSelected: itemsInBag.some(
        (item) => asset.tokenId === item.asset.tokenId && asset.address === item.asset.address
      ),
    }
  }, [asset, itemsInBag])

  const { notForSale, assetMediaType } = useMemo(() => {
    let notForSale = true
    let assetMediaType = AssetMediaType.Image

    notForSale = asset.notForSale || BigNumber.from(asset.currentEthPrice ? asset.currentEthPrice : 0).lt(0)
    if (isAudio(asset.animationUrl)) {
      assetMediaType = AssetMediaType.Audio
    } else if (isVideo(asset.animationUrl)) {
      assetMediaType = AssetMediaType.Video
    }

    return {
      notForSale,
      assetMediaType,
    }
  }, [asset])

  const { provider, rarityLogo } = useMemo(() => {
    return {
      provider: asset.rarity?.providers.find(({ provider: _provider }) => _provider === asset.rarity?.primaryProvider),
      rarityLogo: rarityProviderLogo[asset.rarity?.primaryProvider ?? 0] ?? '',
    }
  }, [asset])

  const fetchNextPrice = async () => {
    const data = await queryClient.fetchQuery(
      ['orderFetcher', asset.tokenType, asset.tokenId, asset.address, orderPriceStack.length],
      () =>
        asset.tokenType === TokenType.ERC1155
          ? OrderFetcher(asset.tokenId, asset.address, orderPriceStack.length)
          : undefined
    )

    if (data) {
      const newOrders = data.map((order) => order.price)
      setPossibleOrders([...possibleOrders, ...newOrders])
      setOrderPriceStack(newOrders.sort((a, b) => (BigNumber.from(a).lte(BigNumber.from(b)) ? -1 : 1)))
    }
  }

  useEffect(() => {
    if (asset.tokenType === TokenType.ERC1155) {
      const pricesForToken = itemsInBag
        .filter((item) => item.asset.tokenId === asset.tokenId && item.asset.address === asset.address)
        .map((item) => item.asset.currentEthPrice)

      const pricesAccountedFor = [...orderPriceStack, ...pricesForToken]
      if (pricesAccountedFor.length !== possibleOrders.length) {
        const tempPossibleOrders = [...possibleOrders]
        pricesAccountedFor.forEach((price) => {
          const index = tempPossibleOrders.indexOf(price)
          tempPossibleOrders.splice(index, 1)
        })

        setOrderPriceStack(
          [...tempPossibleOrders, ...orderPriceStack].sort((a, b) =>
            BigNumber.from(a).lte(BigNumber.from(b)) ? -1 : 1
          )
        )
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsInBag])

  return (
    <Card.Container asset={asset} selected={isSelected}>
      {assetMediaType === AssetMediaType.Image ? (
        <Card.Image uniformHeight={uniformHeight} setUniformHeight={setUniformHeight} />
      ) : assetMediaType === AssetMediaType.Video ? (
        <Card.Video
          uniformHeight={uniformHeight}
          setUniformHeight={setUniformHeight}
          shouldPlay={mediaShouldBePlaying}
          setCurrentTokenPlayingMedia={setCurrentTokenPlayingMedia}
        />
      ) : (
        <Card.Audio
          uniformHeight={uniformHeight}
          setUniformHeight={setUniformHeight}
          shouldPlay={mediaShouldBePlaying}
          setCurrentTokenPlayingMedia={setCurrentTokenPlayingMedia}
        />
      )}
      <Card.DetailsContainer>
        <Card.InfoContainer>
          <Card.PrimaryRow>
            <Card.PrimaryDetails>
              <Card.PrimaryInfo>{asset.name ? asset.name : `#${asset.tokenId}`}</Card.PrimaryInfo>
              {asset.openseaSusFlag && <Card.Suspicious />}
            </Card.PrimaryDetails>
            {asset.rarity && provider && provider.rank && (
              <Card.Ranking
                rarity={asset.rarity}
                provider={provider}
                rarityVerified={!!rarityVerified}
                rarityLogo={rarityLogo}
              />
            )}
          </Card.PrimaryRow>
          <Card.SecondaryRow>
            <Card.SecondaryDetails>
              <Card.SecondaryInfo>
                {notForSale
                  ? ''
                  : asset.tokenType === TokenType.ERC1155
                  ? `${formatWeiToDecimal(orderPriceStack[0])} ETH`
                  : `${formatWeiToDecimal(asset.currentEthPrice)} ETH`}
              </Card.SecondaryInfo>
              {(asset.marketplace === Markets.NFTX || asset.marketplace === Markets.NFT20) && <Card.Pool />}
            </Card.SecondaryDetails>
            {asset.tokenType !== 'ERC1155' && asset.marketplace && (
              <Card.MarketplaceIcon marketplace={asset.marketplace} />
            )}
          </Card.SecondaryRow>
        </Card.InfoContainer>
        <Card.Button
          quantity={quantity}
          selectedChildren={'Remove'}
          onClick={(e: MouseEvent) => {
            e.preventDefault()
            if (asset.tokenType === TokenType.ERC1155) {
              addAssetToBag({
                ...asset,
                currentEthPrice: orderPriceStack[0],
                priceInfo: {
                  ...asset.priceInfo,
                  ETHPrice: orderPriceStack[0],
                  basePrice: orderPriceStack[0],
                },
              })
              !bagExpanded && !isMobile && toggleBag()
              orderPriceStack.splice(0, 1)
              if (orderPriceStack.length === 0) {
                fetchNextPrice()
              }
            } else {
              addAssetToBag(asset)
            }
            !bagExpanded && !isMobile && toggleBag()
          }}
          onSelectedClick={(e: MouseEvent) => {
            e.preventDefault()
            if (asset.tokenType === TokenType.ERC1155) {
              removeAssetFromBag(
                itemsInBag
                  .filter((item) => item.asset.address === asset.address && item.asset.tokenId === asset.tokenId)
                  .sort((a, b) =>
                    BigNumber.from(a.asset.currentEthPrice).lte(BigNumber.from(b.asset.currentEthPrice)) ? 1 : -1
                  )[0].asset
              )
            } else {
              removeAssetFromBag(asset)
            }
          }}
        >
          {'Buy now'}
        </Card.Button>
      </Card.DetailsContainer>
    </Card.Container>
  )
}
