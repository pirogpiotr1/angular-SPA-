import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryResultsComponent } from './history-results.component';

describe('HistoryResultsComponent', () => {
  let component: HistoryResultsComponent;
  let fixture: ComponentFixture<HistoryResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
