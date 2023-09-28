declare module 'fastify-multipart' {
  import * as fastify from 'fastify';

  interface FastifyRequest {
    isMultipart: () => boolean;
  }

  interface FastifyMultipartOptions {
    limits?: {
      fieldNameSize?: number;
      fieldSize?: number;
      fields?: number;
      fileSize?: number;
      files?: number;
      headerPairs?: number;
    };
  }

  interface FastifyMultipartFile {
    fieldname: string;
    file: ReadableStream;
    filename: string;
    encoding: string;
    mimetype: string;
    transferEncoding: string;
  }

  interface FastifyRequest {
    isMultipart: () => boolean;
    parts: () => Promise<{ [fieldname: string]: FastifyMultipartFile[] }>;
  }

  interface FastifyReply {
    multipart: (
      handler: (field: string, file: FastifyMultipartFile, req: FastifyRequest, reply: FastifyReply) => void,
      options?: FastifyMultipartOptions
    ) => void;
  }

  function fastifyMultipart(
    fastify: fastify.FastifyInstance,
    opts: FastifyMultipartOptions
  ): void;

  export = fastifyMultipart;
}
