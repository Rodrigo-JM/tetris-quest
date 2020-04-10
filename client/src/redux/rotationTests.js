export const JLSTZ_OFFSET_TESTS = [
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ],
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2],
  ],
];

JLSTZ_OFFSET_TESTS['down'] = [0, -1]
JLSTZ_OFFSET_TESTS['left'] = [-1, 0]
JLSTZ_OFFSET_TESTS['right'] = [1, 0]

export const I_OFFSET_TESTS = [
  [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, 0],
    [2, 0],
  ],
  [
    [-1, 0],
    [0, 0],
    [0, 0],
    [0, 1],
    [0, -2],
  ],
  [
    [-1, 1],
    [1, 1],
    [-2, 1],
    [1, 0],
    [-2, 0],
  ],
  [
    [0, 1],
    [0, 1],
    [0, 1],
    [0, -1],
    [0, 2],
  ],
]

I_OFFSET_TESTS['down'] = [0, -1]
I_OFFSET_TESTS['left'] = [-1, 0]
I_OFFSET_TESTS['right'] = [1, 0];

export const O_OFFSET_TESTS = [[[0, 0]], [[0, -1]], [[-1, -1]], [[-1, 0]]];

O_OFFSET_TESTS['down'] = [0, -1]
O_OFFSET_TESTS['left'] = [-1, 0]
O_OFFSET_TESTS['right'] = [1, 0];