import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from '@shared/logger.config';
import * as session from 'express-session';


async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(loggerConfig)
    });

    const origin = process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : ['*'];

    app.enableCors({
        origin,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
        credentials: true, // Allow credentials
    });

    app.use(
        session({
            secret: 'your-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 86400000, // 1 day
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
            }
        }),
    );


    // @ts-ignore
    app.set('query parser', 'extended');
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
