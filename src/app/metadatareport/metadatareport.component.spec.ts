import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadatareportComponent } from './metadatareport.component';

describe('MetadatareportComponent', () => {
  let component: MetadatareportComponent;
  let fixture: ComponentFixture<MetadatareportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadatareportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadatareportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
