<script lang="ts">
  import Paper from './Paper.svelte';
  import Score from './Score.svelte';
</script>

<svelte:head>
  <title>Dot-Box</title>
  <meta name="robots" content="noindex nofollow" />
</svelte:head>

<div class="container">
  <Score />
  <Paper />
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
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
