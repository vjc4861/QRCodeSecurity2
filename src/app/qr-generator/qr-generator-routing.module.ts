import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrGeneratorPage } from './qr-generator.page';

// const routes: Routes = [
//   {
//     path: '',
//     component: QrGeneratorPage,
//     children: [
//       {
//         path: ':qrcodeId',
//         loadChildren: () => import('./qrcode-detail/qrcode-detail.module').then( m => m.QrcodeDetailPageModule)
//       }
//     ]
//   }
// ]



const routes: Routes = [
  {
    path: '',
    component: QrGeneratorPage
  },
  {
    // path: 'qrcode-detail',
    path: ':qrcodeId',
    loadChildren: () => import('./qrcode-detail/qrcode-detail.module').then( m => m.QrcodeDetailPageModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrGeneratorPageRoutingModule {}
