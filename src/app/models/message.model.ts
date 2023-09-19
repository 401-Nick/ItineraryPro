export interface Message {
    author: string;
    content: string;
    type: 'assistant' | 'user';
}
