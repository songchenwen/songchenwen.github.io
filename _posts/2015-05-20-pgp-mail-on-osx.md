---
layout: post
title: 防篡改防偷窥，OS X 上发送 PGP 加密邮件
category: Tech
---

研究比特币的人一定都听说过 PGP 加密邮件通讯。传说中本聪和小伙伴们发邮件都是要用 PGP 加密的。就连这几天热门的 [CZ vs OKCoin](https://www.reddit.com/r/Bitcoin/comments/37tm1b/czs_statement_regarding_the_dispute_between/) 事件里，PGP 也来参与客串了一把。

使用 PGP 加密的邮件通讯，使得邮件接收者可以确信这封邮件是由谁发送的，并且未经篡改，也使得邮件发送者可以确信自己发出的邮件只有对应的接收者一个人能够阅读。

那么在 OS X 上我们如何方便的使用 PGP 加密邮件通讯呢？

<!-- more -->

## 安装

首先要安装 [GPG Suite](https://gpgtools.org)。这是一组用来帮助我们做 PGP 相关操作的工具集合。

如果你用 [Homebrew](http://brew.sh) 的话，只需要执行一行命令就能安装好 GPG Suite 了。

~~~ bash
brew install Caskroom/cask/gpgtools
~~~

如果你不用 Homebrew，那么 [这里](https://gpgtools.org) 能够下载到 GPG Suite 的安装文件。

## 添加自己的密匙

安装好 GPG Suite 后，Launchpad 里就会多出来一个叫 GPG Keychain 的 app。打开它，先添加一个用来代表自己身份的密匙。

点击界面左上角的`新建`钮，会弹出生成新密匙对的窗口。在全名和 Email 处分别填上自己的信息。全名不能少于 5 字符，所以中文名是不行了。Email 就是自己要用来进行加密通信时所用的邮箱地址。勾上 `Upload public key`，这样别人通过你的邮箱地址就能直接找到你的公匙了。

![](/images/pgp-mail-on-osx/1.png)

## 设置快捷键

GPG Suite 会在系统里安装一些 OpenPGP 相关的服务。我们可以给他们设置好快捷键来方便我们使用。

打开 `系统偏好设置` -> `键盘` -> `快捷键` -> `服务`。我们主要设置文本相关的快捷键。我的设置如下图。配合 [Hyper 键](/tech/2015/04/02/hammerspoon-mac-window-manager/) 使用很方便。

![](/images/pgp-mail-on-osx/2.png)

## 发送邮件

发送邮件时，一般要进行签名和加密两个步骤。

签名使对方可以验证邮件的发送者，并能确保邮件未被篡改。加密可以保证只有邮件接收者才能阅读这封邮件，其他人即使拦截到这封邮件也无法阅读其内容。

在实际使用中，我们也可以根据自己的需求选择只执行这两个步骤中的一步。

### 签名

在撰写邮件的窗口中，选中我们写好的邮件全文，用快捷键或者右键调用 `OpenPGP: Sign Selection`，输入口令，点 `OK`。邮件的签名就会自动加好了。

这里需要注意的是，我们这种方式只能签名纯文本。有格式的文本在签名后会丢失格式。

### 加密

给邮件加密时，我们需要知道对方的公匙，这样对方才能用自己的私匙来解密邮件。

打开 GPG Keychain 点击 `Lookup Key`，输入对方的邮箱地址，就会在服务器上搜索对方的公匙。如果对方曾经上传过公匙，那我们找到后取回就可以了。如果对方上传过多个公匙，一般我们用最新的一个就好了。如果对方没有上传过自己的公匙的话，那我们只能联系对方让他上传公匙或者把公匙直接发给我们了。

把对方的公匙加入了 GPG Keychain 后，就可以退出它了。

再回到撰写邮件的窗口中，选中邮件全文(如果签名过，就也包含签名的信息)，用快捷键或者右键调用 `OpenPGP: Encrypt Selection`，在弹出的窗口中勾上收件人。如果要发邮件给多个人，这里也可以多选。点 `OK` 后，邮件就变成密文了。

现在我们终于可以放心地把这封写有我们秘密的邮件发出去了。

## 接收邮件

当我们收到一封以 `----BEGIN PGP MESSAGE----` 开头的邮件时，我们就知道自己收到了一封 PGP 加密的邮件了。

如果邮件是以 `-----BEGIN PGP SIGNED MESSAGE-----` 开头的，那说明这封邮件里带了 PGP 签名。

### 解密

解密 PGP 密文，只需要选中全部密文(包含 `----BEGIN PGP MESSAGE----` 和 `-----END PGP MESSAGE-----`)，用快捷键或右键调用 `OpenPGP: Decrypt Selection`，输入口令，就能看到解密后的明文了。

当然只有在我们拥有对应的私匙时才能进行解密。

### 验证签名

选中消息和它的签名(从 `-----BEGIN PGP SIGNED MESSAGE-----` 到 `-----END PGP SIGNATURE-----`)，用快捷键或右键调用 `OpenPGP: Verify Signature of Selection`，在弹出的对话框中我们就能看到签名者的信息了。

> 我的邮箱已经放在前面的截图里了，不妨发给我一封 PGP 加密的邮件试试吧。
