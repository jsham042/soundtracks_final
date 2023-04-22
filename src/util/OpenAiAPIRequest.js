// Information to reach API
const API_URL = "https://api.openai.com/v1/engines/text-davinci-003/completions";
const api_key = process.env.REACT_APP_MY_OPENAI_API_KEY;//API key that Joe got from registering the app
const API_URL_IMAGE = "https://api.openai.com/v1/images/generations";

//Asynchronous functions
export const generateSongRecommendations = async(prompt) => {
    const data = JSON.stringify({
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key}`
            }
            });
            if(response.ok){
            const jsonResponse = await response.json();
            const responseArray = jsonResponse.choices[0].text.split(/\d+\.\s/g);
            const filteredResponse = responseArray.map((element) => {
                return element.replace(/\n|\d+\./g, "").trim();
            }).filter((element) => element !== "");
            return(filteredResponse);
        }
    } catch (error) {
            console.log(error);
        }
    }

export const generatePlaylistName = async(prompt) => {
    const data = JSON.stringify({
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    });

    try {
        const response = await fetch(API_URL, {
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

    generateImage(`Image of driving down the 101. Not containing text.`)
    .then(albumArtUrl => {
        console.log(albumArtUrl); // the URL of the generated album art
        // you can now set the state of the album art URL to `albumArtUrl`
    })
    .catch(error => {
        console.error(error);
    });



export default {generateSongRecommendations, generatePlaylistName, generateImage};
