<script lang="ts">
  type Paper = { top: string; left: string; right: string; bottom: string }[][];

  const paper: Paper = [
    [
      { top: '', left: '', bottom: '', right: '' },
      { top: '', left: '', bottom: '', right: '' },
      { top: '', left: '', bottom: '', right: '' },
    ],
    [
      { top: '', left: '', bottom: '', right: '' },
      { top: '', left: '', bottom: '', right: '' },
      { top: '', left: '', bottom: '', right: '' },
    ],
    [
      { top: '', left: '', bottom: '', right: '' },
      { top: '', left: '', bottom: '', right: '' },
      { top: '', left: '', bottom: '', right: '' },
    ],
  ];

  const convertPaperForRender = (paper: Paper) => {
    let renderedPaper: ({
      row: number;
      col: number;
      position: 'bottom' | 'box' | 'left' | 'right' | 'top';
      value: boolean | string;
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

  let hoverWith: {
    row: number;
    col: number;
    position: 'bottom' | 'left' | 'right' | 'top';
  } = { row: -1, col: -1, position: 'top' };
</script>

<div
  class="container"
  style="--colums: {`10px 25px 5px ${'5px 25px 5px '.repeat(
    paper[0].length - 2
  )}5px 25px 10px`}; --rows: {`10px 25px 5px ${'5px 25px 5px '.repeat(
    paper.length - 2
  )}5px 25px 10px`}"
>
  {#each convertPaperForRender(paper) as item}
    {#if item === null}
      <span class="null" />
    {:else if typeof item.value === 'boolean'}
      <span class="box" />
    {:else}
      <!-- svelte-ignore a11y-mouse-events-have-key-events -->
      <span
        class="border border-{item.position}"
        on:mouseover={() => {
          if (item) {
            switch (item.position) {
              case 'top': {
                hoverWith = {
                  row: item.row - 1,
                  col: item.col,
                  position: 'bottom',
                };

                break;
              }

              case 'bottom': {
                hoverWith = {
                  row: item.row + 1,
                  col: item.col,
                  position: 'top',
                };

                break;
              }

              case 'left': {
                hoverWith = {
                  row: item.row,
                  col: item.col - 1,
                  position: 'right',
                };

                break;
              }

              case 'right': {
                hoverWith = {
                  row: item.row,
                  col: item.col + 1,
                  position: 'left',
                };

                break;
              }
            }
          }
        }}
        on:mouseleave={() => {
          hoverWith = { row: -1, col: -1, position: 'top' };
        }}
        class:hoverWith={hoverWith.row === item.row &&
          hoverWith.col === item.col &&
          hoverWith.position === item.position}>{item.value}</span
      >
    {/if}
  {/each}
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

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

  .border:hover {
    background-color: red;
  }

  .hoverWith {
    background-color: red;
  }

  .null {
    background-color: rgb(231, 231, 231);
    background-color: black;
  }
</style>
