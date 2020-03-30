import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFenomenosComponent } from './form-fenomenos.component';

describe('FormFenomenosComponent', () => {
  let component: FormFenomenosComponent;
  let fixture: ComponentFixture<FormFenomenosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFenomenosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFenomenosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
