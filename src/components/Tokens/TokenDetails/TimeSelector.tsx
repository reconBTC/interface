import { TimePeriod } from 'graphql/data/util'
import { useAtomValue } from 'jotai/utils'
import { startTransition, useState } from 'react'
import styled from 'styled-components/macro'

import { MEDIUM_MEDIA_BREAKPOINT } from '../constants'
import { filterTimeAtom } from '../state'
import { DISPLAYS, ORDERED_TIMES } from '../TokenTable/TimeSelector'

export const TimeOptionsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`
export const TimeOptionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
  gap: 4px;
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  border-radius: 16px;
  height: 40px;
  padding: 4px;
  width: fit-content;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    width: 100%;
    justify-content: space-between;
    border: none;
  }
`
const TimeButton = styled.button<{ active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, active }) => (active ? theme.backgroundInteractive : 'transparent')};
  font-weight: 600;
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 12px;
  line-height: 20px;
  border: none;
  cursor: pointer;
  color: ${({ theme, active }) => (active ? theme.textPrimary : theme.textSecondary)};
  transition-duration: ${({ theme }) => theme.transition.duration.fast};
  :hover {
    ${({ active, theme }) => !active && `opacity: ${theme.opacity.hover};`}
  }
`

export type RefetchPricesFunction = (t: TimePeriod) => void
export default function TimePeriodSelector({ refetchTokenPrices }: { refetchTokenPrices: RefetchPricesFunction }) {
  const [timePeriod, setTimePeriod] = useState(useAtomValue(filterTimeAtom))
  return (
    <TimeOptionsWrapper>
      <TimeOptionsContainer>
        {ORDERED_TIMES.map((time) => (
          <TimeButton
            key={DISPLAYS[time]}
            active={timePeriod === time}
            onClick={() => {
              startTransition(() => refetchTokenPrices(time))
              setTimePeriod(time)
            }}
          >
            {DISPLAYS[time]}
          </TimeButton>
        ))}
      </TimeOptionsContainer>
    </TimeOptionsWrapper>
  )
}
