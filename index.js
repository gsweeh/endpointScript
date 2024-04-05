// Use dynamic import to import node-fetch
import('node-fetch').then(nodeFetch => {
    const fetch = nodeFetch.default;

    // Function to make the API call
    async function makeAPICall() {
        try {
            // Make request to the endpoint
            let response = await fetch('https://email.gubhai.eu.org/alert');

            // Check if response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Read response body as text
            let responseBody = await response.text();
            console.log('API call success. Response:', responseBody);

            // 2nd
            response = await fetch('https://email.gubhai.eu.org/alert');

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

    // Variable to keep track of the number of hits
    let hitCount = 0;

    // Make the initial API call
    makeAPICall();
}).catch(error => {
    console.error('Failed to import node-fetch:', error);
});
