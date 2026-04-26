/**
 * Linear regression helper for trend prediction.
 * Given an array of y-values, computes the slope and intercept.
 */
export function linearRegression(yValues: number[]) {
  const n = yValues.length;
  const xValues = Array.from({ length: n }, (_, i) => i + 1); // [1, 2, 3, ..., n]

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumXX = xValues.reduce((a, b) => a + b * b, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return {
    slope,
    intercept,
    predict: (x: number) => slope * x + intercept
  };
}

/**
 * Normalizes a value to a 0-100 scale.
 */
export function normalize(value: number, min: number, max: number): number {
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, normalized));
}
