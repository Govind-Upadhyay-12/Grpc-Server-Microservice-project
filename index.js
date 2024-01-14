// const grpc=require("@grpc/grpc-js")
// const protoLoader=require('@grpc/proto-loader')
// const packageDefinition=protoLoader.loadSync('./todo.proto')

// const server=new grpc.Server()
// const todos=[
//     {
//         id:'1',title:'Todo1',content:'Content of todo1'
//     },
//     {
//         id:'2',title:'Todo2',content:'Content of todo2'
//     }
// ]

// server.addService(todoProto.TodoService.service,{
//     listTodos:(call,callback)=>{
//         callback(null,todos)
//     },
//    createTodo:(call,callback)=>{
//         let imcoming=call.request;
//         todos.push(imcoming)
//         callback(null,imcoming);

//     },
//     getTodo:(call,callback)=>{
//        let incomoing_todo=call.request;
//        let todoid=incomoing_todo.id;
//        const response=todos.filter((todo)=>todo.id==todoid);
//        if(response.length>0){
//         callback(null,response);
//        }
//        else{
//         callback({
//             message:"todo not found"
//         },null)
//        }

//     }
    


// })
// server.bind('127.0.0.1:50051',grpc.ServerCredentials.createInsecure());
// console.log("server is started");
// server.start();

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, 'todo.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const todoProto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server();

const todos = [
    {
        id: '1',
        title: 'Todo1',
        content: 'Content of todo1',
    },
    {
        id: '2',
        title: 'Todo2',
        content: 'Content of todo2',
    },
];

server.addService(todoProto.TodoService.service, {
    listTodos: (call, callback) => {
        callback(null, { todos });
    },
    createTodo: (call, callback) => {
        const incomingTodo = call.request;
        incomingTodo.id = (todos.length + 1).toString();
        todos.push(incomingTodo);
        callback(null, incomingTodo);
    },
    getTodo: (call, callback) => {
        const incomingTodo = call.request;
        const todoId = incomingTodo.id;
        const response = todos.find((todo) => todo.id === todoId);

        if (response) {
            callback(null, response);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Todo not found",
            });
        }
    },
});

const PORT =   50051;
const HOST = "localhost";

server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Server running at ${HOST}:${PORT}`);
    server.start();
});
