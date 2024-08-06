// Derived from src/util/OpenAI.test.js

export type Prompt = string;

export interface Message {
    content: string;
}

export interface Choice {
    message: Message;
}

export interface ApiResponse {
    choices: Choice[];
}

export type DetermineAppropriateStrategies = (prompt: Prompt) => Promise<number[]>;
