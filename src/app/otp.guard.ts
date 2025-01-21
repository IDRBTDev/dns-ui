import { Injectable, inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

export const otpGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router); 
  const previousUrl =localStorage.getItem('previousUrl');  // Access stored previousUrl// Access stored previousUrl
console.log(previousUrl)
  const allowedPreviousUrls = ['/rgtr-login','/login']; 
  if (previousUrl && allowedPreviousUrls.includes(previousUrl)) {
    return true; 
  } else {
    router.navigate([route.data['fallbackRoute']]); 
    // localStorage.clear();
    return false;
  }
};