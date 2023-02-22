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

  const onBorderClick = () => {
    if (!isMyTurn) return;

    let willNextTurn = true;

    for (const item of hover) {
      if (
        $gameStateR.publicState.paper?.[item.row]?.[item.col]?.[
          item.position
        ] !== undefined
      ) {
        // すでにborderが塗られている場合は弾く
        if (
          $gameStateR.publicState.paper[item.row][item.col][item.position] !==
          null
        ) {
          return;
        }

        $gameStateR.publicState.paper[item.row][item.col][item.position] =
          $myUserId;

        // box埋めるかチェック
        if (
          $gameStateR.publicState.paper[item.row][item.col].bottom &&
          $gameStateR.publicState.paper[item.row][item.col].top &&
          $gameStateR.publicState.paper[item.row][item.col].left &&
          $gameStateR.publicState.paper[item.row][item.col].right
        ) {
          $gameStateR.publicState.paper[item.row][item.col].filled = $myUserId;
          willNextTurn = false;
        }
      }
    }

    if (
      $gameStateR.publicState.paper.every((row) =>
        row.every((col) => col.filled)
      )
    ) {
      //ゲーム終了
      $gameStateR.publicState.turnUserId = null;
    } else {
      if (willNextTurn) $gameStateR.publicState.turnUserId = nextUserId();
    }

    $gameStateW = $gameStateR;
  };
</script>

<div
  class="paper"
  style="--colums: {`30px 70px 15px ${'15px 70px 15px '.repeat(
    $gameStateR.publicState?.paper?.[0].length - 2
  )}15px 70px 30px`}; --rows: {`30px 70px 15px ${'15px 70px 15px '.repeat(
    $gameStateR.publicState?.paper?.length - 2
  )}15px 70px 30px`}"
>
  {#each convertPaperForRender($gameStateR.publicState?.paper) as item}
    {#if item === null}
      <span class="null" />
    {:else if item.position === 'box'}
      <span
        class="box"
        style="--boxcolor: {// @ts-ignore
        $gameStateR.userStates.get(item.value)?.color ?? '#e8e8e8'}"
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
  .paper {
    display: inline-grid;
    grid-template-columns: var(--colums);
    grid-template-rows: var(--rows);
    border: 2px solid rgb(65, 65, 65);
    background: white;
  }

  .box {
    border: 2px solid rgb(65, 65, 65);
    background-color: var(--boxcolor);
  }

  .border {
    border-style: solid;
    border-color: rgb(65, 65, 65);
  }

  .border-top,
  .border-bottom {
    border-width: 0 2px 0 2px;
  }

  .border-right,
  .border-left {
    border-width: 2px 0 2px 0;
  }

  .hover {
    background-color: var(--theme-color);
    filter: contrast(175%);
  }

  .fixed {
    background-color: var(--fixed-color);
  }

  .null {
    background-color: rgb(231, 231, 231);
    background-color: rgb(65, 65, 65);
  }
</style>
