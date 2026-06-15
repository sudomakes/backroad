## [1.13.0](https://github.com/sudomakes/backroad/compare/v1.12.0...v1.13.0) (2026-06-15)

### Features

- **backroad-ui:** add flat design-system lib (shadcn + AI Elements) ([d222e90](https://github.com/sudomakes/backroad/commit/d222e900fb6d5d3c93342691353b67440088b4be))
- **components:** export renderer registry; fix Stats contrast ([0149d17](https://github.com/sudomakes/backroad/commit/0149d175d53d55f808dcec5541dd59eb18e3f8d9))
- **config:** app-maker recommended appearance (palette + mode) ([c87e561](https://github.com/sudomakes/backroad/commit/c87e561903461168ba2641b5d203ccedf6e9cd26))
- **frontend:** Tailwind v4 + shadcn migration, navbar GitHub link ([cef6b97](https://github.com/sudomakes/backroad/commit/cef6b97778c543b7816a9a13a1710a492f383118))
- **runner:** emit real running state around script execution ([ba41e45](https://github.com/sudomakes/backroad/commit/ba41e4504c9e29f78bc3add6d92fa456a033b1dd))

### Bug Fixes

- **core:** import chart/socket types from package roots ([019ea8f](https://github.com/sudomakes/backroad/commit/019ea8f832b3c14ae0369f87e7514a493a179959))
- **theme:** let a saved preference win over the app-maker default ([9f2e30d](https://github.com/sudomakes/backroad/commit/9f2e30dca80e841459581632f23f226fb3241f1e))
- **themes:** darken claude/twitter/amethyst-haze primaries for WCAG AA ([71a8cef](https://github.com/sudomakes/backroad/commit/71a8cefb7e2bb77b6ea058ccce01f0bb47a1b127))
- **themes:** raise claude/twitter muted-foreground to WCAG AA ([0d42d84](https://github.com/sudomakes/backroad/commit/0d42d84e6b5a0bc94ad83abeed69d35fff47cc68))

### Chores

- drop path-mapping comment from tsconfig.base.json ([3d534f9](https://github.com/sudomakes/backroad/commit/3d534f9435dfb45fb7bad09f02815d2b7cec1fd0))

### Refactoring

- **components:** collapse renderer exports to the registry ([33b667e](https://github.com/sudomakes/backroad/commit/33b667efb7135c0ab44b1fc5a8be53cd4005f684))
- **components:** consume backroad-ui, migrate renderers to shadcn ([21902fc](https://github.com/sudomakes/backroad/commit/21902fcffea5d43b8ea41f2fbb34baa7a4cdf8f2))
- **theme:** centralize prefs in a useLocalStorageState hook ([a47c710](https://github.com/sudomakes/backroad/commit/a47c7100cbf263faaffbd7177c0d33810df83635))

## [1.12.0](https://github.com/sudomakes/backroad/compare/v1.11.0...v1.12.0) (2026-06-14)

### Features

- **demo:** add sidebar navigation listing all demo pages ([8302f55](https://github.com/sudomakes/backroad/commit/8302f558b764b55914d8e59fa86258d888852683))

## [1.11.0](https://github.com/sudomakes/backroad/compare/v1.10.0...v1.11.0) (2026-06-14)

### Features

- **sidebar:** add backdrop, open/close API, and defaultOpen option ([e1c04b4](https://github.com/sudomakes/backroad/commit/e1c04b4d6d9859cd33ffc99be54fe2971749a76b))

### Bug Fixes

- **a11y:** use native buttons for sidebar controls ([4c2f465](https://github.com/sudomakes/backroad/commit/4c2f4655d29745693e6d939c50677a5d4fe0cfde))
- **auth:** redirect login/logout to the React auth pages, not the API mount ([d49b740](https://github.com/sudomakes/backroad/commit/d49b7407f1b986851502f0224d01bd5b9c271ec3))
- **backroad:** restore accidentally removed iframe method and test ([24c0729](https://github.com/sudomakes/backroad/commit/24c0729018e4176f49008173f23cac77627f69db))
- **core:** restore iframe type removed during sidebar revert ([8c80c19](https://github.com/sudomakes/backroad/commit/8c80c19d77963d60b6a5fa1766541a0c0573b411))
- default sidebar closed and silence empty-ack lint error ([68fdd46](https://github.com/sudomakes/backroad/commit/68fdd4671756669864d0a17f772b49256aa70541))
- **e2e:** update smoke test auth URLs to match current API routes ([334693f](https://github.com/sudomakes/backroad/commit/334693f7a91be729045c236f573af2cbb7eb51d0))
- **sidebar:** attach open/close directly to manager instance ([6a46d3c](https://github.com/sudomakes/backroad/commit/6a46d3c14f92fce72d7c4814c0e1e5cd3ec27706))
- **sidebar:** preserve prototype methods when returning sidebar handle ([59be1e3](https://github.com/sudomakes/backroad/commit/59be1e3fcaf7375bfe86def70e5b609bf75d5fe7))
- **sidebar:** restore portal rendering for persistent sidebar ([7963110](https://github.com/sudomakes/backroad/commit/7963110661a224b3069b037bf24708871b43c997))
- **sidebar:** simplify component to match original structure ([1278cc5](https://github.com/sudomakes/backroad/commit/1278cc54333105850cd1f7e2843a8807fde57888))
- **tests:** fix pre-existing test failures ([20534d1](https://github.com/sudomakes/backroad/commit/20534d110d99c2db454ea0e4b50b58e5c1f4c488))

### Chores

- sidebar added in demo ([43045ee](https://github.com/sudomakes/backroad/commit/43045ee78b16d93a80333f7c0db92be7ccb7e08a))

### Refactoring

- better sidebar and docs sandbox ([0125841](https://github.com/sudomakes/backroad/commit/01258419cc935cc5232444d825189fb1a23755ae))
- removed useless code ([31747a2](https://github.com/sudomakes/backroad/commit/31747a24ccac95475b6b877a94b115f81cdb8e09))
- **sidebar:** replace framer-motion with CSS transitions ([c59fc19](https://github.com/sudomakes/backroad/commit/c59fc19debea3ea20f5b226fa0b075bb9b554052))

## [1.10.0](https://github.com/sudomakes/backroad/compare/v1.9.0...v1.10.0) (2026-06-13)

### Features

- **sandbox:** add syntax highlighting to WebContainer editor ([af49dc6](https://github.com/sudomakes/backroad/commit/af49dc66d1657339b537880e768e0119d5c00428))

### Bug Fixes

- **e2e:** update sandbox test to look for CodeMirror editor ([e63c27f](https://github.com/sudomakes/backroad/commit/e63c27f20a58cafcd361cbd4d145fe0d733952f1))

### Chores

- tighten bundle size limits ([ce7fc5b](https://github.com/sudomakes/backroad/commit/ce7fc5bb38944a03901d7e879606298377b2bbd7))

## [1.9.0](https://github.com/sudomakes/backroad/compare/v1.8.0...v1.9.0) (2026-06-13)

### Features

- add a11y testing to storybook and wire into PR checks ([33d7b4b](https://github.com/sudomakes/backroad/commit/33d7b4b032d1ada311aec5d712778d5315b6ceb2))

### Bug Fixes

- **e2e:** run against production build instead of dev servers ([2e6b13c](https://github.com/sudomakes/backroad/commit/2e6b13cef19d97f18ed621af85c0bf4c06b94b10))
- fix a11y violations and knip baseline ([1f46ee0](https://github.com/sudomakes/backroad/commit/1f46ee02ec1f7e0f4b8c629788eaad6cf2c3ef75))

## [1.8.0](https://github.com/sudomakes/backroad/compare/v1.7.10...v1.8.0) (2026-06-13)

### Features

- **dev:** add gitleaks secret scan to pre-commit hook ([d692a82](https://github.com/sudomakes/backroad/commit/d692a8247e0a73c5e906d0e51cdbd0bd22c1bc6b))
- **iframe:** add iframe as first-class component with e2e tests ([b402128](https://github.com/sudomakes/backroad/commit/b40212834ad9d655bbb3713c41506d58e6e1a151))

### Bug Fixes

- **ci:** run gitleaks CLI directly instead of gitleaks-action@v2 which requires a paid license ([e1eeca9](https://github.com/sudomakes/backroad/commit/e1eeca9dc4c24c2864841b79b977e3914c695848))

## [1.7.10](https://github.com/sudomakes/backroad/compare/v1.7.9...v1.7.10) (2026-06-10)

### Bug Fixes

- copy \_headers to root for Cloudflare Pages ([b4327cb](https://github.com/sudomakes/backroad/commit/b4327cbdc60ff01ea7ba50212be23fa2ab482cd3))

## [1.7.9](https://github.com/sudomakes/backroad/compare/v1.7.8...v1.7.9) (2026-06-10)

### Bug Fixes

- move docs to /docs/, landing at root, remove GitHub Pages workflow ([bfd0fe8](https://github.com/sudomakes/backroad/commit/bfd0fe8734a56bb426db804700f2d34fd7fd6207))

## [1.7.8](https://github.com/sudomakes/backroad/compare/v1.7.7...v1.7.8) (2026-06-10)

### Bug Fixes

- **sandbox:** remove crossOriginIsolated check to test if headers are needed ([163cfc7](https://github.com/sudomakes/backroad/commit/163cfc77539ab81908fb7b92b91b49a9c82b10ff))

## [1.7.7](https://github.com/sudomakes/backroad/compare/v1.7.6...v1.7.7) (2026-06-10)

### Bug Fixes

- **sandbox:** pin @backroad/backroad and tsx versions ([7c5ca42](https://github.com/sudomakes/backroad/commit/7c5ca421d64bde2a7a0e8100824d4d9a9a1b9465))

## [1.7.6](https://github.com/sudomakes/backroad/compare/v1.7.5...v1.7.6) (2026-06-10)

### Bug Fixes

- **sandbox:** add timeout and crossOriginIsolated check ([fac7f0e](https://github.com/sudomakes/backroad/commit/fac7f0e8163d01efe34911317f8d53011e522d4c))

## [1.7.5](https://github.com/sudomakes/backroad/compare/v1.7.4...v1.7.5) (2026-06-10)

### Bug Fixes

- **docs:** replace Sandpack with WebContainer API ([58704fa](https://github.com/sudomakes/backroad/commit/58704fa112bb2d6264f875c7dac607dcd34a4b9b)), closes [codesandbox/sandpack#1108](https://github.com/codesandbox/sandpack/issues/1108)

### Chores

- **deps:** update pnpm-lock.yaml for WebContainer API ([b607543](https://github.com/sudomakes/backroad/commit/b6075435777659c93eece968862869f176e5ab7a))

## [1.7.4](https://github.com/sudomakes/backroad/compare/v1.7.3...v1.7.4) (2026-06-10)

### Bug Fixes

- copy \_headers to build output for COOP/COEP ([de20cb7](https://github.com/sudomakes/backroad/commit/de20cb766cf11668dca71ab2f714ce3b7ef606b7))

## [1.7.3](https://github.com/sudomakes/backroad/compare/v1.7.2...v1.7.3) (2026-06-10)

### Bug Fixes

- update baseUrl for root deployment ([c3e527d](https://github.com/sudomakes/backroad/commit/c3e527d22f50a371963440ac33903f2ea126a94c))

## [1.7.2](https://github.com/sudomakes/backroad/compare/v1.7.1...v1.7.2) (2026-06-09)

### Bug Fixes

- **landing:** make terminal command text readable ([6f35380](https://github.com/sudomakes/backroad/commit/6f3538029e9984a32e33aa676c51187075d6ba19))

## [1.7.1](https://github.com/sudomakes/backroad/compare/v1.7.0...v1.7.1) (2026-06-09)

### Bug Fixes

- **deploy:** move CNAME to landing so it lands at site root ([7664f00](https://github.com/sudomakes/backroad/commit/7664f00dc207568f19b8c066ea56a92f19f4d89c))

## [1.7.0](https://github.com/sudomakes/backroad/compare/v1.6.0...v1.7.0) (2026-06-07)

### Features

- docs site, landing page, auth UI, e2e suites ([447c59a](https://github.com/sudomakes/backroad/commit/447c59a469ab01847f38d535eb69f595dfe648aa))

### Bug Fixes

- **docs:** unbreak writing-and-markdown MDX ([aca76a5](https://github.com/sudomakes/backroad/commit/aca76a5c73613f8f9dd90f1476ed663549512fbe))

## [1.6.0](https://github.com/sudomakes/backroad/compare/v1.5.4...v1.6.0) (2026-06-07)

### Features

- update pnpm workspace and add examples directory ([74f5829](https://github.com/sudomakes/backroad/commit/74f582934e6a3a021314f172afdf7b407e282ac5))

## [1.5.4](https://github.com/sudomakes/backroad/compare/v1.5.3...v1.5.4) (2026-06-04)

### Bug Fixes

- **ci:** disable line-length rules for commitlint ([b2c528f](https://github.com/sudomakes/backroad/commit/b2c528f16e9f539518ea8057aa26c96a91f50f54))

## [1.4.0-alpha.5](https://github.com/sudomakes/backroad/compare/v1.4.0-alpha.4...v1.4.0-alpha.5) (2024-02-26)

### Features

- **async-llm-response:** loading state implemented ([3418b77](https://github.com/sudomakes/backroad/commit/3418b779e4f35bf0747d10839fc81c8cc4b2c4db))
- **async-llm-response:** remove unused async in the example app run function ([4095d1f](https://github.com/sudomakes/backroad/commit/4095d1f69cbad223bbd131467132fee1068dc098))

## [1.4.0-alpha.4](https://github.com/sudomakes/backroad/compare/v1.4.0-alpha.3...v1.4.0-alpha.4) (2024-02-01)

### Bug Fixes

- added ack on config receipt ([e47233f](https://github.com/sudomakes/backroad/commit/e47233fbe7e9c05488f590a237de7f55b0cca9a6))

## [1.4.0-alpha.3](https://github.com/sudomakes/backroad/compare/v1.4.0-alpha.2...v1.4.0-alpha.3) (2024-01-30)

### Features

- added clipboard upload ([539f63d](https://github.com/sudomakes/backroad/commit/539f63d93ef6f9d1da02b65aa1e5b7282020b6f2))

## [1.4.0-alpha.2](https://github.com/sudomakes/backroad/compare/v1.4.0-alpha.1...v1.4.0-alpha.2) (2024-01-30)

### Features

- **config:** keep types consistent for config type ([8205e9b](https://github.com/sudomakes/backroad/commit/8205e9b3e2a4dd4746d2c7871524f406676e8d29))
- **config:** setup an event just for config and add it to socket.tsx ([e2d1547](https://github.com/sudomakes/backroad/commit/e2d1547eb66ce5893b9ef5983975c4f387595988))
- **config:** wire up config events to frontend via a hook ([7322652](https://github.com/sudomakes/backroad/commit/73226522d8d9554ef772304c6b5ac529dc1ac253))
- npMerge branch 'alpha' into feat/permanent-theme ([67d9942](https://github.com/sudomakes/backroad/commit/67d9942cc2265d6119fcc29601e793db435a855f))
- **theme:** fix formatting on example app run function ([e0e33be](https://github.com/sudomakes/backroad/commit/e0e33bee149f85af228996b0c264c7c62e97524b))
- **theme:** implement choose theme at runtime ([8eb02f7](https://github.com/sudomakes/backroad/commit/8eb02f7a7eeeef7ffa6b67c4f083047d6bc35ad5))

### Bug Fixes

- ga-4 added empty deps array in useeffect ([597aa04](https://github.com/sudomakes/backroad/commit/597aa0469c3634bd262891f0c3295b1e988e11cd))
- readme ([c881ccf](https://github.com/sudomakes/backroad/commit/c881ccffbc30a0c768f0d26cbe8b611f8a6eae41))
- rerender fix for root node ([c37a1ad](https://github.com/sudomakes/backroad/commit/c37a1adc6444fdcba6f8b4eababcd1b66e161ea2))
- tables, fileupload and better logs ([401956d](https://github.com/sudomakes/backroad/commit/401956d555077145f32004fc7c214a52a0ffd860))

### Chores

- **release:** -v1.3.1 [skip ci] ([aa8d941](https://github.com/sudomakes/backroad/commit/aa8d941da3ac538702a9650479c0a3eae390cb48))
- **release:** -v1.3.2 [skip ci] ([faffbff](https://github.com/sudomakes/backroad/commit/faffbff0e7d6bb6d92c29c24dbb3c931dc003547))
- upgraded deploy workflow ([4596d6c](https://github.com/sudomakes/backroad/commit/4596d6c3d8b58552c5f290e83d6a8fc9c5726036))

## [1.4.0-alpha.1](https://github.com/sudomakes/backroad/compare/v1.3.1-alpha.4...v1.4.0-alpha.1) (2023-11-01)

### Features

- added google analytics ([ad2de41](https://github.com/sudomakes/backroad/commit/ad2de41d1a7c7cc2322638920accf14d2e1982cc))

## [1.3.1-alpha.4](https://github.com/sudomakes/backroad/compare/v1.3.1-alpha.3...v1.3.1-alpha.4) (2023-11-01)

### Bug Fixes

- table not updating on value change ([e8063e0](https://github.com/sudomakes/backroad/commit/e8063e0ab8bd712a5e9830913226e7f9138d316a))

## [1.3.1-alpha.3](https://github.com/sudomakes/backroad/compare/v1.3.1-alpha.2...v1.3.1-alpha.3) (2023-11-01)

### Bug Fixes

- added better boot logs for dev ([f0d0dc8](https://github.com/sudomakes/backroad/commit/f0d0dc88bdb075582396d6c284cd4c822bb59efa))

## [1.3.1-alpha.2](https://github.com/sudomakes/backroad/compare/v1.3.1-alpha.1...v1.3.1-alpha.2) (2023-10-31)

### Bug Fixes

- removed commander dependency ([959745d](https://github.com/sudomakes/backroad/commit/959745d70c1469c809d380e0b16e6303565a6323))

## [1.3.1-alpha.1](https://github.com/sudomakes/backroad/compare/v1.3.0...v1.3.1-alpha.1) (2023-10-31)

### Bug Fixes

- supporting all filetypes in upload component ([915adbf](https://github.com/sudomakes/backroad/commit/915adbf05858c703f5b79bb6d238510a3cc747a4))

### Chores

- added issue autocleanup ([4df1ba9](https://github.com/sudomakes/backroad/commit/4df1ba9bfeb62ed5c9039e7a6efce6f9d81070ad))
- added prerelease branch ([18a78a4](https://github.com/sudomakes/backroad/commit/18a78a4ba1f38e6579010ce7124ba6a9915df8e8))
- arm builds ([5f23147](https://github.com/sudomakes/backroad/commit/5f23147ac8c6195a28de8027a30aa82932cffcef))
- fixed docker image scp for ubuntu 22.04 ([3a3829b](https://github.com/sudomakes/backroad/commit/3a3829b12716522d5d726eeb415fc209d6b785f6))
- moved to lts ([0e8a587](https://github.com/sudomakes/backroad/commit/0e8a58770f51752a69a48d4a64ecd63e3cb45e85))
- multi plat builds ([f18bc7a](https://github.com/sudomakes/backroad/commit/f18bc7a52e0abba4e1016e8f2d684a56c0481f1b))
- removed group commands ([f192a15](https://github.com/sudomakes/backroad/commit/f192a15d7409ecd1a3464eb9ae4e574ca507a8e7))

## [1.3.0](https://github.com/sudomakes/backroad/compare/v1.2.1...v1.3.0) (2023-10-15)

### Features

- improvements in responsiveness ([a273084](https://github.com/sudomakes/backroad/commit/a273084e8178ac2671f2a6d62736992671e22d27))

## [1.2.1](https://github.com/sudomakes/backroad/compare/v1.2.0...v1.2.1) (2023-10-15)

### Bug Fixes

- added gaps to column ([e9904b8](https://github.com/sudomakes/backroad/commit/e9904b8b6ee0aa324747f0753a52902817d733d7))
- changed multer to formidable for types ([25e5a5d](https://github.com/sudomakes/backroad/commit/25e5a5dbc27bcb940c676f48a378106f5475d1ca))

## [1.2.0](https://github.com/sudomakes/backroad/compare/v1.1.0...v1.2.0) (2023-10-13)

### Features

- added button ([38590fc](https://github.com/sudomakes/backroad/commit/38590fc399178c756d9e4451ec7bc2e9adfae23f))
- added color picker ([e38936f](https://github.com/sudomakes/backroad/commit/e38936f8e5ac54546a8f912152f56b83c9d56396))
- added components ([0834983](https://github.com/sudomakes/backroad/commit/0834983d2fd35bc644a73b1383b2becb5ee6c811))
- added video and file upload ([efd16fd](https://github.com/sudomakes/backroad/commit/efd16fdc3ab47c48df289eb019583cabb2d1737f))

### Refactoring

- removed logs ([74ab690](https://github.com/sudomakes/backroad/commit/74ab6905331fdffc2c232738e66a5f717cfb74d3))

## [1.1.0](https://github.com/sudomakes/backroad/compare/v1.0.2...v1.1.0) (2023-10-11)

### Features

- added bar chart ([e270ff4](https://github.com/sudomakes/backroad/commit/e270ff4073c54372967d65702d02f04dd70de04c))
- added collapse ([55f7a20](https://github.com/sudomakes/backroad/commit/55f7a20397ccdaf50403b52490e79d7d01e90a3b))
- added llm chat message ([c6bc3a8](https://github.com/sudomakes/backroad/commit/c6bc3a83d86654fd2bea042abbd2c3cb91761b28))
- added llm example ([ebd4326](https://github.com/sudomakes/backroad/commit/ebd4326988f6e7c78055e2ef62957d744f95849d))
- added more charts ([dab9f5e](https://github.com/sudomakes/backroad/commit/dab9f5e88ff7b0c244591b38963d565c339e42c0))
- added table component ([cc810cd](https://github.com/sudomakes/backroad/commit/cc810cde2abf6af6389ddbb0b4ebca0d2d858504))
- added tabs ([93abdd0](https://github.com/sudomakes/backroad/commit/93abdd0cdd96b0d571a6a5741ed12daf6c99f1f9))

## [1.0.2](https://github.com/sudomakes/backroad/compare/v1.0.1...v1.0.2) (2023-10-08)

### Bug Fixes

- added client bundling to backroad build ([8a951ce](https://github.com/sudomakes/backroad/commit/8a951ce9a3126f6e0f154e8ad062fe7b3ec85f08))
- added static asset bundling to backroad ([baad45d](https://github.com/sudomakes/backroad/commit/baad45d1ef12374fea213bd21e2bceaae6355787))

## [1.0.1](https://github.com/sudomakes/backroad/compare/v1.0.0...v1.0.1) (2023-10-08)

### Bug Fixes

- publishing workflow ([77a1a02](https://github.com/sudomakes/backroad/commit/77a1a02d3e1fbf7a86358d3d531c5e8952564616))

## 1.0.0 (2023-10-08)

### Bug Fixes

- commit message which should trigger release ([d937fd0](https://github.com/sudomakes/backroad/commit/d937fd0b37d13b471b29924a5fb3f3686506d7a6))

### Chores

- initialised packaging work ([4c44dc7](https://github.com/sudomakes/backroad/commit/4c44dc743c8c3fcfe29f352897ed037741e60926))
- updated branch in workflow ([3720a43](https://github.com/sudomakes/backroad/commit/3720a434789dace1c2b44aec157ce284744254d2))
- updated main branch in pipelines and added deps ([d0bf59d](https://github.com/sudomakes/backroad/commit/d0bf59da23748ff55457072335578608e47b018f))
- updated pre commit hooks ([b4e6afb](https://github.com/sudomakes/backroad/commit/b4e6afb2c3b5e664867db9c7252c3beeb14db49e))
- updated workflow ([b502c65](https://github.com/sudomakes/backroad/commit/b502c65a439db717ccf93a37c50d6523aa9f3ef3))
- **workflows:** added github secrets usage for package publishing ([16028f2](https://github.com/sudomakes/backroad/commit/16028f2a1ece6152858afbf38e3a8294f8939d33))
- **workflows:** set token scope ([29ce48d](https://github.com/sudomakes/backroad/commit/29ce48d00e2e7a2680aa35a74e5dc11d5a4113fa))
