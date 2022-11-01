import { FilterIcon } from 'nft/components/icons'
import styled from 'styled-components/macro'

const HideOnMediumBreakpoint = styled.div`
  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    display: none;
  }
`

const FilterContainer = styled.div<{ active: boolean }>`
  position: relative;
  color: ${({ theme, active }) => (active ? theme.accentTextLightPrimary : theme.textPrimary)};
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
  padding: 12px;
  height: 44px;
  z-index: 1;
  overflow: hidden;
`

const FilterTextContainer = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
  z-index: 1;
  pointer-events: none;
`

const FilterBackgroundContainer = styled.div<{ active: boolean }>`
  position: absolute;
  background: ${({ theme, active }) => (active ? theme.accentAction : theme.backgroundInteractive)};
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 0;

  :hover {
    opacity: ${({ theme }) => theme.opacity.hover};
    transition: ${({
      theme: {
        transition: { duration, timing },
      },
    }) => `${duration.fast} background-color ${timing.in}`};
  }

  :active {
    opacity: ${({ theme }) => theme.opacity.click};
    transition: ${({
      theme: {
        transition: { duration, timing },
      },
    }) => `${duration.fast} background-color ${timing.in}`};
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
  return (
    <FilterContainer active={isFiltersExpanded} onClick={onClick}>
      <FilterTextContainer>
        <FilterIcon />
        <HideOnMediumBreakpoint>Filter</HideOnMediumBreakpoint>
      </FilterTextContainer>
      <FilterBackgroundContainer active={isFiltersExpanded} />
    </FilterContainer>
  )
}
