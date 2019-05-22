import { async, TestBed } from '@angular/core/testing';

import { <%= classify(name) %>Component } from './<%= name %>.component';

describe('<%= classify(name) %>Component Class', () => {
  let component: <%= classify(name) %>Component;

  // Stubs

  // Mocks

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        <%= classify(name) %>Component,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.get(<%= classify(name) %>Component);
  });
});