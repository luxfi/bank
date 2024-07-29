const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (config) => {
  //const destDir = __dirname.split(path.sep).slice(-2).join(path.sep);
  const destDir = './';

  return {
    ...config,
    target: 'node20',
    devtool: 'source-map',
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /.node$/,
          loader: 'node-loader',
        },
      ],
    },
    externals: [nodeExternals({ modulesDir: './node_modules' })],
    plugins: [
      ...config.plugins,
      new CopyWebpackPlugin({
        patterns: [
          './node_modules/swagger-ui-dist/swagger-ui.css',
          './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
          './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
          './node_modules/swagger-ui-dist/favicon-16x16.png',
          './node_modules/swagger-ui-dist/favicon-32x32.png',
        ].map((e) => ({ from: e, to: destDir })),
      }),
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
    ],
  };
};
