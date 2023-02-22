<script lang="ts">
  import type { UserId } from '$types';
  import { gameStateR, gameStateW, myUserId } from '$/store';
  import { convertPaperForRender } from '$lib/convertPaperForRender';

  $: isMyTurn = $myUserId && $gameStateR.publicState?.turnUserId === $myUserId;

  $: hover = $gameStateR.publicState?.hover;

  const nextUserId = (): UserId => {
    const turn = $gameStateR.publicState.turnUserId;
    const userIds = [...$gameStateR.userStates.keys()];
    let index = userIds.findIndex((userId) => userId === turn);

    if (++index >= userIds.length) {
      index = 0;
    }

    return userIds[index];
  };

  const nextTurn = () => {
    $gameStateR.publicState.turnUserId = nextUserId();
    $gameStateW = $gameStateR;
  };

  const onBorderClick = () => {
    if (!isMyTurn) return;

    for (const item of hover) {
      if (
        $gameStateR.publicState.paper?.[item.row]?.[item.col]?.[
          item.position
        ] !== undefined
      ) {
        // すでにborderが弾かれている
        if (
          $gameStateR.publicState.paper[item.row][item.col][item.position] !==
          null
        ) {
          return;
        }

        $gameStateR.publicState.paper[item.row][item.col][item.position] =
          $myUserId;

        // box埋めチェック
        console.log(
          Object.values($gameStateR.publicState.paper[item.row][item.col])
        );

        if (
          $gameStateR.publicState.paper[item.row][item.col].bottom &&
          $gameStateR.publicState.paper[item.row][item.col].top &&
          $gameStateR.publicState.paper[item.row][item.col].left &&
          $gameStateR.publicState.paper[item.row][item.col].right
        ) {
          $gameStateR.publicState.paper[item.row][item.col].filled = $myUserId;
        }

        $gameStateW = $gameStateR;
      }
    }

    nextTurn();
  };
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
    {:else if item.position === 'box'}
      <span
        class="box"
        style="--boxcolor: {// @ts-ignore
        $gameStateR.userStates.get(item.value)?.color}"
      />
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
        on:click={onBorderClick}
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
        )?.color}; --fixed-color: {item.value &&
          $gameStateR.userStates?.get(item.value)?.color}
        "
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
    background-color: var(--boxcolor);
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
    background-color: var(--fixed-color);
  }

  .null {
    background-color: rgb(231, 231, 231);
    background-color: black;
  }
</style>
