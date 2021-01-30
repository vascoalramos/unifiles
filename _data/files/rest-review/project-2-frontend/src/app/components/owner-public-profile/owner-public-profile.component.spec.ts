import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OwnerPublicProfileComponent} from './owner-public-profile.component';

describe('OwnerPublicProfileComponent', () => {
  let component: OwnerPublicProfileComponent;
  let fixture: ComponentFixture<OwnerPublicProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerPublicProfileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerPublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
