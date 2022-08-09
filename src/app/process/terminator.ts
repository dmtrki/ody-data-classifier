import { exec } from 'child_process'

export default class ProcessTerminator {
  static onError() {
    process.on('uncaughtException', (err) => {
      console.error(err)
      this.terminate()
    })

    process.on('unhandledRejection', (reason, promise) => {
      console.error(reason)
      this.terminate()
    })
  }

  private static terminate() {
    if (process.env.NODE_ENV === 'development') return
    exec('pgrep -x node', (error, result) => {
      console.log(result);
      if (!error && result) {
        const lines = result.split(/\r?\n/)
        for (const line of lines) {
          const pid = parseInt(line);
          if (Number.isInteger(pid)) {
            process.kill(pid, 'SIGKILL')
          }
        }
      } else if (error) {
        process.exit(1);
      }
    })
  }
}
