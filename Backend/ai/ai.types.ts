export type Role = "user" | "model";

export interface AIMessage {
    role: Role;
    parts: { text: string }[];
}

export interface AIChatRequest {
    message: string;
    history: AIMessage[];
    lastResults?: any[];
}

export interface FunctionCall {
    name: string;
    args: any;
}