<script lang="ts">
  import ChainBadge from './ChainBadge.svelte'
  import {
    defaultNotifyEventStyles,
    unrecognizedChainStyle
  } from '../../utils.js'
  import type { Notification, ChainStyle } from '../../types.js'
  export let chainStyles: ChainStyle = unrecognizedChainStyle
  export let notification: Notification
</script>

<style>
  div.notification-icons-wrapper {
    height: 30px;
    width: 30px;
  }
  .border {
    border-radius: 8px;
  }
  div.notification-icon {
    padding: 6px;
  }

  div.pending-icon {
    animation: blink 2s ease-in infinite;
    height: 100%;
    width: 100%;
    padding: 7px;
  }
  @keyframes blink {
    from,
    to {
      opacity: 1;
    }
    50% {
      opacity: 0.2;
    }
  }
  div.border-action {
    height: 32px;
    min-width: 32px;
    border-radius: 8px;
    overflow: hidden;
    will-change: transform;
  }
  div.border-action:before {
    content: '';
    background-image: conic-gradient(#d7ae31 20deg, #9e916a 120deg);
    height: 140%;
    width: 140%;
    position: absolute;
    left: -25%;
    top: -25%;
    animation: rotate 2s infinite linear;
  }

  div.chain-icon-container {
    left: 18px;
    top: 18px;
  }
  @keyframes rotate {
    100% {
      transform: rotate(-360deg);
    }
  }
</style>

{#if notification.type}
  <div class="relative">
    {#if notification.type === 'pending'}
      <div class="border-action absolute" />
    {/if}

    <div
      class="flex items-center justify-center border relative notification-icons-wrapper"
      style={`background:${
        defaultNotifyEventStyles[notification.type]['backgroundColor']
      }; color: ${
        defaultNotifyEventStyles[notification.type]['iconColor'] || ''
      }; ${ 'height: 28px; width: 28px; margin: 2px;'}; `}
    >
      <div
        class={`notification-icon flex items-center justify-center ${
          notification.type === 'pending' ? 'pending-icon' : ''
        }`}
      >
        {@html defaultNotifyEventStyles[notification.type]['eventIcon']}
      </div>
    </div>
    {#if !notification.id.includes('customNotification') && !notification.id.includes('preflight')}
      <div class="absolute chain-icon-container">
        <ChainBadge
          icon={chainStyles.icon}
          size={16}
          background={chainStyles.color}
          borderColorVar={`--notify-onboard-background, var(--onboard-gray-600, var(--gray-600))`}
          padding={3}
        />
      </div>
    {/if}
  </div>
{/if}
