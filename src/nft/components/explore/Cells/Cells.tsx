import { formatEther } from '@ethersproject/units'
import { SquareArrowDownIcon, SquareArrowUpIcon, VerifiedIcon } from 'nft/components/icons'
import { Denomination } from 'nft/types'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

import { ethNumberStandardFormatter, formatWeiToDecimal } from '../../../utils/currency'
import { putCommas } from '../../../utils/putCommas'
import { formatChange } from '../../../utils/toSignificant'
import { Box } from '../../Box'
import { Column, Row } from '../../Flex'
import * as styles from './Cells.css'

const CollectionNameContainer = styled.div`
  display: flex;
  padding: 14px 0px 14px 8px;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const CollectionName = styled.div`
  margin-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const RoundedImage = styled.div<{ src?: string }>`
  height: 36px;
  width: 36px;
  border-radius: 36px;
  background: ${({ src, theme }) => (src ? `url(${src})` : theme.backgroundModule)};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`

const ChangeCellContainer = styled.div<{ change: number }>`
  display: flex;
  color: ${({ theme, change }) => (change >= 0 ? theme.accentSuccess : theme.accentFailure)};
  justify-content: end;
  align-items: center;
  gap: 2px;
`

const EthContainer = styled.div`
  display: flex;
  justify-content: end;
`

interface CellProps {
  value: {
    logo?: string
    name?: string
    address?: string
    isVerified?: boolean
    value?: number
    change?: number
  }
}

export const CollectionTitleCell = ({ value }: CellProps) => {
  return (
    <CollectionNameContainer>
      <RoundedImage src={value.logo} />
      <CollectionName>
        <ThemedText.SubHeader>{value.name}</ThemedText.SubHeader>
      </CollectionName>
      {value.isVerified && (
        <span className={styles.verifiedBadge}>
          <VerifiedIcon />
        </span>
      )}
    </CollectionNameContainer>
  )
}

export const WithCommaCell = ({ value }: CellProps) => <span>{value.value ? putCommas(value.value) : '-'}</span>

export const EthCell = ({
  value,
  denomination,
  usdPrice,
}: {
  value?: number
  denomination: Denomination
  usdPrice?: number
}) => {
  const denominatedValue =
    denomination === Denomination.ETH
      ? value
      : usdPrice && value
      ? usdPrice * parseFloat(formatEther(value))
      : undefined
  const formattedValue = denominatedValue
    ? denomination === Denomination.ETH
      ? formatWeiToDecimal(denominatedValue.toString(), true) + ' ETH'
      : ethNumberStandardFormatter(denominatedValue, true)
    : '-'

  return (
    <EthContainer>
      <ThemedText.BodyPrimary>{value ? formattedValue : '-'}</ThemedText.BodyPrimary>
    </EthContainer>
  )
}

export const VolumeCell = ({
  value,
  denomination,
  usdPrice,
}: {
  value?: number
  denomination: Denomination
  usdPrice?: number
}) => {
  const denominatedValue = denomination === Denomination.ETH ? value : usdPrice && value ? usdPrice * value : undefined

  const formattedValue = denominatedValue
    ? denomination === Denomination.ETH
      ? ethNumberStandardFormatter(denominatedValue.toString()) + ' ETH'
      : ethNumberStandardFormatter(denominatedValue, true)
    : '-'

  return (
    <EthContainer>
      <ThemedText.BodyPrimary>{value ? formattedValue : '-'}</ThemedText.BodyPrimary>
    </EthContainer>
  )
}

export const ChangeCell = ({ change }: { change?: number }) => (
  <ChangeCellContainer change={change ?? 0}>
    {!change || change > 0 ? (
      <SquareArrowUpIcon width="20px" height="20px" />
    ) : (
      <SquareArrowDownIcon width="20px" height="20px" />
    )}
    <ThemedText.BodyPrimary color="currentColor">{change ? Math.round(change) : 0}%</ThemedText.BodyPrimary>
  </ChangeCellContainer>
)

export const WeiWithDayChange = ({ value }: CellProps) => (
  <Column gap="4">
    <Row justifyContent="flex-end" color="textPrimary">
      {value && value.value ? <>{formatWeiToDecimal(value.value.toString(), true)} ETH</> : '-'}
    </Row>
    {value.change ? (
      <Box
        as="span"
        color={value.change > 0 ? 'green' : 'accentFailure'}
        fontWeight="normal"
        fontSize="12"
        position="relative"
      >
        {value.change > 0 && '+'}
        {formatChange(value.change)}%
      </Box>
    ) : null}
  </Column>
)

export const CommaWithDayChange = ({ value }: CellProps) => (
  <Column gap="4">
    <WithCommaCell value={value} />
    {value.change ? (
      <Box
        as="span"
        color={value.change > 0 ? 'green' : 'accentFailure'}
        fontWeight="normal"
        fontSize="12"
        position="relative"
      >
        {value.change > 0 && '+'}
        {formatChange(value.change)}%
      </Box>
    ) : null}
  </Column>
)
