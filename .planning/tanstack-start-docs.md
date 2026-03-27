# TanStack Start Documentation Reference

> Fetched from https://tanstack.com/start/latest/docs/framework/react/ on 2026-03-28
> Source: https://github.com/TanStack/router/tree/main/docs/start/framework/react

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Quick Start](#quick-start)
4. [Routing](#routing)
5. [File-Based Routing](#file-based-routing)
6. [Server Functions](#server-functions)
7. [Static Prerendering](#static-prerendering)
8. [Rendering Markdown](#rendering-markdown)

---

# Overview

> [!NOTE]
> TanStack Start is currently in the **Release Candidate** stage! This means it is considered feature-complete and its API is considered stable.
> **This does not mean it is bug-free or without issues, which is why we invite you to try it out and provide feedback!**
> The road to v1 will likely be a quick one, so don't wait too long to try it out!

TanStack Start is a full-stack React framework powered by TanStack Router. It provides a full-document SSR, streaming, server functions, bundling, and more. Thanks to [Vite](https://vite.dev/), it's ready to develop and deploy to any hosting provider or runtime you want!

## Dependencies

TanStack Start is built on two key technologies:

- **[TanStack Router](https://tanstack.com/router)**: A type-safe router for building web applications with advanced features like nested routing, search params, and data loading
- **[Vite](https://vite.dev/)**: A modern build tool that provides fast development with hot module replacement and optimized production builds

## Should I use TanStack Start or just TanStack Router?

90% of any framework usually comes down to the router, and TanStack Start is no different. **TanStack Start relies 100% on TanStack Router for its routing system.** In addition to TanStack Router's amazing features, Start enables even more powerful features:

- **Full-document SSR** - Server-side rendering for better performance and SEO
- **Streaming** - Progressive page loading for improved user experience
- **Server Routes & API Routes** - Build backend endpoints alongside your frontend
- **Server Functions** - Type-safe RPCs between client and server
- **Middleware & Context** - Powerful request/response handling and data injection
- **Full-Stack Bundling** - Optimized builds for both client and server code
- **Universal Deployment** - Deploy to any Vite-compatible hosting provider
- **End-to-End Type Safety** - Full TypeScript support across the entire stack

That said, if you **know with certainty** that you will not need any of the above features, then you may want to consider using TanStack Router alone, which is still a powerful and type-safe SPA routing upgrade over other routers and frameworks.

## Are there limitations?

The only relevant limitation is that TanStack Start does not currently support React Server Components, **but we are actively working on integration and expect to support them in the near future.**

Otherwise, TanStack Start provides the same capability as other full-stack frameworks like Next.js, Remix, etc, with even more features and a more powerful developer experience.

## How is TanStack Start funded?

TanStack is 100% open source, free to use, and always will be. TanStack.com is owned by TanStack LLC, a privately held company, 100% bootstrapped and self-funded. We are not venture-backed and have never sought investors.

---

# Getting Started

## Migrate an existing project from another framework

- [Start a new project from scratch](#start-a-new-project-from-scratch) to quickly learn how Start works (see below)
- Refer to a migration guide for your specific framework:
  - [Next.js](./migrate-from-next-js)
  - Remix 2 / React Router 7 "Framework Mode" (coming soon!)

## Start a new project from scratch

Choose one of the following options to start building a new TanStack Start project:

- **TanStack Start CLI** - Just run `npx @tanstack/cli@latest create`. Local, fast, and optionally customizable
- **TanStack Builder** - A visual interface to configure new TanStack projects with a few clicks
- **Quick Start Examples** - Download or clone one of our official examples
- **Build a project from scratch** - A guide to building a TanStack Start project line-by-line, file-by-file.

---

# Quick Start

## Impatient?

The fastest way to get a Start project up and running is with the CLI. Just run

```
npx @tanstack/cli@latest create
```

depending on your package manager of choice. You'll be prompted to add things like Tailwind, eslint, and a ton of other options.

You can also clone and run the [Basic](https://github.com/TanStack/router/tree/main/examples/react/start-basic) example right away with the following commands:

```bash
npx gitpick TanStack/router/tree/main/examples/react/start-basic start-basic
cd start-basic
npm install
npm run dev
```

If you'd like to use a different example, you can replace `start-basic` above with the slug of the example you'd like to use from the list below.

## Examples

TanStack Start has a load of examples to get you started. Pick one of the examples below to get started!

- [Basic](https://github.com/TanStack/router/tree/main/examples/react/start-basic) (start-basic)
- [Basic + Auth](https://github.com/TanStack/router/tree/main/examples/react/start-basic-auth) (start-basic-auth)
- [Counter](https://github.com/TanStack/router/tree/main/examples/react/start-counter) (start-counter)
- [Basic + React Query](https://github.com/TanStack/router/tree/main/examples/react/start-basic-react-query) (start-basic-react-query)
- [Clerk Auth](https://github.com/TanStack/router/tree/main/examples/react/start-clerk-basic) (start-clerk-basic)
- [Convex + Trellaux](https://github.com/TanStack/router/tree/main/examples/react/start-convex-trellaux) (start-convex-trellaux)
- [Supabase](https://github.com/TanStack/router/tree/main/examples/react/start-supabase-basic) (start-supabase-basic)
- [Trellaux](https://github.com/TanStack/router/tree/main/examples/react/start-trellaux) (start-trellaux)
- [WorkOS](https://github.com/TanStack/router/tree/main/examples/react/start-workos) (start-workos)
- [Material UI](https://github.com/TanStack/router/tree/main/examples/react/start-material-ui) (start-material-ui)

### Stackblitz

Each example above has an embedded stackblitz preview to find the one that feels like a good starting point

### Quick Deploy

To quickly deploy an example, click the **Deploy to Netlify** button on an example's page to both clone and deploy the example to Netlify.

### Manual Deploy

To manually clone and deploy the example to anywhere else you'd like, use the following commands replacing `EXAMPLE_SLUG` with the slug of the example you'd like to use from above:

```bash
npx gitpick TanStack/router/tree/main/examples/react/EXAMPLE_SLUG my-new-project
cd my-new-project
npm install
npm run dev
```

## Other Router Examples

While not Start-specific examples, these may help you understand more about how TanStack Router works:

- [Quickstart (file-based)](https://github.com/TanStack/router/tree/main/examples/react/quickstart-file-based)
- [Basic (file-based)](https://github.com/TanStack/router/tree/main/examples/react/basic-file-based)
- [Kitchen Sink (file-based)](https://github.com/TanStack/router/tree/main/examples/react/kitchen-sink-file-based)
- [Kitchen Sink + React Query (file-based)](https://github.com/TanStack/router/tree/main/examples/react/kitchen-sink-react-query-file-based)
- [Location Masking](https://github.com/TanStack/router/tree/main/examples/react/location-masking)
- [Authenticated Routes](https://github.com/TanStack/router/tree/main/examples/react/authenticated-routes)
- [Scroll Restoration](https://github.com/TanStack/router/tree/main/examples/react/scroll-restoration)
- [Deferred Data](https://github.com/TanStack/router/tree/main/examples/react/deferred-data)
- [Navigation Blocking](https://github.com/TanStack/router/tree/main/examples/react/navigation-blocking)
- [View Transitions](https://github.com/TanStack/router/tree/main/examples/react/view-transitions)
- [With tRPC](https://github.com/TanStack/router/tree/main/examples/react/with-trpc)
- [With tRPC + React Query](https://github.com/TanStack/router/tree/main/examples/react/with-trpc-react-query)

---

# Routing

TanStack Start is built on top of TanStack Router, so all of the features of TanStack Router are available to you.

> [!NOTE]
> We highly recommend reading the [TanStack Router documentation](https://tanstack.com/router/latest/docs/framework/react/overview) to learn more about the features and capabilities of TanStack Router. What you learn here is more of a high-level overview of TanStack Router and how it works in Start.

## The Router

The `router.tsx` file is the file that will dictate the behavior of TanStack Router used within Start. It's located in the `src` directory of your project.

```
src/
├── router.tsx
```

Here, you can configure everything from the default [preloading functionality](https://tanstack.com/router/latest/docs/framework/react/guide/preloading) to [caching staleness](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading).

```tsx
// src/router.tsx
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

// You must export a getRouter function that
// returns a new router instance each time
export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}
```

## File-Based Routing

Start uses TanStack Router's file-based routing approach to ensure proper code-splitting and advanced type-safety.

You can find your routes in the `src/routes` directory.

```
src/
├── routes <-- This is where you put your routes
│   ├── __root.tsx
│   ├── index.tsx
│   ├── about.tsx
│   ├── posts.tsx
│   ├── posts/$postId.tsx
```

## The Root Route

The root route is the top-most route in the entire tree and encapsulates all other routes as children. It's found in the `src/routes/__root.tsx` file and must be named `__root.tsx`.

```
src/
├── routes
│   ├── __root.tsx <-- The root route
```

- It has no path and is **always** matched
- Its `component` is **always** rendered
- This is where you render your document shell, e.g. `<html>`, `<body>`, etc.
- Because it is **always rendered**, it is the perfect place to construct your application shell and take care of any global logic

```tsx
// src/routes/__root.tsx
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

Notice the `Scripts` component at the bottom of the `<body>` tag. This is used to load all of the client-side JavaScript for the application and should always be included for proper functionality.

## The HeadContent Component

The `HeadContent` component is used to render the head, title, meta, link, and head-related script tags of the document.

It should be **rendered in the `<head>` tag of your root route's layout.**

## The Outlet Component

The `Outlet` component is used to render the next potentially matching child route. `<Outlet />` doesn't take any props and can be rendered anywhere within a route's component tree. If there is no matching child route, `<Outlet />` will render `null`.

## The Scripts Component

The `Scripts` component is used to render the body scripts of the document.

It should be **rendered in the `<body>` tag of your root route's layout.**

## Route Tree Generation

You may notice a `routeTree.gen.ts` file in your project.

```
src/
├── routeTree.gen.ts <-- The generated route tree file
```

This file is automatically generated when you run TanStack Start (via `npm run dev` or `npm run start`). This file contains the generated route tree and a handful of TS utilities that make TanStack Start's type-safety extremely fast and fully inferred.

## Nested Routing

TanStack Router uses nested routing to match the URL with the correct component tree to render.

For example, given the following routes:

```
routes/
├── __root.tsx <-- Renders the <Root> component
├── posts.tsx <-- Renders the <Posts> component
├── posts.$postId.tsx <-- Renders the <Post> component
```

And the URL: `/posts/123`

The component tree would look like this:

```
<Root>
  <Posts>
    <Post />
  </Posts>
</Root>
```

## Types of Routes

There are a few different types of routes that you can create in your project.

- **Index Routes** - Matched when the URL is exactly the same as the route's path
- **Dynamic/Wildcard/Splat Routes** - Dynamically capture part or all of the URL path into a variable to use in your application

There are also a few different utility route types that you can use to group and organize your routes:

- **Pathless Layout Routes** (Apply layout or logic to a group of routes without nesting them in a path)
- **Non-Nested Routes** (Un-nest a route from its parents and render its own component tree)
- **Grouped Routes** (Group routes together in a directory simply for organization, without affecting the path hierarchy)

## Creating File Routes

To create a route, create a new file that corresponds to the path of the route you want to create. For example:

| Path             | Filename            | Type           |
| ---------------- | ------------------- | -------------- |
| `/`              | `index.tsx`         | Index Route    |
| `/about`         | `about.tsx`         | Static Route   |
|                  | `posts.tsx`         | "Layout" Route |
| `/posts/`        | `posts/index.tsx`   | Index Route    |
| `/posts/:postId` | `posts/$postId.tsx` | Dynamic Route  |
| `/rest/*`        | `rest/$.tsx`        | Wildcard Route |

## Defining Routes

To define a route, use the `createFileRoute` function to export the route as the `Route` variable.

For example, to handle the `/posts/:postId` route, you would create a file named `posts/$postId.tsx` here:

```
src/
├── routes
│   ├── posts/$postId.tsx
```

Then, define the route like this:

```tsx
// src/routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posts/$postId')({
  component: PostComponent,
});
```

> [!NOTE]
> The path string passed to `createFileRoute` is **automatically written and managed by the router for you via the TanStack Router Bundler Plugin or Router CLI.** So, as you create new routes, move routes around or rename routes, the path will be updated for you automatically.

---

# File-Based Routing

> Source: https://github.com/TanStack/router/blob/main/docs/router/routing/file-based-routing.md

Most of the TanStack Router documentation is written for file-based routing and is intended to help you understand in more detail how to configure file-based routing and the technical details behind how it works. While file-based routing is the preferred and recommended way to configure TanStack Router, you can also use code-based routing if you prefer.

## What is File-Based Routing?

File-based routing is a way to configure your routes using the filesystem. Instead of defining your route structure via code, you can define your routes using a series of files and directories that represent the route hierarchy of your application. This brings a number of benefits:

- **Simplicity**: File-based routing is visually intuitive and easy to understand for both new and experienced developers.
- **Organization**: Routes are organized in a way that mirrors the URL structure of your application.
- **Scalability**: As your application grows, file-based routing makes it easy to add new routes and maintain existing ones.
- **Code-Splitting**: File-based routing allows TanStack Router to automatically code-split your routes for better performance.
- **Type-Safety**: File-based routing raises the ceiling on type-safety by generating and managing type linkages for your routes, which can otherwise be a tedious process via code-based routing.
- **Consistency**: File-based routing enforces a consistent structure for your routes, making it easier to maintain and update your application and move from one project to another.

## `/`s or `.`s?

While directories have long been used to represent route hierarchy, file-based routing introduces an additional concept of using the `.` character in the file-name to denote a route nesting. This allows you to avoid creating directories for few deeply nested routes and continue to use directories for wider route hierarchies.

## Directory Routes

Directories can be used to denote route hierarchy, which can be useful for organizing multiple routes into logical groups and also cutting down on the filename length for large groups of deeply nested routes.

| Filename                      | Route Path                | Component Output                  |
| ----------------------------- | ------------------------- | --------------------------------- |
| `__root.tsx`                  |                           | `<Root>`                          |
| `index.tsx`                   | `/` (exact)               | `<Root><RootIndex>`               |
| `about.tsx`                   | `/about`                  | `<Root><About>`                   |
| `posts.tsx`                   | `/posts`                  | `<Root><Posts>`                   |
| `posts/`                      |                           |                                   |
| `posts/index.tsx`             | `/posts` (exact)          | `<Root><Posts><PostsIndex>`       |
| `posts/$postId.tsx`           | `/posts/$postId`          | `<Root><Posts><Post>`             |
| `posts_/$postId/edit.tsx`     | `/posts/$postId/edit`     | `<Root><EditPost>`                |
| `settings.tsx`                | `/settings`               | `<Root><Settings>`                |
| `settings/profile.tsx`        | `/settings/profile`       | `<Root><Settings><Profile>`       |
| `settings/notifications.tsx`  | `/settings/notifications` | `<Root><Settings><Notifications>` |
| `_pathlessLayout.tsx`         |                           | `<Root><PathlessLayout>`          |
| `_pathlessLayout/route-a.tsx` | `/route-a`                | `<Root><PathlessLayout><RouteA>`  |
| `_pathlessLayout/route-b.tsx` | `/route-b`                | `<Root><PathlessLayout><RouteB>`  |
| `files/$.tsx`                 | `/files/$`                | `<Root><Files>`                   |

## Flat Routes

Flat routing gives you the ability to use `.`s to denote route nesting levels.

| Filename                      | Route Path                | Component Output                  |
| ----------------------------- | ------------------------- | --------------------------------- |
| `__root.tsx`                  |                           | `<Root>`                          |
| `index.tsx`                   | `/` (exact)               | `<Root><RootIndex>`               |
| `about.tsx`                   | `/about`                  | `<Root><About>`                   |
| `posts.tsx`                   | `/posts`                  | `<Root><Posts>`                   |
| `posts.index.tsx`             | `/posts` (exact)          | `<Root><Posts><PostsIndex>`       |
| `posts.$postId.tsx`           | `/posts/$postId`          | `<Root><Posts><Post>`             |
| `posts_.$postId.edit.tsx`     | `/posts/$postId/edit`     | `<Root><EditPost>`                |
| `settings.tsx`                | `/settings`               | `<Root><Settings>`                |
| `settings.profile.tsx`        | `/settings/profile`       | `<Root><Settings><Profile>`       |
| `settings.notifications.tsx`  | `/settings/notifications` | `<Root><Settings><Notifications>` |
| `_pathlessLayout.tsx`         |                           | `<Root><PathlessLayout>`          |
| `_pathlessLayout.route-a.tsx` | `/route-a`                | `<Root><PathlessLayout><RouteA>`  |
| `_pathlessLayout.route-b.tsx` | `/route-b`                | `<Root><PathlessLayout><RouteB>`  |
| `files.$.tsx`                 | `/files/$`                | `<Root><Files>`                   |

## Mixed Flat and Directory Routes

It's extremely likely that a 100% directory or flat route structure won't be the best fit for your project, which is why TanStack Router allows you to mix both flat and directory routes together to create a route tree that uses the best of both worlds where it makes sense.

> [!TIP]
> If you find that the default file-based routing structure doesn't fit your needs, you can always use Virtual File Routes to control the source of your routes whilst still getting the awesome performance benefits of file-based routing.

## Getting started with File-Based Routing

To get started with file-based routing, you'll need to configure your project's bundler to use the TanStack Router Plugin or the TanStack Router CLI.

To enable file-based routing, you'll need to be using React with a supported bundler:

- Installation with Vite
- Installation with Rspack/Rsbuild
- Installation with Webpack
- Installation with Esbuild

When using TanStack Router's file-based routing through one of the supported bundlers, our plugin will **automatically generate your route configuration through your bundler's dev and build processes**. It is the easiest way to use TanStack Router's route generation features.

---

# Server Functions

## What are Server Functions?

Server functions let you define server-only logic that can be called from anywhere in your application - loaders, components, hooks, or other server functions. They run on the server but can be invoked from client code seamlessly.

```tsx
import { createServerFn } from '@tanstack/react-start';

export const getServerTime = createServerFn().handler(async () => {
  // This runs only on the server
  return new Date().toISOString();
});

// Call from anywhere - components, loaders, hooks, etc.
const time = await getServerTime();
```

Server functions provide server capabilities (database access, environment variables, file system) while maintaining type safety across the network boundary.

## Basic Usage

Server functions are created with `createServerFn()` and can specify HTTP method:

```tsx
import { createServerFn } from '@tanstack/react-start';

// GET request (default)
export const getData = createServerFn().handler(async () => {
  return { message: 'Hello from server!' };
});

// POST request
export const saveData = createServerFn({ method: 'POST' }).handler(async () => {
  // Server-only logic
  return { success: true };
});
```

## Where to Call Server Functions

Call server functions from:

- **Route loaders** - Perfect for data fetching
- **Components** - Use with `useServerFn()` hook
- **Other server functions** - Compose server logic
- **Event handlers** - Handle form submissions, clicks, etc.

```tsx
// In a route loader
export const Route = createFileRoute('/posts')({
  loader: () => getPosts(),
});

// In a component
function PostList() {
  const getPosts = useServerFn(getServerPosts);

  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  });
}
```

## File Organization

For larger applications, consider organizing server-side code into separate files. Here's one approach:

```
src/utils/
├── users.functions.ts   # Server function wrappers (createServerFn)
├── users.server.ts      # Server-only helpers (DB queries, internal logic)
└── schemas.ts           # Shared validation schemas (client-safe)
```

- **`.functions.ts`** - Export `createServerFn` wrappers, safe to import anywhere
- **`.server.ts`** - Server-only code, only imported inside server function handlers
- **`.ts`** (no suffix) - Client-safe code (types, schemas, constants)

### Example

```tsx
// users.server.ts - Server-only helpers
import { db } from '~/db';

export async function findUserById(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}
```

```tsx
// users.functions.ts - Server functions
import { createServerFn } from '@tanstack/react-start';
import { findUserById } from './users.server';

export const getUser = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return findUserById(data.id);
  });
```

### Static Imports Are Safe

Server functions can be statically imported in any file, including client components:

```tsx
// Safe - build process handles environment shaking
import { getUser } from '~/utils/users.functions';

function UserProfile({ id }) {
  const { data } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser({ data: { id } }),
  });
}
```

The build process replaces server function implementations with RPC stubs in client bundles. The actual server code never reaches the browser.

> [!WARNING]
> Avoid dynamic imports for server functions:
>
> ```tsx
> // Can cause bundler issues
> const { getUser } = await import('~/utils/users.functions');
> ```

## Parameters & Validation

Server functions accept a single `data` parameter. Since they cross the network boundary, validation ensures type safety and runtime correctness.

### Basic Parameters

```tsx
import { createServerFn } from '@tanstack/react-start';

export const greetUser = createServerFn({ method: 'GET' })
  .inputValidator((data: { name: string }) => data)
  .handler(async ({ data }) => {
    return `Hello, ${data.name}!`;
  });

await greetUser({ data: { name: 'John' } });
```

### Validation with Zod

For robust validation, use schema libraries like Zod:

```tsx
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(0),
});

export const createUser = createServerFn({ method: 'POST' })
  .inputValidator(UserSchema)
  .handler(async ({ data }) => {
    // data is fully typed and validated
    return `Created user: ${data.name}, age ${data.age}`;
  });
```

### Form Data

Handle form submissions with FormData:

```tsx
export const submitForm = createServerFn({ method: 'POST' })
  .inputValidator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error('Expected FormData');
    }

    return {
      name: data.get('name')?.toString() || '',
      email: data.get('email')?.toString() || '',
    };
  })
  .handler(async ({ data }) => {
    // Process form data
    return { success: true };
  });
```

## Error Handling & Redirects

Server functions can throw errors, redirects, and not-found responses that are handled automatically when called from route lifecycles or components using `useServerFn()`.

### Basic Errors

```tsx
import { createServerFn } from '@tanstack/react-start';

export const riskyFunction = createServerFn().handler(async () => {
  if (Math.random() > 0.5) {
    throw new Error('Something went wrong!');
  }
  return { success: true };
});

// Errors are serialized to the client
try {
  await riskyFunction();
} catch (error) {
  console.log(error.message); // "Something went wrong!"
}
```

### Redirects

Use redirects for authentication, navigation, etc:

```tsx
import { createServerFn } from '@tanstack/react-start';
import { redirect } from '@tanstack/react-router';

export const requireAuth = createServerFn().handler(async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw redirect({ to: '/login' });
  }

  return user;
});
```

### Not Found

Throw not-found errors for missing resources:

```tsx
import { createServerFn } from '@tanstack/react-start';
import { notFound } from '@tanstack/react-router';

export const getPost = createServerFn()
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const post = await db.findPost(data.id);

    if (!post) {
      throw notFound();
    }

    return post;
  });
```

## Server Context & Request Handling

Access request headers, cookies, and customize responses:

```tsx
import { createServerFn } from '@tanstack/react-start';
import { getRequest, getRequestHeader, setResponseHeaders, setResponseStatus } from '@tanstack/react-start/server';

export const getCachedData = createServerFn({ method: 'GET' }).handler(async () => {
  // Access the incoming request
  const request = getRequest();
  const authHeader = getRequestHeader('Authorization');

  // Set response headers (e.g., for caching)
  setResponseHeaders(
    new Headers({
      'Cache-Control': 'public, max-age=300',
      'CDN-Cache-Control': 'max-age=3600, stale-while-revalidate=600',
    })
  );

  // Optionally set status code
  setResponseStatus(200);

  return fetchData();
});
```

Available utilities:

- `getRequest()` - Access the full Request object
- `getRequestHeader(name)` - Read a specific request header
- `setResponseHeader(name, value)` - Set a single response header
- `setResponseHeaders(headers)` - Set multiple response headers via Headers object
- `setResponseStatus(code)` - Set the HTTP status code

## Additional Advanced Topics

- **Streaming** - Stream typed data from server functions to the client
- **Raw Responses** - Return `Response` objects, binary data, or custom content types
- **Progressive Enhancement** - Use server functions without JavaScript by leveraging the `.url` property with HTML forms
- **Middleware** - Compose server functions with middleware for authentication, logging, and shared logic
- **Static Server Functions** - Cache server function results at build time for static generation
- **Request Cancellation** - Handle request cancellation with `AbortSignal` for long-running operations

> **Note**: Server functions use a compilation process that extracts server code from client bundles while maintaining seamless calling patterns. On the client, calls become `fetch` requests to the server.

---

# Static Prerendering

> Source: https://github.com/TanStack/router/blob/main/docs/start/framework/react/guide/static-prerendering.md

Static prerendering is the process of generating static HTML files for your application. This can be useful for either improving the performance of your application, as it allows you to serve pre-rendered HTML files to users without having to generate them on the fly or for deploying static sites to platforms that do not support server-side rendering.

## Prerendering

TanStack Start can prerender your application to static HTML files, which can then be served to users without having to generate them on the fly. To prerender your application, you can add the `prerender` option to your tanstackStart configuration in `vite.config.ts` file:

```ts
// vite.config.ts

import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: {
        // Enable prerendering
        enabled: true,

        // Enable if you need pages to be at `/page/index.html` instead of `/page.html`
        autoSubfolderIndex: true,

        // If disabled, only the root path or the paths defined in the pages config will be prerendered
        autoStaticPathsDiscovery: true,

        // How many prerender jobs to run at once
        concurrency: 14,

        // Whether to extract links from the HTML and prerender them also
        crawlLinks: true,

        // Filter function takes the page object and returns whether it should prerender
        filter: ({ path }) => !path.startsWith('/do-not-render-me'),

        // Number of times to retry a failed prerender job
        retryCount: 2,

        // Delay between retries in milliseconds
        retryDelay: 1000,

        // Maximum number of redirects to follow during prerendering
        maxRedirects: 5,

        // Fail if an error occurs during prerendering
        failOnError: true,

        // Callback when page is successfully rendered
        onSuccess: ({ page }) => {
          console.log(`Rendered ${page.path}!`);
        },
      },
      // Optional configuration for specific pages
      // Note: When autoStaticPathsDiscovery is enabled (default), discovered static
      // routes will be merged with the pages specified below
      pages: [
        {
          path: '/my-page',
          prerender: { enabled: true, outputPath: '/my-page/index.html' },
        },
      ],
    }),
    viteReact(),
  ],
});
```

## Automatic Static Route Discovery

All static paths will be automatically discovered and seamlessly merged with the specified `pages` config.

Routes are excluded from automatic discovery in the following cases:

- Routes with path parameters (e.g., `/users/$userId`) since they require specific parameter values
- Layout routes (prefixed with `_`) since they don't render standalone pages
- Routes without components (e.g., API routes)

Note: Dynamic routes can still be prerendered if they are linked from other pages when `crawlLinks` is enabled.

## Crawling Links

When `crawlLinks` is enabled (default: `true`), TanStack Start will extract links from prerendered pages and prerender those linked pages as well.

For example, if `/` contains a link to `/posts`, then `/posts` will also be automatically prerendered.

---

# Rendering Markdown

> Source: https://github.com/TanStack/router/blob/main/docs/start/framework/react/guide/rendering-markdown.md

This guide covers two methods for importing and rendering markdown content in your TanStack Start application:

1. **Static markdown** with `content-collections` for build-time loading (e.g., blog posts)
2. **Dynamic markdown** fetched at runtime from GitHub or any remote source

Both methods share a common rendering pipeline using the `unified` ecosystem.

> **Important note**: TanStack Start does NOT have native MDX support built-in. Markdown rendering is done by processing `.md` files at build time (via `content-collections`) or by fetching raw markdown at runtime and converting it to HTML using the `unified`/`remark`/`rehype` pipeline. There is no first-class `.mdx` file support (MDX with JSX) out of the box.

## Setting Up the Markdown Processor

Both approaches use the same markdown-to-HTML processing pipeline. First, install the required dependencies:

```bash
npm install unified remark-parse remark-gfm remark-rehype rehype-raw rehype-slug rehype-autolink-headings rehype-stringify shiki html-react-parser gray-matter
```

Create a markdown processor utility:

```tsx
// src/utils/markdown.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

export type MarkdownHeading = {
  id: string;
  text: string;
  level: number;
};

export type MarkdownResult = {
  markup: string;
  headings: Array<MarkdownHeading>;
};

export async function renderMarkdown(content: string): Promise<MarkdownResult> {
  const headings: Array<MarkdownHeading> = [];

  const result = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // Support GitHub Flavored Markdown
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML AST
    .use(rehypeRaw) // Process raw HTML in markdown
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['anchor'] },
    })
    .use(rehypeStringify) // Serialize to HTML string
    .process(content);

  return {
    markup: String(result),
    headings,
  };
}
```

## Method 1: Static Markdown with content-collections

The `content-collections` package is ideal for static content like blog posts that are included in your repository. It processes markdown files at build time and provides type-safe access to the content.

### Installation

```bash
npm install @content-collections/core @content-collections/vite
```

### Configuration

Create a `content-collections.ts` file in your project root:

```tsx
// content-collections.ts
import { defineCollection, defineConfig } from '@content-collections/core';
import matter from 'gray-matter';

const posts = defineCollection({
  name: 'posts',
  directory: './src/blog', // Directory containing your .md files
  include: '*.md',
  schema: (z) => ({
    title: z.string(),
    published: z.string().date(),
    description: z.string().optional(),
    authors: z.string().array(),
  }),
  transform: ({ content, ...post }) => {
    return {
      ...post,
      slug: post._meta.path,
      content,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
```

### Vite Integration

Add the content-collections plugin to your Vite config:

```tsx
// app.config.ts
import { defineConfig } from '@tanstack/react-start/config';
import contentCollections from '@content-collections/vite';

export default defineConfig({
  vite: {
    plugins: [contentCollections()],
  },
});
```

### Using the Collection

Access your posts through the generated collection:

```tsx
// src/routes/blog.index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { allPosts } from 'content-collections';

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
});

function BlogIndex() {
  const sortedPosts = allPosts.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {sortedPosts.map((post) => (
          <li key={post.slug}>
            <Link to="/blog/$slug" params={{ slug: post.slug }}>
              <h2>{post.title}</h2>
              <span>{post.published}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Rendering a Single Post

```tsx
// src/routes/blog.$slug.tsx
import { createFileRoute, notFound } from '@tanstack/react-router';
import { allPosts } from 'content-collections';
import { Markdown } from '~/components/Markdown';

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    return post;
  },
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <p>
          By {post.authors.join(', ')} on {post.published}
        </p>
      </header>
      <Markdown content={post.content} className="prose" />
    </article>
  );
}
```

## Method 2: Dynamic Markdown from Remote Sources

For content stored externally (like GitHub repositories), you can fetch and render markdown dynamically using server functions.

```tsx
// src/utils/docs.server.ts
import { createServerFn } from '@tanstack/react-start';
import matter from 'gray-matter';

type FetchDocsParams = {
  repo: string; // e.g., 'tanstack/router'
  branch: string; // e.g., 'main'
  filePath: string; // e.g., 'docs/guide/getting-started.md'
};

export const fetchDocs = createServerFn({ method: 'GET' })
  .inputValidator((params: FetchDocsParams) => params)
  .handler(async ({ data: { repo, branch, filePath } }) => {
    const url = `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const rawContent = await response.text();
    const { data: frontmatter, content } = matter(rawContent);

    return {
      frontmatter,
      content,
      filePath,
    };
  });
```

### Using Dynamic Markdown in Routes

```tsx
// src/routes/docs.$path.tsx
import { createFileRoute } from '@tanstack/react-router';
import { fetchDocs } from '~/utils/docs.server';
import { Markdown } from '~/components/Markdown';

export const Route = createFileRoute('/docs/$path')({
  loader: async ({ params }) => {
    return fetchDocs({
      data: {
        repo: 'your-org/your-repo',
        branch: 'main',
        filePath: `docs/${params.path}.md`,
      },
    });
  },
  component: DocsPage,
});

function DocsPage() {
  const { frontmatter, content } = Route.useLoaderData();

  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <Markdown content={content} className="prose" />
    </article>
  );
}
```

## Summary

| Approach            | Best For                                  | Pros                                           | Cons                                      |
| ------------------- | ----------------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| content-collections | Blog posts, static docs bundled with app  | Type-safe, build-time processing, fast runtime | Requires rebuild for content updates      |
| Dynamic fetching    | External docs, frequently updated content | Always fresh, no rebuild needed                | Runtime overhead, requires error handling |

---

## Key Facts Summary for Documentation Site Use

### MDX Support

- **No native MDX support** in TanStack Start. There is no built-in `.mdx` file handler.
- Markdown is rendered via the `unified`/`remark`/`rehype` pipeline (converts `.md` to HTML string, then parsed with `html-react-parser`).
- For static docs, use `@content-collections/core` + `@content-collections/vite` to process `.md` files at build time.
- Syntax highlighting is done separately with Shiki (`codeToHtml`).

### Static Generation

- Static prerendering is supported via the `prerender` option in `vite.config.ts` using `@tanstack/react-start/plugin/vite`.
- `autoStaticPathsDiscovery: true` auto-discovers all static routes.
- `crawlLinks: true` recursively prerendering linked pages.
- Dynamic routes (e.g., `/posts/$slug`) can be prerendered if linked from crawled pages or explicitly listed in `pages` config.
- Output can be `page.html` or `page/index.html` (controlled by `autoSubfolderIndex`).

### Routing Patterns

- File-based routing in `src/routes/` directory, auto-generates `routeTree.gen.ts`.
- Route files use `createFileRoute()` exporting a `Route` constant.
- Two styles: directory-based (`posts/$postId.tsx`) or flat (`.` as separator: `posts.$postId.tsx`), or mixed.
- `__root.tsx` is the shell route — renders `<html>`, `<head>`, `<HeadContent />`, `<body>`, `<Scripts />`.
- `_pathlessLayout.tsx` prefix creates layout groups without adding a URL segment.
- `$param` for dynamic segments, `$` for splat/wildcard routes.
- Route loaders run on the server for SSR, type-safe via `Route.useLoaderData()`.
- No React Server Components support yet (in development).

### Key Packages

- `@tanstack/react-start` - main framework package
- `@tanstack/react-router` - routing (auto-included)
- `@tanstack/react-start/plugin/vite` - Vite plugin
- `@content-collections/core` + `@content-collections/vite` - static markdown/content
- `unified`, `remark-*`, `rehype-*` - markdown processing pipeline
- `shiki` - syntax highlighting
- `html-react-parser` - render processed HTML as React
