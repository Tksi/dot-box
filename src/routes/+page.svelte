<script lang="ts">
  type Paper = { top: number; left: number; right: number; bottom: number }[][];

  const paper: Paper = [
    [
      { top: 0, left: 0, bottom: 0, right: 0 },
      { top: 0, left: 0, bottom: 0, right: 0 },
    ],
    [
      { top: 0, left: 0, bottom: 0, right: 0 },
      { top: 0, left: 0, bottom: 0, right: 0 },
    ],
  ];

  const renderPaper = (paper: Paper) => {
    // TODO
  };

  const renderedPaper = [
    '.',
    '00T',
    '.',
    '.',
    '01T',
    '.',
    '00L',
    '00',
    '00R',
    '01L',
    '01R',
    '01L',
    '.',
    '00B',
    '.',
    '.',
    '01B',
    '.',
    '.',
    '10T',
    '.',
    '.',
    '11T',
    '.',
    '10L',
    '10',
    '10R',
    '11L',
    '11',
    '11R',
    '.',
    '10B',
    '.',
    '.',
    '11B',
    '.',
  ];
</script>

<div class="container">
  <span>.</span>
  <span>00T</span>
  <span>.</span>
  <span>.</span>
  <span>01T</span>
  <span>.</span>
  <span>00L</span>
  <span>00</span>
  <span>00R</span>
  <span>01L</span>
  <span>01R</span>
  <span>01L</span>
  <span>.</span>
  <span>00B</span>
  <span>.</span>
  <span>.</span>
  <span>01B</span>
  <span>.</span>
  <span>.</span>
  <span>10T</span>
  <span>.</span>
  <span>.</span>
  <span>11T</span>
  <span>.</span>
  <span>10L</span>
  <span>10</span>
  <span>10R</span>
  <span>11L</span>
  <span>11</span>
  <span>11R</span>
  <span>.</span>
  <span>10B</span>
  <span>.</span>
  <span>.</span>
  <span>11B</span>
  <span>.</span>
</div>

<!-- convert peparTypes to renderHTML  -->
<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .container {
    display: grid;
    grid-template-columns: 20px 50px 20px 20px 50px 20px;
    grid-template-rows: 20px 50px 20px 20px 50px 20px 20px;
  }
  span {
    overflow-wrap: anywhere;
    border: 1px solid black;
  }
</style>
