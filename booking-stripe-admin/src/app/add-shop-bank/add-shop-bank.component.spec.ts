import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShopBankComponent } from './add-shop-bank.component';

describe('AddShopBankComponent', () => {
  let component: AddShopBankComponent;
  let fixture: ComponentFixture<AddShopBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShopBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShopBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
