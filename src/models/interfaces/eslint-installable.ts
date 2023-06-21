export interface ESLintIntstallable {
  installESLint(): Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isESLintInstallable(object: any): object is ESLintIntstallable {
  return 'installESLint' in object
}
