//Passing of id down from the handleClick, id in this case would be employeeId
export default async function performGetConflicts(id) {
  const response = await fetch(
    `https://front-end-kata.brighthr.workers.dev/api/conflict/${id}`
  );

  if (response.ok) {
    const text = await response.text();
    return JSON.parse(text);
  }

  console.error("error response: ", response);
  throw new Error("get conflict call failed");
}
