/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (config) => {
  return {
    ...config,
    target: 'node20',
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.node$/,
          use: 'ts-loader',
        },
      ],
    },
    externals: [nodeExternals({ modulesDir: '../../node_modules' })],
    plugins: [
      ...config.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const lazyImports = [
            '@nestjs/microservices',
            'cache-manager',
            'class-validator',
            'class-transformer',
            '@nestjs/websockets/socket-module',
            '@nestjs/microservices/microservices-module',
            'fastify-swagger',
            'class-transformer/storage',
            'ts-morph',
            '@apollo/subgraph/dist/directives',
            '@apollo/subgraph/package.json',
            '@apollo/subgraph',
            'sqlite3',
            'pg',
            'pg-query-stream',
            'oracledb',
            'mysql',
            'tedious',
            'better-sqlite3',
            '@mikro-orm/entity-generator',
            '@mikro-orm/better-sqlite',
            '@mikro-orm/sqlite',
            '@mikro-orm/postgresql',
            '@mikro-orm/mariadb',
            '@mikro-orm/mongodb',
            '@mikro-orm/seeder',
            'nock',
            'mock-aws-s3',
          ];
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource, {
              paths: [process.cwd()],
            });
          } catch (err) {
            return true;
          }
          return false;
        },
      }),
      // Outros plugins conforme necessário
    ],
    devtool: 'source-map', // Opcional, útil para debug
  };
};
