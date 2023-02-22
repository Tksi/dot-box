<script lang="ts">
  import { gameStateW, gameStateR, myUserId } from '$/store';
  import type { StatePublic } from '$/store';
  import type { UserId } from '$types';

  // const paper: Paper = [
  //   [
  //     { top: '', left: '', bottom: '', right: '' },
  //     { top: '', left: '', bottom: '', right: '' },
  //     { top: '', left: '', bottom: '', right: '' },
  //   ],
  //   [
  //     { top: '', left: '', bottom: '', right: '' },
  //     { top: '', left: '', bottom: '', right: '' },
  //     { top: '', left: '', bottom: '', right: '' },
  //   ],
  //   [
  //     { top: '', left: '', bottom: '', right: '' },
  //     { top: '', left: '', bottom: '', right: '' },
  //     { top: '', left: '', bottom: '', right: '' },
  //   ],
  // ];

  $: isMyTurn = $myUserId && $gameStateR.publicState?.turnUserId === $myUserId;

  $: console.log(isMyTurn);

  const convertPaperForRender = (paper: StatePublic['paper']) => {
    if (paper === undefined) return [];
    let renderedPaper: ({
      row: number;
      col: number;
      position: 'bottom' | 'box' | 'left' | 'right' | 'top';
      value: UserId | null | boolean;
    } | null)[][] = new Array(paper.length * 3)
      .fill('')
      .map(() => new Array(paper[0].length * 3).fill(''));

    for (const [i, row] of Object.entries(paper)) {
      for (const [j, col] of Object.entries(row)) {
        for (let k = 0; k < 3; k++) {
          if (k === 0 || k === 2) {
            renderedPaper[Number(i) * 3 + k][Number(j) * 3] = null;
            renderedPaper[Number(i) * 3 + k][Number(j) * 3 + 2] = null;

            if (k == 0) {
              renderedPaper[Number(i) * 3 + k][Number(j) * 3 + 1] = {
                row: Number(i),
                col: Number(j),
                position: 'top',
                value: col.top,
              };
            } else {
              renderedPaper[Number(i) * 3 + k][Number(j) * 3 + 1] = {
                row: Number(i),
                col: Number(j),
                position: 'bottom',
                value: col.bottom,
              };
            }
          } else {
            renderedPaper[Number(i) * 3 + k][Number(j) * 3] = {
              row: Number(i),
              col: Number(j),
              position: 'left',
              value: col.left,
            };
            renderedPaper[Number(i) * 3 + k][Number(j) * 3 + 1] = {
              row: Number(i),
              col: Number(j),
              position: 'box',
              value: false,
            };
            renderedPaper[Number(i) * 3 + k][Number(j) * 3 + 2] = {
              row: Number(i),
              col: Number(j),
              position: 'right',
              value: col.right,
            };
          }
        }
      }
    }

    return renderedPaper.flat().flat();
  };

  // let hover: {
  //   row: number;
  //   col: number;
  //   position: 'bottom' | 'left' | 'right' | 'top';
  // }[] = [
  //   { row: -1, col: -1, position: 'top' },
  //   { row: -1, col: -1, position: 'top' },
  // ];

  $: hover = $gameStateR.publicState?.hover;

  $: console.log(hover);
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

  .null {
    background-color: rgb(231, 231, 231);
    background-color: black;
  }
</style>
