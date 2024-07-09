###############################
# BUILD FOR LOCAL DEVELOPMENT #
###############################

FROM node:20-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY --chown=node:node package*.json ./
COPY --chown=node:node apps/api/package*.json apps/api/
COPY --chown=node:node apps/password-rotate-job/package*.json apps/password-rotate-job/
COPY --chown=node:node apps/migrations/package*.json apps/migrations/
COPY --chown=node:node libs/tools/misc/package*.json libs/tools/misc/
COPY --chown=node:node libs/tools/models/package*.json libs/tools/models/

RUN npm ci
# Use the node user from the image (instead of the root user)

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine As build
ARG SVC_NAME
WORKDIR /usr/src/app

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app .

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Run the build command which creates the production bundle
RUN npm run build:$SVC_NAME

USER node

###################
# PRODUCTION
###################

FROM node:20-alpine As production

WORKDIR /usr/src

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/dist .
COPY --chown=node:node --from=build /usr/src/app/rds-us-east-1-bundle.pem .

# Start the server using the production build
CMD ["node"]
