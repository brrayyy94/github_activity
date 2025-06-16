async function getUserEvents(username) {
  try {
    console.log(`Fetching events for user: ${username}`);
    if (typeof username !== 'string') {
      throw new TypeError('Username must be a string');
    }
    // Fetch user events from GitHub API
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    if (!response.ok) {
      throw new Error(`Error fetching events for user ${username}: ${response.statusText}`);
    }
    const events = await response.json();
    return displayEvents(events);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function displayEvents(events){
    if (!Array.isArray(events) || events.length === 0) {
        console.log('No events found for this user.');
        return;
    }
    events.forEach(event => {
        const repo = event.repo.name;

        switch(event.type){
            case 'PushEvent':
                const commits = event.payload.commits.length;
                console.log(`-Pushed ${commits} commit(s) to ${repo}`);
                break;
            case 'IssuesEvent':
                const action = event.payload.action;
                console.log(`-${action[0].toUpperCase() + action.slice(1)} an issue in ${repo}`);
                break;
            default:
                console.log(`-Event type: ${event.type} in repository ${repo}`);
                break;
        }
    });
}

const username = process.argv[2];
console.log(`Username provided: ${username}`);
if (!username) {
  console.error('Please provide a GitHub username as a command line argument.');
  process.exit(1);
}

await getUserEvents(username);
