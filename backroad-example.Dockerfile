# Build the Docker image with `docker build -f backroad-example.Dockerfile .`.
# The app bundle is produced by `pnpm run build-example-app`.
#
# Run the container with `docker run -p 3000:3000 -t backroad-example`.
FROM node:20 as builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build-example-app

FROM node:20 as runner
COPY --from=builder /app/dist/apps/backroad-example /app
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# RUN addgroup --system backroad-example && \
#     adduser --system --group backroad-example backroad-example

# RUN chown -R backroad-example:backroad-example .

# The runtime image installs the minimal production dependencies declared by
# the generated dist package manifest.
RUN pnpm install --prod --frozen-lockfile
EXPOSE 3333
CMD [ "node", "." ]
