export function validateRelease(release) {
  if (!/^\d+\.\d+\.\d+$/.test(release?.version) || release.tag !== `v${release.version}`) throw new Error('Invalid release version');
  const expected = `https://github.com/werket-werk/proof-releases/releases/download/${release.tag}/Proof_${release.version}_universal.dmg`;
  if (release.url !== expected || !/^[a-f0-9]{64}$/.test(release.sha256) || !(release.size > 0)) throw new Error('Invalid release asset');
  return release;
}
