

export default async function performGetAbsence() {
    const response = await fetch('https://front-end-kata.brighthr.workers.dev/api/absences');

    console.log("calling inside", response);
    if(response.ok) {
        const text = await response.text();
        console.log(text);
        return JSON.parse(text);
    }

    console.error('error response: ', response);
    throw new Error('get absence call failed');
}