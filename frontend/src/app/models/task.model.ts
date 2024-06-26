export class Task {
  _id: string;
  title: string;
  _listId: string;
  completed: boolean;

  constructor(_id: string, title: string, _listId: string, completed: boolean) {
    this._id = _id;
    this.title = title;
    this._listId = _listId;
    this.completed = completed;
  }
}
