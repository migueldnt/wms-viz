import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDataInfoComponent } from './dialog-data-info.component';

describe('DialogDataInfoComponent', () => {
  let component: DialogDataInfoComponent;
  let fixture: ComponentFixture<DialogDataInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDataInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDataInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
