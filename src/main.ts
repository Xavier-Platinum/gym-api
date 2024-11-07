import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/utils/utils.filter';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';
// import serverlessExpress from '@vendia/serverless-express';
// import { Handler, Context, Callback } from 'aws-lambda';

// let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS and allow all origins
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Setting global prefix
  app.setGlobalPrefix('/api/v1', {});

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Because of serveerless
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port || 3001, '0.0.0.0');

  // await app.init();
  // const expressApp = app.getHttpAdapter().getInstance();
  // server = serverlessExpress({ app: expressApp });
}

bootstrap();

// export const handler: Handler = async (
//   event: any,
//   context: Context,
//   callback: Callback<any>,
// ) => {
//   if (!server) {
//     await bootstrap();
//   }
//   // return {
//   //   statusCode: 200,
//   //   body: JSON.stringify({ message: 'Hello from Vercel!' }),
//   // };
//   return server(event, context, callback);
// };
