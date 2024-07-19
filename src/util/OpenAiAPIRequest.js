// Information to reach API
const API_URL_COMPLETIONS = "https://api.openai.com/v1/completions";
const API_URL_CHAT_COMPLETIONS = "https://api.openai.com/v1/chat/completions";
const api_key = process.env.REACT_APP_MY_OPENAI_API_KEY;
const API_URL_IMAGE = "https://api.openai.com/v1/images/generations";


// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// creates song recommendations based on a prompt
export const generateAISongRecommendations = async (userSearchInput) => {
    
    // First, determine the right strategies (e.g. think literally vs. based on mood) to tell the AI to use
    const strategies = await DetermineAppropriateStrategies(userSearchInput);

    // Total recommendations required NOTE this is our decision
    const totalRecommendations = 25;

    // Calculate the number of recommendations per strategy to total the targeted amount
    const recsPerStrategy = Math.floor(totalRecommendations / strategies.length);

    // Generate the song recommendations by calling the AI with the different strategies
    const songRecommendations = strategies.map(async strategy => {
        // Modify prompt to include strategy for generating recommendations
        const strategyPrompt = `The user has requested that you curate a playlist based on this description:
        ${userSearchInput} 
        
        Based on the user's description, it is best to follow this strategy for curating the playlist:
        ${strategy}
        
        Give me ${recsPerStrategy} song recommendations in JSON format with the following structure:
        {
          "recommendations": [
            {
              "song": "song 1",
              "artist": "artist 1"
            },
            {
              "song": "song 2",
              "artist": "artist 2"
            },
            ...
          ]
        }
        `;

        let strategyRecommendations = await generateSongRecommendations(strategyPrompt, recsPerStrategy);

        // Log the strategy and its recommendations
        console.log(`Strategy: ${strategy}`, strategyRecommendations);

        // Parse the recommendations as JSON
        let strategyRecommendationsDict = JSON.parse(strategyRecommendations);

        // Grab the recommendations array
        strategyRecommendations = strategyRecommendationsDict.recommendations;

        console.log("Recommendations: ", strategyRecommendations);

        return strategyRecommendations;
    });

    // Resolve all promises concurrently and flatten the resulting array
    let recommendations = (await Promise.all(songRecommendations)).flat();
    console.log("Recommendations before dupes: ", recommendations);

    const uniqueRecommendations = recommendations.filter((song, index, self) =>
        index === self.findIndex((t) => t.song === song.song && t.artist === song.artist)
    );
    const removedCount =    recommendations.length - uniqueRecommendations.length;
    console.log(`Number of duplicate recommendations removed: ${removedCount}`);

    recommendations = Array.from(uniqueRecommendations.values());

    // Randomize the order of recommendations
    shuffleArray(recommendations);

    // In case total recommendations are less than 25 due to rounding down, fill up remaining
    if (recommendations.length < totalRecommendations) {
        const recommendationContents = recommendations.map(rec => `${rec.song} by ${rec.artist}`).join(", ");
        const remainingRecs = totalRecommendations - recommendations.length;
        const prompt = `The user has requested that you curate a playlist based on this description:
        ${userSearchInput} 

        The following songs have already been added to the playlist:
        ${recommendationContents}
        
        Give me ${remainingRecs} new song recommendations in JSON format with the following structure:
        {
          "recommendations": [
            {
              "song": "song 1",
              "artist": "artist 1"
            },
            {
              "song": "song 2",
              "artist": "artist 2"
            },
            ...
          ]
        }
        `
        let additionalRecs = await generateSongRecommendations(prompt, remainingRecs);

        // Parse the recommendations as JSON
        let additionalRecsDict = JSON.parse(additionalRecs);

        // Grab the recommendations array
        additionalRecs = additionalRecsDict.recommendations;

        // Combine with other recs
        recommendations = [...new Set(recommendations.concat(additionalRecs))];
        
        //Remove potential duplicates again after adding additional recommendations
        recommendations = recommendations.filter((song, index, self) =>
            index === self.findIndex((t) => t.song === song.song && t.artist === song.artist)
        );

        // Randomize the order of recommendations again after adding additional recommendations
        shuffleArray(recommendations);
    }
    console.log("Final recommendations: ", recommendations);

    return recommendations;
}


//Interprets prompt to determine which batch strategies make sense given the context of the prompt
export const DetermineAppropriateStrategies = async (userSearchInput) => {
    const batchDescriptions = [
        "1. Interpret the user's prompt literally.",
        "2. Capture the mood or theme implied by the user's prompt.",
        "3. Select songs from different genres that fit the context of the user's prompt.",
        "4. Suggest songs from different eras or time periods that align with the user's prompt.",
        "5. Interpret the user's prompt creatively.",
    ];
    const context =
        `The user is looking for song recommendations that are appropriate the following description: ${userSearchInput}. 
    Think about what exactly the user is asking for. Are they looking to capture a mood? Are they asking about a specific event or location?
    Based on this reflection, which of these strategies would be suitable for recommending music based on this prompt: ${batchDescriptions}? 
    List the suitable strategies in an array with the corresponding number for the batch description.
    For example, if the prompt is "I'm feeling sad", then the suitable strategies would be 1, 2, 3, and 5. And you would return [1, 2, 3, 5].`;
    // run an api call to openai to generate the response
    const data = JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
            role: "system",
            content: "Based on a prompt you will categorize which music recommendation strategies to use."
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
            // Extract numbers from GPT-4's response in a unique set
            const strategies = [...new Set(responseContent.match(/\d+/g))];
            if (strategies !== null) {
                const strategyDescriptions = strategies.map(num => batchDescriptions[num - 1]);
                return strategyDescriptions;
            }
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
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
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
            const responseArray = jsonResponse.choices[0].message.content
            return responseArray
        }
    } catch (error) {
        console.log(error);
    }
}

export const generatePlaylistName = async(prompt) => {
    const data = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: "You are a helpful assistant."
        },{
            role: "user",
            content: prompt
        }]
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
        if(response.ok){
            const jsonResponse = await response.json();
            const textResponse = jsonResponse.choices[0].message.content;
            return(textResponse);
        } else {
            console.error(`Failed to generate playlist name: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`Error generating playlist name: ${error}`);
        return null;
    }
}


export const generateImage = async (prompt) => {
    const data = JSON.stringify({
        "model": "dall-e-2",
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

export default {generateSongRecommendations, generatePlaylistName, generateImage, generateTotalSongRecommendations: generateAISongRecommendations};