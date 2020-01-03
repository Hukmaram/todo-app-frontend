import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsListManagerComponent } from './friends-list-manager.component';

describe('FriendsListManagerComponent', () => {
  let component: FriendsListManagerComponent;
  let fixture: ComponentFixture<FriendsListManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsListManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsListManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
