import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PodcastPlayerPage } from './podcast-player.page';

describe('PodcastPlayerPage', () => {
  let component: PodcastPlayerPage;
  let fixture: ComponentFixture<PodcastPlayerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
