import 'source-map-support/register'

import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyHandler, 
    APIGatewayProxyResult } from 'aws-lambda'   
import { TodoItemAccess } from '../../dataLayer/ToDoList'
import { createLogger } from '../../utils/logger'
import { getUserById} from '../../utils/jwt/authenticator'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'


const logger = createLogger('todos')
const todo = new TodoItemAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
      
  const authHeader = event.headers['Authorization']
  const newTodo: CreateTodoRequest = JSON.parse(event.body)


    const userId = getUserById(authHeader)
    logger.info(`create group for user ${userId} with data ${newTodo}`)
    
    const todoitem = await todo.createTodoItem(newTodo,userId)
  
    return {
        statusCode: 201,
        headers:{
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
            item: {
              ...todoitem
            }
          })
      }

}
