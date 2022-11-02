import { style } from '@vanilla-extract/css'
import { breakpoints, sprinkles, themeVars } from 'nft/css/sprinkles.css'

export const container = style([
  sprinkles({
    overflow: 'auto',
    height: 'viewHeight',
    paddingTop: '4',
  }),
  {
    width: '300px',
    paddingBottom: '96px',
    scrollbarWidth: 'none',
    '@media': {
      [`(max-width: ${breakpoints.md}px)`]: {
        width: 'auto',
        height: 'auto',
        paddingBottom: '0px',
      },
    },
    selectors: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
])

export const rowHover = style([
  {
    ':hover': {
      background: themeVars.colors.backgroundInteractive,
      borderRadius: 12,
    },
  },
])

export const row = style([
  sprinkles({
    display: 'flex',
    paddingRight: '16',
    cursor: 'pointer',
    fontSize: '16',
    lineHeight: '20',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: { sm: '16', md: '16', lg: '12' },
    paddingTop: '10',
    paddingBottom: '10',
  }),
])

export const subRowHover = style({
  ':hover': {
    background: themeVars.colors.backgroundInteractive,
  },
})

export const borderTop = sprinkles({
  borderTopStyle: 'solid',
  borderTopColor: 'backgroundOutline',
  borderTopWidth: '1px',
})

export const borderBottom = sprinkles({
  borderBottomStyle: 'solid',
  borderBottomColor: 'backgroundOutline',
  borderBottomWidth: '1px',
})

export const detailsOpen = style([
  borderTop,
  sprinkles({
    overflow: 'hidden',
    marginTop: '8',
    marginBottom: '8',
  }),
])

export const filterDropDowns = style([
  borderBottom,
  sprinkles({
    overflowY: 'scroll',
  }),
  {
    maxHeight: '302px',
    '::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none',
  },
])

export const chevronIcon = style({
  marginLeft: -1,
})

export const chevronContainer = style([
  sprinkles({
    color: 'textSecondary',
    display: 'inline-block',
    height: '28',
    width: '28',
    transition: '250',
  }),
  {
    marginRight: -1,
  },
])
