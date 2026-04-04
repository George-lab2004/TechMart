export type Role = "user" | "model";

export interface AdminAIMessage {
    role: Role;
    parts: { text: string }[];
}

export interface AdminAIChatRequest {
    message: string;
    history: AdminAIMessage[];
    lastResults?: any[];
}

export interface AdminFunctionCall {
    name: string;
    args: any;
} 