<script lang="ts">
  import { gameStateW, gameStateR, myUserId } from '$/store';
  import { convertPaperForRender } from '$lib/convertPaperForRender';

  $: isMyTurn = $myUserId && $gameStateR.publicState?.turnUserId === $myUserId;

  $: hover = $gameStateR.publicState?.hover;
</script>

<div
  class="container"
  style="--colums: {`20px 75px 10px ${'10px 75px 10px '.repeat(
    $gameStateR.publicState?.paper?.[0].length - 2
  )}10px 75px 20px`}; --rows: {`20px 75px 10px ${'10px 75px 10px '.repeat(
    $gameStateR.publicState?.paper?.length - 2
  )}10px 75px 20px`}"
>
  {#each convertPaperForRender($gameStateR.publicState?.paper) as item}
    {#if item === null}
      <span class="null" />
    {:else if typeof item.value === 'boolean'}
      <span class="box" />
    {:else}
      <!-- svelte-ignore a11y-mouse-events-have-key-events -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span
        class="border border-{item.position}"
        on:mouseover={() => {
          if (!isMyTurn) return;

          if (item && item.position !== 'box') {
            hover[0] = {
              row: item.row,
              col: item.col,
              position: item.position,
            };

            switch (item.position) {
              case 'top': {
                hover[1] = {
                  row: item.row - 1,
                  col: item.col,
                  position: 'bottom',
                };

                break;
              }

              case 'bottom': {
                hover[1] = {
                  row: item.row + 1,
                  col: item.col,
                  position: 'top',
                };

                break;
              }

              case 'left': {
                hover[1] = {
                  row: item.row,
                  col: item.col - 1,
                  position: 'right',
                };

                break;
              }

              case 'right': {
                hover[1] = {
                  row: item.row,
                  col: item.col + 1,
                  position: 'left',
                };

                break;
              }
            }
            $gameStateW = $gameStateR;
          }
        }}
        on:mouseleave={() => {
          if (!isMyTurn) return;
          hover[0] = { row: -1, col: -1, position: 'top' };
          hover[1] = { row: -1, col: -1, position: 'top' };
          $gameStateW = $gameStateR;
        }}
        on:click={() => {
          if (item && isMyTurn) {
            for (const item of hover) {
              if (
                $gameStateR.publicState.paper?.[item.row]?.[item.col]?.[
                  item.position
                ] !== undefined
              ) {
                $gameStateR.publicState.paper[item.row][item.col][
                  item.position
                ] = $myUserId;
                $gameStateW = $gameStateR;
              }
            }
          }
        }}
        class:hover={hover.some(({ row, col, position }) => {
          return (
            item &&
            row === item.row &&
            col === item.col &&
            position === item.position
          );
        })}
        style="--theme-color: {$gameStateR.userStates?.get(
          // @ts-ignore
          $gameStateR.publicState?.turnUserId
        )?.color}"
        class:fixed={item.value}
      />
    {/if}
  {/each}
</div>

<style>
  .container {
    display: inline-grid;
    grid-template-columns: var(--colums);
    grid-template-rows: var(--rows);
    border: 1px solid black;
  }

  .box {
    border: 1px solid black;
  }

  .border {
    border-style: solid;
    border-color: black;
  }

  .border-top,
  .border-bottom {
    border-width: 0 1px 0 1px;
  }

  .border-right,
  .border-left {
    border-width: 1px 0 1px 0;
  }

  .hover {
    background-color: var(--theme-color);
  }

  .fixed {
    background-color: var(--theme-color);
  }

  .null {
    background-color: rgb(231, 231, 231);
    background-color: black;
  }
</style>
