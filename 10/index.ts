/*
We don't want to reimplement all the data-requesting functions. Let's decorate the old callback-based functions with the new Promise-compatible result. The final function should return a Promise which would resolve with the final data directly (i.e. users or admins) or would reject with an error (or type Error).
The function should be named promisify.

Bonus:

Create a function promisifyAll which accepts an object with functions and returns a new object where each of the function is promisified.
Rewrite api creation accordingly:
const api = promisifyAll(oldApi);

*/

interface User {
  type: "user";
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  type: "admin";
  name: string;
  age: number;
  role: string;
}

type Person = User | Admin;

const admins: Admin[] = [
  { type: "admin", name: "Jane Doe", age: 32, role: "Administrator" },
  { type: "admin", name: "Bruce Willis", age: 64, role: "World saver" },
];

const users: User[] = [
  {
    type: "user",
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  { type: "user", name: "Kate Müller", age: 23, occupation: "Astronaut" },
];

export type ApiResponse<T> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "error";
      error: string;
    };

// = = =
export function promisify<T>(
  func: (callback: (response: ApiResponse<T>) => void) => void,
): () => Promise<T> {
  return () => {
    return new Promise<T>((resolve, reject) => {
      func((response) => {
        if (response.status === "success") {
          resolve(response.data);
        } else {
          reject(new Error("Request failed"));
        }
      });
    });
  };
}

function promisifyAll(obj: apiType): apiType {
  let answer: apiType = {}
  for (let key in obj) {
    answer[key] = promisify(obj[key])
  }
  return answer
}


interface apiType  {
  [key: string]: (callback: (response: ApiResponse<any>) => void) => void
}

// = = =

const oldApi: apiType = {
  requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
    callback({
      status: "success",
      data: admins,
    });
  },
  requestUsers(callback: (response: ApiResponse<User[]>) => void) {
    callback({
      status: "success",
      data: users,
    });
  },
  requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
    callback({
      status: "success",
      data: Date.now(),
    });
  },
  requestCoffeeMachineQueueLength(
    callback: (response: ApiResponse<number>) => void,
  ) {
    callback({
      status: "error",
      error: "Numeric value has exceeded Number.MAX_SAFE_INTEGER.",
    });
  },
}

export const api = {
  requestAdmins: promisify(oldApi.requestAdmins),
  requestUsers: promisify(oldApi.requestUsers),
  requestCurrentServerTime: promisify(oldApi.requestCurrentServerTime),
  requestCoffeeMachineQueueLength: promisify(
    oldApi.requestCoffeeMachineQueueLength,
  ),
};

function logPerson(person: Person) {
  console.log(
    ` - ${person.name}, ${person.age}, ${
      person.type === "admin" ? person.role : person.occupation
    }`,
  );
}

async function startTheApp() {
  console.log("Admins:");
  (await api.requestAdmins()).forEach(logPerson);
  console.log();

  console.log("Users:");
  (await api.requestUsers()).forEach(logPerson);
  console.log();

  console.log("Server time:");
  console.log(
    `   ${new Date(await api.requestCurrentServerTime()).toLocaleString()}`,
  );
  console.log();

  console.log("Coffee machine queue length:");
  console.log(`   ${await api.requestCoffeeMachineQueueLength()}`);
}

startTheApp().then(
  () => {
    console.log("Success!");
  },
  (e: Error) => {
    console.log(
      `Error: "${e.message}", but it's fine, sometimes errors are inevitable.`,
    );
  },
);

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/generics.html
