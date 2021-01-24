import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PasswordSetComponent } from './password-set.component';

describe('PasswordSetComponent', () => {
  let component: PasswordSetComponent;
  let fixture: ComponentFixture<PasswordSetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
