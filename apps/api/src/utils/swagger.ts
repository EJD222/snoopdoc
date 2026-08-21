import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export type TSwaggerConfig = {
    app: NestFastifyApplication;
    path: string;
    title?: string;
    description?: string;
    version?: string;
    tags?: Parameters<DocumentBuilder["addTag"]>[];
};

export const createSwagger = ({
    app,
    path,
    title,
    description,
    version,
    tags
}: TSwaggerConfig) => {
    const config = new DocumentBuilder();

    if (title) config.setTitle(title);
    if (description) config.setTitle(description);
    if (version) config.setTitle(version);

    if(tags) {
        for (const tag of tags) {
            config.addTag(...tag)
        }
    };

    const documentFactory = () => {
        return SwaggerModule.createDocument(app, config.build());
    };

    SwaggerModule.setup(path, app, documentFactory);
}