---
layout: post
title: SSL Labs 评分 A+ 的 nginx 配置
category: Tech
tags: [nginx, Https]
---

可惜[我的博客](http://songchenwen.com)并不支持 https，这是因为 GitHub Pages 和 GitCafe Pages 都不支持在自定义域名上使用 https 访问。

但是不久前我刚刚为 [bither.net](https://bither.net) 做了配置，现在 [bither.net](https://bither.net) 在 [QUALYS SSL Labs](https://www.ssllabs.com/) 上的评分已经是 [A+](https://www.ssllabs.com/ssltest/analyze.html?d=bither.net&hideResults=on) 了。当你访问 [bither.net](https://bither.net) 时，地址栏上显示的小锁就说明了 https 的安全性。

而且这一切其实一分钱都不用花。

<!-- more -->

要使用 https 首先就需要证书，[StartSSL](https://www.startssl.com/) 上有免费的证书提供，注册过程多少有些繁琐，不过已经有不少人提供了详细的注册方法说明，我在这里就不赘述了。

重要的是，有了 SSL 证书之后要怎么配置 nginx 服务器才能足够安全。[QUALYS SSL Labs](https://www.ssllabs.com/) 提供了对服务器 https 安全级别的测试，在这个测试中达到 A 级以上基本就可以认为是足够安全的。

废话不多说了，下面是我使用的 nginx 配置文件，参考自 [konklone.com](https://konklone.com/post/switch-to-https-now-for-free) 的配置。我把注释翻译成了中文，方便大家看懂。

~~~
# 重定向 http 请求
server {
    listen 80;
    server_name bither.net;
    return 301 https://$host$request_uri;
}

server {
	# 'spdy' 开启了对 SPDY 的支持
    listen 443 ssl spdy;
    server_name bither.net;
    
    # 这里需要添加你自己的配置, 比如指向静态文件的路径, 或者将请求重定向给其它进程
    
    # 存放证书文件的位置 
    ssl_certificate /path/to/unified.crt;
    ssl_certificate_key /path/to/my-private-decrypted.key;

    # 需要添加的 http headers
    # Strict-Transport-Security: 让浏览器记住直接访问 https 的网址, 不再去 http 上重定向了。
    # 这个一旦设置上将会很难更改, 如果要和 includeSubdomains 一起使用时更要慎重。
    #    max-age: 记住的时长, 单位是秒 (31536000 = 1 年)
    #    includeSubdomains: 所有子域名都强制使用 https 访问, 这个如果不确定千万别开。
    #    preload: 告诉浏览器可以预加载你的域名的 HSTS。
    #    在这里提交你的域名来让浏览器预加载: https://hstspreload.appspot.com
    add_header Strict-Transport-Security 'max-age=31536000; includeSubDomains; preload';

    # 选择特定的加密方式, 来保证远期保密, 并且避免已知的漏洞。
    # 只对于 IE8/XP 的用户有一点点小例外 (DES-CBC3-SHA)
    # 这里有可能要根据 nginx 的版本来做调整
    # 参考自: https://www.ssllabs.com/ssltest/analyze.html
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'kEECDH+ECDSA+AES128 kEECDH+ECDSA+AES256 kEECDH+AES128 kEECDH+AES256 kEDH+AES128 kEDH+AES256 DES-CBC3-SHA +SHA !aNULL !eNULL !LOW !MD5 !EXP !DSS !PSK !SRP !kECDH !CAMELLIA !RC4 !SEED';

    # 不再使用旧的不安全的 SSLv2 和 SSLv3 
    ssl_protocols TLSv1.2 TLSv1.1 TLSv1;

    # 打开 Session 恢复, 缓存 10 分钟
    # 来自 http://nginx.org/en/docs/http/configuring_https_servers.html
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;
    keepalive_timeout   70;

    # 一个 MTU 中缓冲 1400 bytes 的数据
    # nginx 1.5.9+ ONLY
    ssl_buffer_size 1400;

    # SPDY header 压缩 (0 是不压缩, 9 压缩率最高速度最慢). 推荐选择 6
    # 但是 header 压缩在 SPDY versions 1 - 3 中都是有缺陷的
    # 所以我们先关闭它, 等有了支持 SPDY 4 的 nginx 版本后再打开
    spdy_headers_comp 0;

    # 为 DH 椭圆曲线预先生成一个 2048 bit 的随机参数, 如果不设置的话默认只有 1024 bits
    # 使用 OpenSSL 用如下命令生成:
    #   openssl dhparam -outform pem -out dhparam2048.pem 2048
    ssl_dhparam /path/to/dhparam2048.pem;

    # 下面这一大段被我注释掉了, 打开 OCSP stapling 有效减少 CA 服务器的负担。
    # OCSP stapling - means nginx will poll the CA for signed OCSP responses, 
    # and send them to clients so clients don't make their own OCSP calls.
    # https://en.wikipedia.org/wiki/OCSP_stapling
    # 
    # while the ssl_certificate above may omit the root cert if the CA is trusted,
    # ssl_trusted_certificate below must point to a chain of **all** certs
    # in the trust path - (your cert, intermediary certs, root cert)
    #
    # 8.8.8.8 and 8.8.4.4 below are Google's public IPv4 DNS servers. 
    # nginx will use them to talk to the CA.
    # 以下是被我注释掉的配置
    #ssl_stapling on;
    #ssl_stapling_verify on;
    #resolver 8.8.8.8 8.8.4.4 valid=86400;
    #resolver_timeout 10;
    #ssl_trusted_certificate /path/to/all-certs-in-chain.crt;
}
~~~

使用这个配置文件时有几点需要注意的地方:

1. `add_header Strict-Transport-Security` 时一定要考虑好是不是要对所有的子域名都开启，如果子域名的服务器还没准备好接受 https 的请求的话，那一旦开启再想反悔就难了。
2. `ssl_ciphers` 在设置时可能会因为操作系统和 nginx 版本不同而导致有的加密方式没办法开启，尽量升级最新的 nginx 吧，如果不方便升级的话就只能自行取舍了。
