import { S3Access } from '../../utils/s3/S3Access'
import { createLogger } from '../../utils/logger'
import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserById} from '../../utils/jwt/authenticator'
import { TodoItemAccess } from '../../dataLayer/ToDoList'


const s3 = new S3Access()
const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const authHeader = event.headers['Authorization']
    const userId = getUserById(authHeader) 
    logger.info(`get groups for user ${userId}`)
    const result = await new TodoItemAccess().getUserTodos(userId)
      
    for(const record of result){
        record.attachmentUrl = await s3.getTodoAttachmentUrl(record.todoId)
    }

    const key = 'items'
    return {
        statusCode: 200,
        headers:{
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
          [key]:result
        })
      }
}