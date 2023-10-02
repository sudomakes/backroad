# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build backroad-example`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t backroad-example`.
FROM docker.io/node:lts-alpine

# ENV HOST=0.0.0.0
# ENV PORT=3000

WORKDIR /app

RUN addgroup --system backroad-example && \
          adduser --system -G backroad-example backroad-example

COPY dist/apps/backroad-example backroad-example
RUN chown -R backroad-example:backroad-example .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix backroad-example --omit=dev -f ci
EXPOSE 3333
CMD [ "node", "backroad-example" ]