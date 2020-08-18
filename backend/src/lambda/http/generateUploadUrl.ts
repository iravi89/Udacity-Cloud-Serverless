import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { S3Access } from '../../utils/s3/S3Access';
import { TodoItemAccess } from '../../dataLayer/ToDoList'
import { getUserById} from '../../utils/jwt/authenticator'
import { createLogger } from '../../utils/logger'

const todos = new TodoItemAccess()

const logger = createLogger('todos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const authHeader = event.headers['Authorization']
    const userId = getUserById(authHeader)
 
    const item = await todos.getTodoById(todoId)


    if(item.Count == 0){
        logger.error(`user ${userId} requesting put url for non exists todo with id ${todoId}`)
        const error = 'TODO does not exist'
        
        return {
            statusCode: 400,
            headers:{
              'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
              error
            })
          }
    }

     if(item.Items[0].userId !== userId)
    {
        logger.error(`user ${userId} requesting put url todo does not belong to his account with id ${todoId}`)
        const error = 'TODO does not belong to authorized user'
        
        return {
            statusCode: 400,
            headers:{
              'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
              error
            })
          }
    }
    else
    {

    
    const url = new S3Access().getPresignedUrl(todoId)
    
            return {
                statusCode: 200,
                headers:{
                  'Access-Control-Allow-Origin':'*'
                },
                body: JSON.stringify({
                  uploadUrl: url
                  })
              }
    }
    
  }
