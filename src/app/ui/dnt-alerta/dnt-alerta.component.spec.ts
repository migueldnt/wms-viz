import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DntAlertaComponent } from './dnt-alerta.component';

describe('DntAlertaComponent', () => {
  let component: DntAlertaComponent;
  let fixture: ComponentFixture<DntAlertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DntAlertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DntAlertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
