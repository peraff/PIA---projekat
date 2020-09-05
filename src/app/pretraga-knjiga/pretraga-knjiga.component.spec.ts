import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PretragaKnjigaComponent } from './pretraga-knjiga.component';

describe('PretragaKnjigaComponent', () => {
  let component: PretragaKnjigaComponent;
  let fixture: ComponentFixture<PretragaKnjigaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PretragaKnjigaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PretragaKnjigaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
