/*
Here is a library which helps manipulating objects.
We tried to write type annotations and we failed.
Please help!
*/



export class ObjectManipulator {

  constructor(protected obj) {}

  public set(key, value) {
    return new ObjectManipulator({...this.obj, [key]: value});
  }

  public get(key) {
    return this.obj[key];
  }

  public delete(key) {
    const newObj = {...this.obj};
    delete newObj[key];
    return new ObjectManipulator(newObj);
  }

  public getObject() {
    return this.obj;
  }
}
