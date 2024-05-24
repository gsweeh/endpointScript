const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config(); // Load environment variables from .env file

let hitCount = 1;
let extraMinutes = 0;
let nextCallTime = Date.now() + 24 * 60 * 60 * 1000 + (10 * hitCount) * 60 * 1000; // Initial next call time
let countdownIntervalId;
let nextCallTimeoutId;

// Endpoint to add extra time
app.get('/time', (req, res) => {
    const additionalTime = parseInt(req.query.extra, 10);
    if (isNaN(additionalTime)) {
        return res.status(400).send('Invalid time provided');
    }

    extraMinutes += additionalTime;
    nextCallTime += additionalTime * 60 * 1000;

    // Clear the current countdown and timeout
    clearInterval(countdownIntervalId);
    clearTimeout(nextCallTimeoutId);

    // Start a new countdown and set the new timeout for the next API call
    countdownToNextAPICall(nextCallTime - Date.now());
    nextCallTimeoutId = setTimeout(makeAPICall, nextCallTime - Date.now());

    res.send(`Extra ${additionalTime} minutes added. Total extra time: ${extraMinutes} minutes. Next API call in: ${calculateRemainingTime(nextCallTime - Date.now())}`);
});

// Endpoint to get the current status of variables
app.get('/status', (req, res) => {
    const remainingTime = calculateRemainingTime(nextCallTime - Date.now());
    res.json({
        hitCount,
        extraMinutes,
        remainingTime,
        nextCallTime: new Date(nextCallTime).toLocaleString()
    });
});

async function makeAPICall() {
    try {
        const { default: fetch } = await import('node-fetch');

        let response = await fetch(process.env.API_ENDPOINT_1);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let responseBody = await response.text();
        console.log('API call success. Response:', responseBody);

        await sleep(5000);

        response = await fetch(process.env.API_ENDPOINT_2);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        responseBody = await response.text();
        console.log('API call success. Response:', responseBody);

        nextCallTime = Date.now() + 24 * 60 * 60 * 1000 + (10 * hitCount + extraMinutes) * 60 * 1000;
        console.log(`Next API call scheduled in: ${calculateRemainingTime(nextCallTime - Date.now())}`);

        nextCallTimeoutId = setTimeout(makeAPICall, nextCallTime - Date.now());
        countdownToNextAPICall(nextCallTime - Date.now());

        hitCount++;
    } catch (error) {
        console.error('There was a problem with the API request:', error);
    }
}

function calculateRemainingTime(delay) {
    const hours = Math.floor(delay / (60 * 60 * 1000));
    const minutes = Math.floor((delay % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((delay % (60 * 1000)) / 1000);
    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function countdownToNextAPICall(delay) {
    let remainingTime = delay;
    countdownIntervalId = setInterval(() => {
        remainingTime -= 1000;
        if (remainingTime <= 0) {
            clearInterval(countdownIntervalId);
            console.log('\rNext API call in progress...');
        } else {
            process.stdout.write(`\rNext API call in: ${calculateRemainingTime(remainingTime)}`);
        }
    }, 1000);
}

makeAPICall();

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
