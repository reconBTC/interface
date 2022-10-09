import { EMPTY_TOKEN_LIST, OnReviewSwapClick, SwapWidget, SwapWidgetSkeleton } from '@uniswap/widgets'
import { useWeb3React } from '@web3-react/core'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useIsDarkMode } from 'state/user/hooks'
import { DARK_THEME, LIGHT_THEME } from 'theme/widget'

import { Tokens, useSyncWidgetInputs } from './inputs'
import { useSyncWidgetSettings } from './settings'
import { useSyncWidgetTransactions } from './transactions'

export type { Tokens } from './inputs'
export { Field } from '@uniswap/widgets'
export const WIDGET_WIDTH = 360

const WIDGET_ROUTER_URL = 'https://api.uniswap.org/v1/'

export interface WidgetProps {
  tokens: Tokens
  onTokensChange: (tokens: Tokens) => void
  onReviewSwapClick?: OnReviewSwapClick
}

export default function Widget({ tokens, onTokensChange, onReviewSwapClick }: WidgetProps) {
  const locale = useActiveLocale()
  const theme = useIsDarkMode() ? DARK_THEME : LIGHT_THEME
  const { provider } = useWeb3React()

  const { inputs, tokenSelector } = useSyncWidgetInputs({ tokens, onTokensChange })
  const { settings } = useSyncWidgetSettings()
  const { transactions } = useSyncWidgetTransactions()

  return (
    <>
      <SwapWidget
        disableBranding
        hideConnectionUI
        // jsonRpcUrlMap is excluded - network providers are always passed directly
        routerUrl={WIDGET_ROUTER_URL}
        width={WIDGET_WIDTH}
        locale={locale}
        theme={theme}
        onReviewSwapClick={onReviewSwapClick}
        // defaultChainId is excluded - it is always inferred from the passed provider
        provider={provider}
        tokenList={EMPTY_TOKEN_LIST} // prevents loading the default token list, as we use our own token selector UI
        {...inputs}
        {...settings}
        {...transactions}
      />
      {tokenSelector}
    </>
  )
}

export function WidgetSkeleton() {
  return <SwapWidgetSkeleton theme={useIsDarkMode() ? DARK_THEME : LIGHT_THEME} width={WIDGET_WIDTH} />
}
