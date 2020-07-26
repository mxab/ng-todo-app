import { Component, OnInit } from '@angular/core';
import { TodosService } from '../todos.service';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Todo } from '../todos';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  private load$ = new BehaviorSubject<void>(undefined);

  todos$: Observable<{
    todos: Todo[];
    error?: string;
    loading: boolean;
  }> = this.todosService.findAll().pipe(
    map((result) => {
      return {
        todos: result,
        error: null,
        loading: false,
      };
    }),
    catchError((e: Error) => {
      return of({
        todos: [],
        error: e.message,
        loading: false,
      });
    }),
    startWith({
      todos: [],
      error: null,
      loading: true,
    })
  );

  todosState$ = this.load$.pipe(
    switchMap(() => {
      return this.todos$;
    })
  );

  newTodoFormGroup = this.fb.group({
    title: this.fb.control('', Validators.required),
  });

  constructor(
    private readonly todosService: TodosService,
    private readonly fb: FormBuilder
  ) {}

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

  create(): void {
    if (this.newTodoFormGroup.invalid) {
      return;
    }
    const newTodo = this.newTodoFormGroup.value;
    this.todosService
      .create(newTodo)
      .toPromise()
      .then(() => {
        this.newTodoFormGroup.reset();
        this.load$.next();
      });
  }
}
