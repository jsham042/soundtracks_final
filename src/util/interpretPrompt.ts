import OpenAiAPIRequest, { interpretPrompt2 } from "./OpenAiAPIRequest";
import type { InterpretPromptResponse } from "./interpretPrompt-js.types";

console.log(interpretPrompt2("I'm feeling sad") as InterpretPromptResponse);
