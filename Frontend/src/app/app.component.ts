import {Component, OnInit} from '@angular/core';
import {TodoItem} from "../../../Backend/TodoList.Api/src/models/todoItems";
import {TodoService} from "../service/todoService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private todoService: TodoService) {
  }

  public title = 'TodoList';
  public itemList: TodoItem[] = [];

  todoItem = <TodoItem>{};
  errorMessage = '';

  ngOnInit() {
    this.getAllItems();
  }

  deleteItem(id: string) {
    this.todoService.deleteItem(id)
      .subscribe({
        complete: () => {
          this.getAllItems();
          this.clearErrorMessage();
        }
      });
  }

  postItem() {
    this.todoService.postItem(this.todoItem)
      .subscribe({
        complete: () => {
          this.getAllItems();
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage = error.error
          }
        }
      });

    this.clearForm();
  }

  checkBoxCompleted(e: Event, item: TodoItem) {
    item.isCompleted = (e.target as HTMLInputElement).checked;
    this.todoService.updateItem(item)
      .subscribe({
        complete: () => {
          this.getAllItems();
          this.clearErrorMessage();
        }
      });
  }

  getAllItems() {
    this.todoService.getItemsList().subscribe(item => {
      this.itemList = item;
      this.itemList.sort((a, b) => a.description.localeCompare(b.description));
    })
  }

  clearInput() {
    this.todoItem.description = '';
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }

  clearForm() {
    this.clearInput();
    this.clearErrorMessage();
  }
}
