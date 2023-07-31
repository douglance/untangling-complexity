function moduleFour() {
  // Simulates a function that may throw an error
  const randomNumber = Math.random();

  if (randomNumber < 0.5) {
    throw new Error("Something went wrong in moduleFour!");
  }

  return randomNumber;
}

function moduleThree() {
  try {
    const result = moduleFour();
    return result;
  } catch (error) {
    throw new Error(`An error occurred in moduleThree:\n${error.message}`);
  }
}

function moduleTwo() {
  try {
    const result = moduleThree();
    return result;
  } catch (error) {
    throw new Error(`An error occurred in moduleTwo:\n${error.message}`);
  }
}

function moduleOne() {
  try {
    const a = moduleTwo();
    const b = moduleTwo();
    const c = moduleTwo();
    const d = moduleTwo();
    console.log(`Operation successful, result is ${a + b + c + d}`);
  } catch (error) {
    throw new Error(`An error occurred in moduleOne:\n${error.message}`);
  }
}

moduleOne();
