import { firstValueFrom } from 'rxjs'
import { filter, withLatestFrom, pluck } from 'rxjs/operators'
import { configuration } from './configuration.js'
import { state } from './store/index.js'
import { setWalletModules } from './store/actions.js'
import { connectWallet$, wallets$ } from './streams.js'
import type {
  ConnectOptions,
  ConnectOptionsString,
  WalletState
} from './types.js'
import { wait } from './utils.js'
import { validateConnectOptions } from './validation.js'


  async function connect(
    options ?: ConnectOptions | ConnectOptionsString
): Promise<WalletState[]> {
  if (options) {
    // const error = validateConnectOptions(options)
    // if (error) {
    //   throw error
    // }
  }

  const { chains } = state.get()

  // Wallets require the chains for initializing providers,
  // so we must ensure at least one is set
  if (!chains.length)
    throw new Error(
        'At least one chain must be set before attempting to connect a wallet'
    )

  const { autoSelect } = options || {
    autoSelect: { label: '', disableModals: false, type: 'evm' }
  }

  // if auto selecting, wait until next event loop
  if (autoSelect && (typeof autoSelect === 'string' || autoSelect.label)) {
    await wait(50)
  }

  // first time calling connect, so initialize and set wallet modules
  if (!state.get().walletModules.length) {
    setWalletModules(configuration.initialWalletInit)
  }


  connectWallet$.next({
    autoSelect:
        typeof autoSelect === 'string'
            ? { label: autoSelect, disableModals: false, type: 'evm' }
            : autoSelect,
    inProgress: true
  })


  const result$ = connectWallet$.pipe(
      filter(
          ({ inProgress, actionRequired }) =>
              inProgress === false && !actionRequired
      ),
      withLatestFrom(wallets$),
      pluck(1)
  )

  return firstValueFrom(result$)
}

export default connect
