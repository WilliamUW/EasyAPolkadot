<script lang="ts">
  import Spinner from './Spinner.svelte'
  export let scanAccounts: () => Promise<void>
  export let loadingAccounts: boolean
  export let showEmptyAddresses: boolean
  export let errorFromScan: string

</script>

<style>
  button {
    align-items: center;
    padding: 0.5rem 0.5rem;
    color: var(--account-select-white, var(--onboard-white, var(--white)));
    border-radius: 1.5rem;
    font-family: var(
      --account-select-font-family-normal,
      var(--font-family-normal, var(--font-family-normal))
    );
    font-style: normal;
    font-weight: bold;
    font-size: var(
      --account-select-font-size-6,
      var(--onboard-font-size-6, var(--font-size-6))
    );
    line-height: var(
      --account-select-font-line-height-1,
      var(--onboard-line-height-1, var(--line-height-1))
    );
    border: none;

    width: 8rem;
  }


  .button-group-action {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .scan-accounts-btn {
    background: var(
            --account-select-primary-500,
            var(--onboard-primary-500, var(--primary-500))
    );
    color: var(--w3o-text-color, inherit);
    display: flex;
    justify-content: center;
    width: 165px;
    align-items: center;
    cursor: pointer;
  }

  .more-btn:disabled {
    background: var(
            --account-select-gray-800,
            var(--onboard-gray-800, var(--gray-800))
    );
    cursor: default;
  }

  .more-btn {
    background: var(
            --account-select-primary-500,
            var(--onboard-primary-500, var(--primary-500))
    );
    cursor: pointer;
  }

  input:hover {
    border-color: var(
      --account-select-primary-500,
      var(--onboard-primary-300, var(--primary-300))
    );
  }

  input:focus {
    border-color: var(
      --account-select-primary-500,
      var(--onboard-primary-500, var(--primary-500))
    );
    box-shadow: 0 0 1px 1px
      var(
        --account-select-primary-500,
        var(--onboard-primary-500, var(--primary-500))
      );
    box-shadow: 0 0 0 1px -moz-mac-focusring;
    outline: none;
  }

  input:disabled {
    background: var(
      --account-select-accent-background-color,
      var(--onboard-gray-100, var(--gray-100))
    );
  }

  input[type='checkbox'] {
    -webkit-appearance: none;
    width: auto;
    background: var(--account-select-background-color, var(--onboard-white, var(--white)));
    border: 1px solid
      var(--account-select-gray-300, var(--onboard-gray-300, var(--gray-300)));
    padding: 0.5em;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    height: 0.5rem;
    width: 0.5rem;
  }

  input[type='checkbox']:hover {
    border-color: var(
      --account-select-primary-500,
      var(--onboard-primary-500, var(--primary-500))
    );
  }

  input[type='checkbox']:checked {
    background: var(
      --account-select-primary-500,
      var(--onboard-primary-500, var(--primary-500))
    );
    border-color: var(
      --account-select-primary-500,
      var(--onboard-primary-500, var(--primary-500))
    );
    color: var(--account-select-white, var(--onboard-white, var(--white)));
  }

  input[type='checkbox']:checked:after {
    content: url("data:image/svg+xml,%3Csvg width='0.885em' height='0.6em' viewBox='0 0 14 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 6L5 11L14 2L12.59 0.58L5 8.17L1.41 4.59L0 6Z' fill='white'/%3E%3C/svg%3E");
    font-size: var(
      --account-select-font-size-7,
      var(--onboard-font-size-7, var(--font-size-7))
    );
    position: absolute;
    color: var(--account-select-white, var(--onboard-white, var(--white)));
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    position: absolute;
    top: 238px;
    left: 14px;
    font-size: 14px;
  }

  .checkbox-input {
    margin-right: 0.5rem;
  }

  .error-msg {
    color: var(
      --account-select-danger-500,
      var(--onboard-danger-500, var(--danger-500))
    );
    font-size: var(--account-select-font-size-7, var(--font-size-7));
    max-width: 15rem;
    line-height: 1;
    position: absolute;
    top: 260px;
    left: 18px;
  }

  .table-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.4rem 0.4rem 0 0;
    background: var(--account-select-accent-background-color, var(--border-color));
  }

  .cursor-pointer {
    cursor: pointer;
  }

  @media all and (min-width: 768px) {
    .checkbox-container {
      display: flex;
      align-items: center;
      position: unset;
      top: unset;
      left: unset;
      font-size: unset;
    }

    .checkbox-input {
      margin-right: 0.75rem;
    }

    .error-msg {
      position: unset;
      top: unset;
      left: unset;
    }

    .table-controls {
      height: 3.5rem;
      gap: 8px;
      justify-content: flex-end;
    }

    input[type='checkbox'] {
      height: 1.5rem;
      width: 1.5rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      font-size: var(
        --account-select-font-size-5,
        var(--onboard-font-size-5, var(--font-size-5))
      );
      width: unset;
    }
  }

  @media all and (max-width: 326px) {
    .checkbox-container {
      top: 328px;
    }
    .error-msg {
      top: 350px;
    }
  }
</style>

<div class="table-controls">
<!--  <div class="checkbox-container">-->
<!--    <input-->
<!--      id="show-empty-addresses"-->
<!--      type="checkbox"-->
<!--      bind:checked={showEmptyAddresses}-->
<!--      class="checkbox-input"-->
<!--    />-->
<!--    <label for="show-empty-addresses" class="ml2 cursor-pointer font-5"-->
<!--      >Show Empty Addresses</label-->
<!--    >-->
<!--  </div>-->
  {#if errorFromScan}
    <span class="error-msg">{errorFromScan}</span>
  {/if}
  <div class="button-group-action">
    <button
            class="scan-accounts-btn"
            id="scan-accounts"
            on:click={async () => await scanAccounts()}
    >
      {#if loadingAccounts}
        Scanning...
        <Spinner size="1.5rem" />
      {/if}
      {#if !loadingAccounts}
        Scan Accounts
      {/if}
    </button>
  </div>

</div>
