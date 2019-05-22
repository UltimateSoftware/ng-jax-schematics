import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { <%= classify(name) %>Component } from './<=% name %>.component';

describe('<%= classify(name) %>Component Class', () => {
  let component: <%= classify(name) %>Component;

  // Stubs

  // Mocks

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        <%= classify(name) %>Component,
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    }).compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.get(<%= classify(name) %>Component);
  });
});