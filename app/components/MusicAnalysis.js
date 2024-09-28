export default function MusicAnalysis({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="mt-8 p-6 bg-white/10 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Music Analysis</h2>
      <ul className="space-y-2">
        <li>RMS Energy: {analysis.rms.toFixed(4)}</li>
        <li>Spectral Centroid: {analysis.spectralCentroid.toFixed(4)}</li>
        <li>Spectral Flatness: {analysis.spectralFlatness.toFixed(4)}</li>
        <li>Perceptual Spread: {analysis.perceptualSpread.toFixed(4)}</li>
        <li>Spectral Rolloff: {analysis.spectralRolloff.toFixed(4)}</li>
        <li>Danceability: {(analysis.danceability * 100).toFixed(2)}%</li>
        <li>Energy: {(analysis.energy * 100).toFixed(2)}%</li>
        <li>Valence: {(analysis.valence * 100).toFixed(2)}%</li>
      </ul>
    </div>
  );
}

