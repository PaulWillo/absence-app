

export default async function performGetAbsence() {
    const response = await fetch('https://front-end-kata.brighthr.workers.dev/api/absences');

    if(response.ok) {
        const text = await response.text();
        return JSON.parse(text);
    }

    console.error('error response: ', response);
    throw new Error('get absence call failed');
}