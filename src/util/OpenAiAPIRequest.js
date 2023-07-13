// Information to reach API
const API_URL_COMPLETIONS = "https://api.openai.com/v1/completions";
const API_URL_CHAT_COMPLETIONS = "https://api.openai.com/v1/chat/completions";
const api_key = process.env.REACT_APP_MY_OPENAI_API_KEY;//API key that Joe got from registering the app
const API_URL_IMAGE = "https://api.openai.com/v1/images/generations";


// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// creates song recommendations based on a prompt
export const generateTotalSongRecommendations = async (prompt) => {
    // Determine strategies
    const strategies = await DetermineAppropriateStrategies(prompt);

    // Total recommendations required
    const totalRecommendations = 25;
    // Calculate recommendations per strategy
    const recsPerStrategy = Math.floor(totalRecommendations / strategies.length);

    // Create array of promises for all strategies
    const strategyPromises = strategies.map(async strategy => {
        // Modify prompt to include strategy for generating recommendations
        const strategyPrompt = `Give me ${recsPerStrategy} song recommendations for this prompt: ${prompt}. Use this strategy to make your recommendations ${strategy}. Format the response with this convention: Song Name - Artist Name 2. Song Name - Artist Name`;
        const strategyRecommendations = await generateSongRecommendations(strategyPrompt, recsPerStrategy);

        // Log the strategy and its recommendations
        console.log(`Strategy: ${strategy}`, strategyRecommendations);

        return strategyRecommendations;
    });

    // Resolve all promises concurrently and flatten the resulting array
    let recommendations = (await Promise.all(strategyPromises)).flat();

    // Remove duplicates by converting to Set and back to array
    recommendations = [...new Set(recommendations)];

    // Randomize the order of recommendations
    shuffleArray(recommendations);

    // In case total recommendations are less than 25 due to rounding down, fill up remaining
    if (recommendations.length < totalRecommendations) {
        const remainingRecs = totalRecommendations - recommendations.length;
        const additionalRecs = await generateSongRecommendations(prompt, remainingRecs);

        // Remove potential duplicates again after adding additional recommendations
        recommendations = [...new Set(recommendations.concat(additionalRecs))];

        // Randomize the order of recommendations again after adding additional recommendations
        shuffleArray(recommendations);
    }
    console.log("Final recommendations: ", recommendations);

    return recommendations;
}


//Interprets prompt to determine which batch strategies make sense given the context of the prompt
export const DetermineAppropriateStrategies = async (prompt) => {
    const batchDescriptions = [
        "1. Literal interpretation of the user's prompt",
        "2. Capturing the mood or theme implied by the user's prompt",
        "3. Selecting songs from different genres that would fit the context of the user's prompt",
        "4. Suggesting songs from different eras or time periods that align with the user's prompt",
        "5. Creative interpretation of the user's prompt",
    ];
    const context =
    `The user is looking for song recommendations that are appropriate the following prompt: ${prompt}. 
    Think about what exactly the user is asking for. Are they looking to capture a mood? Are they asking about a specific event or location?
    Based on this reflection, which of these strategies would be suitable for recommending music based on this prompt: ${batchDescriptions}? 
    List the suitable strategies in an array with the corresponding number for the batch description.
    For example, if the prompt is "I'm feeling sad", then the suitable strategies would be 1, 2, 3, and 5. And you would return [1, 2, 3, 5].`;
    // run an api call to openai to generate the response
    const data = JSON.stringify({
        model: "gpt-4",
        messages: [{
            role: "system",
            content: "You are a prompt interpreter. Based on a prompt you will categorize which music recommendation strategies to use."
        }, {
            role: "user",
            content: context
        }],
    });
    try {
        const response = await fetch(API_URL_CHAT_COMPLETIONS, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key}`
            }
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            const responseContent = jsonResponse.choices[0].message.content;
            console.log(responseContent)
            // Extract numbers from GPT-4's response
            const strategies = responseContent.match(/\d+/g);
            if (strategies !== null) {
                return strategies.map(Number);
            }
            consol
        }
        else {
        const errorResponse = await response.json();
        console.log('Error response:', errorResponse);
    }

    } catch (error) {
        console.log(error);
    }
    // Fall back to the wildcard strategy.
    console.log("An error occurred or no strategies were selected. Falling back to wildcard strategy.");
    return [5];
}


//Asynchronous functions
export const generateSongRecommendations = async (prompt) => {
    const data = JSON.stringify({
        model: "gpt-4",
        messages: [{
            role: "system",
            content: "You are a music recommendation engine."
        }, {
            role: "user",
            content: prompt
        }],
    });

    try {
        const response = await fetch(API_URL_CHAT_COMPLETIONS, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key}`
            }
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            const responseArray = jsonResponse.choices[0].message.content.split(/\d+\.\s/g);
            const filteredResponse = responseArray.map((element) => {
                return element.replace(/\n|\d+\./g, "").trim();
            }).filter((element) => element !== "");
            return (filteredResponse);
        }
    } catch (error) {
        console.log(error);
    }
}

export const generatePlaylistName = async(prompt) => {
    const data = JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    });

    try {
        const response = await fetch(API_URL_COMPLETIONS, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key}`
            }
        });
        if(response.ok){
            const jsonResponse = await response.json();
            const textResponse = jsonResponse.choices[0].text
            return(textResponse);
        }
    } catch (error) {
        console.log(error);
    }

}


export const generateImage = async (prompt) => {
    const data = JSON.stringify({
        "model": "image-alpha-001",
        "prompt": prompt,
        "num_images": 1,
        "size": "512x512",
    });

    try {
        const response = await fetch(API_URL_IMAGE, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key}`
            }
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            if (jsonResponse && jsonResponse.data && jsonResponse.data.length > 0) {
                return jsonResponse.data[0].url;
            } else {
                console.error("Invalid response from OpenAI API");
                return null;
            }
        } else {
            console.error(`Failed to generate image: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`Error generating image: ${error}`);
        return null;
    }
}

export default {generateSongRecommendations, generatePlaylistName, generateImage, generateTotalSongRecommendations};