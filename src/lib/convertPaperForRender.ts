import type { StatePublic } from '$/store';
import type { UserId } from '$types';

export const convertPaperForRender = (paper: StatePublic['paper']) => {
  if (paper === undefined) return [];
  const renderedPaper: ({
    row: number;
    col: number;
    position: 'bottom' | 'box' | 'left' | 'right' | 'top';
    value: UserId | boolean | null;
  } | null)[][] = new Array(paper.length * 3)
    .fill('')
    .map(() => new Array(paper[0].length * 3).fill(''));

  for (const [i, row] of Object.entries(paper)) {
    for (const [j, col] of Object.entries(row)) {
      for (let k = 0; k < 3; k++) {
        if (k === 0 || k === 2) {
          renderedPaper[Number(i) * 3 + k][Number(j) * 3] = null;
          renderedPaper[Number(i) * 3 + k][Number(j) * 3 + 2] = null;

          // eslint-disable-next-line max-depth
          if (k === 0) {
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
