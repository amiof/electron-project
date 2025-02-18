// import { WebSocket } from "ws";
//
//
// export default  class MySocket {
//
//     aria2Socket = new WebSocket("ws://localhost:6800/jsonrpc");
//
//     // Handle connection open
//     startEvent() {
//         this.aria2Socket.onopen = () => {
//             console.log("Connected to Aria2");
//
//             // Start sending requests only after the connection is open
//         };
//
//         // Handle connection close
//         this.aria2Socket.onclose = () => {
//             console.log("Connection closed to Aria2");
//         };
//
//         // Handle incoming messages
//         this.aria2Socket.onmessage = (event: any) => {
//             try {
//                 const response = JSON.parse(event.data);
//                 console.log("Message:", response);
//             } catch (error) {
//                 console.error("Error parsing response:", error);
//             }
//         };
//
//         // Handle errors
//         this.aria2Socket.onerror = (error) => {
//             console.error("An error occurred:", error);
//         };
//
//     }
//
//     // Function to send JSON-RPC request
//     aria2RpcRequest(method: string, params = [], id = "my-request") {
//         if (this.aria2Socket.readyState === WebSocket.OPEN) {
//             const requestData = JSON.stringify({
//                 jsonrpc: "2.0",
//                 id: id,
//                 method: method,
//                 params: params,
//             });
//
//             this.aria2Socket.send(requestData);
//         } else {
//             console.warn("WebSocket not open yet. Cannot send request.");
//         }
//     }
//     generateId(): string {
//         return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//     }
//
// }