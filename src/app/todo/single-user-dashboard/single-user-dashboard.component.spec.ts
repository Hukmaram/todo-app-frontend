import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUserDashboardComponent } from './single-user-dashboard.component';

describe('SingleUserDashboardComponent', () => {
  let component: SingleUserDashboardComponent;
  let fixture: ComponentFixture<SingleUserDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleUserDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleUserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
