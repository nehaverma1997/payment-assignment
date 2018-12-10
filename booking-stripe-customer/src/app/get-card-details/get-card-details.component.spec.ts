import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCardDetailsComponent } from './get-card-details.component';

describe('GetCardDetailsComponent', () => {
  let component: GetCardDetailsComponent;
  let fixture: ComponentFixture<GetCardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetCardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
