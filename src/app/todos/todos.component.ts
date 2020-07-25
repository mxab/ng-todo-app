import { Component, OnInit } from '@angular/core';
import { TodosService } from '../todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  todos$ = this.todosService.findAll();

  constructor(private readonly todosService: TodosService) {}

  ngOnInit(): void {}
}
