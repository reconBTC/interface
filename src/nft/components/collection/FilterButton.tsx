import clsx from 'clsx'
import { Box } from 'nft/components/Box'
import * as styles from 'nft/components/collection/FilterButton.css'
import { FilterIcon } from 'nft/components/icons'
import { useIsCollectionLoading } from 'nft/hooks'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

const HideOnMediumBreakpoint = styled.div`
  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    display: none;
  }
`

export const FilterButton = ({
  onClick,
  isMobile,
  isFiltersExpanded,
}: {
  isMobile: boolean
  isFiltersExpanded: boolean
  onClick: () => void
}) => {
  const isCollectionNftsLoading = useIsCollectionLoading((state) => state.isCollectionNftsLoading)

  return (
    <Box
      display="flex"
      gap="8"
      className={clsx(styles.filterButton, !isFiltersExpanded && styles.filterButtonExpanded)}
      borderRadius="12"
      fontSize="16"
      cursor="pointer"
      position="relative"
      onClick={onClick}
      paddingTop="12"
      paddingLeft="12"
      paddingBottom="12"
      paddingRight={isMobile ? '8' : '12'}
      width={isMobile ? '44' : 'auto'}
      height="44"
      whiteSpace="nowrap"
    >
      <FilterIcon />
      <HideOnMediumBreakpoint>
        <ThemedText.SubHeader>Filter</ThemedText.SubHeader>
      </HideOnMediumBreakpoint>
    </Box>
  )
}
