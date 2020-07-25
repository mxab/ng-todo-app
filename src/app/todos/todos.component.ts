import { Component, OnInit } from '@angular/core';
import { TodosService } from '../todos.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { Todo } from '../todos';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  private load$ = new BehaviorSubject<void>(undefined);

  todos$ = this.todosService.findAll().pipe(
    map((result) => {
      return {
        todos: result,
        error: null,
      };
    }),
    catchError((e: Error) => {
      return of({
        todos: [],
        error: e.message,
      });
    })
  );

  todosState$ = this.load$.pipe(
    switchMap(() => {
      return this.todos$;
    })
  );

  constructor(private readonly todosService: TodosService) {}

  ngOnInit(): void {}

  done(todo: Todo): void {
    this.todosService
      .done(todo.id)
      .toPromise()
      .then(() => {
        this.load$.next();
      });
  }

  remove(todo: Todo): void {
    this.todosService
      .remove(todo.id)
      .toPromise()
      .then(() => {
        this.load$.next();
      });
  }
}
