export interface HuskyInstallable {
  installHusky(): Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isHuskyInstallable(object: any): object is HuskyInstallable {
  return 'installHusky' in object
}
