import { Jwt } from '../../auth/Jwt'
import {  decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos')

export function getUserById(authHeader: string): string{
  logger.info('Authenticating user with jwt ${authHeader}')
  console.log('In Function:authHeader',authHeader)

  if (!authHeader) throw new Error(' authentication header null')

  if (!authHeader.toLowerCase().startsWith('bearer ')) throw new Error('authentication header  not valid')
  const split = authHeader.split(' ')
  const jwtToken = split[1]

  const jwt: Jwt = decode(jwtToken, { complete: true }) as Jwt
  console.log('Jwt Token:',jwt.payload)
  return jwt.payload.sub
}
