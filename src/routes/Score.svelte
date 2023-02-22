<script lang="ts">
  import { gameStateR, gameStateW, myUserId } from '$/store';
  import { shuffleArr } from '$lib/shuffleArr';

  const ROW = 3;
  const COL = 3;
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
      $gameStateR.publicState.paper = new Array(ROW).fill(null).map((_) => {
        return new Array(COL).fill(null).map((_) => {
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
</script>

{#if $gameStateR.userStates}
  {#each [...$gameStateR.userStates?.entries()] as userState}
    <div>
      <p
        class:myTurn={$gameStateR.publicState.turnUserId === userState[0]}
        style="--theme-color: {userState[1].color}"
      >
        user名:{userState[1].userName}
      </p>
    </div>
  {/each}
{/if}

{#if $gameStateR.userStates?.size > 1 && !$gameStateR.publicState.turnUserId}
  <div>
    <button on:click={start}>Start</button>
  </div>
{/if}

<style>
  .myTurn {
    text-decoration: underline;
  }
  p {
    color: var(--theme-color);
  }
</style>
