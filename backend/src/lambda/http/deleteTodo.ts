import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    APIGatewayProxyHandler } from 'aws-lambda'
import { getUserById} from '../../utils/jwt/authenticator'
import { TodoItemAccess } from '../../dataLayer/ToDoList'


const todos = new TodoItemAccess()
const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const authHeader = event.headers['Authorization']



    const todoId = event.pathParameters.todoId
    if(!todoId){
        logger.error('invalid delete attempt without todo id')
        const message = 'TODO : invalid parameters , please check the parameter'
        return {
            statusCode: 400,
            headers:{
              'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
              message
            })
          }
    }
 
    const userId = getUserById(authHeader)

    const item = await todos.getTodoById(todoId)
    if(item.Count == 0){
        logger.error('user ${userId} requesting delete for non exists todo with id ${todoId}')
        const message = 'TODO : not exists'
        return {
            statusCode: 400,
            headers:{
              'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
              message
            })
          }
    }

    else if(item.Items[0].userId !== userId){
        logger.error('user ${userId} requesting delete todo does not belong to his account with id ${todoId}')
        const message = 'TODO : does not belong to authorized user'
        return {
            statusCode: 400,
            headers:{
              'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
              message
            })
          }
    }
    else
    {

    logger.info(`User ${userId} deleting todo ${todoId}`)
    await todos.deleteTodoById(todoId)
    const message = 'TODO : Deleted sucessfully'
    return {
        statusCode: 204,
        headers:{
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
          message
        })
      }
    
    }
  
}
