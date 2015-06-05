---
layout: post
published: true
title: Safari 插件 QQ 旋风离线导出至 Aria2
category: Tech
tags: [Safari, Aria2, OSX]
---

前两天写了一个 Safari 扩展。可以从QQ旋风离线空间里导出文件到 Aria2 下载。

买不起迅雷会员，所以一直用着QQ旋风的离线下载。Mac上又没有可以下载旋风离线文件的客户端，也没见到支持导入 Cookies 的图形化下载工具，所以只能导入的 Aria2 里下载。

在 Chrome 上我一直用[这个扩展](https://chrome.google.com/webstore/detail/mblmc%E8%BF%85%E9%9B%B7%E7%A6%BB%E7%BA%BFqq%E6%97%8B%E9%A3%8E%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98360%E4%BA%91%E7%9B%98%E7%AD%89ar/iamaphkapjbdhhpdapkalhanifedeged)。

但是 Safari 上没有类似的扩展，也试了用 [NinjaKit](https://github.com/os0x/NinjaKit) 来装 UserScript ，却不起作用。

于是自己写了这个扩展。就只是很简单的调用了[这个 UserScript](https://github.com/rhyzx/xuanfeng-userscript)。

- [Github](https://github.com/songchenwen/safari_xuanfeng_lixian_exporter)
- [Download](https://github.com/songchenwen/safari_xuanfeng_lixian_exporter/releases/download/v0.1/safari_xuanfeng_lixian_exporter.safariextz)