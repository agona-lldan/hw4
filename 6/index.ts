/*
Fix typing for the filterPersons so that it can filter users and return User[] when personType='user' and return Admin[] when personType='admin'. Also filterPersons should accept partial User/Admin type according to the personType. `criteria` argument should behave according to the `personType` argument value. `type` field is not allowed in the `criteria` field.

Bonus:
Implement a function `getObjectKeys()` which returns more convenient result for any argument given, so that you don't need to cast it.
let criteriaKeys = Object.keys(criteria) as (keyof User)[];
-->
let criteriaKeys = getObjectKeys(criteria);

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

export type Person = User | Admin;

export const persons: Person[] = [
  {
    type: "user",
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  { type: "admin", name: "Jane Doe", age: 32, role: "Administrator" },
  { type: "user", name: "Kate Müller", age: 23, occupation: "Astronaut" },
  { type: "admin", name: "Bruce Willis", age: 64, role: "World saver" },
  { type: "user", name: "Wilson", age: 23, occupation: "Ball" },
  { type: "admin", name: "Agent Smith", age: 23, role: "Anti-virus engineer" },
];
export const isAdmin = (person: Person): person is Admin =>
  person.type === "admin";
export const isUser = (person: Person): person is User =>
  person.type === "user";
export function logPerson(person: Person) {
  console.log(
    ` - ${person.name}, ${person.age}, ${
      person.type === "admin" ? person.role : person.occupation
    }`,
  );
}

// = = =
type UserCriteria = Partial<Omit<User, "type">>;
type AdminCriteria = Partial<Omit<Admin, "type">>;

export function filterPersons(
  persons: Person[],
  personType: "admin",
  criteria: AdminCriteria,
): Admin[];
export function filterPersons(
  persons: Person[],
  personType: "user",
  criteria: UserCriteria,
): User[];
export function filterPersons(
  persons: Person[],
  personType: "user" | "admin",
  criteria: UserCriteria | AdminCriteria,
): Admin[] | User[] {
  if (personType === "user") {
    return persons.filter(isUser).filter((user) => {
      const criteriaKeys = getObjectKeys<User>(criteria);
      return criteriaKeys.every((fieldName) => {
        return user[fieldName] === criteria[fieldName];
      });
    });
  } else {
    return persons.filter(isAdmin).filter((user) => {
      const criteriaKeys = getObjectKeys<Admin>(criteria);
      return criteriaKeys.every((fieldName) => {
        return user[fieldName] === criteria[fieldName];
      });
    });
  }
}

function getObjectKeys<T>(obj: UserCriteria | AdminCriteria): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}
// = = =

export const usersOfAge23 = filterPersons(persons, "user", { age: 23 });
export const adminsOfAge23 = filterPersons(persons, "admin", { age: 23 });

console.log("Users of age 23:");
usersOfAge23.forEach(logPerson);

console.log();

console.log("Admins of age 23:");
adminsOfAge23.forEach(logPerson);

