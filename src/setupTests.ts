function ignoreConsole() {
  vi.spyOn(process.stdout, 'write').mockImplementation(vi.fn() as null)
  vi.spyOn(process.stderr, 'write').mockImplementation(vi.fn() as null)
}

beforeEach(() => {
  ignoreConsole()
})
