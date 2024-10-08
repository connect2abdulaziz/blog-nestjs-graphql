import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { AppConfigService } from './config/app/config.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GraphqlHttpExceptionFilter } from './filters/http-exception.filter';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { Reflector } from '@nestjs/core';
import { Routes } from './constants/routes.constants';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix(Routes.GLOBAL_ROUTE); // api/v1
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      
    }),
  )

  app.useGlobalFilters(new GraphqlHttpExceptionFilter());

  //app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'),{
    prefix: '/uploads',
  });


  // Get app config for cors settings and starting the app.
  const appConfig: AppConfigService = app.get(AppConfigService);

  const whitelist = [appConfig.url, 'https://blog-frontend-three-nu.vercel.app'];
  app.enableCors({
    origin: whitelist,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    exposedHeaders: ['Authorization', 'X-Custom-Header'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200, 
    preflightContinue: false,
  })

  await app.listen(appConfig.port);  // <---- Notice this
  console.log(`Server running on ${appConfig.url}`);
  console.log(`Test data in the GraphQL play ground on ${appConfig.url}/graphql`);
  
  
  if(module.hot){
    module.hot.accept();
    module.hot.dispose(() => {
      app.close();
    });
  }
}
bootstrap();