---
layout: post
title: 利用Github和Heroku远程发表Hexo文章
categories: 
  - Tech
tags: 
  - Heroku
  - Hexo
---

> 我现在已经不用 Hexo 了。
> 对于自动发布来说，[Travis-CI](https://travis-ci.org) 会是一个更好的选择。

使用[Hexo]这种静态博客程序搭建博客时，始终会遇到一个问题，要写博客就必须有一台环境配置好的电脑才行。想用手机和平板发文章，就会遇到各种问题。

看到了[Yu-Zhi Chen](http://kywk.github.io/)的[hexo-migrator-dropbox](http://kywk.github.io/hexo-migrator-dropbox/)，但苦于地域限制，很难发挥它的作用。

于是开发了[hexo-migrator-issue]和[hexo-heroku-auto-publisher]，顺便为最近要开始的前端项目练练手。这两个插件配合[Heroku]和Github issues提供的免费服务，即可实现远程发表[Hexo]文章的功能。

以下步骤基于已搭建好[Hexo]环境并且有Github Pages项目的前提。

<!-- more -->

#准备项目

##安装[hexo-heroku-auto-publisher]

在Hexo项目目录下执行

~~~ bash
$ npm install hexo-heroku-auto-publisher --save
~~~

这个插件不需要配置，它的作用就是在你的项目里添加一些上传到[Heroku]时所需要的文件。

##转换项目

安装好[hexo-heroku-auto-publisher]后，在[Hexo]项目目录下执行

~~~ bash
$ hexo mp
~~~

等执行完成后你会看到自己的项目里多出了`app.js`和`Procfile`这两个文件。如果你能看到隐藏文件的话还会看到`.ssh`文件夹合理面包含的三个文件。

让我们看看刚才这个命令的执行过程中都发生了什么：

* 下载了`app.js`，`Procfile`，`.ssh/known_hosts`这三个文件
* 为你生成了一个新的ssh key，用来给[Heroku]向你的[Github]项目提交内容的权限。
* 为你安装了[hexo-migrator-issue]插件
* 为你的项目添加了`async`，`body-parser`，`express`，`hexo`这四个依赖。

##保存ssh key

在刚才转换项目的过程中，有一段输出是值得我们注意的。类似下面这样。

~~~
Add the following ssh key to https://github.com/settings/ssh 

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDAOJXk9uTTwEGw89pET3X7C5ZQSZ76ENNYuamoO+AhMO3xlommwuqFzkKZX7ijWVAhaJ6dfuetpSFVAiSLQsHaEWH/ZLzLD9h+grhrkuk/wUyArn8IXe7hwTKl6fbTzrnZpY8I9FrQOk72cGiq82oLnBpnA1DIHvAQL1c/oIBZpZXWni70N1AOJ5qw4s9H2lqK7p53JLWtx/dEZtBCIvcSCqDrZpVgwQPgzfIdbaD2aB0j6KQKrsQlszj1s/svFzfdv6s1imc6NsA+IxpShH+2c9jbMU2NyEKEnM1ipOyPoFjCHTQ1ufBd5vT8M9nwVoHbpuOhSttBM6HHXWmhPFmp ww@localhost
~~~

这里打印出了我们要添加到[Github]上的ssh key，让我们先把它复制出来保存一下吧。

##修改配置文件

按照下面的格式修改配置文件

~~~ yaml
issue_migrator :
    repository_name : repository.github.io  
        # 这个Github项目的issue会被当做文章(必填)
                                             
    owner_name : someone                     
        # 上面那个项目的创建者的用户名 (必填)
                                             
    label : blog            
        # 只有打了这个标签的issue才会被当做文章
        # 留空这一项的话意为着所有的issue都会被当做文章
        # 默认空
                                             
    issue_count_per_page : 20
        # 每次API请求中包含多少issue 默认 20
    
    clean : true
        # 这项如果为true的话，每次执行issue_migrator都会先删掉之前所有的文章
        # 如果为false，则只会添加文章不会删除文章
        # 只有当你项目里所有之前的文章都转移到issue里之后才应该设为true
        # 默认 false
    
    including_closed : false
        # 一般我们把issue close了就以为这要把它从博客上删除了
        # 如果是true，那么close了的issue也不会被认为是删除了的
        # 默认 false
        
heroku_auto_publisher :
    sender_name : songchenwen
    	# 当这个Github用户名未这一项的用户
    	# 对上面的repository产生issue操作时
    	# 才会触发issue_migrator
    	# 留空的话就是所有人的操作都会触发
    	# 默认空
    	
    commit_user_name : songchenwen
    	# 自动发表文章时你希望Github上显示的commit用户名
    	
    commit_user_email : emptyzone.0@gmail.com
    	# 自动发表文章时你希望Github上显示的commit用户email
~~~

以上这些步骤完成后，我们就已经准备好要部署到[Heroku]上的项目了。

#创建[Heroku] App

##注册

如果你还没有Heroku的账户的话，就先去[这里](https://id.heroku.com/signup)注册吧。

##安装heroku-toolbelt

Heroku toolbelt是你在本地操作Heroku Apps的客户端。
去[这里](https://devcenter.heroku.com/articles/quickstart#step-2-install-the-heroku-toolbelt)下载安装。

安装完成后打开终端(命令行)执行

~~~ bash
$ heroku login
~~~

然后按照提示输入Email和密码，设置好ssh key。

##初始化Git

如果你当前的项目已经是一个Git版本库了，那么你只需要记得把准备项目时新生成的文件添加的版本控制里就行了。不过需要注意的是./ssh/id_rsa这个文件尽量不要push到公开的版本库上，有了它就有了操作你的[Github]项目的授权。

如果你的项目还没有被初始化成Git版本库过，那么你需要执行下面三条命令。

~~~ bash
$ git init
$ git add .
$ git commit -m "init"
~~~

##创建App

在项目目录下执行

~~~ bash
$ heroku create
~~~

这会在[Heroku]上创建好对应的App。

再执行

~~~ bash
$ git push heroku master
~~~

这会把你的项目部署到[Heroku]上。

执行下面的命令来保证你的项目能得到运行。

~~~ bash
$ heroku ps:scale web=1
~~~

让我们来访问一下你的项目吧，执行

~~~ bash
$ heroku open
~~~

命令执行后会在浏览器里打开你的项目，如果页面上显示success则代表你部署成功了，记住这个页面的网址，我们后面会用到它。

#配置Github


##添加ssh key

在[这里](https://github.com/settings/ssh)添加上刚才ssh key，注意登录用户必须有提交到Github Pages项目的权限。

##设置Webhooks

打开你用来存放文章(issue)的[Github]项目主页，点击右侧的`Settings`，再点左侧的`Webhooks & Services`。

点击`Add webhook`。

在`Payload URL`里填入刚才我们打开heroku app的网址。

`Content type`选`application/json`。

`Secret`留空。

`Which events would you like to trigger this webhook?`选`Let me select individual events.`。

在下面的选项里只选`Issues`一项就够了。

选中`Active`。

点击`Add webhook`。


---


现在就去issue里写一篇文章试试吧。记得issue的标题会被当做文件名，issue的内容要带有hexo所需的文件头哦。

像[这个](https://github.com/emptyzone/emptyzone.github.com/issues/14)一样。

[Hexo]: http://hexo.io
[hexo-migrator-issue]: https://github.com/songchenwen/hexo-migrator-issue
[hexo-heroku-auto-publisher]: https://github.com/songchenwen/hexo-heroku-auto-publisher
[Heroku]: http://heroku.com
[Github]: https://github.com