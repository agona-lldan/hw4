/*

Intro:

    Our attempt to Open Source didn't work quite as
    expected. It turned out there were already many
    existing functional JS libraries.

    All the remaining developers left the company as
    well. It seems that they are joining a very
    ambitious startup which re-invented a juicer and
    raised millions of dollars.
    Too bad we cannot compete with this kind of
    financing even though we believe our idea is
    great.

    It's time to shine for the last time and publish
    our new invention: object-constructor as our CTO
    named it. A small library which helps
    manipulating an object.

Exercise:

    Here is a library which helps manipulating objects.
    We tried to write type annotations and we failed.
    Please help!

*/

interface ManipulatedObject {
  [key: string]: any;
}

export class ObjectManipulator {
  protected obj: ManipulatedObject;

  constructor(obj: ManipulatedObject) {
    this.obj = obj;
  }

  public set(key: string, value: any): ObjectManipulator {
    return new ObjectManipulator({ ...this.obj, [key]: value });
  }

  public get(key: string): any {
    return this.obj[key];
  }

  public delete(key: string): ObjectManipulator {
    const newObj: ManipulatedObject = { ...this.obj };
    delete newObj[key];
    return new ObjectManipulator(newObj);
  }

  public getObject(): ManipulatedObject {
    return this.obj;
  }
}
