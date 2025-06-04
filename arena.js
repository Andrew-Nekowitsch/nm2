const url = 'https://www.ninjamanager.com/ajax/challengeTeam';

const teams = [
    1763,
    2213,
    14322,
    17895,
    2522,
    17905,
    17908,
    17910,
    17903,
    17919,
    17932,
];

const myFetch = (teamId, token) => {
    return fetch(url, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Brave\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "x-csrf-token": token,
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://www.ninjamanager.com/arena",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `TeamID=${teamId}&SkipBattle=true`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}

async function fetchUrlsParallel(teams) {
    const results = await Promise.allSettled(teams.map(async teamId => {
        try {
            const response = await myFetch(teamId, '582e2b1627417587d7fcd2563cdf5409b4e86f63f006e95d69fb429e149c7415');
            if (!response.ok) throw new Error(`Status ${response.status}`);
            const json = JSON.stringify(response.value.data, null, 2)
            if (json.error.toString().includes('You have reached your max amount of challenges against this team! Try again later.')) {
                console.log(`Skipping team ${teamId} due to max challenges reached.`);
                return { teamId, data: null };
            }
            if (json.error.toString().includes('Not enough energy!')) {
                console.log(`Skipping team ${teamId} due to the lack of energy.`);
                return { teamId, data: null };
            }
            const data = await response.json();
            return { teamId, data };
        } catch (err) {
            return { teamId, error: err.message };
        }
    }));

    for (const result of results) {
        if (result.status === 'fulfilled') {
            console.log(`Fetched from ${result.value.teamId}:`, result.value.data);
            const fs = require('fs');
            fs.writeFileSync('response.json', JSON.stringify(result.value.data, null, 2));
        } else {
            console.error(`Failed to fetch:`, result.reason);
        }
    }
}

fetchUrlsParallel(teams);