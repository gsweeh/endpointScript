// Use dynamic import to import node-fetch
import('node-fetch').then(nodeFetch => {
    const fetch = nodeFetch.default;

    // Function to make the API call
    async function makeAPICall() {
        try {
            // Make request to the 1st endpoint
            let response = await fetch('yourendpoint');

            // Check if response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Read response body as text
            let responseBody = await response.text();
            console.log('API call success. Response:', responseBody);

            // Sleep for 5 seconds
            await sleep(5000);

            // Make request to the 2nd endpoint
            response = await fetch('yourendpoint');

            // Check if response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Read response body as text
            responseBody = await response.text();
            console.log('API call success. Response:', responseBody);

            // Calculate next delay (24 hours + additional 10 minutes)
            const nextDelay = 24 * 60 * 60 * 1000 + (10 + 10 * hitCount) * 60 * 1000;
            console.log(`Next API call scheduled in: ${calculateRemainingTime(nextDelay)}`);

            // Schedule next API call
            setTimeout(makeAPICall, nextDelay);

            // Start countdown for the next API call
            countdownToNextAPICall(nextDelay);

            // Increment hit count
            hitCount++;
        } catch (error) {
            console.error('There was a problem with the API request:', error);
        }
    }

    // Function to calculate remaining time until the next API call
    function calculateRemainingTime(delay) {
        const hours = Math.floor(delay / (60 * 60 * 1000));
        const minutes = Math.floor((delay % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((delay % (60 * 1000)) / 1000);
        return `${hours} hours ${minutes} minutes ${seconds} seconds`;
    }

    // Function to sleep for a specified number of milliseconds
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to start countdown for the next API call
    function countdownToNextAPICall(delay) {
        let remainingTime = delay;
        const intervalId = setInterval(() => {
            remainingTime -= 1000;
            if (remainingTime <= 0) {
                clearInterval(intervalId);
                console.log('\rNext API call in progress...');
            } else {
                process.stdout.write(`\rNext API call in: ${calculateRemainingTime(remainingTime)}`);
            }
        }, 1000);
    }

    // Variable to keep track of the number of hits
    let hitCount = 0;

    // Make the initial API call
    makeAPICall();
}).catch(error => {
    console.error('Failed to import node-fetch:', error);
});
