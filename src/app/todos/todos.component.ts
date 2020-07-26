import { Component, OnInit } from '@angular/core';
import { Status, TodoFilter, TodosService } from '../todos.service';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { Todo } from '../todos';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  private load$ = new BehaviorSubject<void>(undefined);

  filterFormGroup = this.fb.group({
    status: this.fb.control(Status.all),
  });

  todosState$ = combineLatest([
    this.route.paramMap.pipe(
      map((paramMap) => {
        const filter: TodoFilter = {
          status: Status.all,
        };
        const status = paramMap.get('status') as Status;
        if (status) {
          filter.status = status;
        }
        return filter;
      }),
      tap((filter) => {
        this.filterFormGroup.reset(filter);
      })
    ),
    this.load$,
  ]).pipe(
    switchMap(([filter]: [TodoFilter, void]) => {
      return this.loadTodos(filter);
    })
  );

  newTodoFormGroup = this.fb.group({
    title: this.fb.control('', Validators.required),
  });

  constructor(
    private readonly todosService: TodosService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
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

  private loadTodos(
    filter: TodoFilter
  ): Observable<{
    todos: Todo[];
    error?: string;
    loading: boolean;
  }> {
    return this.todosService.findAll(filter).pipe(
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
  }

  applyFilterToRoute(): void {
    const filter = this.filterFormGroup.value as TodoFilter;
    const params: { status?: string } = {};
    if (filter.status) {
      params.status = filter.status;
    }
    this.router.navigate([params]);
  }
}
