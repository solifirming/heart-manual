# 心动说明书

18 道原创情境题，探索恋爱相处方式。手机和桌面均可使用。

## 在线体验

https://heart-manual-liard.vercel.app/

备用地址：https://solifirming.github.io/heart-manual/

## 功能

- 三个维度，组合得到八类原创恋爱人格。
- 上一题、修改答案、刷新恢复进度、重新测试确认。
- 答完即显示完整分析，包括六个报告章节；支持复制摘要。
- 免费阅读，无收费页面或解锁步骤。
- 答题进度仅保存在当前浏览器。

原创娱乐测试，不作为心理诊断。

## 开发与验证

网站文件位于 `docs/`，题库与报告内容在 `docs/data.js`，界面逻辑在 `docs/app.js`。

使用任意静态服务器预览 `docs/`。执行 `node verify.mjs` 验证计分与核心答题流程。

Vercel 和 GitHub Pages 均从 `main` 分支的 `docs` 目录发布，推送更新后自动重新发布。

字体为得意黑（Smiley Sans），许可证保存在 `docs/fonts/LICENSE.txt`。