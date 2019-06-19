# review recorder

使用 chrome 插件追踪 GitHub PR review 记录，并把数据存放在 Google Spreadsheet。

## 为啥要搞这个

最近公司项目组推行了一个规定：周报里面要把 Review 过的 PR 填上。作为有尊严的程序员，我们肯定是想自动化地来做。可惜试了下 GitHub 的 API 之后发现有几个蛋疼的问题，主要是如果 review 完了没有 comment 直接 approve 的话查不到记录（其实能，但是会很麻烦）。

于是我就想搞个 chrome 插件来统计，有个额外的 bonus 是可以（粗略）统计 review 每个 PR 花的时间，当然了最主要的原因是我没写过 chrome 插件，想玩一玩。

另外一个问题是，我会用多个电脑工作，很自然地需要一个服务器来同步数据，也为了好玩点，我决定把数据给存在 Google Spreadsheet 上。

## 怎么做的

先说一下 chrome 插件部分，大体上就是判断是 Pull Request 页面后触发一个定时器，每分钟检查一下，如果在 review 就把相关信息 POST 到服务端记条日志。判断在 review 的标准是一分钟内在 /pull/xxx/files 页面有过点击鼠标，或者按键，或者 scroll 操作。另外点击插件 icon 的时候打开一个新 tab 查询 review 统计信息，默认查最近一周的记录（包含当天）。

Spreadsheet 这边就是一空白的表格加两段 Google App Script。`doPost` 负责接收 review 记录，记在表格里。`doGet` 负责汇总一段时间内的记录。

## 手把手安装教程

第一步，用 [这个链接](https://docs.google.com/spreadsheets/d/12w6E9IZsLP58mYbqjE-cOaVtIx--UIocuGM_MihIWdI/copy) 创建一份 SpreadSheet 副本。标题可以随便改一个你认为合适的名字。

第二步，打开“脚本编辑器”，可以看到我写好的 App Script。不用管代码，直接“部署为网络应用”。注意，“项目版本”选“新建”，“有权使用该应用的人”选择“任何人（甚至匿名）”。这时会看到需要授权的提示，需要我们授予脚本访问表格数据的权限，点击查看。然后会看到提示“应用未经过验证”，点击“高级” - “转到 recorder server（不安全）”，最后选择“允许”进行授权。到这里如果一切正常的话，会看到已部署为网络应用的提示，把应用的网址拷贝下来。

第三步，准备 chrome 插件。你需要把这个项目 clone 或下载到本地。编辑 `chrome-extension/config.js` 文件，把 SCRIPT_APP_URL 改成刚才复制的 URL，把 IGNORE_AUTHOR_ID 改成你自己的 GitHub ID（这个是为了防止自己的 PR 被记录），RECORD_INTERVAL 是上报的间隔一般不用改。

第四步，安装插件。打开[插件页面](chrome://extensions/)，点击“加载已解压的扩展程序”，选择 `chrome-extension` 目录进行安装，成功后如图。

这样就完成了，PR review 历史会被自动记录在 SpreadSheet 里，点击插件的图标可以看到最近一周的统计。
