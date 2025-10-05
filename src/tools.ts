export function debug(...args: any[]) {
  console.debug(`\x1b[37m\x1b[46m${args[0]}\x1b[0m`, ...args.slice(1));
}
