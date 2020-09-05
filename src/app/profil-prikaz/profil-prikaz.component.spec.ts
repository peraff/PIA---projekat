import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilPrikazComponent } from './profil-prikaz.component';

describe('ProfilPrikazComponent', () => {
  let component: ProfilPrikazComponent;
  let fixture: ComponentFixture<ProfilPrikazComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilPrikazComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilPrikazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
