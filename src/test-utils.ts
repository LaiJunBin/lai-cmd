export const mockedStdout = () => {
  vi.spyOn(process.stdout, 'write');
  return vi.mocked(process.stdout.write);
};
