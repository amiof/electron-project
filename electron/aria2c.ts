import {ChildProcess, spawn} from "child_process";
import WebSocket from "ws";


interface Aria2cRequest {
    jsonrpc: '2.0';
    id: string;
    method: string;
    params: (string | any[])[]; // Allow for different parameter types
}

// interface Aria2cResponse {
//     jsonrpc: '2.0';
//     id: string;
//     result?: any;
//     error?: {
//         code: number;
//         message: string;
//     };
// }
//

export default class aria2c {

    ws: WebSocket | null = null;
    aria2cProcess: ChildProcess | null = null;
    aria2cSecret: string = 'test'; // STORE SECURELY! Use electron-store
    aria2cPort: number = 6800;

    start() {
        this.aria2cProcess = spawn('aria2c', [
            '--enable-rpc',
            '--async-dns-server=8.8.8.8',
            '--rpc-listen-all=true',
            '--rpc-allow-origin-all',
            `--rpc-listen-port=${this.aria2cPort}`,
            `--rpc-secret=${this.aria2cSecret}`,
        ])

        this.aria2cProcess.stdout!.on('data', (data: Buffer) => { // Use non-null assertion (!) if sure it's not null
            console.log(`aria2c stdout: ${data}`);
        });

        this.aria2cProcess.stderr!.on('data', (data: Buffer) => {
            console.error(`aria2c stderr: ${data}`);
        });

        this.aria2cProcess.on('close', (code: number) => {
            console.log(`aria2c exited with code ${code}`);
            this.ws = null;
        });
    }

    // Handle connection open
    connect() {

        this.ws = new WebSocket("ws://localhost:6800/jsonrpc");
        this.ws.onopen = () => {
            console.log("Connected to Aria2");

            // Start sending requests only after the connection is open
        };

        // Handle connection close
        this.ws.onclose = () => {
            console.log("Connection closed to Aria2");
        };

        // Handle incoming messages
        this.ws.onmessage = (event: any) => {
            try {
                const response = JSON.parse(event.data);
                console.log("Message:", response);
            } catch (error) {
                console.error("Error parsing response:", error);
            }
        };

        // Handle errors
        this.ws.onerror = (error) => {
            console.error("An error occurred:", error);
        };

    }


    sendAria2cRequest(method: string, params: any[] = [], id: string = this.generateId()) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const requestData: Aria2cRequest = {
                jsonrpc: "2.0",
                id: id,
                method: method,
                params: [`token:${this.aria2cSecret}`, ...params],
            }

            this.ws.send(JSON.stringify(requestData));
        } else {
            console.warn("WebSocket not open yet. Cannot send request.");
        }
    }

    generateId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }


}