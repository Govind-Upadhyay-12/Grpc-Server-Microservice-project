const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const todoService = protoDescriptor.TodoService;

const client = new todoService('localhost:50051', grpc.credentials.createInsecure());


function listTodos() {
    client.listTodos({}, (error, response) => {
        if (!error) {
            console.log('List of Todos:', response.todos);
        } else {
            console.error('Error calling listTodos:', error.message);
        }
    });
}

function createTodo() {
    const newTodo = {
        id: '3',
        title: 'New Todo',
        content: 'Content of the new todo',
    };

    client.createTodo(newTodo, (error, response) => {
        if (!error) {
            console.log('Created Todo:', response);
        } else {
            console.error('Error calling createTodo:', error.message);
        }
    });
}

function getTodo() {
    const todoRequest = { id: '1' };

    client.getTodo(todoRequest, (error, response) => {
        if (!error) {
            console.log('Todo Details:', response);
        } else {
            console.error('Error calling getTodo:', error.message);
        }
    });
}


listTodos();
createTodo();
getTodo();
