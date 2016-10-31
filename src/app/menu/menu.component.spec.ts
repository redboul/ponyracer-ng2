import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs/Subject';

import { AppModule } from '../app.module';
import { MenuComponent } from './menu.component';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

describe('Component: Menu', () => {

  const fakeUserService = { userEvents: new Subject<UserModel>() } as UserService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [
      { provide: UserService, useValue: fakeUserService }
    ]
  }));

  it('should have a `navbarCollapsed` field', () => {
    const menu: MenuComponent = new MenuComponent(fakeUserService);
    menu.ngOnInit();
    expect(menu.navbarCollapsed)
      .toBe(true, 'Check that `navbarCollapsed` is initialized with `true`.' +
        'Maybe you forgot to declare `navbarCollapsed` in your component.');
  });

  it('should have a `toggleNavbar` method', () => {
    const menu: MenuComponent = new MenuComponent(fakeUserService);
    expect(menu.toggleNavbar)
      .not.toBeNull('Maybe you forgot to declare a `toggleNavbar()` method');

    menu.toggleNavbar();

    expect(menu.navbarCollapsed)
      .toBe(false, '`toggleNavbar()` should change `navbarCollapsed` from true to false`');

    menu.toggleNavbar();

    expect(menu.navbarCollapsed)
      .toBe(true, '`toggleNavbar()` should change `navbarCollapsed` from false to true`');
  });

  it('should toggle the class on click', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const element = fixture.nativeElement;

    fixture.detectChanges();

    const navbarCollapsed = element.querySelector('#navbar');
    expect(navbarCollapsed).not.toBeNull('No element with the id `#navbar`');
    expect(navbarCollapsed.classList).toContain('collapse', 'The element with the id `#navbar` should have the class `collapse`');

    const button = element.querySelector('button');
    expect(button).not.toBeNull('No `button` element to collapse the menu');
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const navbar = element.querySelector('#navbar');
    expect(navbar.classList).not
      .toContain('collapse', 'The element with the id `#navbar` should have not the class `collapse` after a click');
  });

  it('should use routerLink to navigate', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const element = fixture.nativeElement;

    fixture.detectChanges();

    const links = element.querySelectorAll('a[routerLink]');
    expect(links.length).toBe(3, 'You should have two routerLink: one to the races, one to the home');
  });

  it('should listen to userEvents in ngOnInit', async(() => {
    const component = new MenuComponent(fakeUserService);
    component.ngOnInit();

    const user = { login: 'cedric', money: 200 } as UserModel;

    fakeUserService.userEvents.subscribe(() => {
      expect(component.user).toBe(user, 'Your component should listen to the `userEvents` observable');
    });

    fakeUserService.userEvents.next(user);
  }));

  it('should display the user if logged', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.user = { login: 'cedric', money: 200 } as UserModel;

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const info = element.querySelector('a.nav-item.nav-link.float-md-right');
    expect(info)
      .not.toBeNull('You should have an `a` element with the classes `nav-item nav-link float-md-right` to display the user info');
    expect(info.textContent).toContain('cedric', 'You should display the user\'s name in a `a` element');
    expect(info.textContent).toContain('200', 'You should display the user\'s score in a `a` element');
  });

  it('should unsubscribe on destroy', () => {
    const component = new MenuComponent(fakeUserService);
    component.ngOnInit();
    spyOn(component.userEventsSubscription, 'unsubscribe');
    component.ngOnDestroy();

    expect(component.userEventsSubscription.unsubscribe).toHaveBeenCalled();
  });
});
