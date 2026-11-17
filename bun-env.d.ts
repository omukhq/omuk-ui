/// <reference types="bun-types" />

// Pulls in Bun's ambient declarations, notably `bun:test`, which the co-located
// *.test.ts files import. A `types` array in tsconfig.json would do the same,
// but it would also switch off the automatic @types packages (React included).
