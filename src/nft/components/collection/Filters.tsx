import { Box } from 'nft/components/Box'
import * as styles from 'nft/components/collection/Filters.css'
import { MarketplaceSelect } from 'nft/components/collection/MarketplaceSelect'
import { PriceRange } from 'nft/components/collection/PriceRange'
import { Column, Row } from 'nft/components/Flex'
import { BagCloseIcon } from 'nft/components/icons'
import { Checkbox } from 'nft/components/layout/Checkbox'
import { subhead } from 'nft/css/common.css'
import { useCollectionFilters, useFiltersExpanded } from 'nft/hooks'
import { Trait } from 'nft/hooks/useCollectionFilters'
import { TraitPosition } from 'nft/hooks/useTraitsOpen'
import { groupBy } from 'nft/utils/groupBy'
import { useMemo, useReducer } from 'react'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

import { TraitSelect } from './TraitSelect'

const FiltersHeader = styled.div`
  display: none;
  justify-content: space-between;
  padding-top: 22px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 8px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    display: flex;
  }
`
const IconWrapper = styled.button`
  background-color: transparent;
  border-radius: 8px;
  border: none;
  color: ${({ theme }) => theme.textPrimary};
  cursor: pointer;
  display: flex;
  padding: 2px;
  opacity: 1;
  transition: 125ms ease opacity;
  :hover {
    opacity: 0.6;
  }
  :active {
    opacity: 0.4;
  }
`

export const Filters = ({ traits }: { traits: Trait[] }) => {
  const { buyNow, setBuyNow } = useCollectionFilters((state) => ({
    buyNow: state.buyNow,
    setBuyNow: state.setBuyNow,
  }))
  const [, setFiltersExpanded] = useFiltersExpanded()
  const traitsByGroup: Record<string, Trait[]> = useMemo(() => (traits ? groupBy(traits, 'trait_type') : {}), [traits])
  const [buyNowHovered, toggleBuyNowHover] = useReducer((state) => !state, false)

  const handleBuyNowToggle = () => {
    setBuyNow(!buyNow)
  }

  return (
    <Box className={styles.container}>
      <FiltersHeader>
        <ThemedText.HeadlineSmall>Filter</ThemedText.HeadlineSmall>
        <IconWrapper onClick={() => setFiltersExpanded(false)}>
          <BagCloseIcon />
        </IconWrapper>
      </FiltersHeader>

      <Column marginTop="8">
        <Row
          justifyContent="space-between"
          className={`${styles.row} ${styles.rowHover}`}
          gap="2"
          borderRadius="12"
          paddingTop="12"
          paddingBottom="12"
          onClick={(e) => {
            e.preventDefault()
            handleBuyNowToggle()
          }}
          onMouseEnter={toggleBuyNowHover}
          onMouseLeave={toggleBuyNowHover}
        >
          <Box className={subhead}>Buy now</Box>
          <Checkbox hovered={buyNowHovered} checked={buyNow} onClick={handleBuyNowToggle}>
            <span />
          </Checkbox>
        </Row>
        <MarketplaceSelect />
        <PriceRange />
        {Object.entries(traitsByGroup).length > 0 && (
          <Box
            as="span"
            color="textSecondary"
            paddingLeft="8"
            marginTop="12"
            marginBottom="12"
            className={styles.borderTop}
          ></Box>
        )}

        <Column>
          {Object.entries(traitsByGroup).map(([type, traits], index) => (
            // the index is offset by two because price range and marketplace appear prior to it
            <TraitSelect key={type} {...{ type, traits }} index={index + TraitPosition.TRAIT_START_INDEX} />
          ))}
        </Column>
      </Column>
    </Box>
  )
}
