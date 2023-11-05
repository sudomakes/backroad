# Backroad

<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and licence info here --->

![](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![https://backroad.sudomakes.art](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![https://backroad.sudomakes.art](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![https://react.dev/](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NX Workspace](https://img.shields.io/badge/workspace-143157?style=for-the-badge&logo=NX&logoColor=white)
[![semantic-release: backroad](https://img.shields.io/badge/semantic--release-backroad-06A261?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

<img src="./docs/assets/banner.png">
Backroad is a low-code tool that allows Node.JS developers to try out their own tooling/packages or build proof-of-concept apps as quickly as possible.

Backroad provides a simple [streamlit-like](https://streamlit.io/) API and ships with several commonly used components out of the box like form inputs, tables and LLMs. Powered by a top-to-bottom re-run based flow, it allows you to quickly put together applications with a very easy-to-understand interface.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed a relatively recent version of Node.JS

## Installing Backroad

To install Backroad, follow these steps:

```bash
npx degit sudomakes/trybackroad trybackroad
cd trybackroad
npm i
npm run dev
```

## Backroad Example

Here's what a sample backroad script looks like

```js
const [photo] = br.fileUpload({ label: 'Pick Image' });
if (photo) {
  br.write({ body: '# Greyscale image' });
  const image = await Jimp.read(photo.filepath);
  image.greyscale().getBase64(Jimp.AUTO, (err, res) => {
    br.image({ src: res, width: 600 });
  });
}
```

And this is the output you will get in the browser:

<img src="./docs/assets/file-upload.
png" />

As you can probably notice, it takes a relatively small amount of code to get started building and prototyping your ideas with Backroad. To learn more about backroad components and concepts, refer the [docs](https://backroad.sudomakes.art/docs/fundamentals/introduction/)

## Contributing to Backroad

<!--- If your README is long or you have some specific process or steps you want contributors to follow, consider creating a separate CONTRIBUTING.md file--->

To contribute to Backroad, follow these steps:

You can refer to the [contribution guide](./Contribution.md) which has some helpful instructions on how to get started with contributing to Backroad.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

<!-- ## Contributors -->

## Contact

If you want to reach out for anything related to Backroad, you may send an email to [contact@sudomakes.art](mailto:contact@sudomakes.art)

# Links

Website & Documentation : [backroad.sudomakes.art](https://backroad.sudomakes.art)

Link to the NPM Package: [@backroad/backroad](https://www.npmjs.com/package/@backroad/backroad)

Easiest way to get started with backroad: [sudomakes/trybackroad](https://github.com/sudomakes/trybackroad)

## License

<!--- If you're not sure which open license to use see https://choosealicense.com/--->

This project uses the [Fair Source license](./LICENSE).
