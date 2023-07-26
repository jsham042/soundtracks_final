const nock = require('nock');
import { DetermineAppropriateStrategies } from './OpenAiAPIRequest.js';

describe("interpretPrompt", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // it("should return array of strategies when API call is successful", async () => {
    //     const prompt = "I'm feeling sad";
    //     const mockResponse = {
    //         "choices": [
    //             {
    //                 "message": {
    //                     "content": "1, 2, 3, 5"
    //                 }
    //             }
    //         ]
    //     };
    //     nock('http://api.openai.com')
    //         .post('/v1/chat/completions') // adjust path to actual API endpoint
    //         .reply(200, mockResponse);
    //
    //     const result = await DetermineAppropriateStrategies(prompt);
    //     expect(result).toEqual([1, 2, 3, 5]);
    // });

    it("should return fallback array when API call is not successful", async () => {
        const prompt = "I'm feeling sad";

        nock('http://api.openai.com')
            .post('/v1/chat/completions') // adjust path to actual API endpoint
            .replyWithError('Something went wrong');

        const result = await DetermineAppropriateStrategies(prompt);
        expect(result).toEqual([5]);
    });

    it("should return fallback array when API response is not as expected", async () => {
        const prompt = "I'm feeling sad";
        const mockResponse = {
            "choices": [
                {
                    "message": {
                        "content": "no strategy"
                    }
                }
            ]
        };

        nock('http://api.openai.com')
            .post('/v1/chat/completions') // adjust path to actual API endpoint
            .reply(200, mockResponse);

        const result = await DetermineAppropriateStrategies(prompt);
        expect(result).toEqual([5]);
    });
});
