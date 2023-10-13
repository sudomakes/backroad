# Backroad

Because making wrapper UIs around your software is too much work.

[![semantic-release: backroad](https://img.shields.io/badge/semantic--release-backroad-06A261?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

<img src="./docs/assets/backroad.png"/>

A node js equivalent to https://streamlit.io/

## Use Cases

<img src="./docs/assets/use-cases/chat-prompt.png"/>

## Commands

to run local registry: nx local-registry

## Currently Need to Work On (From highest priority to lowest)

- homepage and tawk integration, google analytics integration
- Support for remaining components and documentation
- 404 page for routes which dont exist
- allow differentiated value types for frontend and backend (for example we currently use string filename array for frontend and multer file object in backend for same input type, fileupload but its not elegant)
- SEO improvements (for blog type pages)
- favicon support, default title support, initial container width, initial sidebar state
- generic types for values of certain components (for example select options should be strongly typeable through generics somehow)
- memoisation constructs for intensive tasks in script
