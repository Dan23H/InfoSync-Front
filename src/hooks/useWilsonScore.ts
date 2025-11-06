import { useMemo } from "react";

export function useWilsonScore(likes: number, dislikes: number, z = 1.96): number {
  return useMemo(() => {
    const n = likes + dislikes;
    if (n === 0) return 0;

    const p = likes / n;
    const z2 = z * z;
    const numerator = p + z2 / (2 * n) - z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
    const denominator = 1 + z2 / n;
    return numerator / denominator; // valor entre 0 y 1
  }, [likes, dislikes, z]);
}

export function getRecommendationLabel(score: number, totalVotes: number): { label: string; color: string } {
  if (totalVotes === 0) return { label: "Sin votar", color: "black" };
  if (totalVotes < 25) return { label: "Pocos votos", color: "black" };
  if (score < 0.2) return { label: "No recomendado", color: "rgba(255, 0, 0, 1)" };
  if (score < 0.4) return { label: "Poco recomendado", color: "rgba(171, 111, 0, 1)" };
  if (score < 0.6) return { label: "Regular", color: "rgba(120, 120, 0, 1)" };
  if (score < 0.8) return { label: "Recomendado", color: "rgba(55, 128, 0, 1)" };
  return { label: "Muy recomendado", color: "rgba(0, 100, 25, 1)" };
}