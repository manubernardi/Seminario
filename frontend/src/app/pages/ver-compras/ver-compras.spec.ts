import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCompras } from './ver-compras';

describe('VerCompras', () => {
  let component: VerCompras;
  let fixture: ComponentFixture<VerCompras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerCompras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCompras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
