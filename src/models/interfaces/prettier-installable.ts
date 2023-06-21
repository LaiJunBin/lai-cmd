export interface PrettierInstallable {
  installPrettier(): Promise<void>;
}

export function isPrettierInstallable(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is PrettierInstallable {
  return 'installPrettier' in object;
}
