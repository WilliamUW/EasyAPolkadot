<script lang="ts">
  import type { Notification } from '../../types.js'
  import { shortenAddress } from '../../utils.js'
  import { _ } from 'svelte-i18n'
  import Timer from './Timer.svelte'

  export let notification: Notification
</script>

<style>
  div.notify-transaction-data {
    font-size: var(
      --notify-onboard-transaction-font-size,
      var(--onboard-font-size-6, var(--font-size-6))
    );
    font-family: inherit;
    margin: 0px 20px 0px 8px;
    justify-content: center;
  }

  .hash-time {
    display: inline-flex;
    margin-top: 4px;
    font-size: var(
      --notify-onboard-hash-time-font-size,
      var(--onboard-font-size-7, var(--font-size-7))
    );
    line-height: var(
      --notify-onboard-hash-time-font-line-height,
      var(--onboard-font-line-height-4, var(--font-line-height-4))
    );
  }

  .address-hash {
    color: var(
      --notify-onboard-address-hash-color,
      var(--onboard-primary-200, var(--primary-200))
    );
  }

  a.address-hash {
    color: var(
      --notify-onboard-anchor-color,
      var(--onboard-primary-400, var(--primary-400))
    );
  }

  a {
    display: flex;
    text-decoration: none;
    color: inherit;
  }

  .transaction-status {
    color: var(--notify-onboard-transaction-status, inherit);
    line-height: 24px;
    font-weight: 400;
    overflow: hidden;
    width: 200px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>

<div class="flex flex-column notify-transaction-data">
  <span class="transaction-status">
    {notification.message}
  </span>

  {#if notification.id && !notification.id.includes('customNotification') && !notification.id.includes('preflight')}
    <span class="hash-time">
      {#if notification.link}
        <a
          class="address-hash"
          href={notification.link}
          target="_blank"
          rel="noreferrer noopener"
        >
          {shortenAddress(notification.id)}
        </a>
      {:else}
        <div class="address-hash">
          {shortenAddress(notification.id)}
        </div>
      {/if}
      <Timer startTime={notification.startTime} />
    </span>
  {/if}
</div>
