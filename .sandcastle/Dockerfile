# syntax=docker/dockerfile:1.7
FROM node:24-bookworm

# Install system dependencies
RUN apt-get update && apt-get install -y \
  git \
  curl \
  jq \
  && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && apt-get update && apt-get install -y gh \
  && rm -rf /var/lib/apt/lists/*

# Build-args for UID/GID alignment: sandcastle docker build-image
# defaults these to the host user's UID/GID so image-built files
# and bind-mounted files share an owner without runtime chown.
ARG AGENT_UID=1000
ARG AGENT_GID=1000

# Rename the base image's "node" user to "agent" and align UID/GID.
RUN groupmod -o -g $AGENT_GID node && usermod -o -u $AGENT_UID -g $AGENT_GID -d /home/agent -m -l agent node
USER ${AGENT_UID}:${AGENT_GID}

# Install Claude Code CLI
RUN curl -fsSL https://claude.ai/install.sh | bash

# Add the agent's local bin to PATH (Claude CLI + corepack shims land here).
ENV PATH="/home/agent/.local/bin:$PATH"

# Enable corepack and activate pnpm AS THE AGENT USER (after the USER switch),
# so the shims and the prepared pnpm cache live in the agent's own home and are
# actually usable at runtime. Doing this as root left the prepared package in
# root's corepack cache, forcing the agent to re-bootstrap pnpm on every run.
ENV COREPACK_HOME="/home/agent/.cache/corepack"
RUN corepack enable --install-directory /home/agent/.local/bin \
  && corepack prepare pnpm@11.5.2 --activate

# Pin the pnpm store to a fixed path in the agent's home via the user .npmrc.
# Without this, pnpm chooses the store per-filesystem: at runtime the git
# worktree is bind-mounted from the host (a different device than the image's
# overlay home), so pnpm would default to a fresh, EMPTY store next to the
# worktree (e.g. /home/agent/workspace/.pnpm-store) and re-download every
# package — defeating the pre-warm below. Pinning store-dir makes both this
# build and the agent's runtime install resolve to the same baked store. The
# store lives on a different device than the bind-mounted worktree, so pnpm
# copies from it instead of hardlinking — still fully offline, no re-download.
RUN echo "store-dir=/home/agent/.local/share/pnpm/store" >> /home/agent/.npmrc

# --- Pre-warm the pnpm store with this project's deps -----------------------
# We deliberately do NOT copy host node_modules into the worktree (host is macOS,
# sandbox is Linux — darwin-arm64 native bindings don't load in-container). Deps
# must be downloaded INSIDE the image so the native bindings match. We run a full
# workspace `pnpm install` here purely to populate pnpm's content-addressable
# store (~/.local/share/pnpm/store), which is baked into this image layer. The
# agent's in-workspace `pnpm install` on a fresh worktree then reuses every
# tarball from that warm store — no re-download of ~1.7 GB of deps per run (the
# slow part) — and only does the cheap link/native-build step over the network.
#
# Why a full install and not `pnpm fetch`: in this multi-package workspace,
# `pnpm fetch` (lockfile-only, no manifests) silently skips dependencies it can't
# attribute to a project manifest (e.g. root devDeps like @faker-js/faker), so
# the store comes out incomplete. A real install with all 9 package.json present
# warms the complete closure. Verified: a subsequent --network none install
# resolves entirely from the store with no missing-tarball errors.
#
# We COPY the repo source in, install, then delete the source and its
# node_modules in the SAME layer — only the pnpm store (under $HOME) survives, so
# the image gains the warm store (~1 GB) but not a second copy of node_modules.
# --ignore-scripts skips native compilation we would throw away anyway (the agent
# rebuilds natives at runtime, where it has network). (We COPY rather than
# bind-mount because pnpm's link step fails on a build-time rw overlay mount.)
#
# IMPORTANT: this COPY reads the repo root, so the build context must be the repo
# root, not .sandcastle/. Build the image with:
#   sandcastle docker build-image --dockerfile .sandcastle/Dockerfile
# (`--dockerfile` switches the build context to the current working directory;
# the plain `build-image` form uses .sandcastle/ as context and this fails.)
# The repo-root .dockerignore already keeps node_modules/dist out of the context.
COPY --chown=agent:agent . /home/agent/buildsrc
RUN cd /home/agent/buildsrc \
  && pnpm install --frozen-lockfile --ignore-scripts \
  && rm -rf /home/agent/buildsrc

WORKDIR /home/agent

# In worktree sandbox mode, Sandcastle bind-mounts the git worktree at /home/agent/workspace
# and overrides the working directory to /home/agent/workspace at container start.
# Structure your Dockerfile so that /home/agent/workspace can serve as the project root.
ENTRYPOINT ["sleep", "infinity"]
