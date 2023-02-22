<script lang="ts">
  import Paper from './Paper.svelte';
  import Score from './Score.svelte';
  import { gameStateR, setGameId } from '$/store';
</script>

<svelte:head>
  <title>Dot-Box</title>
  <meta name="robots" content="noindex nofollow" />
</svelte:head>

{#if ($gameStateR.publicState?.turnUserId ?? null) === null}
  <div class="message">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    share URL or make <span class="room" on:click={setGameId}> new Room</span>
  </div>
{/if}

<div class="container">
  <Paper />
  <Score />
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    background-color: #e8e8e8;
    user-select: none;
  }

  .message {
    font-size: 1.25rem;
    position: fixed;
    top: 0;
    background-color: white;
    width: 100dvw;
    text-align: center;
  }

  .room {
    user-select: none;
    text-decoration: underline;
    color: rgb(86, 118, 212);
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-width: 100dvw;
    min-height: 100dvh;
  }
</style>
