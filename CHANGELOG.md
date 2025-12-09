# [10.13.0](https://github.com/Nosto/web-components/compare/v10.12.0...v10.13.0) (2025-12-09)


### Features

* migrate to trusted publishing ([01c49bb](https://github.com/Nosto/web-components/commit/01c49bbffa92979958e25c3b9224592866319e8c))

# [10.12.0](https://github.com/Nosto/web-components/compare/v10.11.0...v10.12.0) (2025-12-09)


### Bug Fixes

* add scoped shopify override ([b4f0424](https://github.com/Nosto/web-components/commit/b4f042436b14797963ba5b8214c27c5db472e915))
* **getShopifyUrl:** add resetShopifyShop to prevent test pollution ([5e5e192](https://github.com/Nosto/web-components/commit/5e5e192a50cd56e6359ee2c55bdcb01a535a540d))


### Features

* **getShopifyUrl:** add resetShopifyShop cleanup function ([c85df02](https://github.com/Nosto/web-components/commit/c85df0251ae8f211c5a4a053f1c9c79d99829079))

# [10.11.0](https://github.com/Nosto/web-components/compare/v10.10.1...v10.11.0) (2025-12-09)


### Bug Fixes

* **storybook:** correct error message in exampleProductsLoader ([56a3641](https://github.com/Nosto/web-components/commit/56a36414415f08cd7bcbc131621fc87dc6f38e2d))


### Features

* **Bundle:** add compact variant selector to both stories ([b67a376](https://github.com/Nosto/web-components/commit/b67a37606391639edfaba9acb3010bdea0e62616))
* **Bundle:** align storybook stories with SimpleCard pattern ([41b89a3](https://github.com/Nosto/web-components/commit/41b89a30c395ccd6fd046287e9469bbe5532512c))
* **storybook:** update exampleHandlesLoader to return handle and title ([8928897](https://github.com/Nosto/web-components/commit/8928897d570faf44d1da8c69ec227c0edd48e0a8))

## [10.10.1](https://github.com/Nosto/web-components/compare/v10.10.0...v10.10.1) (2025-12-09)


### Bug Fixes

* improve shopify url resolving ([a2c81e5](https://github.com/Nosto/web-components/commit/a2c81e508f5089684d588f7f483ba99dbfb5d7d7))

# [10.10.0](https://github.com/Nosto/web-components/compare/v10.9.0...v10.10.0) (2025-12-09)


### Bug Fixes

* **jsx:** restore strict typing for custom elements, flexible for native elements ([05a3e34](https://github.com/Nosto/web-components/commit/05a3e34ff5779dc4b397ae86d66db7a9bc969035))


### Features

* **jsx:** replace manual HTML element mappings with imported TypeScript types ([cd1ebd5](https://github.com/Nosto/web-components/commit/cd1ebd563f766cc7ccdf71f0d057f69f19c8f7de))

# [10.9.0](https://github.com/Nosto/web-components/compare/v10.8.0...v10.9.0) (2025-12-09)


### Bug Fixes

* adjust eslint and fix mock generation ([c8e8356](https://github.com/Nosto/web-components/commit/c8e8356126effdc8ab83eb378a8c0a2b530b9cea))


### Features

* generate shopify graphql types ([7fd8976](https://github.com/Nosto/web-components/commit/7fd897667561b5609a0d4c271b058117c8188281))

# [10.8.0](https://github.com/Nosto/web-components/compare/v10.7.1...v10.8.0) (2025-12-08)


### Bug Fixes

* **Bundle:** use real ATC call ([0bf694c](https://github.com/Nosto/web-components/commit/0bf694c630b2a3437a9fbe0ad931fa33172ebffe))
* **comments:** minor improvements with function naming and property assignments ([0020ffe](https://github.com/Nosto/web-components/commit/0020ffe62e7b28b87d64b720b46d125a1915abac))
* **comments:** move listener registration on line up ([705b376](https://github.com/Nosto/web-components/commit/705b37641f298178e6981cd16a866747ab11f423))
* move initialization to field init ([55dbe64](https://github.com/Nosto/web-components/commit/55dbe64e47f704486c4083377bf47d1ebdd7bbd4))
* update mock products method signature ([caec6e9](https://github.com/Nosto/web-components/commit/caec6e981fc1472d894d4d423fbad56c2ab1dfc5))


### Features

* introduce storefront API in bundle component ([9a6f6f2](https://github.com/Nosto/web-components/commit/9a6f6f2529bb80bfcb12eee5525e3724004a2da2))

## [10.7.1](https://github.com/Nosto/web-components/compare/v10.7.0...v10.7.1) (2025-12-01)


### Bug Fixes

* handle style strings in JSX and update storybook config for tsx files ([74dcf43](https://github.com/Nosto/web-components/commit/74dcf43884233f1433574ba09db6715327123b3f))
* resolve typescript errors and update imports ([c36c6c4](https://github.com/Nosto/web-components/commit/c36c6c4faf6a6363b5656696e1a5169cb456b52a))

# [10.7.0](https://github.com/Nosto/web-components/compare/v10.6.0...v10.7.0) (2025-12-01)


### Features

* add default props mechanism for SimpleCard & DynamicCard ([792ddd2](https://github.com/Nosto/web-components/commit/792ddd25958d070696f70eaaf93f8433a6c0a833))

# [10.6.0](https://github.com/Nosto/web-components/compare/v10.5.0...v10.6.0) (2025-11-27)


### Features

* **fetch:** add postJSON utility for POST requests ([0e5a0e8](https://github.com/Nosto/web-components/commit/0e5a0e8ab66196ec8b0bdb9383f5a34e97d6d3f8))

# [10.5.0](https://github.com/Nosto/web-components/compare/v10.4.0...v10.5.0) (2025-11-27)


### Bug Fixes

* import component in story instead ([352fda7](https://github.com/Nosto/web-components/commit/352fda70211a2dbaeae9abf530ea6bf976a26c0c))


### Features

* support checkbox inside bundle nested product card, tests ([436c735](https://github.com/Nosto/web-components/commit/436c7355f5737519df244091508b492718193637))

# [10.4.0](https://github.com/Nosto/web-components/compare/v10.3.0...v10.4.0) (2025-11-26)


### Features

* **jsx:** add support for property binding in applyProperties ([c98b9a9](https://github.com/Nosto/web-components/commit/c98b9a9028dcf764854f93587c516fe97b8b8414))

# [10.3.0](https://github.com/Nosto/web-components/compare/v10.2.0...v10.3.0) (2025-11-25)


### Bug Fixes

* **test:** improve error message in addProductHandlers for better debugging ([7fb5e28](https://github.com/Nosto/web-components/commit/7fb5e28b49781111bef046f3002248cc65eefd1f))


### Features

* **test:** extract addProductHandlers utility for reusable mock setup ([b0c79c5](https://github.com/Nosto/web-components/commit/b0c79c5fbf71f5c5b762d469a8154b2f33f840e4))

# [10.2.0](https://github.com/Nosto/web-components/compare/v10.1.8...v10.2.0) (2025-11-25)


### Bug Fixes

* add more test cases ([028813c](https://github.com/Nosto/web-components/commit/028813c5497a8f655aff1171bd30d65088ac9d67))
* change story level root references ([5fac7ea](https://github.com/Nosto/web-components/commit/5fac7eac4ce219f99543ab6918dbe038890ad279))
* import correct shopify funcition ([aa5d9a9](https://github.com/Nosto/web-components/commit/aa5d9a9849872252318633f22a0a1bbdeb1b45f0))
* mock simple card product in test ([e9ce7e0](https://github.com/Nosto/web-components/commit/e9ce7e0fd9e10ae807288632cd1d345e240b2839))
* replace any usage ([8ece18b](https://github.com/Nosto/web-components/commit/8ece18bae9463ee36e453b63214db1f02e0e0aa1))
* review comments ([fc76f2a](https://github.com/Nosto/web-components/commit/fc76f2a5c35ea1a9de848a0e6d95cee2b1595dc4))
* review comments ([e505dd0](https://github.com/Nosto/web-components/commit/e505dd03cca6d34b6d7dd55ad450e3c1d88639c8))
* review comments ([fabe731](https://github.com/Nosto/web-components/commit/fabe73150e8845e45e57ed9d1a231bcacf325b7c))
* review comments ([623a721](https://github.com/Nosto/web-components/commit/623a721c68a7c6def7ce8acddea6c95bd942391b))
* review comments ([c2e6303](https://github.com/Nosto/web-components/commit/c2e6303838cb87f39749410df6832b86044c9fdc))
* review comments ([647b675](https://github.com/Nosto/web-components/commit/647b6752cb251492e6675ade0a2c4495f07839e8))
* review comments, initial test file ([4597f14](https://github.com/Nosto/web-components/commit/4597f14e94877863fba3373e6ae384aebc742178))
* use price as number ([d509dcd](https://github.com/Nosto/web-components/commit/d509dcd49209c5838977853ec473dd0a05fd25e8))


### Features

* initial Bundle component ([cb84b5d](https://github.com/Nosto/web-components/commit/cb84b5d4115f7e7117b9137e774da0693e980fe6))

## [10.1.8](https://github.com/Nosto/web-components/compare/v10.1.7...v10.1.8) (2025-11-25)


### Bug Fixes

* address warning on [@fires](https://github.com/fires) tag usage ([6326384](https://github.com/Nosto/web-components/commit/63263846e0a214b43aed1ed4c25f4a94c7bf1423))
* update deprecated eslint config and scope it to src and test folders ([5b2e862](https://github.com/Nosto/web-components/commit/5b2e8627d03e00c26d8c70694fd5db276a6b03df))

## [10.1.7](https://github.com/Nosto/web-components/compare/v10.1.6...v10.1.7) (2025-11-25)


### Bug Fixes

* issues with storybook ([7347b71](https://github.com/Nosto/web-components/commit/7347b712d82c3335acd5cfcfe2a3da9ffd873c12))
* lint errors ([0a20231](https://github.com/Nosto/web-components/commit/0a2023115bb5c9a5c4d0e5c472574d7e79616a97))
* use shop domain ([d210045](https://github.com/Nosto/web-components/commit/d21004532da7169f4a821da4b28f803f86af72c1))

## [10.1.6](https://github.com/Nosto/web-components/compare/v10.1.5...v10.1.6) (2025-11-24)


### Bug Fixes

* adjust getExampleHandles to use only base url while fetching data from GraphQL ([52ab266](https://github.com/Nosto/web-components/commit/52ab266ed24a92a80b0768624c5e3ff6525bf1fc))
* move shop url normalization our of cache logic ([131c66f](https://github.com/Nosto/web-components/commit/131c66fb9dcf5ec2b3e93ac8c39cf60239c6b76d))
* refactor getExampleHandles ([b132b54](https://github.com/Nosto/web-components/commit/b132b5491fe5f41af4eba3a88bafdeac725a52b2))

## [10.1.5](https://github.com/Nosto/web-components/compare/v10.1.4...v10.1.5) (2025-11-24)


### Bug Fixes

* add super class for reactive elements ([372e370](https://github.com/Nosto/web-components/commit/372e370d96ce258a7174977b3733ccc4d40d5531))

## [10.1.4](https://github.com/Nosto/web-components/compare/v10.1.3...v10.1.4) (2025-11-24)


### Bug Fixes

* attempt at simplifying createShopifyUrl in storybook ([e113919](https://github.com/Nosto/web-components/commit/e113919bc36775215f2837ce78b2bf9f9cafe311))
* revert window.Storybook usage ([d6ab7d6](https://github.com/Nosto/web-components/commit/d6ab7d65a9b639a12ab056f00f1bd2fe8dc82dfb))

## [10.1.3](https://github.com/Nosto/web-components/compare/v10.1.2...v10.1.3) (2025-11-21)


### Bug Fixes

* fix root override ([f5e7866](https://github.com/Nosto/web-components/commit/f5e786672f781e131603568f0cdf77717f9dd86b))

## [10.1.2](https://github.com/Nosto/web-components/compare/v10.1.1...v10.1.2) (2025-11-21)


### Bug Fixes

* handle case where  routes.root could be empty ([d0cef17](https://github.com/Nosto/web-components/commit/d0cef17ae4a4dc11eaeada4eaa6c8ca2f60e82a2))
* handle shopify design mode (theme editor) ([2261400](https://github.com/Nosto/web-components/commit/22614000a8d290e5708a54498e424f2286e35258))
* simplify resolveUrl ([22514a0](https://github.com/Nosto/web-components/commit/22514a06317462365f080114104782f34085986c))

## [10.1.1](https://github.com/Nosto/web-components/compare/v10.1.0...v10.1.1) (2025-11-21)


### Bug Fixes

* update createShopifyUrl to handle query params in URL ([cf2eb43](https://github.com/Nosto/web-components/commit/cf2eb435e7d184d156fd94afe119d7aed5578a09))

# [10.1.0](https://github.com/Nosto/web-components/compare/v10.0.2...v10.1.0) (2025-11-21)


### Features

* implement resource minification plugins ([bc97927](https://github.com/Nosto/web-components/commit/bc97927f7890d50c9e3839774f48469852c8c65e))

## [10.0.2](https://github.com/Nosto/web-components/compare/v10.0.1...v10.0.2) (2025-11-20)


### Bug Fixes

* add error handling to exampleHandlesLoader ([bd2e91f](https://github.com/Nosto/web-components/commit/bd2e91f55c90d2a074c7ab60014375fddc9dc762))

## [10.0.1](https://github.com/Nosto/web-components/compare/v10.0.0...v10.0.1) (2025-11-20)


### Bug Fixes

* review comment ([6d8609b](https://github.com/Nosto/web-components/commit/6d8609b1a9c1cf2b67c747d560a2200ca52ffac2))
* sort variants in compact mode ([a0cb074](https://github.com/Nosto/web-components/commit/a0cb0745dbcb802052410970abdaab7f53556fce))

# [10.0.0](https://github.com/Nosto/web-components/compare/v9.30.0...v10.0.0) (2025-11-20)


* refactor(SimpleCard)!: replace alternate/carousel with image-mode ([fd21efb](https://github.com/Nosto/web-components/commit/fd21efb7c5644439c9fdf8cf5b3ec1095b2e1866))


### Features

* **mock:** centralize mock Shopify products to src/mock/products.ts ([bc24c28](https://github.com/Nosto/web-components/commit/bc24c289de824217762048454cbd9a3028928561))
* **SimpleCard:** update Storybook stories for image-mode ([58675b8](https://github.com/Nosto/web-components/commit/58675b8ae601519306452bf40156af65bdcdf807))


### BREAKING CHANGES

* The `alternate` and `carousel` boolean properties have been removed from
SimpleCard component. Use the new `image-mode` attribute instead.

Migration guide:
- Replace `<nosto-simple-card alternate>` with `<nosto-simple-card image-mode="alternate">`
- Replace `<nosto-simple-card carousel>` with `<nosto-simple-card image-mode="carousel">`
- The `imageMode` TypeScript property accepts "alternate" | "carousel" | undefined

# [9.30.0](https://github.com/Nosto/web-components/compare/v9.29.0...v9.30.0) (2025-11-19)


### Features

* **test:** extend test coverage for shadowContentFactory.ts ([f553b29](https://github.com/Nosto/web-components/commit/f553b29c93877f738bc298e8eea7afbd105c2e65))

# [9.29.0](https://github.com/Nosto/web-components/compare/v9.28.0...v9.29.0) (2025-11-19)


### Features

* **VariantSelector:** disable dropdown when all variants are unavailable ([b86679a](https://github.com/Nosto/web-components/commit/b86679a587c1a8f7105c7fc572b67568962a2408))

# [9.28.0](https://github.com/Nosto/web-components/compare/v9.27.2...v9.28.0) (2025-11-19)


### Features

* **story:** align SimpleCard and VariantSelector controls ([1ef7dbd](https://github.com/Nosto/web-components/commit/1ef7dbd86bf949624e5c9217ce852a1647ee35ea))

## [9.27.2](https://github.com/Nosto/web-components/compare/v9.27.1...v9.27.2) (2025-11-19)


### Bug Fixes

* skip option name prefix ([b841211](https://github.com/Nosto/web-components/commit/b841211f5a159eaecc4885824958eb93db6920c1))

## [9.27.1](https://github.com/Nosto/web-components/compare/v9.27.0...v9.27.1) (2025-11-19)


### Bug Fixes

* **SimpleCard:** skip image updates on variant change when carousel or alternate mode enabled ([92ba896](https://github.com/Nosto/web-components/commit/92ba8968fe659cd6a90fd478e229ce3112381dc4))

# [9.27.0](https://github.com/Nosto/web-components/compare/v9.26.0...v9.27.0) (2025-11-19)


### Bug Fixes

* extract default mode ([a5145cd](https://github.com/Nosto/web-components/commit/a5145cd9d4a8c65a4749536f95dbda07ed4dc861))
* update handle in case variant points to different handle ([7d9b8d6](https://github.com/Nosto/web-components/commit/7d9b8d62b36a8df074d78bdecfac0ef19f8c5087))


### Features

* **VariantSelector:** add compact mode with dropdown selector ([17eab87](https://github.com/Nosto/web-components/commit/17eab8740fccf4796d314c61eb403849f9c5c503))
* **VariantSelector:** make compact default mode and rename default to options ([122ad5a](https://github.com/Nosto/web-components/commit/122ad5aeb6d49d858be74e95525f95f9a7793a5a))
* **VariantSelector:** skip single-value options in compact mode dropdown ([d3509b6](https://github.com/Nosto/web-components/commit/d3509b63ef814006530a8c2613230466ce7e055b))

# [9.26.0](https://github.com/Nosto/web-components/compare/v9.25.0...v9.26.0) (2025-11-18)


### Features

* **SimpleCard:** add carousel mode with navigation arrows ([a8c0996](https://github.com/Nosto/web-components/commit/a8c099613c70e83c9b221b48739ebd982da68418))

# [9.25.0](https://github.com/Nosto/web-components/compare/v9.24.0...v9.25.0) (2025-11-18)


### Bug Fixes

* **VariantSelector:** add default maxValues of 5 to Default story ([69b06a9](https://github.com/Nosto/web-components/commit/69b06a965380970d3d78202c475356ad27d856f1))
* **VariantSelector:** improve accessibility and add maxValues to Default story ([41141f3](https://github.com/Nosto/web-components/commit/41141f314d9389b3c9dbdd1b2fc0cd42ea474b7d))
* **VariantSelector:** make component reactive with observe option ([caea9ce](https://github.com/Nosto/web-components/commit/caea9cef55bbfb4762a8e0d7498d3ef1125c4cc5))
* **VariantSelector:** remove redundant tests and fix property binding ([1b5d72f](https://github.com/Nosto/web-components/commit/1b5d72f2b219534bce758290fe2d19cc85e1be32))
* **VariantSelector:** use kebab-case attribute name in stories ([2937a0e](https://github.com/Nosto/web-components/commit/2937a0ea50601ba83b8574c78ef909d8bae36d52))


### Features

* **inject:** add unprovide function to remove element from mapping ([0857a4c](https://github.com/Nosto/web-components/commit/0857a4ce26fc914153c38287f8417f0dddc6b44d))
* **VariantSelector:** add maxValues attribute with tests and stories ([240d0f1](https://github.com/Nosto/web-components/commit/240d0f17f9d5bc6d0fb85f5be3b6a0cb6ea31492))

# [9.24.0](https://github.com/Nosto/web-components/compare/v9.23.0...v9.24.0) (2025-11-17)


### Bug Fixes

* **VariantSelector:** remove table category sections from placeholder and preselect controls ([2ebf716](https://github.com/Nosto/web-components/commit/2ebf71613228ced6210d3c15cc637b2cb767615a))
* **vue:** apply property binding to null/undefined values and remove redundant tests ([9f32d0e](https://github.com/Nosto/web-components/commit/9f32d0e3310a682fd27f4c2a529509d4cdb919ce))
* **vue:** exclude event handler properties from property binding ([2a8c240](https://github.com/Nosto/web-components/commit/2a8c24098b50791545f498969eb8f4f79c26ba98))
* **vue:** move removeAttribute to else branch for null/undefined values ([175329e](https://github.com/Nosto/web-components/commit/175329e30d1d2d0605e3a07fd3fc8fa277246687))


### Features

* **VariantSelector:** add placeholder and preselect controls to Default story ([bf4c0d4](https://github.com/Nosto/web-components/commit/bf4c0d49cfe0257b9d2071085f03dfdead848410))
* **vue:** enhance setAttribute to bind properties when available ([eafc25c](https://github.com/Nosto/web-components/commit/eafc25ce03153ead3b4b3f18409ca7a890641461))

# [9.23.0](https://github.com/Nosto/web-components/compare/v9.22.0...v9.23.0) (2025-11-17)


### Features

* **DynamicCard:** extend storybook story with controls ([5638717](https://github.com/Nosto/web-components/commit/56387171a88da502b811442090f13291fc08f39a))

# [9.22.0](https://github.com/Nosto/web-components/compare/v9.21.0...v9.22.0) (2025-11-14)


### Bug Fixes

* lint ([78f8b3f](https://github.com/Nosto/web-components/commit/78f8b3f1245f59c5ff9af5a409353fd3fd8784b4))
* product count optional ([40e9067](https://github.com/Nosto/web-components/commit/40e906722560522e0fb2f08a1166bfe81f82dc37))


### Features

* variant and simple card number of products to render ([5471e6c](https://github.com/Nosto/web-components/commit/5471e6c1ee41fdd26bb1d54ecd196e1ce1b0e80a))

# [9.21.0](https://github.com/Nosto/web-components/compare/v9.20.2...v9.21.0) (2025-11-14)


### Bug Fixes

* lint ([c8a7163](https://github.com/Nosto/web-components/commit/c8a7163c9893f7dbb5d8336f4477dad8305e5c8b))
* moved to default ([0ed5613](https://github.com/Nosto/web-components/commit/0ed56133cb30721a251de8095ac6a63e760d3387))
* review ([d0b4e32](https://github.com/Nosto/web-components/commit/d0b4e32cd25a678ba7d6d2736ba90cfc1e9c0c28))
* reviews ([e5a1b78](https://github.com/Nosto/web-components/commit/e5a1b789a824a1a684646abd32357c7e0a99bc8e))
* reviews ([4b07070](https://github.com/Nosto/web-components/commit/4b07070829476a341b0cc47c261dacaa06786d57))


### Features

* grid ([1f522f0](https://github.com/Nosto/web-components/commit/1f522f046f5faab42a18cd7dc2ad710afd70f0c8))
* storybook simple card custom column count ([33eb117](https://github.com/Nosto/web-components/commit/33eb1171aa53d4f1e556ef9a2bddf4d1c06d0b42))
* storybook variant selector custom grid columns ([43f2ad3](https://github.com/Nosto/web-components/commit/43f2ad3494146841f6fa09d354948535fed61426))

## [9.20.2](https://github.com/Nosto/web-components/compare/v9.20.1...v9.20.2) (2025-11-14)


### Bug Fixes

* add error handling to cached wrapper ([5f5824b](https://github.com/Nosto/web-components/commit/5f5824b5309cd2d39022e67d9cbd89460c8755d5))

## [9.20.1](https://github.com/Nosto/web-components/compare/v9.20.0...v9.20.1) (2025-11-14)


### Bug Fixes

* add cacheable wrapper for functions ([3441d59](https://github.com/Nosto/web-components/commit/3441d59322cce58cd5bfec84c641d9be88d53430))

# [9.20.0](https://github.com/Nosto/web-components/compare/v9.19.0...v9.20.0) (2025-11-14)


### Bug Fixes

* add product.id field to all variants in mock data and tests ([1ecb330](https://github.com/Nosto/web-components/commit/1ecb330efa6038132c0b9e1a70cdcbdce944c7b4))
* update SimpleCard.productId on variant change ([b1a404f](https://github.com/Nosto/web-components/commit/b1a404f874a641430670d09f6cd74fe86f8bcb13))
* use function to get api url ([f7fcb5e](https://github.com/Nosto/web-components/commit/f7fcb5eccf49e13df3643faa52a8f697d108332e))


### Features

* use getExampleHandles in SimpleCard and VariantSelector stories ([5b90530](https://github.com/Nosto/web-components/commit/5b9053018c0dedf069d98520bc4d64039571bb9e))

# [9.19.0](https://github.com/Nosto/web-components/compare/v9.18.1...v9.19.0) (2025-11-13)


### Features

* storefront graphql api ([1c816e3](https://github.com/Nosto/web-components/commit/1c816e3b80804b73fa8d81af1eb790f093b2de23))
* update tests to use GraphQL shopify types ([66bc526](https://github.com/Nosto/web-components/commit/66bc5261385e1cc88c820d88fcfa1e2ce1be581a))
* **VariantSelector:** add adjacentVariants support to GraphQL query ([41e4875](https://github.com/Nosto/web-components/commit/41e48755d229cc3e8d9588b0280539d1beccff43))


### Reverts

* remove test changes and convertRestToGraphQL helper ([4b6d6e5](https://github.com/Nosto/web-components/commit/4b6d6e5ab7a33bea07607e4bd1e7aea80b0b53ba))

## [9.18.1](https://github.com/Nosto/web-components/compare/v9.18.0...v9.18.1) (2025-11-12)


### Bug Fixes

* **tests:** update IntersectionObserver mocking for Vitest 4.x compatibility ([bfa7201](https://github.com/Nosto/web-components/commit/bfa7201c73ea629e3ed6312c76a379698627e1ec))

# [9.18.0](https://github.com/Nosto/web-components/compare/v9.17.0...v9.18.0) (2025-11-12)


### Bug Fixes

* additional checks ([eb0e161](https://github.com/Nosto/web-components/commit/eb0e1615afb3648b2e7120d1b034f246255ff21a))
* event listeners ([c1d7817](https://github.com/Nosto/web-components/commit/c1d7817a94a4e25e5761d9ebaacfb7fef2efc3c9))
* lint ([6a0980e](https://github.com/Nosto/web-components/commit/6a0980e5bf7423c865900303af6176db87575ce0))
* lint ([f114a83](https://github.com/Nosto/web-components/commit/f114a8348ac8d7c014e36dbe98449646d879a009))
* reviews ([2f5fe3a](https://github.com/Nosto/web-components/commit/2f5fe3a845a675500ceef75a13a7fdefd64b4ec5))
* reviews ([ec81435](https://github.com/Nosto/web-components/commit/ec814354f1849232c4751737cc3b761eb764b9af))
* reviews ([43aac32](https://github.com/Nosto/web-components/commit/43aac32d38b861c4798740e775fac889abf230a0))
* **SimpleCard:** remove event listeners from mock mode ([c0d5bc3](https://github.com/Nosto/web-components/commit/c0d5bc37b9d2c925c8d6afc3b74cf6e7aaaabdcb))
* tests ([65ded71](https://github.com/Nosto/web-components/commit/65ded711a6465c70d6e523ed83780786f004e2c4))


### Features

* mock mode ([eaf4b52](https://github.com/Nosto/web-components/commit/eaf4b5299d6120c50b02445301d32213ba26e4fb))
* **SimpleCard:** add mock mode tests and fix early return ([102c856](https://github.com/Nosto/web-components/commit/102c85687c9755342fa8023176430026ea278fb1))

# [9.17.0](https://github.com/Nosto/web-components/compare/v9.16.0...v9.17.0) (2025-11-12)


### Bug Fixes

* lint ([2ae17e8](https://github.com/Nosto/web-components/commit/2ae17e83d513df07e1d7ce9d8620db5bcc9323ac))
* lint ([92575b8](https://github.com/Nosto/web-components/commit/92575b88c9f095e8170817385bfdbbb024469b2a))
* remove handles ([6757a18](https://github.com/Nosto/web-components/commit/6757a18fa3e2357d1e638a7818c7a816d8b68172))
* reviews ([a765b92](https://github.com/Nosto/web-components/commit/a765b92015d31d8aa2d681ac677efbbf778eb301))
* reviews ([5e6e35a](https://github.com/Nosto/web-components/commit/5e6e35a55bb023470878cd41cb46345fa3a4bbc7))
* reviews ([a27fe83](https://github.com/Nosto/web-components/commit/a27fe834ead810b91cb1227b04ff493db1210b08))
* story fixes ([5fc6546](https://github.com/Nosto/web-components/commit/5fc6546d6cc0105c0ce600dbc741681af367abac))


### Features

* mock mode ([996f3d3](https://github.com/Nosto/web-components/commit/996f3d3ce15cbbf131c80bd0a88af255df1f6eaf))

# [9.16.0](https://github.com/Nosto/web-components/compare/v9.15.0...v9.16.0) (2025-11-07)


### Features

* **Image:** add support for loading attribute ([70479b1](https://github.com/Nosto/web-components/commit/70479b1e3831a781fa03f86cbedd8ae31634bb85))

# [9.15.0](https://github.com/Nosto/web-components/compare/v9.14.0...v9.15.0) (2025-11-05)


### Bug Fixes

* **Image:** move part attribute to connectedCallback and remove redundant test ([b973624](https://github.com/Nosto/web-components/commit/b97362416480bbfb128ff417f4d0be851b6bd6de))


### Features

* **Image:** expose inner img element via part="img" for external styling ([46a83a2](https://github.com/Nosto/web-components/commit/46a83a22841dc8e9b0e30fbe433f0343b6fddf28))

# [9.14.0](https://github.com/Nosto/web-components/compare/v9.13.1...v9.14.0) (2025-11-04)


### Features

* **Campaign:** add urlSynced property to reload on navigation changes ([c2b5552](https://github.com/Nosto/web-components/commit/c2b5552ba90f7a50263f27eacf4eedac37108e02))

## [9.13.1](https://github.com/Nosto/web-components/compare/v9.13.0...v9.13.1) (2025-11-03)


### Bug Fixes

* **SimpleCard:** use img.style.cssText instead of img.style assignment ([688ef0f](https://github.com/Nosto/web-components/commit/688ef0fcc74af1650325412c0629fabfd39a369e))
* use img directly in SimpleCard ([9a61a8b](https://github.com/Nosto/web-components/commit/9a61a8bfcc8e0e49321933a85cc33f5896c31519))

# [9.13.0](https://github.com/Nosto/web-components/compare/v9.12.1...v9.13.0) (2025-10-30)


### Bug Fixes

* **VariantSelector:** lint formatting ([5757a0b](https://github.com/Nosto/web-components/commit/5757a0b4ed400e8f4a68071fdb0d37dcb116fe8c))
* **VariantSelector:** simplify placeholder to single string and skip listener setup ([7631fcb](https://github.com/Nosto/web-components/commit/7631fcb306c2872f5065b6dee6c99945abaef1f3))


### Features

* **VariantSelector:** add placeholder attribute implementation and tests ([c8bddb2](https://github.com/Nosto/web-components/commit/c8bddb2b88f8291e51808ab583bd8d5e71073877))

## [9.12.1](https://github.com/Nosto/web-components/compare/v9.12.0...v9.12.1) (2025-10-29)


### Bug Fixes

* use property decorators ([d3c50ed](https://github.com/Nosto/web-components/commit/d3c50edef173fb488aee4e67b2a0140f2cac5781))

# [9.12.0](https://github.com/Nosto/web-components/compare/v9.11.0...v9.12.0) (2025-10-28)


### Features

* **decorators:** guard arrayAttribute setter against non-array values ([06fc8e1](https://github.com/Nosto/web-components/commit/06fc8e1c0441cd8ad84e00a944a51787c2f2e30a))

# [9.11.0](https://github.com/Nosto/web-components/compare/v9.10.2...v9.11.0) (2025-10-28)


### Bug Fixes

* remove FetchPriority story and combination test as requested ([7353b6a](https://github.com/Nosto/web-components/commit/7353b6a548739be0fa15ab5fdebd2e785a0c9822))
* simplify fetchpriority test to single value as requested ([46c6bde](https://github.com/Nosto/web-components/commit/46c6bde7e5bc3f97d37b555e22a67d7c27b65a2d))
* **VariantSelector:** disable pointer interactions on unavailable values ([1db3fd6](https://github.com/Nosto/web-components/commit/1db3fd68cf6456f8426a3705d01f91213c60d6e6))


### Features

* **Image:** add fetchpriority attribute support ([e9c48ea](https://github.com/Nosto/web-components/commit/e9c48ea187c7ce0cd643413a10522b375aef4b4a))
* **SimpleCard/VariantSelector:** emit post-render events ([d25e9f8](https://github.com/Nosto/web-components/commit/d25e9f878ba83cc2badb44d7896b7f8f9b1a6d00))
* **SimpleCard/VariantSelector:** emit post-render events ([24280fe](https://github.com/Nosto/web-components/commit/24280fe8b50d0fbdf48a8b2b427097a77a659a98))

## [9.10.2](https://github.com/Nosto/web-components/compare/v9.10.1...v9.10.2) (2025-10-27)


### Bug Fixes

* listen only to handle changes ([d25ab1c](https://github.com/Nosto/web-components/commit/d25ab1cf9b67af7a0f283386ff7c80c2b0e9680f))

## [9.10.1](https://github.com/Nosto/web-components/compare/v9.10.0...v9.10.1) (2025-10-27)


### Bug Fixes

* improve variant preselection logic ([18b2809](https://github.com/Nosto/web-components/commit/18b280924d58a242e789f01faf2ef23a1ebae269))

# [9.10.0](https://github.com/Nosto/web-components/compare/v9.9.0...v9.10.0) (2025-10-27)


### Bug Fixes

* **docs:** correct VariantSelector category from Category to Campaign level templating ([dbcbbbe](https://github.com/Nosto/web-components/commit/dbcbbbee8cd8a1a3216102f420542b74503e78b7))
* **docs:** remove stray comma and complete example externalization ([8caebf8](https://github.com/Nosto/web-components/commit/8caebf8df5e1bff760878a24bc33a1cc2cbd9f39))
* **docs:** update SectionCampaign Liquid template example per review feedback ([cd89de8](https://github.com/Nosto/web-components/commit/cd89de899ab277318a302644c0a67336396cb439))


### Features

* add typedoc-plugin-markdown and move examples to header section ([30cc435](https://github.com/Nosto/web-components/commit/30cc435aaab66535e7de9ae5f4b921c8b49fa02b))

# [9.9.0](https://github.com/Nosto/web-components/compare/v9.8.2...v9.9.0) (2025-10-27)


### Bug Fixes

* improve VariantSelector parts exposure ([38c3e46](https://github.com/Nosto/web-components/commit/38c3e4669812da2d570a991bbc571df0f6c2ecda))


### Features

* remove all component cards from Storybook overview page ([6ae094a](https://github.com/Nosto/web-components/commit/6ae094a343a2a97fbb4d8112c9589d0d82793b7f))
* remove overview links from Storybook overview page ([9484faa](https://github.com/Nosto/web-components/commit/9484faabc122b848e27d1dca37f92179ef345e55))

## [9.8.2](https://github.com/Nosto/web-components/compare/v9.8.1...v9.8.2) (2025-10-24)


### Bug Fixes

* fix createShopifyUrl logic ([51d6931](https://github.com/Nosto/web-components/commit/51d6931ecf5808ab6d286814da5d33239f0aa526))

## [9.8.1](https://github.com/Nosto/web-components/compare/v9.8.0...v9.8.1) (2025-10-23)


### Bug Fixes

* add missing unlisten call ([1002e66](https://github.com/Nosto/web-components/commit/1002e66fc1b8f975b27c726086e8d88b4a7e21c1))

# [9.8.0](https://github.com/Nosto/web-components/compare/v9.7.0...v9.8.0) (2025-10-23)


### Features

* bump @nosto/nosto-js dependency from 2.7.0 to 2.9.1 ([8b8f3b2](https://github.com/Nosto/web-components/commit/8b8f3b234d0a22d3531e910d1723a702f3ca8824))

# [9.7.0](https://github.com/Nosto/web-components/compare/v9.6.0...v9.7.0) (2025-10-23)


### Features

* **VariantSelector:** add default slot to shadow DOM ([8827c2c](https://github.com/Nosto/web-components/commit/8827c2c5285411e0297a2a8a5b8ed330e6a8fd55))

# [9.6.0](https://github.com/Nosto/web-components/compare/v9.5.0...v9.6.0) (2025-10-22)


### Bug Fixes

* simplify Campaign mock if-block condition as requested ([f221450](https://github.com/Nosto/web-components/commit/f2214504bf7ac9790bcc05b22eba2b774588f027))
* simplify Control stories mocking as requested in PR feedback ([0bef310](https://github.com/Nosto/web-components/commit/0bef310b38bce6408c64e54406abca15451aba9e))
* **storybook:** improve navigation links with proper target attributes ([f04fd74](https://github.com/Nosto/web-components/commit/f04fd745ca157acf6df4c82bfe94fe81979e411e))


### Features

* consolidate Storybook mocking for Campaign and Control components ([2020773](https://github.com/Nosto/web-components/commit/2020773a1d3c8ce8af6b37bd04941efd47dfde3f))
* **storybook:** add minimal overview page with component summary ([f81afd3](https://github.com/Nosto/web-components/commit/f81afd3f6689b63f0d4614233e0460b45328ece9))
* **storybook:** implement comprehensive frontpage with component overview ([bd83526](https://github.com/Nosto/web-components/commit/bd83526cbeb7463f40634a851516140c367193df))

# [9.5.0](https://github.com/Nosto/web-components/compare/v9.4.1...v9.5.0) (2025-10-21)


### Features

* **SimpleCard:** preload data via property ([6e97953](https://github.com/Nosto/web-components/commit/6e979536167d61500f2d907033a8859ff5920af5))

## [9.4.1](https://github.com/Nosto/web-components/compare/v9.4.0...v9.4.1) (2025-10-20)


### Bug Fixes

* extract shadowRoot population code ([38d7d46](https://github.com/Nosto/web-components/commit/38d7d4651cf396cd8c49daaeece9b91ead89dedd))

# [9.4.0](https://github.com/Nosto/web-components/compare/v9.3.2...v9.4.0) (2025-10-20)


### Features

* **Image:** complete shadow DOM rendering, optional layout, and unstyled attribute implementation ([08eb250](https://github.com/Nosto/web-components/commit/08eb250b482189566e6a56a63177ed03458e1d93))
* **Image:** implement shadow DOM rendering, optional layout, and unstyled attribute ([94a2311](https://github.com/Nosto/web-components/commit/94a231191ddd7ea446355e8ffaf6d4acda857a9f))

## [9.3.2](https://github.com/Nosto/web-components/compare/v9.3.1...v9.3.2) (2025-10-20)


### Bug Fixes

* drop buggy story ([5d55cd0](https://github.com/Nosto/web-components/commit/5d55cd063cfceb039cb803eb8f7a33bb849e1181))
* drop double escaping ([a469bd6](https://github.com/Nosto/web-components/commit/a469bd627b78ca857547b3418f85e4785138807a))

## [9.3.1](https://github.com/Nosto/web-components/compare/v9.3.0...v9.3.1) (2025-10-14)


### Bug Fixes

* return h3 back ([abfa228](https://github.com/Nosto/web-components/commit/abfa22847bd48ed1a4f2649ecc95055f74ed27cf))
* update styles ([f7f63da](https://github.com/Nosto/web-components/commit/f7f63dacf5021157512696b222e0bcf450c0409a))

# [9.3.0](https://github.com/Nosto/web-components/compare/v9.2.1...v9.3.0) (2025-10-10)


### Features

* **VariantSelector:** implement single-value option auto-selection and hiding ([15e069e](https://github.com/Nosto/web-components/commit/15e069e99a7e9329db0315edc5f5352bb8c3da8c))

## [9.2.1](https://github.com/Nosto/web-components/compare/v9.2.0...v9.2.1) (2025-10-10)


### Bug Fixes

* add unavailable flags to option values ([f4b683a](https://github.com/Nosto/web-components/commit/f4b683affed6af608295a8f7d9d97ce4ff3632eb))

# [9.2.0](https://github.com/Nosto/web-components/compare/v9.1.0...v9.2.0) (2025-10-08)


### Features

* add add-to-cart support to SimpleCard ([2a99814](https://github.com/Nosto/web-components/commit/2a99814ce9c1840cbb7f66f94cea3eebaed12760))

# [9.1.0](https://github.com/Nosto/web-components/compare/v9.0.0...v9.1.0) (2025-10-08)


### Bug Fixes

* **VariantSelector:** change preselect default to false and simplify logic per feedback ([9002b66](https://github.com/Nosto/web-components/commit/9002b66aa1befd6e3e4048d35654adfba48dd97e))


### Features

* **VariantSelector:** add preselect boolean attribute for optional variant preselection ([e298ae2](https://github.com/Nosto/web-components/commit/e298ae20b7fedef4252868d75d897d544f874d6f))

# [9.0.0](https://github.com/Nosto/web-components/compare/v8.36.1...v9.0.0) (2025-10-08)


### Bug Fixes

* remove empty lines as requested in code review ([e31be65](https://github.com/Nosto/web-components/commit/e31be6554ba6ab5b7644fcce707c0156c66fcf1a))


### Documentation

* document ProductCard removal as breaking change ([9c0ae0a](https://github.com/Nosto/web-components/commit/9c0ae0a2acd528b425cd48d001118bfa5e4e1479))


### BREAKING CHANGES

* The ProductCard component and nosto-product-card custom element have
been completely removed. Use Campaign component (nosto-campaign) instead for product
templating capabilities.

## [8.36.1](https://github.com/Nosto/web-components/compare/v8.36.0...v8.36.1) (2025-10-07)


### Bug Fixes

* adjust variant image handling ([4e32418](https://github.com/Nosto/web-components/commit/4e32418983d01685f5d9f61b12ddf1043d7ea6de))

# [8.36.0](https://github.com/Nosto/web-components/compare/v8.35.0...v8.36.0) (2025-10-07)


### Features

* **SimpleCard,VariantSelector:** align CSS styles according to requirements ([26fdf2d](https://github.com/Nosto/web-components/commit/26fdf2dc3be4512f5661f725c1e2f9a3f03345dc))

# [8.35.0](https://github.com/Nosto/web-components/compare/v8.34.0...v8.35.0) (2025-10-07)


### Bug Fixes

* add cache clearing and fix failing tests ([80405d5](https://github.com/Nosto/web-components/commit/80405d5ea64648515f299098d31125d16f7dc6dd))
* make currentProduct public and remove product from VariantChangeDetail ([2155778](https://github.com/Nosto/web-components/commit/2155778212d688a8b64a333688cb9e5f183f3bf5))
* move VariantChangeDetail to types, use escapeHtml for data attributes ([69c4594](https://github.com/Nosto/web-components/commit/69c459481733c809eb1a8242d44ad256cdc34311))
* **Popup:** fix test unhandled errors and format issues ([030cabe](https://github.com/Nosto/web-components/commit/030cabec2c08ee345029923736c2d79ea66f3349))


### Features

* add WithVariantSelector Storybook story for SimpleCard ([9c91cd4](https://github.com/Nosto/web-components/commit/9c91cd4dd8853310b0615af318990927e9113d08))
* complete VariantSelector implementation with Storybook integration ([4225966](https://github.com/Nosto/web-components/commit/422596686e416b09c1b34be145682f4fd3d5e32d))
* implement VariantSelector component with basic functionality ([9c1ea83](https://github.com/Nosto/web-components/commit/9c1ea83b0c61f97bc038acb36983bbafce7db97d))
* **Popup:** add new custom element with dialog and ribbon slots ([d077525](https://github.com/Nosto/web-components/commit/d077525a68e21d6e0472dbaeb86445e52538c9a8))
* **Popup:** add ribbon mode, shadow DOM parts, and global test setup ([1324963](https://github.com/Nosto/web-components/commit/132496371aa298109b61884ec512a960d788aa87))


### Performance Improvements

* optimize SimpleCard updates with querySelector-based DOM updates ([7cd30db](https://github.com/Nosto/web-components/commit/7cd30db437c70ed3e40163a57ee79f5f1a4b9ab0))

# [8.34.0](https://github.com/Nosto/web-components/compare/v8.33.0...v8.34.0) (2025-10-06)


### Bug Fixes

* restore the removed test for both primary and alternate images ([73cff99](https://github.com/Nosto/web-components/commit/73cff99f13a00c44abe76ca0b580bd0f10d2baa3))
* use proper HTML escaping for sizes attribute and remove duplicate test ([c16649b](https://github.com/Nosto/web-components/commit/c16649b2a4307a4ae78b138060cdbd30d929c355))


### Features

* **SimpleCard:** add sizes attribute support for responsive images ([d9a512f](https://github.com/Nosto/web-components/commit/d9a512f91edcb0c5bee06bae93cadbfbc48df997))

# [8.33.0](https://github.com/Nosto/web-components/compare/v8.32.0...v8.33.0) (2025-10-06)


### Bug Fixes

* **Image:** simplify implementation - remove comments and attribute removal logic ([7f843cd](https://github.com/Nosto/web-components/commit/7f843cd594d635b05b85769792989901d80b69cf))
* restore all original vue tests and remove backup file ([6e1e5a0](https://github.com/Nosto/web-components/commit/6e1e5a016d2e1d4d0e7fcc1fb3ceb5f1ba433f94))


### Features

* **Image:** reuse existing img child instead of always recreating ([eee1705](https://github.com/Nosto/web-components/commit/eee1705390b59a3b62222cfd1571ecdbfb06c7a1))
* **jsdoc:** add [@category](https://github.com/category) annotations to all custom elements ([9722a22](https://github.com/Nosto/web-components/commit/9722a224b30adca2c1b6134916a9e4c3e150ad9f))

# [8.32.0](https://github.com/Nosto/web-components/compare/v8.31.2...v8.32.0) (2025-10-06)


### Features

* bump GitHub Actions Node.js version from 22 to 24 ([fdcd5da](https://github.com/Nosto/web-components/commit/fdcd5da84a736dfc1720b4e7dfb4e4607ef606a0))

## [8.31.2](https://github.com/Nosto/web-components/compare/v8.31.1...v8.31.2) (2025-10-03)


### Bug Fixes

* **components:** ensure loading state cleared in finally blocks across custom elements ([9ee5eef](https://github.com/Nosto/web-components/commit/9ee5eef89f73df2e9eaa28b32830b1ac3413c481))
* **SimpleCard:** add try/finally blocks for loading state management ([89f4e11](https://github.com/Nosto/web-components/commit/89f4e113b58dac9bec4692bcbedb579e6485beff))

## [8.31.1](https://github.com/Nosto/web-components/compare/v8.31.0...v8.31.1) (2025-10-03)


### Bug Fixes

* normalize image urls ([6479451](https://github.com/Nosto/web-components/commit/647945145c50c891a39ce16bf42814ef41a043e9))


### Performance Improvements

* **SimpleCard:** cache constructible stylesheet for better performance ([adf59e6](https://github.com/Nosto/web-components/commit/adf59e66d5a35260d0e8f6398a6c9f27cbe09782))

# [8.31.0](https://github.com/Nosto/web-components/compare/v8.30.0...v8.31.0) (2025-10-02)


### Features

* **utils:** add optional in-memory caching to getText/getJSON ([01f842c](https://github.com/Nosto/web-components/commit/01f842c12857d5aed583a6125e06f14183b983d0))

# [8.30.0](https://github.com/Nosto/web-components/compare/v8.29.0...v8.30.0) (2025-10-02)


### Bug Fixes

* remove comment and add npm caching to copilot-setup-steps.yml ([6d274b4](https://github.com/Nosto/web-components/commit/6d274b4ce7426324252e9bbabb9077d0f8a707ad))


### Features

* add minimal copilot-setup-steps.yml file ([784351d](https://github.com/Nosto/web-components/commit/784351d13fe732f18087c75e5dca7702f603b5b4))

# [8.29.0](https://github.com/Nosto/web-components/compare/v8.28.0...v8.29.0) (2025-10-01)


### Features

* **Campaign:** implement cart-synced attribute with @nosto/nosto-js bump ([94ca04d](https://github.com/Nosto/web-components/commit/94ca04d42fbf4013cf92ef4e54346dbc4a21c7d2))

# [8.28.0](https://github.com/Nosto/web-components/compare/v8.27.0...v8.28.0) (2025-10-01)


### Bug Fixes

* **SimpleCard:** return TemplateExpression objects instead of .html strings ([3431065](https://github.com/Nosto/web-components/commit/343106527d04cbb991b7b9bde8883e6f633af846))


### Features

* **SimpleCard:** refactor to use html templating from src/templating/html.ts ([14f4364](https://github.com/Nosto/web-components/commit/14f4364cbfb5d0165e18c7062e3bdfc231dc043f))

# [8.27.0](https://github.com/Nosto/web-components/compare/v8.26.0...v8.27.0) (2025-09-29)


### Bug Fixes

* use built-in Array constructor for all array types instead of custom ArrayType ([a47f9b5](https://github.com/Nosto/web-components/commit/a47f9b51eba20be002bc49dce49a61ec458468f5))


### Features

* add Array.isArray validation in arrayAttribute getter to ensure type safety ([6d41883](https://github.com/Nosto/web-components/commit/6d418835b68354239591466c866204a1436935ac))
* add breakpoints validation to ensure all elements are positive finite numbers ([cfe2dfc](https://github.com/Nosto/web-components/commit/cfe2dfcc79f12ca45205c5fb7b779489a0f234ed))
* improve breakpoints validation logic and add attribute test case ([ae839a8](https://github.com/Nosto/web-components/commit/ae839a83da1a61a09f11056addaf487b43e18e64))

# [8.26.0](https://github.com/Nosto/web-components/compare/v8.25.0...v8.26.0) (2025-09-29)


### Features

* extract path-specific conventions from copilot instructions ([71f4e85](https://github.com/Nosto/web-components/commit/71f4e85ce61b409c2c073cc8bbee2bdf357a96d0))

# [8.25.0](https://github.com/Nosto/web-components/compare/v8.24.0...v8.25.0) (2025-09-26)


### Features

* **Image:** allow rendering with only src + width or src + height ([541642f](https://github.com/Nosto/web-components/commit/541642f6122181e720760ff7f767e1ca8bee7d54))

# [8.24.0](https://github.com/Nosto/web-components/compare/v8.23.1...v8.24.0) (2025-09-25)


### Features

* **Image:** Add support for alt and sizes attributes and pass to unpic transform ([6a13f61](https://github.com/Nosto/web-components/commit/6a13f6157afff27e3ee6266e21448c8dc1b5c9c5))
* implement lit-html like templating engine with html function ([bb29ec2](https://github.com/Nosto/web-components/commit/bb29ec27b27d557e43dd54f9f0a0fa8255301b9c))

## [8.23.1](https://github.com/Nosto/web-components/compare/v8.23.0...v8.23.1) (2025-09-22)


### Bug Fixes

* **Image:** filter out null/undefined attributes from inner img element ([7b7f3b4](https://github.com/Nosto/web-components/commit/7b7f3b4186d8de0a6ac4068f457cafcbb7d9b0be))

# [8.23.0](https://github.com/Nosto/web-components/compare/v8.22.0...v8.23.0) (2025-09-22)


### Bug Fixes

* **Campaign:** remove template wrappers from lazy loaded and manual initialization stories ([d3b349e](https://github.com/Nosto/web-components/commit/d3b349eb68b88570b4d91a51503fee706dc05e48))
* resolve Prettier formatting issues in all story files ([804c992](https://github.com/Nosto/web-components/commit/804c9922f4174a723d1e84fb3a91ebeb3520faf1))
* resolve remaining lint errors in Campaign stories and ProductCard test ([28bffa7](https://github.com/Nosto/web-components/commit/28bffa7883b41ccf6761e948f77d7e83ecbec071))


### Features

* apply decorator pattern to remaining story files for consistency ([8277fa0](https://github.com/Nosto/web-components/commit/8277fa01faef28de5e5338ce8cb264ca01293575))
* convert story helpers to Storybook decorators and remove template wrapper ([28ed4a7](https://github.com/Nosto/web-components/commit/28ed4a712bb057075429826017137432b4fda702))
* create Storybook files for Campaign, Control, and ProductCard components ([c3a37d2](https://github.com/Nosto/web-components/commit/c3a37d2bfc482a5ced3b8bc94e2c7561cd9c6f00))
* simplify Control stories templates and styles, remove createDemoSection from Image stories ([8ad7375](https://github.com/Nosto/web-components/commit/8ad73759bb7d63be3c6ad38542d77040acefa7ce))

# [8.22.0](https://github.com/Nosto/web-components/compare/v8.21.0...v8.22.0) (2025-09-04)


### Bug Fixes

* resolve Prettier formatting issues in CHANGELOG.md, README.md, and tsconfig.types.json ([2cdfd29](https://github.com/Nosto/web-components/commit/2cdfd29fcab3975ce121f4f13e22360451b5e3d9))
* revert CHANGELOG.md changes and make event name a constant ([02264d0](https://github.com/Nosto/web-components/commit/02264d0a17f358be6ab1476da740195dcfd8848c))


### Features

* **DynamicCard:** emit DynamicCard/loaded event when content loads ([4c07877](https://github.com/Nosto/web-components/commit/4c07877accc2f85636ee47bb00f5320dcdb02539))
* **DynamicCard:** rename event to "@nosto/DynamicCard/loaded" ([59607bb](https://github.com/Nosto/web-components/commit/59607bb2a1f0ca01d35e3be4b95c25d9c1eab176))

# [8.21.0](https://github.com/Nosto/web-components/compare/v8.20.0...v8.21.0) (2025-09-04)


### Features

* add typedoc-json script for JSON output ([516c736](https://github.com/Nosto/web-components/commit/516c736e7928ed1bbcebd995376f3c990b326b17))

# [8.20.0](https://github.com/Nosto/web-components/compare/v8.19.1...v8.20.0) (2025-09-03)


### Features

* make Shopify URL creation more precise with dynamic root ([9312673](https://github.com/Nosto/web-components/commit/9312673e457a5de60dec9aec11fed66c19a7c319))

## [8.19.1](https://github.com/Nosto/web-components/compare/v8.19.0...v8.19.1) (2025-09-03)


### Bug Fixes

* align field types with mandatory/optional semantics ([51492ec](https://github.com/Nosto/web-components/commit/51492ec9c2473dbe5dbaab849f183cdf67c5c2ce))
* **Campaign:** make placement mandatory as requested ([3a3ad46](https://github.com/Nosto/web-components/commit/3a3ad46fdc9e101bcbcb94c10b8b108d22372038))
* **Campaign:** make productId optional to align with type semantics ([d58acd0](https://github.com/Nosto/web-components/commit/d58acd0e1aebcb8cbcd21d3bf8710b93254e146e))
* make template and selectedSkuId optional to align with component semantics ([66db5b9](https://github.com/Nosto/web-components/commit/66db5b9d9ada6c320c3f678e7875cf11b8216f28))

# [8.19.0](https://github.com/Nosto/web-components/compare/v8.18.0...v8.19.0) (2025-09-03)


### Bug Fixes

* **package.json:** add dist/ folder path to main, module, and types fields ([945b8b9](https://github.com/Nosto/web-components/commit/945b8b99e00791c6a92d8419b99f23f219cd70f3))


### Features

* add TypeScript type exports for entire module ([102272f](https://github.com/Nosto/web-components/commit/102272fd571564bc0b75f9262fdc29b1e621da43))

# [8.18.0](https://github.com/Nosto/web-components/compare/v8.17.0...v8.18.0) (2025-09-01)


### Features

* drop Nosto prefix from custom element class names ([5ecbc94](https://github.com/Nosto/web-components/commit/5ecbc941fd44febd818c74aa91460aecef9d4a0e))
* drop Nosto prefix from folder names and module names ([44c8f92](https://github.com/Nosto/web-components/commit/44c8f92e8cbaac33151b7e316efde21b904a01d2))
* drop Nosto prefix from test file names ([3fb6544](https://github.com/Nosto/web-components/commit/3fb654431376759cc54c583e324418a1a3745b8c))

# [8.17.0](https://github.com/Nosto/web-components/compare/v8.16.0...v8.17.0) (2025-09-01)


### Features

* introduce simple fetch facade module with getText and getJSON ([b071d0c](https://github.com/Nosto/web-components/commit/b071d0c8388f72906242236a0a0630661b4af7b3))

# [8.16.0](https://github.com/Nosto/web-components/compare/v8.15.0...v8.16.0) (2025-08-29)


### Features

* rename NostoCampaignSection to NostoSectionCampaign ([d363167](https://github.com/Nosto/web-components/commit/d3631673033c94d52a7c7a2e35fe9c9b9d348ced))

# [8.15.0](https://github.com/Nosto/web-components/compare/v8.14.0...v8.15.0) (2025-08-29)


### Features

* add typecheck script and update copilot instructions ([cbef496](https://github.com/Nosto/web-components/commit/cbef496d7b7e59b3f5307209de9d903d6321451b))

# [8.14.0](https://github.com/Nosto/web-components/compare/v8.13.0...v8.14.0) (2025-08-27)


### Bug Fixes

* **lint:** fix Prettier formatting issues in story CSS files and docs ([cda25fa](https://github.com/Nosto/web-components/commit/cda25fa1cb31e387859c322f68f17c9fcd373c5b))


### Features

* **cleanup:** remove dev folder and dependencies after Storybook migration ([4037c1e](https://github.com/Nosto/web-components/commit/4037c1e8c66de85c80242b37e6921415a3906348))
* **cleanup:** remove liquidjs TypeScript shim declaration ([0c6e3f2](https://github.com/Nosto/web-components/commit/0c6e3f2b0dcb4c8ac0608e8eec3f22c310bb42bf))
* **stories:** extract NostoImage story styles to external CSS file ([32af433](https://github.com/Nosto/web-components/commit/32af43389220628d8ab84fa7f963d69300294b50))
* **storybook:** extract NostoProduct story styles to external CSS file ([d1b1e59](https://github.com/Nosto/web-components/commit/d1b1e5975db1e5f766372c8f760044843f1365c3))
* **storybook:** extract NostoSkuOptions stories CSS to external file ([b58ae30](https://github.com/Nosto/web-components/commit/b58ae3010be29fd9293b8d2c0a3f94caae928313))
* **storybook:** register all custom elements globally in preview.ts ([2ded449](https://github.com/Nosto/web-components/commit/2ded449cfd98df9c6e3b94374f4b08beeeabdbd4))

# [8.13.0](https://github.com/Nosto/web-components/compare/v8.12.0...v8.13.0) (2025-08-25)

### Bug Fixes

- resolve merge conflicts after updating branch with main ([c3c1328](https://github.com/Nosto/web-components/commit/c3c132818596e00031223f6fa0cd748d039eefde))

### Features

- convert NostoCampaignSection test to use TSX syntax ([866b4f1](https://github.com/Nosto/web-components/commit/866b4f15c5bdc21ce4edb559d85daa44af1c95d5))
- rename NostoSection to NostoCampaignSection with updated docs ([0eb393f](https://github.com/Nosto/web-components/commit/0eb393fb0080f7f448e17fe2aa8191652a21169e))

# [8.12.0](https://github.com/Nosto/web-components/compare/v8.11.0...v8.12.0) (2025-08-25)

### Features

- remove unpic and thumb functionality from templating context ([0422889](https://github.com/Nosto/web-components/commit/04228893f7c70c839e3e25dbb86fe379fe7fcea9))

# [8.11.0](https://github.com/Nosto/web-components/compare/v8.10.0...v8.11.0) (2025-08-25)

### Bug Fixes

- **tests:** remove unused JSX import from NostoCampaign.spec.tsx ([448d876](https://github.com/Nosto/web-components/commit/448d876df05cac35a538dfc49e25e5bd3f07ccc9))

### Features

- **jsx:** add custom element type definitions and remove type assertions ([282e43b](https://github.com/Nosto/web-components/commit/282e43b32a73f365514eeeaee0d342b5a1c84366))
- **jsx:** update IntrinsicElements to use Partial class types and simplify createElement ([b60bd9b](https://github.com/Nosto/web-components/commit/b60bd9bf2d455e0f4df075edd671eec7038c240e))
- **jsx:** use Partial<NostoCampaign> for attribute type definitions ([4ef959a](https://github.com/Nosto/web-components/commit/4ef959a6e1882f486f366475d80787ee28a7a65b))
- **tests:** add explicit custom element registration using beforeAll ([e48e0dd](https://github.com/Nosto/web-components/commit/e48e0dd09b54e49e269bc6c8c59bd32e8097dcd2))
- **tests:** add type assertions back to JSX elements in test files ([bad7e7e](https://github.com/Nosto/web-components/commit/bad7e7e6995678bacd25f7c6cc1de53488d8318a))
- **tests:** convert NostoDynamicCard.spec.ts to .tsx with JSX patterns ([56268d7](https://github.com/Nosto/web-components/commit/56268d79af276c122ea989e87a25da5e9b76758a))
- **tests:** convert to actual TSX syntax with JSX createElement ([ff7fcc7](https://github.com/Nosto/web-components/commit/ff7fcc7a0fe4892f021777ef6ae0baa64a98aa77))
- **tests:** convert to actual TSX syntax without explicit createElement import ([b9abd05](https://github.com/Nosto/web-components/commit/b9abd05212316a83475182e8dacb29a70709d860))
- **tests:** implement JSX-like syntax for component creation in NostoDynamicCard tests ([f06a575](https://github.com/Nosto/web-components/commit/f06a57502d47267d0ae70e77e88f45a496262449))

# [8.10.0](https://github.com/Nosto/web-components/compare/v8.9.0...v8.10.0) (2025-08-22)

### Features

- drop single placement signature from mockNostoRecs ([80f23e8](https://github.com/Nosto/web-components/commit/80f23e807020a8aaaf6505e577202251d95f41d8))

# [8.9.0](https://github.com/Nosto/web-components/compare/v8.8.0...v8.9.0) (2025-08-22)

### Features

- **test:** replace global.fetch mocking with MSW usage ([0293e7e](https://github.com/Nosto/web-components/commit/0293e7e6c12ed1795b04c82862de433aec3fe306))
- **test:** return 404 response when handler response is falsy ([428de30](https://github.com/Nosto/web-components/commit/428de30eb7e2cd1a2ca7502a2312263a62f8117d))

# [8.8.0](https://github.com/Nosto/web-components/compare/v8.7.0...v8.8.0) (2025-08-22)

### Features

- add NostoSection custom element ([db2c051](https://github.com/Nosto/web-components/commit/db2c05124a7f66238213a3d1396cba931c56d981))

# [8.7.0](https://github.com/Nosto/web-components/compare/v8.6.0...v8.7.0) (2025-08-13)

### Features

- add Dependabot workflow for monthly GitHub Actions SHA updates ([ad84dab](https://github.com/Nosto/web-components/commit/ad84dab0ef139c5f85d0c8976e9a1b5809aa415a))
- update GitHub Actions to latest commit SHAs for enhanced security ([e4d172c](https://github.com/Nosto/web-components/commit/e4d172ceb8db305f19b0e3b5a103e08762eee94e))

# [8.6.0](https://github.com/Nosto/web-components/compare/v8.5.0...v8.6.0) (2025-08-12)

### Bug Fixes

- correct Node.js version reference and remove build artifacts line ([e23bc84](https://github.com/Nosto/web-components/commit/e23bc8418d23f9e23672a8021d9844c825bffbe3))
- remove development server section from Quick Start as requested ([1580f12](https://github.com/Nosto/web-components/commit/1580f12e26369ef4c042fe335cfe7782badc0268))
- remove Node.js installation guidance and version warnings as requested ([1250330](https://github.com/Nosto/web-components/commit/1250330e82a3ee330f135a0940bf63c925a7ea35))
- remove Validation Scenarios and Development Server Details sections ([9dab44e](https://github.com/Nosto/web-components/commit/9dab44e679d73208c7da93b380a1fd7163a57659))

### Features

- expand GitHub Copilot instructions with comprehensive build and development guidance ([0df88fd](https://github.com/Nosto/web-components/commit/0df88fd3a720d20b74840ed154bc75ea951d00f5))

# [8.5.0](https://github.com/Nosto/web-components/compare/v8.4.2...v8.5.0) (2025-08-11)

### Bug Fixes

- **test:** replace any casts with proper Mock type from vitest ([2d3dc8e](https://github.com/Nosto/web-components/commit/2d3dc8e33d26673e9485e79aaaca7d33bbb69ba1))

### Features

- **NostoCampaign:** add lazy loading with IntersectionObserver ([a068536](https://github.com/Nosto/web-components/commit/a068536b9cab4acca758fbeebaa0b18b0e96a2ad)), closes [#222](https://github.com/Nosto/web-components/issues/222)

### Reverts

- remove non-conventional commits to start fresh ([69e2dcc](https://github.com/Nosto/web-components/commit/69e2dcc9b075fcf533fba01e02f5858ab793d135))

## [8.4.2](https://github.com/Nosto/web-components/compare/v8.4.1...v8.4.2) (2025-08-07)

### Bug Fixes

- handle template elements correctly ([7779bf3](https://github.com/Nosto/web-components/commit/7779bf3a97793c5b841458742258fc309e16795d))

## [8.4.1](https://github.com/Nosto/web-components/compare/v8.4.0...v8.4.1) (2025-08-06)

### Bug Fixes

- drop flags usage ([916e2bc](https://github.com/Nosto/web-components/commit/916e2bcf8af0e0961133840d471dfd665a7812d4))
- improve segments access ([b45086e](https://github.com/Nosto/web-components/commit/b45086eb7f2bd1b3332157d02fb7a99bc986cd92))

# [8.4.0](https://github.com/Nosto/web-components/compare/v8.3.0...v8.4.0) (2025-08-05)

### Features

- combine requests ([80f5eef](https://github.com/Nosto/web-components/commit/80f5eef730f520e19d132c609026f49f020adacf))

# [8.3.0](https://github.com/Nosto/web-components/compare/v8.2.0...v8.3.0) (2025-08-04)

### Features

- support for template rerendering ([6f54202](https://github.com/Nosto/web-components/commit/6f54202c3e2a003fd2beef4798d16f30cfd9695b))

# [8.2.0](https://github.com/Nosto/web-components/compare/v8.1.0...v8.2.0) (2025-07-18)

### Features

- create NostoControl for conditional rendering ([6ef28f0](https://github.com/Nosto/web-components/commit/6ef28f0bf063d5a232e6b6e2e7be4f1d4883227f))

# [8.1.0](https://github.com/Nosto/web-components/compare/v8.0.1...v8.1.0) (2025-07-18)

### Features

- support sections in addition to custom templates ([2126753](https://github.com/Nosto/web-components/commit/212675361af5cfd022e3fbfcea48b74dae16ef24))

## [8.0.1](https://github.com/Nosto/web-components/compare/v8.0.0...v8.0.1) (2025-07-14)

### Bug Fixes

- use id as alias for placement ([fb48c39](https://github.com/Nosto/web-components/commit/fb48c39f9363d22a7234cdbdeeca678b3f857d9f))

# [8.0.0](https://github.com/Nosto/web-components/compare/v7.12.1...v8.0.0) (2025-07-14)

### Features

- normalize context to camelCase ([74a4ca3](https://github.com/Nosto/web-components/commit/74a4ca39e6cb50f67eb3aa92c24b95d1d76e5528))

### BREAKING CHANGES

- snake case to camel case context treatment

## [7.12.1](https://github.com/Nosto/web-components/compare/v7.12.0...v7.12.1) (2025-07-14)

### Bug Fixes

- hide attributes from typedoc ([2e45f99](https://github.com/Nosto/web-components/commit/2e45f99a8c92050fa681ca5532705a6b5a3b4e5c))

# [7.12.0](https://github.com/Nosto/web-components/compare/v7.11.0...v7.12.0) (2025-07-09)

### Features

- extend template context ([3cf8e9c](https://github.com/Nosto/web-components/commit/3cf8e9c8509594e471a929c9c9b1ad041f8d9c90))

# [7.11.0](https://github.com/Nosto/web-components/compare/v7.10.0...v7.11.0) (2025-07-09)

### Features

- add attribute change listeners ([5a22b18](https://github.com/Nosto/web-components/commit/5a22b18f9619c703351296f8533535686ed69538))

# [7.10.0](https://github.com/Nosto/web-components/compare/v7.9.0...v7.10.0) (2025-07-08)

### Features

- add v-on support ([5b0d40b](https://github.com/Nosto/web-components/commit/5b0d40b17240b633b17a9668b46d0dd59b361e3f))
- expose NostoImage ([de60350](https://github.com/Nosto/web-components/commit/de60350b770403fcddeff55e70a28c865beb048a))

# [7.9.0](https://github.com/Nosto/web-components/compare/v7.8.1...v7.9.0) (2025-07-08)

### Features

- add support for template children ([68b3b69](https://github.com/Nosto/web-components/commit/68b3b6905bcf2f84b214006adc7ced19f27d5669))

## [7.8.1](https://github.com/Nosto/web-components/compare/v7.8.0...v7.8.1) (2025-07-08)

### Bug Fixes

- move components to folders ([b213f11](https://github.com/Nosto/web-components/commit/b213f11969cbb081efea8b79c9af7189a05fdc41))

# [7.8.0](https://github.com/Nosto/web-components/compare/v7.7.1...v7.8.0) (2025-07-07)

### Features

- replace liquid and handlebars with vue templating ([baa63c4](https://github.com/Nosto/web-components/commit/baa63c49944117eec07a434caa655afbb3d2e462))

## [7.7.1](https://github.com/Nosto/web-components/compare/v7.7.0...v7.7.1) (2025-07-04)

### Bug Fixes

- extend from NostoElement ([438025d](https://github.com/Nosto/web-components/commit/438025dca00c0db6c7ebd19da60a7c3446a8a743))

# [7.7.0](https://github.com/Nosto/web-components/compare/v7.6.1...v7.7.0) (2025-07-04)

### Bug Fixes

- address comment and fix checkRequired ([7d05a37](https://github.com/Nosto/web-components/commit/7d05a3793c6dedb8059aca228a081e5b358195a9))
- address lint ond improvements ([aed18b7](https://github.com/Nosto/web-components/commit/aed18b72216eb7427835b64071775bbb7075e611))
- exclude main.ts from test coverage ([f10cfd8](https://github.com/Nosto/web-components/commit/f10cfd851dbc44ac804174be69dbcff2a4458081))
- import types ([5ad440a](https://github.com/Nosto/web-components/commit/5ad440abc9d65abb8215c698b200162ee7bc7e15))
- use attribute binding instead of property binding ([615d5d7](https://github.com/Nosto/web-components/commit/615d5d7f8308e20541739f702dab49512c9d5cf6))

### Features

- introduce NostoImage component for rendering responsive images ([745a354](https://github.com/Nosto/web-components/commit/745a354ddacf6baf8808c4c61b3d77c4c4058ba9))

## [7.6.1](https://github.com/Nosto/web-components/compare/v7.6.0...v7.6.1) (2025-07-02)

### Bug Fixes

- move logFirstUsage to superclass ([49d242b](https://github.com/Nosto/web-components/commit/49d242b0ae40f0cab298d62e9a23324770c9898f))

# [7.6.0](https://github.com/Nosto/web-components/compare/v7.5.0...v7.6.0) (2025-07-02)

### Bug Fixes

- clean up ([a017fa9](https://github.com/Nosto/web-components/commit/a017fa90f36215bf77fb02f3a5859ed4ed5859b2))
- clean up ([0f2afc5](https://github.com/Nosto/web-components/commit/0f2afc5ebe085416367b4dd36b48296ea5e2babe))
- clean up ([468791c](https://github.com/Nosto/web-components/commit/468791c3de707a4f459503ca5978f9613107861f))
- reorder assertRequired ([c5a078c](https://github.com/Nosto/web-components/commit/c5a078c6394f4381c43c4aca7def99da758679b5))
- update after review ([9ab6516](https://github.com/Nosto/web-components/commit/9ab6516fab72f5c7d6ece0f0f14d3f71aa1f10a3))
- update after review ([106cb2a](https://github.com/Nosto/web-components/commit/106cb2aa45fdfb3caf26786bfd2ded787a5ce841))
- update after review ([8d4c0ee](https://github.com/Nosto/web-components/commit/8d4c0eef15975376909dea750a32e5dce56e575c))

### Features

- add logging ([d7d9078](https://github.com/Nosto/web-components/commit/d7d90785600531af3756f7c4b7de5ae2a7e268f0))
- log the first instantiation of any component ([d64c298](https://github.com/Nosto/web-components/commit/d64c298583d9524c27c78b3a19e1fecf9b9f9778))
- persist logged status in localStorage ([16c63ab](https://github.com/Nosto/web-components/commit/16c63ab87909c100b764a32006a9e8fe0c224595))

# [7.5.0](https://github.com/Nosto/web-components/compare/v7.4.3...v7.5.0) (2025-06-12)

### Bug Fixes

- update test ([312ce42](https://github.com/Nosto/web-components/commit/312ce428a91cd183c1bfa0bfb2692b351209c660))
- updates ([ef7619e](https://github.com/Nosto/web-components/commit/ef7619e0fffe8d57387cf70fd22a845ba062f4e8))
- updates ([aadb43a](https://github.com/Nosto/web-components/commit/aadb43acfd09ced3e15e816e56b0d549d58d9710))

### Features

- support init false to defer campaign loading ([aea1c1d](https://github.com/Nosto/web-components/commit/aea1c1d3c15f4f50ac1f31b591250eec72840ced))
- update injection logic ([0b4a0d8](https://github.com/Nosto/web-components/commit/0b4a0d8a50bfc30a6fb9140adf9d25a254b8df25))

## [7.4.3](https://github.com/Nosto/web-components/compare/v7.4.2...v7.4.3) (2025-06-12)

### Bug Fixes

- add flags to call ([851bfd9](https://github.com/Nosto/web-components/commit/851bfd9c7704e83c5436a771a029c2974fd58674))

## [7.4.2](https://github.com/Nosto/web-components/compare/v7.4.1...v7.4.2) (2025-06-11)

### Bug Fixes

- expose NostoCampaign ([d11224e](https://github.com/Nosto/web-components/commit/d11224e23bb290d4d7428f9606e853a71d8c2b5d))

## [7.4.1](https://github.com/Nosto/web-components/compare/v7.4.0...v7.4.1) (2025-06-11)

### Bug Fixes

- minor adjustments ([62d0253](https://github.com/Nosto/web-components/commit/62d02533b93261fec974a95270566e6835fb5c9f))

# [7.4.0](https://github.com/Nosto/web-components/compare/v7.3.0...v7.4.0) (2025-06-11)

### Bug Fixes

- updates ([b167608](https://github.com/Nosto/web-components/commit/b16760892c4640d1a0ea96b171b91822ad603685))
- updates ([aa58a01](https://github.com/Nosto/web-components/commit/aa58a0162e1e5639cb5081456b5fc695e7787e34))
- updates after review ([14aa00c](https://github.com/Nosto/web-components/commit/14aa00cbecf0bb7b24eea9048aa009238b4e82ad))

### Features

- fetch JSON results and use templating ([dde82c5](https://github.com/Nosto/web-components/commit/dde82c5bc5a277e55260bfb22121d6d5f954a1a9))

# [7.3.0](https://github.com/Nosto/web-components/compare/v7.2.0...v7.3.0) (2025-06-10)

### Bug Fixes

- clean up ([a5f147f](https://github.com/Nosto/web-components/commit/a5f147fb7c72bcf51efeab973c983695ffba29ca))
- disable auto-injection and assign innerHTML manually ([5b07203](https://github.com/Nosto/web-components/commit/5b07203b896d2bba949de9e10457d144ae4ccc0b))
- fixes ([f800f8e](https://github.com/Nosto/web-components/commit/f800f8efa9f204d04720dfb16efc28dc4903607e))
- move loadCampaign back to component and drop unreachable spy test ([af8595c](https://github.com/Nosto/web-components/commit/af8595c5ae9a3096443391c4be531a59ff80074b))
- remove constructor and simplify attribute handling ([04f2309](https://github.com/Nosto/web-components/commit/04f230919ddf5644078a5c75300929c3b8517b34))
- test alignment ([7375f29](https://github.com/Nosto/web-components/commit/7375f29f3f1e71a500be8dc8eb03d0ddbc154cfd))
- updates ([519cd82](https://github.com/Nosto/web-components/commit/519cd8223816489cbb5e6fb531d5252d6b007e5e))
- updates ([9212ffd](https://github.com/Nosto/web-components/commit/9212ffd770442e5b291546bf12f25e223fc1ef59))
- updates ([1f5d5e3](https://github.com/Nosto/web-components/commit/1f5d5e32387c6bd85eff979c07907898a8684917))
- updates ([66f14d7](https://github.com/Nosto/web-components/commit/66f14d7bea621b12cac2f0d4362f0ad72794699e))
- updates ([0e74b02](https://github.com/Nosto/web-components/commit/0e74b02f1d3431f2401eaa639692123d1d5f0084))

### Features

- add NostoCampaign component ([9383663](https://github.com/Nosto/web-components/commit/9383663f946bfe4c35d48e9b60ed434c9162162d))

# [7.2.0](https://github.com/Nosto/web-components/compare/v7.1.0...v7.2.0) (2025-06-10)

### Features

- add support for placeholder content ([9780cce](https://github.com/Nosto/web-components/commit/9780cce294b1693c55d693b645af1663ae7cc5d0))

# [7.1.0](https://github.com/Nosto/web-components/compare/v7.0.0...v7.1.0) (2025-06-09)

### Features

- add lazy loading support ([debdf24](https://github.com/Nosto/web-components/commit/debdf24f3fff52b76aa9b39710bbb83bc55f538d))

# [7.0.0](https://github.com/Nosto/web-components/compare/v6.0.0...v7.0.0) (2025-06-02)

- feat!: remove NostoSwiper ([b1112b1](https://github.com/Nosto/web-components/commit/b1112b14284834230bf1a52281247be185ab288e))

### BREAKING CHANGES

- NostoSwiper removal

# [6.0.0](https://github.com/Nosto/web-components/compare/v5.0.0...v6.0.0) (2025-05-12)

### Features

- add NostoDynamicCard ([12a885c](https://github.com/Nosto/web-components/commit/12a885ce224873690b2c2aeef6af36af44266473))
- simplify NostoProductCard ([8e0b3b3](https://github.com/Nosto/web-components/commit/8e0b3b332df372d87e35f7cd65d3e9ee934796d7))

### BREAKING CHANGES

- dropping wrap and recoId property handling

# [5.0.0](https://github.com/Nosto/web-components/compare/v4.1.0...v5.0.0) (2025-05-07)

### Features

- remove NostoShopify ([f568b38](https://github.com/Nosto/web-components/commit/f568b3836d084abae4b8131b3b2fb254e39ae5e5))

### BREAKING CHANGES

- NostoShopify support dropped

# [4.1.0](https://github.com/Nosto/web-components/compare/v4.0.0...v4.1.0) (2025-04-29)

### Features

- add extended SKU data support ([9ad386f](https://github.com/Nosto/web-components/commit/9ad386ff67bd5e6f5214d360200135172e3f61e5))

# [4.0.0](https://github.com/Nosto/web-components/compare/v3.4.2...v4.0.0) (2025-04-22)

- fix!: adjust attribute prefixes ([4ffb1b3](https://github.com/Nosto/web-components/commit/4ffb1b32edfe701a55c21f5428dcc3bf8690035a))

### Features

- add price mapping ([3314638](https://github.com/Nosto/web-components/commit/3314638e26e685df5cd33ed2a66c65ba8ecee6d6))

### BREAKING CHANGES

- ns- prefix changed to n-

## [3.4.2](https://github.com/Nosto/web-components/compare/v3.4.1...v3.4.2) (2025-04-22)

### Bug Fixes

- use regex for template language match ([7c23982](https://github.com/Nosto/web-components/commit/7c239827373a293f9dc5e9fbe16269c2ce7e1de0))

## [3.4.1](https://github.com/Nosto/web-components/compare/v3.4.0...v3.4.1) (2025-04-16)

### Bug Fixes

- use official template script types ([bec9dc6](https://github.com/Nosto/web-components/commit/bec9dc6bac3b9c1730c692512962f85bdfad7384))

# [3.4.0](https://github.com/Nosto/web-components/compare/v3.3.0...v3.4.0) (2025-04-16)

### Features

- load Swiper CSS ([9398343](https://github.com/Nosto/web-components/commit/9398343a67bd0bad2fbc1947012aa53e4d9d32b8))

# [3.3.0](https://github.com/Nosto/web-components/compare/v3.2.0...v3.3.0) (2025-04-15)

### Features

- support ATC on SKU option ([b77779b](https://github.com/Nosto/web-components/commit/b77779be9617ae9e313e8b65932af6a0f902ca25))

# [3.2.0](https://github.com/Nosto/web-components/compare/v3.1.0...v3.2.0) (2025-04-14)

### Features

- support for nested swiper usage ([daa82ff](https://github.com/Nosto/web-components/commit/daa82ff0de166c527096011db16d7c9ab113b9ee))
