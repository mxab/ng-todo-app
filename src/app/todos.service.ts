import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todos';
import { HttpClient, HttpParams } from '@angular/common/http';

export enum Status {
  all = '',
  done = 'done',
  open = 'open',
}

export interface TodoFilter {
  status: Status;
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private readonly TODOS_ENDPOINT = 'http://localhost:3000/todos';

  constructor(private readonly http: HttpClient) {}

  findAll(filter: TodoFilter): Observable<Todo[]> {
    let params = new HttpParams();

    if (filter.status === Status.done) {
      params = params.set('done', 'true');
    } else if (filter.status === Status.open) {
      params = params.set('done', 'false');
    }
    return this.http.get<Todo[]>(this.TODOS_ENDPOINT, { params });
  }

  done(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.TODOS_ENDPOINT}/${id}`, {
      done: true,
    });
  }

  remove(id: number): Observable<Todo> {
    return this.http.delete<Todo>(`${this.TODOS_ENDPOINT}/${id}`);
  }

  create(data: { title: string }): Observable<Todo> {
    return this.http.post<Todo>(this.TODOS_ENDPOINT, {
      title: data.title,
      done: false,
    });
  }
}
