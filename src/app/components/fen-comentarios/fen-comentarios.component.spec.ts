import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FenComentariosComponent } from './fen-comentarios.component';

describe('FenComentariosComponent', () => {
  let component: FenComentariosComponent;
  let fixture: ComponentFixture<FenComentariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FenComentariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FenComentariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
