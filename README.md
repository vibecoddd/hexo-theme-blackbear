# hexo-theme-blackbear

A simple theme for Hexo inspired by [even](https://github.com/ahonn/hexo-theme-even) and [PAULO ANDRADE's BLOG](https://pfandrade.me/)

[ Live Preview](https://lwchannel.com)

## How To Use It
Run the comand-lines below:
```bash
npm install hexo-renderer-ejs hexo-renderer-dartsass --save
git clone https://github.com/blackbear03/hexo-theme-blackbear themes/blackbear
cp themes/blackbear/_config.yml.example themes/blackbear/_config.yml
```

Modify `yoursite/_config.yml`:

```yaml
# Extensions
## Plugins: http://hexo.io/plugins/
## Themes: http://hexo.io/themes/
theme: blackbear
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: 'git'
  repo: https://<your private token>@github.com/<your github name>/<your github name>.github.io.git
  branch: master
  message: Happy writing :)
```
