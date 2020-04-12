# Verify swarm service update action

This action checks the update status of a service in a docker swarm and throws an error if it is not `completed`

## Inputs

### `service-name`

**Required** The service name

### `entrypoint`

**Optional** Command added before the inspect service command. Ex.: docker-machine ssh manager-name

### `run-as-su`

**Optional** Should run as super user?

## Exemplo de uso

```yaml
uses: actions/verify-swarm-update-action@v1
with:
  service-name: 'my-service-name'
```
