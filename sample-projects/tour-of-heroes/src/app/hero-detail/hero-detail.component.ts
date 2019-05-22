import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id).subscribe(hero => (this.hero = hero));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.sample2() ? this.goBack() : this.getHero();
    this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
  }

  sample(): boolean {
    if (true) {
      return false;
    }
  }

  sample2(): boolean {
    if (!true) {
      // DO SOMETIN
    } else {
      // DO NOT DO THAT SOMETIN
    }

    if (false) {
      // DO ABSOLUTELY NOTHING
    } else {
      return false;
    }
  }
}
