import type { AppState } from './types.js'

export const APP_INITIAL_STATE: AppState = {
  wallets: [],
  walletModules: [],
  chains: [],
  accountCenter: {
    enabled: true,
    position: 'bottomRight',
    expanded: false,
    minimal: true
  },
  notify: {
    enabled: true,
    transactionHandler: () => {},
    position: 'topRight',
    replacement: {
      gasPriceProbability: {
        speedup: 80,
        cancel: 95
      }
    }
  },
  notifications: [],
  locale: '',
  connect: {
    showSidebar: true,
    disableClose: false
  },
  appMetadata: null,
}

export const STORAGE_KEYS = {
  TERMS_AGREEMENT: 'onboard.js:agreement',
  LAST_CONNECTED_WALLET: 'onboard.js:last_connected_wallet',
  CONNECT_HD_WALLET_MODAL : 'onboard.js:connect_hd_wallet_modal',
  GET_ONLY_CHAIN_NETWORK_LEDGER : 'onboard.js:get_only_chain_network_ledger'
}

export const MOBILE_WINDOW_WIDTH = 768

export const BN_BOOST_RPC_URL = 'https://rpc.blocknative.com/boost'
export const BN_BOOST_INFO_URL = 'https://docs.blocknative.com/blocknative-mev-protection/transaction-boost'
