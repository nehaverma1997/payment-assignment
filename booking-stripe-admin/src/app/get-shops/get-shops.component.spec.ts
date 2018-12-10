import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetShopsComponent } from './get-shops.component';

describe('GetShopsComponent', () => {
  let component: GetShopsComponent;
  let fixture: ComponentFixture<GetShopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetShopsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetShopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
