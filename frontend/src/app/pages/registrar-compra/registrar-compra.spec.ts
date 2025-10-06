import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCompra } from './registrar-compra';

describe('RegistrarCompra', () => {
  let component: RegistrarCompra;
  let fixture: ComponentFixture<RegistrarCompra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarCompra]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarCompra);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
