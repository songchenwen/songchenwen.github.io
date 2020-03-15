---
layout: post
published: true
title: Hammerspoon, OS X 上的全能窗口管理器
category: Tech
tags: [OSX, Lua]
redirect_from: "/tech/2015/04/02/hammerspoon-mac-window-manager/"
---

虽然 Mac 的触摸板很方便，但手指尽量少离开键盘区，仍然是提高效率的好方式。

OS X 上的快捷键很多，也很实用，很多操作只靠键盘就能完成的很好。但一旦涉及窗口管理的时候，就要把手指挪到触摸板上操作了。而我平时最常使用的窗口操作无非就是这几样：切换应用程序、把一个窗口在不同的显示器间移动、最大化窗口、并排排列两个窗口。这些简单的任务，如果都能绑定上快捷键就好了。

[Hammerspoon](http://www.hammerspoon.org) 就是这样一款可高度定制的窗口管理器。

我以前用的是 [Slate](https://github.com/jigish/slate) 作为窗口管理器。但是这货已经有两年多没更新过了，看起来是已经被抛弃了。而且 Slate 又有一些顽固的 Bug。于是我切换到了 Hammerspoon。

Hammerspoon fork 自 [mjolnir](http://mjolnir.io)，但比 mjolnir 更加易用，更像一个成型的产品，需要折腾的东西也更少一些。

<!-- more -->

[下载](https://github.com/Hammerspoon/hammerspoon/releases/latest)好 Hammerspoon 后，把它拖到 `Application` 目录下，运行它，赋予它 `Accesibility` 权限。之后就可以开始写自己的配置脚本了。

Hammerspoon 的配置脚本基于 Lua，脚本语言其实都相通，这里有一篇 [Learn Lua in Y minutes](http://learnxinyminutes.com/docs/lua/)，大致看一下就能知道怎么写了。

打开 `~/.hammerspoon` 目录，创建 `init.lua` 文件。

可以先试一个简单的 `Hello World`。

~~~ lua

hs.hotkey.bind({'cmd', 'shift'}, 'h', function() 
	hs.alert('Hello World') 
end)

~~~

保存之后，`Reload Config` 一下，然后按键盘上的 `command` + `shift` + `h`，屏幕上就会出现一个 `Hello World` 的字样，过一会就会自动消失。

Hammerspoon 是一个插件化的程序，像 `hs.hotkey` 和 `hs.alert` 这些都是 Hammerspoon 所集成的插件。其它还有很多插件，可以在[这里](http://www.hammerspoon.org/docs/)找到详细的文档。

下面来写点更实用的配置。

- 快捷键切换到 QQ
- 当前窗口铺满屏幕的快捷键
- 当前窗口切换显示器的快捷键

~~~ lua

local hyper = {'ctrl', 'alt', 'cmd'}
local hyperShift = {'ctrl', 'alt', 'cmd', 'shift'}

-- hyper + Q switch to QQ
hs.hotkey.bind(hyper, key, function() hs.application.launchOrFocus('QQ') end)

-- hyper + up maximize the current window
hs.hotkey.bind(hyper, 'up', function()
    hs.grid.maximizeWindow() 
end)

-- hyper + shift + left move the current window to the left monitor
hs.hotkey.bind(hyperShift, 'left', function() 
    local w = hs.window.focusedWindow()
    if not w then 
        return
    end
    local s = w:screen():toWest()
    if s then
        w:moveToScreen(s)
    end
end)

-- hyper + shift + right move the current window to the right monitor
hs.hotkey.bind(hyperShift, 'right', function() 
    local w = hs.window.focusedWindow()
    if not w then 
        return
    end
    local s = w:screen():toEast()
    if s then
        w:moveToScreen(s)
    end
end)

~~~

这个配置中的 hyper 键，其实是把 `ctrl` + `alt` + `command` 的修饰键组合映射到了 `caps lock` 上。方法来自[这篇文章](http://stevelosh.com/blog/2012/10/a-modern-space-cadet/)。

Hammerspoon 使用脚本语言来操作 OS X 的系统 API。使很多自动化操作成为可能。

我自己目前使用的配置文件，已经实现了下面这些功能。

- 快捷键切换一系列常用应用。
- 当前窗口铺满屏幕。`hyper` + `up`
- 把当前窗口移动到另一显示器。`hyper` + `shift` + `left` or `right` 
- 左右调整当前窗口，用来并排排列两个窗口。`hyper` + `left` or `right` 
- 专门排列当前应用窗口模式。`hyper` + `down` 进入模式。模式中 `left`, `right` 调整窗口。`up`, `down` 切换当前窗口。
- 窗口切换 hints。`hyper` + `h`
- 撤消窗口操作。`hyper` + `z`
- 应用启动或者插上/拔下外接显示器时自动按配置调整窗口到常用位置。
- 防止系统休眠。`hyper` + `shift` + `c`

[这里是我的配置文件](https://github.com/songchenwen/dotfiles/tree/master/hammerspoon)。将来很可能会逐渐具备更多功能。
