const core = require('@actions/core')
const child_process = require('child_process')

const getStatus = ({ entrypoint, asSu, serviceName }) =>
  child_process
    .execSync(
      `${entrypoint || ''} ${
        asSu ? 'sudo' : ''
      } docker service inspect ${serviceName} --format "{{.UpdateStatus.State}}"`,
    )
    .toString()
    .trim()

const awaitUpdate = ({ entrypoint, asSu, serviceName }) =>
  new Promise((resolve, reject) => {
    let interval

    try {
      interval = setInterval(() => {
        const updateStatus = getStatus({ entrypoint, asSu, serviceName })
        if (updateStatus === 'updating') {
          console.log(`Service status: ${updateStatus}`)
          return
        }

        clearInterval(interval)
        resolve()
      }, 3000)
    } catch (err) {
      if (interval) clearInterval(interval)
      reject(err)
    }
  })

async function run() {
  try {
    const entrypoint = core.getInput('entrypoint')
    const asSu = core.getInput('run-as-su')
    const serviceName = core.getInput('service-name')

    console.log('Waiting service update...')

    await awaitUpdate({ entrypoint, asSu, serviceName })

    const updateStatus = getStatus({ entrypoint, asSu, serviceName })

    if (updateStatus !== 'completed') {
      return core.setFailed(`${serviceName} update status is: ${updateStatus}, please verify your deployment!`)
    }

    console.log('All good!')
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
