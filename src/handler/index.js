class Handler {
  static payloads = {}
  constructor(source, options, command) {
    this.source = source
    this.options = options
    this.command = command
  }

  execute() {
    const handler = Handler.payloads[this.constructor.name][this.source]
    if (handler instanceof Function) {
      handler(this.options, this.command)
    } else {
      this.fallback()
    }
  }

  fallback() {
    console.error(
      `error: cmd ${this.command.name()} unknown source '${this.source}'`
    )
  }

  static register(key, action) {
    if (!this.payloads[this.name]) {
      this.payloads[this.name] = {}
    }

    this.payloads[this.name][key] = action
  }
}

module.exports = Handler
