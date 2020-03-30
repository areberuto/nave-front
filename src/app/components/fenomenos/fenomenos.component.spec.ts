import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FenomenosComponent } from './fenomenos.component';

describe('FenomenosComponent', () => {
  let component: FenomenosComponent;
  let fixture: ComponentFixture<FenomenosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FenomenosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FenomenosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
