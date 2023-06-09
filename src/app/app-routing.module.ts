import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { QrCodeFetcherGuard } from './qr-generator/qr-code-fetcher.guard';
import { QrcodeDetailPage } from './qr-generator/qrcode-detail/qrcode-detail.page';



const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'qr-generator',
    loadChildren: () => import('./qr-generator/qr-generator.module').then( m => m.QrGeneratorPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'qr-verification',
    loadChildren: () => import('./qr-verification/qr-verification.module').then( m => m.QrVerificationPageModule)
  },
  {
    path: 'qr-code-list',
    resolve: { qrcodes: QrCodeFetcherGuard },
    loadChildren: () => import('./qr-generator/qr-generator.module').then(m => m.QrGeneratorPageModule)
  },
  {
    path: 'qr-verification-popup',
    loadChildren: () => import('./qr-verification/qr-verification-popup/qr-verification-popup.module').then( m => m.QrVerificationPopupPageModule)
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})


export class AppRoutingModule {}
