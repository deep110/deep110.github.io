const triangulationTable = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1],
    [3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1],
    [3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1],
    [3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1],
    [9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1],
    [1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1],
    [9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1],
    [2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1],
    [8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1],
    [9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1],
    [4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1],
    [3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1],
    [1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1],
    [4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1],
    [4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1],
    [9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1],
    [1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1],
    [5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1],
    [2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1],
    [9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1],
    [0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1],
    [2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1],
    [10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1],
    [4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1],
    [5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1],
    [5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1],
    [9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1],
    [0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1],
    [1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1],
    [10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1],
    [8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1],
    [2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1],
    [7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1],
    [9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1],
    [2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1],
    [11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1],
    [9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1],
    [5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1],
    [11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1],
    [11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1],
    [1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1],
    [9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1],
    [5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1],
    [2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1],
    [0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1],
    [5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1],
    [6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1],
    [0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1],
    [3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1],
    [6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1],
    [5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1],
    [1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1],
    [10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1],
    [6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1],
    [1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1],
    [8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1],
    [7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1],
    [3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1],
    [5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1],
    [0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1],
    [9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1],
    [8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1],
    [5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1],
    [0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1],
    [6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1],
    [10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1],
    [10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1],
    [8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1],
    [1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1],
    [3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1],
    [0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1],
    [10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1],
    [0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1],
    [3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1],
    [6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1],
    [9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1],
    [8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1],
    [3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1],
    [6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1],
    [0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1],
    [10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1],
    [10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1],
    [1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1],
    [2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1],
    [7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1],
    [7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1],
    [2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1],
    [1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1],
    [11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1],
    [8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1],
    [0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1],
    [7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1],
    [10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1],
    [2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1],
    [6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1],
    [7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1],
    [2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1],
    [1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1],
    [10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1],
    [10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1],
    [0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1],
    [7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1],
    [6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1],
    [8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1],
    [9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1],
    [6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1],
    [1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1],
    [4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1],
    [10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1],
    [8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1],
    [0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1],
    [1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1],
    [8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1],
    [10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1],
    [4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1],
    [10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1],
    [5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1],
    [11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1],
    [9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1],
    [6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1],
    [7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1],
    [3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1],
    [7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1],
    [9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1],
    [3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1],
    [6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1],
    [9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1],
    [1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1],
    [4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1],
    [7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1],
    [6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1],
    [3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1],
    [0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1],
    [6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1],
    [1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1],
    [0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1],
    [11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1],
    [6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1],
    [5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1],
    [9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1],
    [1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1],
    [1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1],
    [10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1],
    [0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1],
    [5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1],
    [10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1],
    [11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1],
    [0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1],
    [9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1],
    [7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1],
    [2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1],
    [8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1],
    [9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1],
    [9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1],
    [1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1],
    [9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1],
    [9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1],
    [5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1],
    [0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1],
    [10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1],
    [2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1],
    [0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1],
    [0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1],
    [9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1],
    [5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1],
    [3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1],
    [5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1],
    [8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1],
    [0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1],
    [9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1],
    [0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1],
    [1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1],
    [3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1],
    [4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1],
    [9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1],
    [11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1],
    [11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1],
    [2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1],
    [9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1],
    [3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1],
    [1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1],
    [4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1],
    [4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1],
    [0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1],
    [3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1],
    [3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1],
    [0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1],
    [9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1],
    [1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

const edgeTable = [
    0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
    0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
    0x190, 0x99, 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
    0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
    0x230, 0x339, 0x33, 0x13a, 0x636, 0x73f, 0x435, 0x53c,
    0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
    0x3a0, 0x2a9, 0x1a3, 0xaa, 0x7a6, 0x6af, 0x5a5, 0x4ac,
    0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
    0x460, 0x569, 0x663, 0x76a, 0x66, 0x16f, 0x265, 0x36c,
    0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
    0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff, 0x3f5, 0x2fc,
    0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
    0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55, 0x15c,
    0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
    0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc,
    0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
    0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
    0xcc, 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
    0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
    0x15c, 0x55, 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
    0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
    0x2fc, 0x3f5, 0xff, 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
    0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
    0x36c, 0x265, 0x16f, 0x66, 0x76a, 0x663, 0x569, 0x460,
    0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
    0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa, 0x1a3, 0x2a9, 0x3a0,
    0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
    0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33, 0x339, 0x230,
    0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
    0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99, 0x190,
    0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
    0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0,
];

class CSS2DObject extends THREE.Object3D {
    constructor(element = document.createElement('div')) {
        super();
        this.isCSS2DObject = true;
        this.element = element;
        this.element.style.position = 'absolute';
        this.element.style.userSelect = 'none';
        this.element.setAttribute('draggable', false);

        this.addEventListener('removed', function () {
            this.traverse(function (object) {
                if (object.element instanceof Element && object.element.parentNode !== null) {
                    object.element.parentNode.removeChild(object.element);
                }
            });
        });
    }

    copy(source, recursive) {
        super.copy(source, recursive);
        this.element = source.element.cloneNode(true);
        return this;
    }
}

class CSS2DRenderer {
    constructor(parameters = {}) {
        this._vector = new THREE.Vector3();
        this._viewMatrix = new THREE.Matrix4();
        this._viewProjectionMatrix = new THREE.Matrix4();
        this._a = new THREE.Vector3();
        this._b = new THREE.Vector3();

        const _this = this;
        let _width, _height;
        let _widthHalf, _heightHalf;

        const cache = {
            objects: new WeakMap()
        };

        const domElement = parameters.element !== undefined ? parameters.element : document.createElement('div');
        domElement.style.overflow = 'hidden';
        this.domElement = domElement;

        this.getSize = function () {
            return {
                width: _width,
                height: _height
            };
        };

        this.render = function (scene, camera) {
            if (scene.autoUpdate === true) scene.updateMatrixWorld();
            if (camera.parent === null) camera.updateMatrixWorld();

            this._viewMatrix.copy(camera.matrixWorldInverse);
            this._viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, this._viewMatrix);

            this.renderObject(scene, scene, camera);
            zOrder(scene);
        };

        this.setSize = function (width, height) {
            _width = width;
            _height = height;

            _widthHalf = _width / 2;
            _heightHalf = _height / 2;

            domElement.style.width = width + 'px';
            domElement.style.height = height + 'px';
        };

        this.renderObject = function (object, scene, camera) {
            if (object.isCSS2DObject) {
                this._vector.setFromMatrixPosition(object.matrixWorld);
                this._vector.applyMatrix4(this._viewProjectionMatrix);

                const visible = (object.visible === true) && (this._vector.z >= - 1 && this._vector.z <= 1) && (object.layers.test(camera.layers) === true);
                object.element.style.display = (visible === true) ? '' : 'none';

                if (visible === true) {
                    object.onBeforeRender(_this, scene, camera);

                    const element = object.element;
                    element.style.transform = 'translate(-50%,-50%) translate(' + (this._vector.x * _widthHalf + _widthHalf) + 'px,' + (- this._vector.y * _heightHalf + _heightHalf) + 'px)';

                    if (element.parentNode !== domElement) {
                        domElement.appendChild(element);
                    }

                    object.onAfterRender(_this, scene, camera);
                }

                const objectData = {
                    distanceToCameraSquared: getDistanceToSquared(camera, object, this._a, this._b)
                };

                cache.objects.set(object, objectData);
            }

            for (let i = 0, l = object.children.length; i < l; i++) {
                this.renderObject(object.children[i], scene, camera);
            }
        }

        function getDistanceToSquared(object1, object2, a, b) {
            a.setFromMatrixPosition(object1.matrixWorld);
            b.setFromMatrixPosition(object2.matrixWorld);

            return a.distanceToSquared(b);
        }

        function filterAndFlatten(scene) {
            const result = [];
            scene.traverse(function (object) {
                if (object.isCSS2DObject) result.push(object);
            });

            return result;
        }

        function zOrder(scene) {
            const sorted = filterAndFlatten(scene).sort(function (a, b) {
                if (a.renderOrder !== b.renderOrder) {
                    return b.renderOrder - a.renderOrder;
                }

                const distanceA = cache.objects.get(a).distanceToCameraSquared;
                const distanceB = cache.objects.get(b).distanceToCameraSquared;

                return distanceA - distanceB;
            });

            const zMax = sorted.length;
            for (let i = 0, l = sorted.length; i < l; i++) {
                sorted[i].element.style.zIndex = zMax - i;
            }
        }
    }
}

class Field {
    constructor(xMax, yMax, zMax) {
        this.xMax2 = 2 * xMax;
        this.yMax2 = 2 * yMax;
        this.zMax2 = 2 * zMax;
        this.buffer = new Float32Array((xMax + 1) * (yMax + 1) * (zMax + 1) * 8);
    }

    set(i, j, k, amt) {
        this.buffer[i * this.xMax2 * this.zMax2 + k * this.zMax2 + j] = amt;
    }

    get(i, j, k) {
        return this.buffer[i * this.xMax2 * this.zMax2 + k * this.zMax2 + j];
    }
}

class MarchingCubes {
    constructor(xMax, yMax, zMax, sampleSize = 1) {
        this.xMax = xMax;
        this.yMax = yMax;
        this.zMax = zMax;
        this.sampleSize = sampleSize;

        this.vertices = new Float32Array(this.xMax * this.yMax * this.zMax * 8 * 12 * 3);
        this.normals = new Float32Array(this.xMax * this.yMax * this.zMax * 8 * 12 * 3);

        this.edges = [];
        for (let i = 0; i < 12; i++) {
            this.edges.push(new Float32Array(3));
        }
    }

    generateMesh(geometry, surfaceLevel, field) {
        let fI, fJ, fK;
        let x, y, z;

        let vIdx = 0;

        for (let i = -this.xMax; i < this.xMax; i++) {
            fI = i + this.xMax;
            x = i * this.sampleSize;
            for (let j = -this.yMax + 1; j < this.yMax - 1; j++) {
                fJ = j + this.yMax;
                y = j * this.sampleSize;
                for (let k = -this.zMax; k < this.zMax; k++) {
                    fK = k + this.zMax;
                    z = k * this.sampleSize;

                    const v0 = field.get(fI, fJ, fK);
                    const v1 = field.get(fI + 1, fJ, fK);
                    const v2 = field.get(fI + 1, fJ, fK + 1);
                    const v3 = field.get(fI, fJ, fK + 1);
                    const v4 = field.get(fI, fJ + 1, fK);
                    const v5 = field.get(fI + 1, fJ + 1, fK);
                    const v6 = field.get(fI + 1, fJ + 1, fK + 1);
                    const v7 = field.get(fI, fJ + 1, fK + 1);

                    let cubeIndex = this.#getCubeIndex(surfaceLevel, v0, v1, v2, v3, v4, v5, v6, v7);
                    let edgeIndex = edgeTable[cubeIndex];
                    if (edgeIndex == 0) {
                        continue;
                    }
                    let mu = this.sampleSize / 2;
                    if (edgeIndex & 1) {
                        mu = (surfaceLevel - v0) / (v1 - v0);
                        this.#setFloatArray(this.edges[0], this.#lerp(x, x + this.sampleSize, mu), y, z);
                    }
                    if (edgeIndex & 2) {
                        mu = (surfaceLevel - v1) / (v2 - v1);
                        this.#setFloatArray(this.edges[1], x + this.sampleSize, y, this.#lerp(z, z + this.sampleSize, mu));
                    }
                    if (edgeIndex & 4) {
                        mu = (surfaceLevel - v3) / (v2 - v3);
                        this.#setFloatArray(this.edges[2], this.#lerp(x, x + this.sampleSize, mu), y, z + this.sampleSize);
                    }
                    if (edgeIndex & 8) {
                        mu = (surfaceLevel - v0) / (v3 - v0);
                        this.#setFloatArray(this.edges[3], x, y, this.#lerp(z, z + this.sampleSize, mu));
                    }
                    if (edgeIndex & 16) {
                        mu = (surfaceLevel - v4) / (v5 - v4);
                        this.#setFloatArray(this.edges[4], this.#lerp(x, x + this.sampleSize, mu), y + this.sampleSize, z);
                    }
                    if (edgeIndex & 32) {
                        mu = (surfaceLevel - v5) / (v6 - v5);
                        this.#setFloatArray(this.edges[5], x + this.sampleSize, y + this.sampleSize, this.#lerp(z, z + this.sampleSize, mu));
                    }
                    if (edgeIndex & 64) {
                        mu = (surfaceLevel - v7) / (v6 - v7);
                        this.#setFloatArray(this.edges[6], this.#lerp(x, x + this.sampleSize, mu), y + this.sampleSize, z + this.sampleSize);
                    }
                    if (edgeIndex & 128) {
                        mu = (surfaceLevel - v4) / (v7 - v4);
                        this.#setFloatArray(this.edges[7], x, y + this.sampleSize, this.#lerp(z, z + this.sampleSize, mu));
                    }
                    if (edgeIndex & 256) {
                        mu = (surfaceLevel - v0) / (v4 - v0);
                        this.#setFloatArray(this.edges[8], x, this.#lerp(y, y + this.sampleSize, mu), z);
                    }
                    if (edgeIndex & 512) {
                        mu = (surfaceLevel - v1) / (v5 - v1);
                        this.#setFloatArray(this.edges[9], x + this.sampleSize, this.#lerp(y, y + this.sampleSize, mu), z);
                    }
                    if (edgeIndex & 1024) {
                        mu = (surfaceLevel - v2) / (v6 - v2);
                        this.#setFloatArray(this.edges[10], x + this.sampleSize, this.#lerp(y, y + this.sampleSize, mu), z + this.sampleSize);
                    }
                    if (edgeIndex & 2048) {
                        mu = (surfaceLevel - v3) / (v7 - v3);
                        this.#setFloatArray(this.edges[11], x, this.#lerp(y, y + this.sampleSize, mu), z + this.sampleSize);
                    }

                    const triLen = triangulationTable[cubeIndex];
                    for (let i = 0; i < triLen.length; i++) {
                        if (triLen[i] === -1) {
                            break;
                        }
                        const e = this.edges[triLen[i]];
                        this.vertices[vIdx] = e[0];
                        this.vertices[vIdx + 1] = e[1];
                        this.vertices[vIdx + 2] = e[2];
                        vIdx += 3;
                    }
                }
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices.slice(0, vIdx), 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(this.normals.slice(0, vIdx), 3));
        geometry.computeVertexNormals();

        // tell three.js that mesh has been updated
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.needsUpdate = true;
    }

    generateMeshIsoSurface(geometry, surfaceLevel, field) {
        let x = 0, y = 0, z = 0;
        let vIdx = 0;

        const v0 = field.get(0, 0, 0);
        const v1 = field.get(1, 0, 0);
        const v2 = field.get(1, 0, 1);
        const v3 = field.get(0, 0, 1);
        const v4 = field.get(0, 1, 0);
        const v5 = field.get(1, 1, 0);
        const v6 = field.get(1, 1, 1);
        const v7 = field.get(0, 1, 1);

        let cubeIndex = this.#getCubeIndex(surfaceLevel, v0, v1, v2, v3, v4, v5, v6, v7);
        let edgeIndex = edgeTable[cubeIndex];
        let mu = 0.5;
        if (edgeIndex & 1) {
            this.#setFloatArray(this.edges[0], x + mu, y, z);
        }
        if (edgeIndex & 2) {
            this.#setFloatArray(this.edges[1], x + 1, y, z + mu);
        }
        if (edgeIndex & 4) {
            this.#setFloatArray(this.edges[2], x + mu, y, z + 1);
        }
        if (edgeIndex & 8) {
            this.#setFloatArray(this.edges[3], x, y, z + mu);
        }
        if (edgeIndex & 16) {
            this.#setFloatArray(this.edges[4], x + mu, y + 1, z);
        }
        if (edgeIndex & 32) {
            this.#setFloatArray(this.edges[5], x + 1, y + 1, z + mu);
        }
        if (edgeIndex & 64) {
            this.#setFloatArray(this.edges[6], x + mu, y + 1, z + 1);
        }
        if (edgeIndex & 128) {
            this.#setFloatArray(this.edges[7], x, y + 1, z + mu);
        }
        if (edgeIndex & 256) {
            this.#setFloatArray(this.edges[8], x, y + mu, z);
        }
        if (edgeIndex & 512) {
            this.#setFloatArray(this.edges[9], x + 1, y + mu, z);
        }
        if (edgeIndex & 1024) {
            this.#setFloatArray(this.edges[10], x + 1, y + mu, z + 1);
        }
        if (edgeIndex & 2048) {
            this.#setFloatArray(this.edges[11], x, y + mu, z + 1);
        }

        const triLen = triangulationTable[cubeIndex];
        for (let i = 0; i < triLen.length; i++) {
            if (triLen[i] === -1) {
                break;
            }
            const e = this.edges[triLen[i]];
            this.vertices[vIdx] = e[0];
            this.vertices[vIdx + 1] = e[1];
            this.vertices[vIdx + 2] = e[2];
            vIdx += 3;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices.slice(0, vIdx), 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(this.normals.slice(0, vIdx), 3));
        geometry.computeVertexNormals();

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.needsUpdate = true;
    }

    #getCubeIndex(isoLevel, a, b, c, d, e, f, g, h) {
        let cubeIndex = 0;

        if (a < isoLevel) cubeIndex |= 1;
        if (b < isoLevel) cubeIndex |= 2;
        if (c < isoLevel) cubeIndex |= 4;
        if (d < isoLevel) cubeIndex |= 8;
        if (e < isoLevel) cubeIndex |= 16;
        if (f < isoLevel) cubeIndex |= 32;
        if (g < isoLevel) cubeIndex |= 64;
        if (h < isoLevel) cubeIndex |= 128;

        return cubeIndex;
    }

    #setFloatArray(arr, a, b, c) {
        arr[0] = a;
        arr[1] = b;
        arr[2] = c;
    }

    #lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }
}

class Terrain {
    constructor(width, height, depth, sampleSize, guiController, isoLevel = 0) {
        this.xMax = Math.floor(width / (2 * sampleSize));
        this.yMax = Math.floor(height / (2 * sampleSize));
        this.zMax = Math.floor(depth / (2 * sampleSize));
        this.sampleSize = sampleSize;
        this.isoLevel = isoLevel;
        this.field = new Field(this.xMax, this.yMax, this.zMax);

        // noise values
        this.setNoiseValues(guiController);
        this.floorOffset = 5;
        this.noiseOffset = Math.random() * 10 + 1;
        this.simplex = new SimplexNoise();

        // graphics
        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.MeshStandardMaterial({ "color": guiController["TerrainColor"] });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.marchingCubes = new MarchingCubes(this.xMax, this.yMax, this.zMax, sampleSize);

        // generate mesh geometry
        this.generateHeightField();
        this.regenerateMesh();
    }

    setNoiseValues(guiController) {
        this.numOctaves = guiController["NumOctaves"];
        this.lacunarity = guiController["Lacunarity"];
        this.persistence = guiController["Persistence"];
        this.noiseWeight = guiController["NoiseWeight"];
        this.weightMultiplier = guiController["WeightMultiplier"];
    }

    getMesh() {
        return this.mesh;
    }

    makeShape(brushSize, point, multiplier) {
        for (let x = -brushSize - 2; x <= brushSize + 2; x++) {
            for (let y = -brushSize - 2; y <= brushSize + 2; y++) {
                for (let z = -brushSize - 2; z <= brushSize + 2; z++) {
                    let distance = this.#sphereDistance(point.clone(), new THREE.Vector3(point.x + x, point.y + y, point.z + z), brushSize);
                    if (distance < 0) {
                        let xi = Math.round(point.x + x) + this.xMax;
                        let yi = Math.round(point.y + y) + this.yMax;
                        let zi = Math.round(point.z + z) + this.zMax;

                        this.field.set(xi, yi, zi, this.field.get(xi, yi, zi) + distance * multiplier);
                    }
                }
            }
        }
        this.regenerateMesh();
    }

    regenerateMesh() {
        this.marchingCubes.generateMesh(this.geometry, this.isoLevel, this.field);
    }

    generateHeightField() {
        for (let i = -this.xMax; i < this.xMax + 1; i++) {
            let x = i * this.sampleSize;
            for (let j = -this.yMax; j < this.yMax + 1; j++) {
                let y = j * this.sampleSize;
                for (let k = -this.zMax; k < this.zMax + 1; k++) {
                    let z = k * this.sampleSize;
                    this.field.set(i + this.xMax, j + this.yMax, k + this.zMax, this.#heightValue(x, y, z));
                }
            }
        }
    }

    #heightValue(x, y, z) {
        let noise = 0;

        let frequency = 0.02;
        let amplitude = 1;
        let weight = 1;
        for (var j = 0; j < this.numOctaves; j++) {
            let n = this.simplex.noise3D(
                (x + this.noiseOffset) * frequency,
                (y + this.noiseOffset) * frequency,
                (z + this.noiseOffset) * frequency,
            );
            let v = 1 - Math.abs(n);
            v = v * v * weight;
            weight = Math.max(Math.min(v * this.weightMultiplier, 1), 0);
            noise += v * amplitude;
            amplitude *= this.persistence;
            frequency *= this.lacunarity;
        }

        let finalVal = -(y + this.floorOffset) + noise * this.noiseWeight;

        return -finalVal;
    }

    #sphereDistance = (spherePos, point, radius) => {
        return spherePos.distanceTo(point) - radius;
    }
}

class MainScene {
    constructor() {
        this.canvas = document.getElementById("main-canvas");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 300);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.gui = new lil.GUI({ container: document.getElementById("gui-canvas-main") });
        this.terrainSize = 60;

        this.isFullScreen = false;
        this.raycaster = new THREE.Raycaster();
        this.guiController = {
            "TerrainColor": 0xc47b3c,
            "BrushAction": "Raise",
            "BrushSize": 5,
            "NumOctaves": 4,
            "Lacunarity": 2,
            "Persistence": 0.5,
            "NoiseWeight": 7,
            "WeightMultiplier": 3.6,
        }
    }

    setup() {
        const canvas = this.canvas;
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);

        // add terrain
        this.terrain = new Terrain(this.terrainSize, this.terrainSize, this.terrainSize, 1, this.guiController);
        this.scene.add(this.terrain.getMesh());

        // add editing brush
        const brushMat = new THREE.MeshPhongMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 });
        const brushGeo = new THREE.SphereGeometry(3, 16, 16);
        this.brush = new THREE.Mesh(brushGeo, brushMat);
        this.brush.scale.setScalar(this.guiController["BrushSize"] * 0.25);
        this.scene.add(this.brush);

        // add lights
        const dLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        dLight.position.set(-5, 2, 10);
        this.scene.add(dLight);

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);
        this.setupGUI();

        this.scene.background = new THREE.Color("#3a3a3a");
        this.camera.position.set(15, 15, 15);

        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.listenToKeyEvents(window);
        this.controls.addEventListener('change', this.render.bind(this));

        window.addEventListener('resize', () => {
            if (this.isFullScreen) {
                this.correctDisplaySize();
            }
        });

        this.changeShape = false;
        const mousePointer = new THREE.Vector2();
        this.canvas.onpointermove = (e) => {
            this.changeShape = false;
            this.updateBrushPosition(e, mousePointer);
        };

        var interval;
        this.canvas.onpointerdown = (e) => {
            this.updateBrushPosition(e, mousePointer);
            this.changeShape = true;
            setTimeout(() => {
                if (this.changeShape) {
                    interval = setInterval(() => {
                        let multiplier = (this.guiController["BrushAction"] === "Depress") ? -1 : 1;
                        this.terrain.makeShape(this.guiController["BrushSize"], this.brush.position, multiplier);
                        this.render();
                    }, 120);
                }
            }, 200);
        };

        this.canvas.onpointerup = () => {
            this.changeShape = false;
            clearInterval(interval);
        };

        const toggleBtn = document.getElementById("toggle-fs");
        toggleBtn.addEventListener("click", () => {
            this.canvas.classList.toggle("fullscreen");
            toggleBtn.classList.toggle("fullscreen");
            document.getElementById("gui-canvas-main").classList.toggle("fullscreen");
            document.getElementById("index-canvas-main").classList.toggle("fullscreen");
            this.isFullScreen = !this.isFullScreen;

            if (this.isFullScreen) {
                toggleBtn.children[1].setAttribute("transform", "translate(16,16)rotate(135)scale(5)translate(-1.85,0)");
            } else {
                toggleBtn.children[1].setAttribute("transform", "translate(16,16)rotate(-45)scale(5)translate(-1.85,0)");
            }
            this.correctDisplaySize();
        });

        this.render();
    }

    setupGUI() {
        const terrainControl = this.gui.addFolder("Terrain Editing");
        terrainControl.addColor(this.guiController, "TerrainColor").onChange(value => {
            this.terrain.material.color.set(value);
            this.render();
        });
        terrainControl.add(this.guiController, "BrushAction", ["Raise", "Depress"]);
        terrainControl.add(this.guiController, "BrushSize", 2, 8, 1).onChange(value => {
            this.brush.scale.setScalar(value * 0.25);
            this.render();
        });

        // add noise controls
        const noiseGUI = this.gui.addFolder("Noise");
        noiseGUI.add(this.guiController, "NumOctaves", 2, 8, 1);
        noiseGUI.add(this.guiController, "Lacunarity", 1, 3, 0.2);
        noiseGUI.add(this.guiController, "Persistence", 0, 1, 0.1);
        noiseGUI.add(this.guiController, "NoiseWeight", 4, 20, 1);
        noiseGUI.add(this.guiController, "WeightMultiplier", 1, 10, 0.2);

        noiseGUI.onFinishChange(event => {
            this.terrain.setNoiseValues(this.guiController);
            this.terrain.generateHeightField();
            this.terrain.regenerateMesh();
            this.render();
        });
        noiseGUI.close();
        if (isMobile()) this.gui.close();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    correctDisplaySize() {
        // update camera's projection aspect ratio
        if (this.isFullScreen) {
            const pixelRatio = window.devicePixelRatio;
            this.renderer.setSize(this.canvas.clientWidth * pixelRatio, this.canvas.clientHeight * pixelRatio, false);
        } else {
            this.renderer.setSize(740, 500, false);
        }
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.render();
    }

    updateBrushPosition(e, mousePointer) {
        var canvasBoundingRect = this.canvas.getBoundingClientRect();
        mousePointer.x = ((e.clientX - canvasBoundingRect.left) / this.canvas.clientWidth) * 2 - 1;
        mousePointer.y = - ((e.clientY - canvasBoundingRect.top) / this.canvas.clientHeight) * 2 + 1;

        this.raycaster.setFromCamera(mousePointer, this.camera);
        const result = this.raycaster.intersectObject(this.terrain.getMesh());
        if (result.length > 0) {
            const point = result[0].point;
            this.brush.position.set(point.x, point.y, point.z);
            this.render();
        }
    }
}

class IsoSurfaceScene {
    constructor() {
        this.canvas = document.getElementById("canvas-iso-surface");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.labelRenderer = new CSS2DRenderer();
        this.gui = new lil.GUI({ container: document.getElementById("gui-canvas-iso-surface") });
        this.raycaster = new THREE.Raycaster();
        this.mousePosition = new THREE.Vector2();
        this.sphereParent = new THREE.Object3D();

        // marching cubes mesh
        this.mcGeometry = new THREE.BufferGeometry();
        this.mcMaterial = new THREE.MeshBasicMaterial({ color: 0x1406e0, side: THREE.DoubleSide });
        this.mcMesh = new THREE.Mesh(this.mcGeometry, this.mcMaterial);
        this.marchingCubes = new MarchingCubes(1, 1, 1, 1);

        this.field = new Field(1, 1, 1);
        this.field.set(0, 0, 1, 1);
        this.intersected = null;
        this.guiController = {
            "Toggle Numbering": () => {
                this.camera.layers.toggle(1);
                this.render();
            },
        }
    }

    setup() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
        this.scene.background = new THREE.Color("#3a3a3a");
        this.setLabelRenderer();
        this.gui.add(this.guiController, 'Toggle Numbering');
        if (isMobile()) this.gui.close();

        // setup camera
        this.camera.layers.enableAll();
        this.camera.position.set(1.373, 1.353, 1.729);

        this.addCube();
        this.scene.add(this.mcMesh);

        this.canvas.addEventListener('mousemove', (e) => {
            var canvasBoundingRect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = ((e.clientX - canvasBoundingRect.left) / this.canvas.clientWidth) * 2 - 1;
            this.mousePosition.y = - ((e.clientY - canvasBoundingRect.top) / this.canvas.clientHeight) * 2 + 1;

            this.interactiveSphere();
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.intersected) {
                var pos = this.intersected.position;
                var val = this.field.get(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
                if (val == 0) {
                    this.field.set(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z), 1);
                    this.intersected.material.color.set(0xcccccc);
                } else {
                    this.field.set(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z), 0);
                    this.intersected.material.color.set(0xffffff);
                }
                this.updateMesh();
                this.render();
            }
        });

        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.target = new THREE.Vector3(0.5, 0.5, 0.5);
        this.controls.listenToKeyEvents(window);
        this.controls.addEventListener('change', this.render.bind(this));

        this.updateMesh();
        this.render();
    }

    setLabelRenderer() {
        this.labelRenderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.labelRenderer.domElement.style.left = "calc(50% - " + this.canvas.clientWidth / 2 + "px)";
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        this.canvas.parentElement.appendChild(this.labelRenderer.domElement);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
    }

    addCube() {
        const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
        var edgeGeo = new THREE.EdgesGeometry(cubeGeo);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        const cube = new THREE.LineSegments(edgeGeo, material);
        cube.position.set(0.5, 0.5, 0.5);
        this.scene.add(cube);

        for (let j = 0; j <= 1; j++) {
            for (let k = 0; k <= 1; k++) {
                for (let i = 0; i <= 1; i++) {
                    this.sphereParent.add(this.addSphere(i, j, k, this.field.get(i, j, k)));
                }
            }
        }
        this.scene.add(this.sphereParent);

        for (let i = 0; i < 2; i++) {
            // edge labels
            this.addLabel(0 + 4 * i, "green", 0.5, i, 0, "0px");
            this.addLabel(1 + 4 * i, "green", 1, i, 0.5, "0px");
            this.addLabel(2 + 4 * i, "green", 0.5, i, 1, "0px");
            this.addLabel(3 + 4 * i, "green", 0, i, 0.5, "0px");

            // vertex labels
            this.addLabel(0 + 4 * i, "white", 0, i, 0, "8px");
            this.addLabel(1 + 4 * i, "white", 1, i, 0, "8px");
            this.addLabel(2 + 4 * i, "white", 1, i, 1, "8px");
            this.addLabel(3 + 4 * i, "white", 0, i, 1, "8px");

        }
        this.addLabel(8, "green", 0, 0.5, 0, "4px");
        this.addLabel(9, "green", 1, 0.5, 0, "4px");
        this.addLabel(10, "green", 1, 0.5, 1, "4px");
        this.addLabel(11, "green", 0, 0.5, 1, "4px");
    }

    addSphere(posX, posY, posZ, val) {
        const geometry = new THREE.SphereGeometry(0.05, 12, 8);
        let color = (val == 0) ? 0x000000 : 0xcccccc;
        const material = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(posX, posY, posZ);

        return sphere;
    }

    addLabel(content, color, x, y, z, leftMargin) {
        const labelDiv = document.createElement('div');
        labelDiv.textContent = content;
        labelDiv.style.marginTop = '-10px';
        labelDiv.style.marginLeft = leftMargin;
        labelDiv.style.color = color;
        const vertexLabel = new CSS2DObject(labelDiv);
        vertexLabel.position.set(x, y, z);
        vertexLabel.layers.set(1);
        this.scene.add(vertexLabel);
    }

    interactiveSphere() {
        this.raycaster.setFromCamera(this.mousePosition, this.camera);
        const intersects = this.raycaster.intersectObjects(this.sphereParent.children, false);

        if (intersects.length > 0) {
            if (this.intersected != intersects[0].object) {
                this.intersected = intersects[0].object;
                this.intersected.material.color.set(0xffffff);
                this.render();
            }
        } else {
            if (this.intersected) {
                var pos = this.intersected.position;
                var val = this.field.get(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
                if (val == 0) {
                    this.intersected.material.color.set(0x0);
                } else {
                    this.intersected.material.color.set(0xcccccc);
                }
                this.intersected = null;
                this.render();
            }
        }
    }

    updateMesh() {
        this.marchingCubes.generateMeshIsoSurface(this.mcGeometry, 0.5, this.field);
    }
}

class AlgoScene {
    constructor() {
        this.canvas = document.getElementById("canvas-algo");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.gui = new lil.GUI({ container: document.getElementById("gui-canvas-algo") });
        this.sphereParent = new THREE.Object3D();
        this.size = 8;
        this.range = 10;

        // marching cubes mesh
        this.mcGeometry = new THREE.BufferGeometry();
        this.mcMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide });
        this.mcMesh = new THREE.Mesh(this.mcGeometry, this.mcMaterial);
        this.marchingCubes = new MarchingCubes(this.size / 2, this.size / 2 + 1, this.size / 2, 1);

        this.isoLevel = 1;
        this.field = new Field(this.size, this.size, this.size);
        this.guiController = {
            "Toggle Field": () => { this.camera.layers.toggle(1); this.render(); },
            "Surface Level": 1,
            "Field Type": "Random",
        }
    }

    setup() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
        this.scene.background = new THREE.Color("#3a3a3a");

        // setup GUI
        this.gui.add(this.guiController, 'Toggle Field');
        this.gui.add(this.guiController, 'Field Type', ["Random", "Sphere"]).onChange(value => {
            const size_2 = this.size / 2;
            for (let i = 0; i <= this.size; i++) {
                for (let j = 0; j <= this.size; j++) {
                    for (let k = 0; k <= this.size; k++) {
                        this.field.set(i, j, k, this.getFieldValue(i - size_2, j - size_2, k - size_2, value));
                    }
                }
            }
            this.marchingCubes.generateMesh(this.mcGeometry, this.isoLevel, this.field);
            this.render();
        });
        this.gui.add(this.guiController, 'Surface Level', -this.range, this.range, 1).onChange(value => {
            if (this.isoLevel == value) return;
            this.isoLevel = value;
            // hide spheres below this isoLevel
            var spheres = this.sphereParent.children;
            for (let i = 0; i < spheres.length; i++) {
                if (spheres[i].fieldValue < this.isoLevel) {
                    spheres[i].visible = false;
                } else {
                    spheres[i].visible = true;
                }
            }
            this.marchingCubes.generateMesh(this.mcGeometry, this.isoLevel, this.field);
            this.render();
        });
        if (isMobile()) this.gui.close();

        const dLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        dLight.position.set(-5, 2, 10);
        this.scene.add(dLight);

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        this.addCube();
        this.drawField();

        this.marchingCubes.generateMesh(this.mcGeometry, this.isoLevel, this.field);
        this.scene.add(this.mcMesh);

        this.camera.layers.enableAll();
        this.camera.position.set(8, 8, 8);

        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.listenToKeyEvents(window);
        this.controls.addEventListener('change', this.render.bind(this));

        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    addCube() {
        const cubeGeo = new THREE.BoxGeometry(this.size, this.size, this.size);
        var edgeGeo = new THREE.EdgesGeometry(cubeGeo);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        const cube = new THREE.LineSegments(edgeGeo, material);
        this.scene.add(cube);

        const axesHelper = new THREE.AxesHelper(7);
        this.scene.add(axesHelper);
    }

    drawField() {
        var size_2 = this.size / 2;
        for (let i = 0; i <= this.size; i++) {
            for (let j = 0; j <= this.size; j++) {
                for (let k = 0; k <= this.size; k++) {
                    let val = this.getFieldValue(i, j, k, "Random");
                    this.field.set(i, j, k, val);
                    this.sphereParent.add(this.addSphere(i - size_2, j - size_2, k - size_2, val));
                }
            }
        }
        this.scene.add(this.sphereParent);
    }

    getFieldValue(x, y, z, type) {
        if (type === "Random") {
            return MathUtil.randomInt(-this.range, this.range);
        } else {
            const size_2 = this.size / 2 - 1;
            return size_2 * size_2 - (x * x + y * y + z * z);
        }
    }

    addSphere(posX, posY, posZ, val) {
        const geometry = new THREE.SphereGeometry(0.1, 12, 8);
        const material = new THREE.MeshBasicMaterial({ color: this.floatToColor(0.5 + val / (2 * this.range)) });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(posX, posY, posZ);
        sphere.fieldValue = val;
        if (val < this.isoLevel) {
            sphere.visible = false;
        }
        sphere.layers.set(1);
        return sphere;
    }

    floatToColor(percentage) {
        var colorPartHex = parseInt(255 * percentage, 10).toString(16).padStart(2, "0");
        var colorHex = colorPartHex + colorPartHex + colorPartHex;
        return parseInt(colorHex, 16);
    }
}

function isMobile(){
    return (screen.width <= 740);
}

new MainScene().setup();
new IsoSurfaceScene().setup();
new AlgoScene().setup();
