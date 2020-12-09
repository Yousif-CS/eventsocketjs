// All message related classes

var MessageImp = require("./Message_pb").Message;

// Contains the size and id (eventid) of messages
interface MessageHeader<T> {};

// Contains the payload and header
interface Message<T> {};

// A message that is owned by a Connection
interface OwnedMessage<T> {};

import { getOriginalNode, textChangeRangeIsUnchanged } from 'typescript';
import { Connection } from './Connection';

enum Config {
    Forward, Forwarded, BroadcastAll, BroadcastRoom, Broadcasted,
    CreateRoom, CreateRoomResponse, JoinRoom, OnRoomJoined,
    None
};

class MessageHeader<T> {

    id: T;
    config: Config;
    size: number;
};

class Message<T> {
    private header: MessageHeader<T>;
    private messageImp: typeof MessageImp;

    constructor(data?: string, id?: T, config?: Config)
    {
        this.messageImp = new MessageImp();
        
        if (! (typeof data === 'undefined' || data === null))
        {
            this.messageImp.setBody(data);
        }
        
        // Set the id if available
        if (typeof id === 'undefined' || id  === null){
            this.messageImp.getHeader().setID(id);
        }
        
        // Set the config to a default value if not available
        if (typeof config === 'undefined' || config === null)
        {
            this.messageImp.getHeader().setConfig(Config['None']);
        }else
        {
            this.messageImp.getHeader().setConfig(config);   
        }

        this.header.size = Object.keys(data).length;
        this.messageImp.getHeader().setSize(this.header.size);

    }

    size(): number {
        return this.header.size;
    }

    data(): string {
        return this.messageImp.getBody();
    }
    
    setID(id: T) {
        this.header.id = id;
        this.messageImp.getHeader().setID(id);
    }

    setConfig(config: Config) {
        this.header.config = config;
        this.messageImp.getHeader().setConfig(config);
    }

    getID(): T {
        return this.header.id;
    }

    getConfig(): Config {
        return this.header.config;
    } 

    serializeBinary(): any {
        return this.messageImp.serializeBinary();
    } 

    deserializeBinary(data: any) {
        this.messageImp = MessageImp.deserializeBinary(data);
        this.header.size = this.messageImp.getHeader().getSize();
        this.header.id = this.messageImp.getHeader().getID();
        this.header.config = this.messageImp.getHeader().getConfig();
    }
};

class OwnedMessage<T> {
    message: Message<T>;
    owner: Connection<T>;
};

export { Message, OwnedMessage };