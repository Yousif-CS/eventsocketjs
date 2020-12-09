
import { Connection } from '../src/Connection';
import { Message } from '../src/Message';

enum EventTypes {
    Hello, World, RandomNumber
};

var connection = new Connection<EventTypes>();

connection.OnMessage = (message: Message<EventTypes>) => {
    document.body.innerHTML = "Message Received: " + message.data();
}

connection.connectToServer("localhost", 60000);

document.body.innerHTML = "Connected!";