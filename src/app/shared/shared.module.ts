import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppImgPipe } from './pipes';
import { AppSlimScrollDirective } from './directives';

/**
 * DIRECTIVES
 */
const SHARED_DIRECTIVES = [
  AppSlimScrollDirective
];

/**
 * PIPES
 */
const SHARED_PIPES = [
  AppImgPipe
];

/**
 * SERVICES
 */
const SHARED_SERVICES = [];

/**
 * COMPONENTS
 */
const SHARED_COMPONENTS = [
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...SHARED_DIRECTIVES,
    ...SHARED_PIPES,
    ...SHARED_COMPONENTS
  ],
  exports: [
    ...SHARED_DIRECTIVES,
    ...SHARED_PIPES,
    ...SHARED_COMPONENTS
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: SharedModule,
      providers: [
        ...SHARED_SERVICES
      ]
    };
  }
}
