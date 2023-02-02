import {HttpClient} from "@angular/common/http";
import {TodoItem} from "../../../Backend/TodoList.Api/src/models/todoItems";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private API_BASE: string = "/api/todoItems";

  constructor(private http: HttpClient) {
  }

  getItemsList() {
    return this.http.get<TodoItem[]>(this.API_BASE)
  }

  postItem(item: TodoItem) {
    return this.http.post<TodoItem>(this.API_BASE, item);
  }

  deleteItem(id: string) {
    return this.http.delete<TodoItem>(this.API_BASE + "/" + id);
  }

  updateItem(item: TodoItem) {
    return this.http.put<TodoItem>(this.API_BASE + "/" + item.id, item);
  }
}
