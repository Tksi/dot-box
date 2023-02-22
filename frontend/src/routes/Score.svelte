<script lang="ts">
  import { gameStateR, gameStateW } from '$/store';
  import { shuffleArr } from '$lib/shuffleArr';

  const COLORTABLE = [
    '#ef5350',
    '#42a5f5',
    '#ba68c8',
    '#26a69a',
    '#66bb6a',
    '#d4e157',
    '#ffee58',
    '#ffa726',
    '#ff7043',
    '#ec407a',
  ];

  const start = () => {
    if ($gameStateR.userStates?.entries() ?? undefined !== undefined) {
      const userStateArr = [...$gameStateR.userStates?.entries()];

      for (let [i, userState] of Object.entries(userStateArr)) {
        userState[1].color = COLORTABLE[Number(i)];
      }

      const shuffledUserStateArr = shuffleArr(userStateArr);
      const shuffledUserStateMap = new Map(shuffledUserStateArr);
      $gameStateR.userStates = shuffledUserStateMap;
      $gameStateR.publicState.turnUserId = shuffledUserStateArr[0][0];
      $gameStateR.publicState.hover = [
        { row: -1, col: -1, position: 'top' },
        { row: -1, col: -1, position: 'top' },
      ];

      const ROW =
        Math.trunc(Math.random() * $gameStateR.userStates?.size) +
        $gameStateR.userStates?.size +
        1;
      const COL =
        Math.trunc(Math.random() * $gameStateR.userStates?.size) +
        $gameStateR.userStates?.size +
        1;
      $gameStateR.publicState.paper = new Array(ROW).fill(null).map(() => {
        return new Array(COL).fill(null).map(() => {
          return {
            top: null,
            right: null,
            left: null,
            bottom: null,
            filled: null,
          };
        });
      });
    }

    $gameStateW = $gameStateR;
  };

  const getUserScore = (userId: string) => {
    if (!$gameStateR.publicState.paper) return 0;

    return $gameStateR.publicState.paper
      .map((boards) => {
        return boards.filter((board) => {
          return board.filled === userId;
        }).length;
      })
      .reduce((a, b) => {
        return a + b;
      });
  };
</script>

<div class="container">
  {#if $gameStateR.userStates}
    {#each [...$gameStateR.userStates?.entries()] as userState}
      <span class="userContainer">
        <span class="score">
          <p>{getUserScore(userState[0])}</p>
        </span>
        <span
          style="--theme-color: {userState[1].color}"
          class="userName"
          class:myTurn={$gameStateR.publicState.turnUserId === userState[0]}
          >{userState[1].userName}</span
        >
      </span>
    {/each}
  {/if}
</div>

{#if $gameStateR.userStates?.size > 1 && $gameStateR.publicState.turnUserId === null}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click={start} class="start">Start</div>
{/if}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap');

  .myTurn {
    text-decoration: underline;
  }

  .container {
    font-size: 2rem;
    margin-top: 5px;
    display: flex;
  }

  .score {
    display: grid;
    place-items: center;
    background-color: white;
    width: 4rem;
    height: 4rem;
    border-radius: 100%;
    position: relative;
    top: 22.5px;
    z-index: -1;
  }

  .userName {
    color: var(--theme-color);
    font-family: 'Teko', sans-serif;
  }

  .userContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 25px;
  }

  .start {
    padding-top: 2px;
    font-family: 'Teko', sans-serif;
    font-size: 2rem;
    line-height: 2rem;
    width: 4rem;
    background-color: white;
    text-align: center;
    border: 5px solid black;
    border-image: linear-gradient(to right, #ef5350 50%, #42a5f5 50%) 5;
  }

  .start:hover {
    border-image: linear-gradient(to right, #42a5f5 50%, #ef5350 50%) 5;
  }
</style>
