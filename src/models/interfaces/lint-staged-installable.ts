export interface LintStagedInstallable {
  installLintStaged(): Promise<void>;
}

export function isLintStagedInstallable(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is LintStagedInstallable {
  return 'installLintStaged' in object;
}
