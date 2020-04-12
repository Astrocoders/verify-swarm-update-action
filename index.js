const core = require('@actions/core')
const child_process = require('child_process')

try {
  const entrypoint = core.getInput('entrypoint')
  const asSu = core.getInput('run-as-su')
  const serviceName = core.getInput('service-name')

  const updateStatus = child_process
    .execSync(
      `${entrypoint || ''} ${
        asSu ? 'sudo' : ''
      } docker service inspect ${serviceName} --format "{{.UpdateStatus.State}}"`,
    )
    .toString()

  if (updateStatus !== 'completed') {
    return core.setFailed(`${serviceName} update status is: ${updateStatus}, please verify your deployment!`)
  }

  console.log('All good!')
} catch (err) {
  core.setFailed(err.message)
}
