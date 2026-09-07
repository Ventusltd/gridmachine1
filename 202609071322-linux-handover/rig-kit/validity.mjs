// Harness validity: the runner's ability to tell whether it can be believed.
//
// Three times in one night a harness reported failures that were its own:
// candidates refused on a SHA-256 mismatch, a mirror missing MapLibre, a mirror
// missing the register payload. Each time the tell was the same, and each time
// it was noticed by a person: a case that is KNOWN to work also failed.
//
// So the rule is encoded. Every run carries a control. If the control fails,
// the run is HARNESS_INVALID and nothing it says about the product is counted.
// A run that cannot pass its own control has no standing to fail a candidate.
import fs from 'node:fs';
import path from 'node:path';

/* Pre-flight: everything a version needs, checked for presence before a browser
   is launched. A missing cartridge found here is a fact stated in one line; the
   same fact found mid-run costs a full pass and arrives disguised as a product
   failure. Reads current.json and resolves each cartridge path the way the
   loader will. */
export function preflight(mirrorRoot, versionDir) {
  const problems = [];
  const currentPath = path.join(mirrorRoot, versionDir, 'current.json');
  if (!fs.existsSync(currentPath)) return { ok: false, problems: [`no current.json at ${versionDir}`] };
  const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
  for (const c of current.cartridges || []) {
    const abs = path.resolve(path.join(mirrorRoot, versionDir), c.path);
    if (!fs.existsSync(abs)) { problems.push(`cartridge missing from mirror: ${c.id} -> ${c.path}`); continue; }
    const bytes = fs.statSync(abs).size;
    if (c.bytes && bytes !== c.bytes) problems.push(`cartridge size differs: ${c.id} mirror=${bytes} manifest=${c.bytes}`);
  }
  // the shell the version boots from
  const shellIndex = path.join(mirrorRoot, versionDir, 'index.html');
  if (!fs.existsSync(shellIndex)) problems.push('version index.html missing');
  return { ok: problems.length === 0, problems, cartridges: (current.cartridges || []).length };
}

/* The control decision. `controlResult` is the outcome of driving a case that
   is known to work on the published version. If it did not pass here, the
   harness - mirror, translator, timing, hashing - is what failed. */
export function classifyRun(controlResult, results) {
  if (!controlResult) {
    return { validity: 'NO_CONTROL', reason: 'run carried no control case; its failures cannot be attributed', results };
  }
  if (!controlResult.pass) {
    return {
      validity: 'HARNESS_INVALID',
      reason: `control "${controlResult.name}" failed: ${controlResult.error || controlResult.signature || 'no detail'}. `
        + 'A harness that cannot pass a known-good case has no standing to fail a candidate. '
        + 'Nothing below is counted against any candidate.',
      results: results.map((r) => ({ ...r, counted: false, why_not_counted: 'harness invalid' })),
    };
  }
  return { validity: 'VALID', reason: `control "${controlResult.name}" passed`, results: results.map((r) => ({ ...r, counted: true })) };
}

/* What the next run should do differently, derived from this run's validity
   rather than from a person reading the log. This is the part that compounds. */
export function steer(classification, preflightResult) {
  const steps = [];
  if (!preflightResult.ok) {
    steps.push('Complete the mirror before running: ' + preflightResult.problems.join('; '));
    steps.push('Do not launch a browser until preflight is clean; a run against an incomplete mirror produces failures that are not the product\'s.');
    return { action: 'FIX_MIRROR', steps };
  }
  switch (classification.validity) {
    case 'HARNESS_INVALID':
      steps.push('The control failed, so vary the HARNESS not the candidates: mirror completeness, translator, cartridge re-signing, readiness signals.');
      steps.push('Re-run the control alone until it passes; only then re-admit candidates.');
      return { action: 'FIX_HARNESS', steps };
    case 'NO_CONTROL':
      steps.push('Add a control case before drawing any conclusion from this run.');
      return { action: 'ADD_CONTROL', steps };
    default: {
      const counted = classification.results.filter((r) => r.counted);
      const failed = counted.filter((r) => !r.pass);
      const sigs = new Set(failed.map((r) => r.signature || r.error || 'unsigned'));
      if (failed.length === counted.length && counted.length > 1 && sigs.size === 1) {
        steps.push('Every candidate failed with one signature, and the control passed - the fault is upstream of every edit but downstream of the harness. Instrument the path rather than varying the change.');
        return { action: 'INSTRUMENT', steps };
      }
      if (failed.length === 0) {
        steps.push('All candidates passed. The next useful run removes changes one at a time to find the smallest set that still passes.');
        return { action: 'MINIMISE', steps };
      }
      steps.push('Some passed, some failed, control valid: the difference between the nearest pass and the nearest fail is the smallest known statement of the fix.');
      return { action: 'DIFF_NEAREST_PAIR', steps };
    }
  }
}
