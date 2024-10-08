<script lang="ts">
  import { onDestroy } from 'svelte'
  import { _ } from 'svelte-i18n'
  import StatusIconBadge from './StatusIconBadge.svelte'
  import NotificationContent from './NotificationContent.svelte'
  import type { Notification } from '../../types.js'
  import closeIcon from '../../icons/close-circle.js'
  import { configuration } from '../../configuration.js'
  import { removeTransaction, transactions$, wallets$ } from '../../streams.js'
  import { chainStyles, defaultNotifyEventStyles, networkToChainId } from '../../utils.js'

  import {
    addCustomNotification,
    removeNotification
  } from '../../store/actions.js'

  import {
    actionableEventCode,
    replaceTransaction,
    validGasNetwork,
    walletSupportsReplacement
  } from '../../replacement.js'

  const { device, gas } = configuration

  export let notification: Notification
  export let updateParentOnRemove: () => void

  // eslint-disable-next-line no-undef
  let timeoutId: NodeJS.Timeout
  let hovered = false

  // get transaction based on notification id
  const transaction = transactions$
    .getValue()
    .find(({ hash }) => hash === notification.id)

  // get wallet that sent transaction
  const wallet =
    transaction &&
    $wallets$.find(
      ({ accounts }) =>
        !!accounts.find(
          ({ address }) =>
            address.toLowerCase() === transaction.from.toLowerCase()
        )
    )

  $: if (notification.autoDismiss) {
    timeoutId = setTimeout(() => {
      removeNotification(notification.id)
      removeTransaction(notification.id)
    }, notification.autoDismiss)
  }

  onDestroy(() => {
    clearTimeout(timeoutId)
  })
</script>

<style>
  .bn-notify-notification {
    --backround-color: var(--notify-onboard-background, var(--w3o-backround-color, var(--gray-700)));
    --foreground-color: var(--w3o-foreground-color, var(--gray-600));
    --text-color: var(--w3o-text-color, #FFF);
    --border-color: var(--w3o-border-color);
    padding: 14px 12px;
    font-family: inherit;
    transition: background 300ms ease-in-out, color 300ms ease-in-out;
    pointer-events: all;
    backdrop-filter: blur(5px);
    min-height: 56px;
    max-width: 318px;
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    position: relative;
    overflow: hidden;
    border: 1px solid transparent;
    border-radius: var(
      --notify-onboard-border-radius,
      var(--onboard-border-radius-4, var(--border-radius-4))
    );
    background: var(--foreground-color);
    color: var(--text-color);
  }

  .bn-notify-notification:hover
    > div.bn-notify-notification-inner
    > div.notify-close-btn-desktop {
    visibility: visible;
    opacity: 1;
  }

  div.notify-close-btn {
    margin-bottom: auto;
    height: 28px;
    width: 28px;
    margin-right: -14px;
  }

  .notify-close-btn .close-icon {
    width: 20px;
    margin: auto;
  }

  .transaction-status {
    color: var(
      --notify-onboard-transaction-status-color,
      var(--onboard-primary-100, var(--primary-100))
    );
    line-height: 14px;
  }

  .dropdown {
    height: 0px;
    overflow: hidden;
    transition: height 150ms ease-in-out;
  }

  .dropdown-visible {
    height: 48px;
  }

  .dropdown-buttons {
    background-color: var(
      --notify-onboard-dropdown-background,
      var(--onboard-gray-700, var(--gray-700))
    );
    width: 100%;
    padding: 8px;
  }

  .dropdown-button {
    padding: 4px 12px;
    border-radius: var(
      --notify-onboard-dropdown-border-radius,
      var(--onboard-border-radius-5, var(--border-radius-5))
    );
    background-color: transparent;
    font-size: var(
      --notify-onboard-dropdown-font-size,
      var(--onboard-font-size-6, var(--font-size-6))
    );
    color: var(
      --notify-onboard-dropdown-text-color,
      var(--onboard-primary-400, var(--primary-400))
    );
    transition: all 150ms ease-in-out;
    cursor: pointer;
  }

  .dropdown-button:hover {
    background: var(
      --notify-onboard-dropdown-btn-hover-background,
      rgba(146, 155, 237, 0.2)
    );
  }
</style>

<div
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  class:bn-notify-clickable={notification.onClick}
  on:click={e => notification.onClick && notification.onClick(e)}
  class="bn-notify-notification bn-notify-notification-{notification.type}}"
  style={`${ `border: 2px solid ${
               defaultNotifyEventStyles[notification.type]['borderColor']
          }`};`}
>
  <div class="flex bn-notify-notification-inner">
    <StatusIconBadge
      {notification}
      chainStyles={chainStyles[networkToChainId[notification.network]]}
    />
    <NotificationContent {notification} />

    <div
      on:click|stopPropagation={() => {
        removeNotification(notification.id)
        removeTransaction(notification.id)
        updateParentOnRemove()
      }}
      class="notify-close-btn notify-close-btn-{device.type} pointer flex"
    >
      <div class="flex items-center close-icon"
           style={`${ `color: ${
               defaultNotifyEventStyles[notification.type]['borderColor']
          }`};`}
      >
        {@html closeIcon}
      </div>
    </div>
  </div>

  <!-- HOVER ACTION DROPDOWN -->
  <div
    class="dropdown"
    class:dropdown-visible={hovered &&
      gas &&
      actionableEventCode(notification.eventCode) &&
      validGasNetwork(notification.network) &&
      walletSupportsReplacement(wallet)}
  >
    {#if notification.eventCode === 'txPool'}
      <div class="dropdown-buttons flex items-center justify-end">
        <button
          on:click={async () => {
            try {
              await replaceTransaction({ type: 'cancel', wallet, transaction })
            } catch (error) {
              // we want a unique id so that the hint notification does not replace the pending notification, so it can't just be the hash
              // but the id is displayed as a hash, so we need to insert the error in the middle
              const id = `${transaction.hash.slice(
                0,
                9
              )}:txReplaceError${transaction.hash.slice(-5)}`

              addCustomNotification({
                id,
                type: 'hint',
                eventCode: 'txError',
                message: $_('notify.transaction.txReplaceError'),
                key: id,
                autoDismiss: 4000
              })
            }
          }}
          class="dropdown-button">Cancel</button
        >
        <button
          on:click={async () => {
            try {
              await replaceTransaction({
                type: 'speedup',
                wallet,
                transaction
              })
            } catch (error) {
              // we want a unique id so that the hint notification does not replace the pending notification, so it can't just be the hash
              // but the id is displayed as a hash, so we need to insert the error in the middle
              const id = `${transaction.hash.slice(
                0,
                9
              )}:txReplaceError${transaction.hash.slice(-5)}`

              addCustomNotification({
                id,
                type: 'hint',
                eventCode: 'txError',
                message: $_('notify.transaction.txReplaceError'),
                key: id,
                autoDismiss: 4000
              })
            }
          }}
          class="dropdown-button">Speed-up</button
        >
      </div>
    {/if}
  </div>
</div>
