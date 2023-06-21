export interface TailwindInstallable {
  installTailwind(): Promise<void>
}

export function isTailwindInstallable(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is TailwindInstallable {
  return 'installTailwind' in object
}
