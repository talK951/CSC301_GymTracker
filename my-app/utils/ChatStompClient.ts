import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export type MessageCallback = (payload: any) => void;

// STOMP-based chat client wrapper using SockJS.
export class ChatStompClient {
  private stompClient: Client;
  private groupName: string;
  private messageCallback?: MessageCallback;

  constructor(url: string, groupName: string) {
    this.groupName = groupName;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });
  }

  // Set a callback to handle incoming messages.
  public setMessageCallback(callback: MessageCallback) {
    this.messageCallback = callback;
  }

  // Connect to the STOMP broker and subscribe to the group chat topic.
  public connect(): void {
    this.stompClient.onConnect = (frame) => {
      console.log('STOMP connected:', frame);

      this.stompClient.subscribe(`/topic/chat/${this.groupName}`, (message: IMessage) => {
        if (message.body) {
          try {
            const parsedBody = JSON.parse(message.body);
            this.messageCallback?.(parsedBody);
          } catch (err) {
            console.warn('Failed to parse STOMP message body:', err);
            this.messageCallback?.(message.body);
          }
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  // Disconnect from the STOMP broker.
  public disconnect(): void {
    this.stompClient.deactivate();
  }

  // Publish (send) a message to the group chat.
  public sendMessage(content: string, isImage: boolean, s3ObjectKey: string,  sender: string) {
    this.stompClient.publish({
      destination: `/app/chat/${this.groupName}`,
      body: JSON.stringify({ groupName: this.groupName, content, isImage, s3ObjectKey, sender })
    });
  }
}