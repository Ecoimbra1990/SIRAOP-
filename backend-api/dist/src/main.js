"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'https://siraop-frontend.web.app',
            'https://siraop-frontend.firebaseapp.com',
            'https://siraop-public.vercel.app',
            'https://siraop-public-nqhhvj0yq-ecoimbra1990s-projects.vercel.app',
            'https://frontend-pwa.vercel.app',
            'https://*.vercel.app',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 8080;
    await app.listen(port);
    console.log(`🚀 SIRAOP API rodando na porta ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map