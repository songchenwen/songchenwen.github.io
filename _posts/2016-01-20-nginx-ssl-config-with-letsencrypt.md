---
layout: post
title: 搭配 Let's Encrypt 半自动化为 nginx 配置 https
category: Tech
tags: [nginx, Https, letsencrypt]
redirect_from: "/tech/2016/01/20/nginx-ssl-config-with-letsencrypt/"
---

有了 [Let's Encrypt]，配置 SSL 证书再也不是难事，只是 [Let's Encrypt] 目前还处在很初期的阶段，对 [nginx] 的自动化配置支持的还不好。不过我们完全可以自己写点小脚本来半自动化配置我们自己的 [nginx] 服务器。

我使用的脚本在[这里](https://github.com/songchenwen/nginx-ssl-config-with-letsencrypt)，分享给大家。

## 这些脚本能做到什么

1. 只需一行命令即为所有指向这台服务器上的 nginx 的域名申请 SSL 证书
2. 用 Crontab 任务来自动续签证书
3. 简单的 nginx 配置示例。可以重定向所有 www 开头的域名到不带 www 的域名上，还可以为你拿到一个 [A+ 的 SSL Labs 评分](/tech/2015/09/09/nginx-configuration-with-ssl-labs-class-a-plus/)。

<!-- more -->

## 安装

我把 [Let's Encrypt] 作为一个 submodule 集成到这个项目里了。所以只需要克隆这一个项目就够了。

~~~
git clone https://github.com/songchenwen/nginx-ssl-config-with-letsencrypt.git
cd nginx-ssl-config-with-letsencrypt
git submodule init
git submodule update --remote
~~~

## 使用

### 申请证书

#### 编辑 `ssl/config`

填写上你的域名。可以填写多个域名，第一个域名会被用作 Common Name。 证书会保存在 `/etc/letsencrypt/live/` 下，以 Common Name 命名的目录下。

选择一个 [Let's Encrypt] 服务器。`acme-v01` 开头的服务器是正式服务器，有严格的请求次数限制，不建议拿它来做实验。`acme-staging` 开头的服务器是测试服务器，没有请求次数限制，但不会签出有效的证书，建议先用这个服务器来测试配置。

#### 配置 nginx

[Let's Encrypt] 在申请和续签证书时，需要用一个 http 服务器来放一个文件，这样它才能验证你对这个域名的所有权。

我这里用一个简单的 nginx 配置文件 `letsencrypt_challenge` 来重定向所有指向这台服务器的域名的 http 请求到对应的 https 请求上，只留下 [Let's Encrypt] 验证所需的 URL 保留在 http 上。

~~~
sudo cp nginx-config/letsencrypt_challenge /etc/nginx/sites-available/letsencrypt_challenge
sudo ln -s /etc/nginx/sites-available/letsencrypt_challenge /etc/nginx/sites-enabled/letsencrypt_challenge 
sudo nginx -s reload
~~~

#### 执行脚本

执行 `ssl/apply_all_certs.sh`，依照提示填入你的 email，然后你的证书就申请好了。

~~~
bash ssl/apply_all_certs.sh
sudo nginx -s reload
~~~

### nginx 配置文件示例

在 `nginx-config` 目录下，有 3 个比较有用的 nginx 配置文件。使用之前记得要修改它们，至少要记得把我的域名替换成你的。

- `letsencrypt_challenge` 重定向所有指向这台服务器的域名的 http 请求到对应的 https 请求上，只留下 [Let's Encrypt] 验证所需的 URL 保留在 http 上。
- `www_to_none_www` 重定向所有 www 开头的域名的 https 请求到对应的没有 www 开头的域名上。
- `sample_config` 是一个简单的服务器配置文件。这个配置文件可以帮你轻松拿到 [SSL Labs](https://www.ssllabs.com/) 上 A 的分数。把最后一个 `}` 前的那一行配置取消注释就会开启 HSTS，这样你的评分就会变成 A+。

### 自动续签证书的 Crontab 任务

[Let's Encrypt] 签发的证书只有 90 天的有效期，所以我们需要一个自动续签证书的方法。一个每个月续签一次的 Crontab 任务就足够了。这个任务应该以 root 权限执行，因为续签完之后我们还需要重载一下 nginx 的配置才能生效。

~~~
sudo crontab -e
~~~

下面是 Crontab 任务的内容

~~~
0 2 1 1-12 * /path/to/ssl/renew_all_certs.sh
~~~

[Let's Encrypt]:https://letsencrypt.org/
[nginx]:https://www.nginx.com
