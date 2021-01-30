import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BaseRegisterComponent} from './base-register.component';

describe('BaseRegisterComponent', () => {
  let component: BaseRegisterComponent;
  let fixture: ComponentFixture<BaseRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseRegisterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
