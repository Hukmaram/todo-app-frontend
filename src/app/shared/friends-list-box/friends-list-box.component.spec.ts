import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsListBoxComponent } from './friends-list-box.component';

describe('FriendsListBoxComponent', () => {
  let component: FriendsListBoxComponent;
  let fixture: ComponentFixture<FriendsListBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsListBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
