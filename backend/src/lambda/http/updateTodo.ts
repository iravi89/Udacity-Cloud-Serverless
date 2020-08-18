import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserById} from '../../utils/jwt/authenticator'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { TodoItemAccess } from '../../dataLayer/ToDoList'
import { createLogger } from '../../utils/logger'



const logger = createLogger('todos')
const todos= new TodoItemAccess()


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const authHeader = event.headers['Authorization']
    const userId = getUserById(authHeader)
  
    const items = await todos.getTodoById(todoId)
  
    if(items.Count == 0){
        logger.error(`task doesnot exist for this user`)
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

    if(items.Items[0].userId !== userId){
        logger.error(`user ${userId} not authorized to make changes for task id ${todoId}`)
        const message = 'TODO : user not authorized'
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
    

    logger.info(`User ${userId} requesting update with task id ${todoId} to ${updatedTodo}`)
    await todos.updateTodobyId(updatedTodo,todoId)

    const message = 'Task Updated sucessfully'
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
