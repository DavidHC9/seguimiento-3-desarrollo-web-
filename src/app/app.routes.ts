import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { loginGuard } from './guards/login-guard';
import { authGuard } from './guards/auth-guard';
import { Register } from './components/register/register';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        canActivate: [loginGuard]
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: 'register',
        component: Register,
        canActivate: [loginGuard]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'login'

    }
]
