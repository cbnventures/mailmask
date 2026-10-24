import { describe, expect, it } from 'vitest';

import { getNpmPackFilePaths } from './npm-pack-report.mjs';

/**
 * Lib - npm Pack Report Test - npm Pack Report.
 *
 * The build verifies the npm package on both local and GitHub runners,
 * which may use different npm major versions and JSON output shapes.
 *
 * @since 0.0.0
 */
describe('npm pack report', () => {
  it('reads the npm 11 array format', () => {
    expect(getNpmPackFilePaths(
      [{ files: [{ path: 'build/src/cli/index.js' }] }],
      'mailmask',
    )).toEqual(['build/src/cli/index.js']);

    return;
  });

  it('reads the npm 12 package-keyed format', () => {
    expect(getNpmPackFilePaths({
      'mailmask': { files: [{ path: 'build/src/cli/index.js' }] },
    }, 'mailmask')).toEqual(['build/src/cli/index.js']);

    return;
  });

  it('rejects reports that omit the requested package', () => {
    expect(() => {
      getNpmPackFilePaths({}, 'mailmask');

      return;
    }).toThrow('did not return a package report');

    return;
  });

  it('rejects reports without a file list', () => {
    expect(() => {
      getNpmPackFilePaths({
        'mailmask': {},
      }, 'mailmask');

      return;
    }).toThrow('did not return a file list');

    return;
  });

  return;
});
