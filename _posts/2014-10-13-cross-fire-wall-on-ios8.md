---
layout: post
title: iOS8 不越狱翻墙方案
date: {}
categories: 
  - Tech
tags: 
  - GFW
  - VPN
  - DNS
  - iOS
  - VPS
published: true
---

>  iOS8为我们带来了第三方输入法和 App Extentions，越狱的需求越来越少。而且自从在 [Bither] 里存了一些比特币之后，我就越来越关注手机系统的安全性。现在真的是能不越狱就尽量不越了。那么不越狱的话怎么满足我自由的访问互联网的需求呢？
> OS X，PC 或者 Android 翻墙，请移步 [Shadowsocks]。

我目前在 iPhone 上所用的翻墙方案包含如下两部分 ：

- 自动连接并区分墙内外流量的IPsec VPN
- 避开GFW污染，并尽量就近解析域名的DNS

> 以下步骤需要你有自己的 VPS。
> 以下操作基于 Ubuntu，以非 root 用户 ssh 登录。其它发行版应该只有包管理和防火墙部分稍有不同。

 
<!-- more -->


# IPsec VPN 

我是在 [Twitter] 上看到 [Justin] 说 Anyconnect 在 iOS8 上变的特别慢之后，才开始考虑停掉 [ocserv] 换用 IPsec VPN 的，IPsec 的配置方法参考了 [Justin] 的[文章](https://medium.com/@cattyhouse/ios-ondemand-ipsec-vpn-setup-ebfb82b6f7a1)。由于 IKEv2 在 iOS8 上有 [Bug](http://www.v2ex.com/t/138171)，所以这里还是用的 IKEv1 协议。不过如果 Apple 在哪个版本修复了 IKEv2 的话，现在这个配置方式也是很容易迁移到 IKEv2 的。

## 编译 Strongswan

apt-get 里的 Strongswan 版本低，所以这里需要自行编译最新版的 Strongswan。

### 检查依赖
如果是基于 OpenVZ 的 VPS 的话，先要检查一下有没有 TUN Device。输入下面的命令。非 OpenVZ 可以跳过这一步。

~~~ bash
cat /dev/net/tun
~~~

如果执行结果如下，那么就可以安装 Strongswan 了。否则的话，去给 VPS 提供商发 Ticket 看能不能解决吧。

~~~ bash
cat: /dev/net/tun: File descriptor in bad state
~~~

### 下载源码

~~~ bash
wget http://download.strongswan.org/strongswan.tar.gz && tar zxvf strongswan* 
cd strongswan*
~~~
### 安装编译所需的包

~~~ bash
sudo apt-get build-dep strongswan
sudo apt-get install libgmp3-dev openssl  libssl-dev
~~~

### 编译
Strongswan 在 `configure` 时要对 OpenVZ 特殊处理。

非 OpenVZ 执行如下命令。

~~~ bash
./configure --sysconfdir=/etc --disable-sql --disable-mysql --disable-ldap --enable-dhcp --enable-eap-identity --enable-eap-mschapv2 --enable-md4 --enable-xauth-eap --enable-eap-peap --enable-eap-md5 --enable-openssl --enable-shared --enable-unity --enable-eap-tls   --enable-eap-ttls --enable-eap-tnc --enable-eap-dynamic --enable-addrblock --enable-radattr --enable-nat-transport --enable-kernel-netlink
~~~

OpenVZ 要加上 `--enable-kernel-libipsec` 参数，完整命令如下。

~~~ bash
./configure --sysconfdir=/etc --disable-sql --disable-mysql --disable-ldap --enable-dhcp --enable-eap-identity --enable-eap-mschapv2 --enable-md4 --enable-xauth-eap --enable-eap-peap --enable-eap-md5 --enable-openssl --enable-shared --enable-unity --enable-eap-tls   --enable-eap-ttls --enable-eap-tnc --enable-eap-dynamic --enable-addrblock --enable-radattr --enable-nat-transport --enable-kernel-netlink --enable-kernel-libipsec
~~~

`configure` 完之后就可以 `make` 和 `install` 了

~~~ bash
make && sudo make install
~~~

## 生成证书

这里是使用的自签名证书，需要你把 CA 证书用邮件发到 iOS 设备上安装才行。如果要用 ssl 证书，可以参考 [wzxjohn] 的[文章](http://maoxian.de/2014/10/setup-ikev2-on-demand-vpn-on-ios-8-and-ikev2-ikev1-cisco-ipsec-vpn-with-strongswan/1220.html)。

Strongswan 的证书都是要放在 `/etc/ipsec.d/` 里的，不过我们是非 root 登录的，不方便直接操作这个目录，可以现在 home 目录下新建个目录来生成证书，等都生成好了再复制到 `/etc/ipsec.d/` 就行了。

~~~ bash
mkdir ~/ipsec_cert && cd ~/ipsec_cert
~~~

生成证书用到的命令比较多，我写好了 script 来做这件事

### 生成服务器证书
记得把我这里写的 `emptyzone.github.io` 换成你自己的 Server IP 或者是域名。你打算用域名访问 VPN 就写 域名，打算用 IP 访问就写 IP，别写错了。

~~~ bash
wget https://gist.githubusercontent.com/songchenwen/14c1c663ea65d5d4a28b/raw/cef8d8bafe6168388b105f780c442412e6f8ede7/server_key.sh
sh server_key.sh emptyzone.github.io
~~~

### 生成客户端证书
把 `gary` 和 `gary@gmail.com` 换成你自己的用户名和email。这个脚本执行完会生成好导入 iOS 时需要的 `p12` 证书文件，最后提示你输入的密码就是用来加密它的，在往 iOS 导入时输入相同的即可。

~~~ bash
wget https://gist.githubusercontent.com/songchenwen/14c1c663ea65d5d4a28b/raw/54843ae2e5e6d1159134cd9a90a08c31ff5a253d/client_key.sh
sh client_key.sh gary gary@gmail.com
~~~

执行完成后可以把以用户名开头的 `.p12` 文件 和 `cacerts/strongswanCert.pem` 下载到本地来备用。

### 复制证书到  `/etc/ipsec.d/` 
Strongswan 需要的是 `cacerts/strongswanCert.pem` `certs/vpnHostCert.pem` `private/vpnHostKey.pem` 这三个文件。

~~~ bash
sudo cp cacerts/strongswanCert.pem /etc/ipsec.d/cacerts/strongswanCert.pem 
sudo cp certs/vpnHostCert.pem /etc/ipsec.d/certs/vpnHostCert.pem
sudo cp private/vpnHostKey.pem /etc/ipsec.d/private/vpnHostKey.pem
~~~

## 配置 Strongswan

### 编辑 /etc/ipsec.conf

~~~ bash
sudo vi /etc/ipsec.conf
~~~

~~~ 
config setup
	# strictcrlpolicy=yes
	#  uniqueids = replace
	# charondebug="cfg 2, dmn 2, ike 2, net 0" #要看Log时，取消注释本行

conn %default
	keyexchange=ikev1
	dpdaction=hold
	dpddelay=600s
	dpdtimeout=5s
	lifetime=24h
	ikelifetime=240h
	rekey=no
	left=emptyzone.github.io #这里换成你登录 VPN 用的域名或 IP，与生成证书时相同 
	leftsubnet=0.0.0.0/0
	leftcert=vpnHostCert.pem
	leftsendcert=always
	right=%any
	rightdns=8.8.8.8
	rightsourceip=10.0.0.0/8

conn CiscoIPSec
	rightauth=pubkey
	rightauth2=xauth
	auto=add
~~~

### 编辑 /etc/ipsec.secrets

~~~ bash
sudo vi /etc/ipsec.secrets
~~~

~~~ 
#验证用户所需的信息
#用户名 : EAP "密码"
: RSA vpnHostKey.pem
gary : EAP "strongpassword" 
~~~

## 配置防火墙 iptables

> 参考我的配置文件，重要的是开启 NAT 转发 开放 `4500` `500` 端口和 `esp` 协议

/etc/iptables.firewall.rules

注意别把自己的 ssh 端口关闭了

~~~ bash
*filter

#  Allow all loopback (lo0) traffic and drop all traffic to 127/8 that doesn't use lo0
-A INPUT -i lo -j ACCEPT
-A INPUT -d 127.0.0.0/8 -j LOG --log-prefix "looback denied: " --log-level 7
-A INPUT -d 127.0.0.0/8 -j REJECT

#  Accept all established inbound connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

#  Allow all outbound traffic - you can modify this to only allow certain traffic
-A OUTPUT -j ACCEPT

#  Allow HTTP and HTTPS connections from anywhere (the normal ports for websites and SSL).
-A INPUT -p tcp --dport 80 -j ACCEPT

# Allow ipsec
-A INPUT -p udp --dport 4500 --j ACCEPT
-A INPUT -p udp --dport 500 --j ACCEPT
-A INPUT -p esp -j ACCEPT

#  Allow SSH connections
#
#  The -dport number should be the same port number you set in sshd_config
#
-A INPUT -p tcp -m state --state NEW --dport 1010 -j ACCEPT

#  Allow ping
-A INPUT -p icmp -j ACCEPT

#  Log iptables denied calls
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

-A INPUT -j DROP

COMMIT
~~~

在 `/etc/sysctl.conf` 中开启 `net.ipv4.ip_forward=1`

编辑 `/etc/network/if-pre-up.d/firewall`
~~~ bash
 #!/bin/sh 
/sbin/iptables-restore < /etc/iptables.firewall.rules
~~~

执行
~~~ bash
sudo chmod +x /etc/network/if-pre-up.d/firewall
~~~

编辑 `/etc/rc.local` 在 `exit 0` 前加上，`20.16.3.18` 换成你的服务器 IP。
~~~ bash
iptables -t nat -A POSTROUTING -j MASQUERADE
iptables -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu
iptables -A POSTROUTING -t nat -s 10.0.0.0/8 -j SNAT --to-source 20.16.3.18
~~~

现在可以重启一下服务器，然后执行 `sudo iptables -L`，看看防火墙有没有添加对。

## 区分流量自动路由

是的，你没看错，IPsec IKEv1 也是支持自动路由的。IPsec 支持 [SplitTunneling](https://wiki.strongswan.org/projects/strongswan/wiki/ForwardingAndSplitTunneling)。iOS 上的 IPsec 客户端用的是 Racoon，这货支持 Unity Plugin。也就是说我们可以用 IP 列表来区分国内外流量了。

但是当启用了 `SplitTunneling` 之后，iOS 端就不会使用我们在服务器端配置的 DNS 了，所以我们还需要利用 Unity Plugin 的 `Split DNS` 来把抗干扰的 DNS 推给客户端。

IP 列表可能会经常维护，所以我希望把它和主配置文件分开放置。放在我的 `home` 目录里就好了。

### 修改 /etc/strongswan.conf

在文件最后加上一句 `include /home/gary/ipsec_config/*.conf` ，`gary` 换成你的 ssh 用户名，这样strongswan 就会导入我的 `~/ipsec_config` 目录下的所有 `.conf` 文件。

### 添加 IP 列表配置

这是我现在用的 IP 列表，目前除了 Instagram 经常有图片下载不下来以外，没有别的问题。这个 IP 列表 iOS 端估计是有数量上限的。我测试的结果是当数量大于160时，iOS 端会返回 `IKE DELETE`。

`28675` 是 `Split DNS` 的 Key，我这里用上了 GFWList 中的所有顶级域名。

创建并编辑 `~/ipsec_config/attr.conf`

~~~ 
charon {
  plugins {
    attr {

	split-include = 63.140.32.0/19, 66.117.16.0/20, 66.235.0.0/16, 130.248.0.0/16, 153.32.0.0/16, 185.34.188.0/22, 192.147.117.0/24, 192.150.0.0/16, 192.243.224.0/20, 192.243.248.0/21, 193.104.215.0/24, 195.35.86.0/24, 208.77.136.0/22, 216.104.0.0/16, 8.18.144.0/23, 23.20.0.0/14, 27.0.0.0/22, 46.51.128.0/18, 46.51.192.0/20, 46.51.216.0/21, 46.51.224.0/19, 46.137.0.0/17, 46.137.128.0/18, 46.137.224.0/19, 50.16.0.0/14, 50.112.0.0/16, 54.0.0.0/8, 67.202.0.0/18, 72.21.192.0/19, 72.44.32.0/19, 75.101.128.0/17, 79.125.0.0/17, 87.238.80.0/21, 96.127.0.0/17, 103.246.148.0/22, 107.20.0.0/14, 122.248.192.0/18, 174.129.0.0/16, 176.32.64.0/19, 176.34.0.0/16, 178.236.0.0/20, 184.72.0.0/15, 184.169.128.0/17, 184.154.0.0/16, 185.48.120.0/22, 199.0.0.0/8, 203.83.220.0/22, 204.236.128.0/17, 204.246.160.0/20, 204.246.176.0/22, 204.246.180.0/23, 204.246.182.0/24, 204.246.184.0/21, 205.251.192.0/19, 205.251.224.0/20, 205.251.240.0/21, 205.251.248.0/22, 205.251.252.0/23, 205.251.254.0/24, 207.171.160.0/19, 216.137.32.0/21, 216.137.40.0/22, 216.137.44.0/23, 216.137.48.0/20, 216.182.224.0/20, 17.0.0.0/8, 63.92.224.0/19, 192.12.74.0/24, 192.42.249.0/24, 204.79.190.0/24, 104.16.0.0/12, 108.162.192.0/19, 108.162.224.0/20, 108.162.240.0/21, 108.162.248.0/22, 108.162.252.0/23, 108.162.254.0/24, 162.158.0.0/15, 173.245.48.0/20, 198.41.128.0/17, 204.93.177.0/24, 108.160.160.0/20, 205.189.0.0/24, 37.48.64.0/18, 85.17.0.0/16, 95.211.0.0/16, 31.13.24.0/21, 31.13.64.0/18, 66.220.144.0/20, 69.63.176.0/20, 69.171.224.0/19, 74.119.76.0/22, 173.252.64.0/18, 204.15.20.0/22, 23.235.32.0/20, 104.156.80.0/20, 208.71.104.0/22, 192.30.252.0/22, 8.6.48.0/21, 8.8.4.0/24, 8.8.8.0/24, 8.15.202.0/24, 8.34.208.0/20, 8.35.192.0/20, 23.236.48.0/20, 23.251.128.0/19, 64.9.224.0/19, 64.233.160.0/19, 66.102.0.0/20, 66.249.64.0/19, 70.32.128.0/19, 72.14.192.0/18, 74.125.0.0/16, 104.132.0.0/14, 104.154.0.0/15, 104.196.0.0/14, 107.167.160.0/19, 107.178.192.0/18, 108.59.80.0/20, 108.170.192.0/18, 108.177.0.0/17, 130.211.0.0/16, 142.250.0.0/15, 146.148.0.0/17, 162.216.148.0/22, 162.222.176.0/21, 172.217.0.0/16, 172.253.0.0/16, 172.16.16.1/32, 173.255.112.0/20, 192.158.28.0/22, 192.178.0.0/15, 207.223.160.0/20, 209.85.128.0/17, 216.58.192.0/19, 216.239.32.0/19, 205.196.120.0/22, 8.25.0.0/16, 192.133.76.0/22, 93.184.216.0/24, 59.24.3.0/24, 91.198.174.0/24, 185.15.56.0/22, 198.35.26.0/23, 198.73.209.0/24, 208.80.152.0/22, 66.155.8.0/21, 76.74.248.0/21, 192.0.64.0/18, 198.181.116.0/22

      28675 = mil com tv fm za tw org info biz ca net ru au us de hk jp me uk io is it in li gov ly fr nu st asia im my xxx tk eu cc mobi se edu il kr ie ar nl cm ua es ph bz br be mp cz name lu ch su to no co nz sg ma vc am at la sh tl gd sk id pl mo tc hu

    }
  }
}
~~~

现在可以执行 `sudo ipsec start --nofork`，试一下了。`--nofork` 参数会让 strongswan 在前台运行，调试时加上就可以了，平时就让它在后台运行吧。

## 开机自启

编辑 `/etc/rc.local` 在 `exit 0` 前加上 `ipsec start`。

## iOS 端自动配置文件

这里完全参考 [Justin] 的[文章](https://medium.com/@cattyhouse/ios-ondemand-ipsec-vpn-setup-ebfb82b6f7a1)就可以了，他那有截图，我就只说一下步骤吧。

用 Apple Configurator 创建配置描述文件。

通用里的名称和标识符自己填好。

凭证里导入刚才下载好的客户端 `.p12` 证书。

VPN里连接类型选 `IPsec(Cisco)`，机器鉴定选证书，在下面选中刚才导入的证书。

导出这个配置描述文件，别签名。

用文本编辑器编辑。

找到这一段

~~~ 
<key>OnDemandEnabled</key>
<integer>1</integer>
~~~

改成下面这样

~~~ 
<key>OnDemandEnabled</key>
<integer>1</integer>
<key>OnDemandRules</key>
<array>
  <dict>
    <key>Action</key>
    <string>Connect</string>
  </dict>
</array>
~~~

另外，如果配置描述文件里只有 `XAuthName`，没有 `XAuthPassword`的话，可以自己加上这个 Key，然后把密码填上。

把这个配置描述文件，连同刚才下载好的服务器CA证书 `strongswanCert.pem` 一起，用邮件发到自己的 iOS 设备上，然后安装好，试一下吧。

# DNS

使用刚才配置的 IPsec VPN 翻墙的话，就总会使用谷歌的 DNS 服务器做域名查询。这样很多明明国内有 CDN 的域名，却会解析到国外的 IP 上，造成访问缓慢。所以我要利用 `pdnsd` 来创建一个带缓存的域名解析服务。这里主要参考了[这篇文章](https://jackyyf.com/work/480)。

## 安装 pdsnd

~~~ bash
sudo apt-get install pdnsd
~~~

## 配置 pdnsd

编辑 /etc/pdnsd.conf

~~~ 
global {
	perm_cache = 8192;
	cache_dir = "/var/cache/pdnsd";
	run_as = "pdnsd";
	server_ip = 0.0.0.0;
	status_ctl = on;
	paranoid = on;
	query_method = udp_tcp;
	tcp_server = on;
	min_ttl = 1d;
	max_ttl = 52w;
	timeout = 10;

	randomize_recs = on;
	debug = off;
	daemon = on;
	verbosity = 1;
	neg_rrs_pol = on;
	neg_domain_pol = on;
	par_queries = 4;
}

server {
	label				= "Unicom Beijing";
	ip 					=  202.106.196.115, 202.106.46.151, 202.106.0.20, 202.106.195.68;
	timeout				= 10;
	proxy_only			= on;
	caching				= on;
	randomize_servers	= off;
    reject_policy		= fail;
    reject_recursively  = on;
	include				=
// Place Domains Below. Remember add a dot(".") at the start of domain, if you also want to redirect all subdomains!
		".cn",
// Place Domains Above.
		"DOMAIN.PADDING";


	exclude				=
// Place Domains Below. Remember add a dot(".") at the start of domain, if you also want to redirect all subdomains!

".darpa.mil", ".fxnetworks.com", ".hulu.com", ".huluim.com", ".muzu.tv", ".netflix.com", ".pandora.com", ".pandora.tv", ".pure18.com", ".spotify.com", ".target.com", ".turntable.fm", ".vevo.com", ".zattoo.com", ".qq.co.za", ".zozotown.com", ".0rz.tw", ".0to255.com", ".1-apple.com.tw", ".10musume.com", ".123rf.com", ".12bet.com", ".12vpn.com", ".141hongkong.com", ".173ng.com", ".1984bbs.com", ".1984bbs.org", ".1bao.org", ".1pondo.tv", ".1eew.com", ".2-hand.info", ".2000fun.com", ".2008xianzhang.info", ".21andy.com", ".24smile.org", ".2shared.com", ".315lz.com", ".36rain.com", ".4bluestones.biz", ".4chan.org", ".5i01.com", ".taiwannation.50webs.com", ".51.ca", ".5maodang.com", ".6-4.net", ".64tianwang.com", ".64wiki.com", ".666kb.com", ".6park.com", ".www.6v6dota.com", ".7capture.com", ".881903.com", ".888.com", ".89-64.org", ".9001700.com", ".908taiwan.org", ".92ccav.com", ".9bis.com", ".9bis.net", ".a-normal-day.com", ".a5.com.ru", ".aboluowang.com", ".aboutgfw.com", ".acgkj.com", ".actimes.com.au", ".aculo.us", ".addictedtocoffee.de", ".adultfriendfinder.com", ".adultkeep.net", ".advanscene.com", ".advertfan.com", ".aenhancers.com", ".af.mil", ".aiph.net", ".aisex.com", ".ait.org.tw", ".aiweiweiblog.com", ".ajaxplorer.info", ".www.ajsands.com", ".akiba-online.com", ".al-qimmah.net", ".alabout.com", ".alasbarricadas.org", ".notes.alexdong.com", ".alexlur.org", ".aliengu.com", ".alkasir.com", ".allgirlsallowed.org", ".alliance.org.hk", ".allinfa.com", ".allinfo.com", ".allmovie.com", ".alternate-tools.com", ".alvinalexander.com", ".alwaysdata.com", ".alwaysdata.net", ".am730.com.hk", ".amazon.com", ".ameblo.jp", ".americangreencard.com", ".amiblockedornot.com", ".amnesty.org", ".amnestyusa.org", ".amoiist.com", ".amzs.me", ".analyze-v.com", ".anchorfree.com", ".andfaraway.net", ".animecrazy.net", ".anobii.com", ".anonymizer.com", ".anontext.com", ".anthonycalzadilla.com", ".antiwave.net", ".aobo.com.au", ".aolchannels.aol.com", ".video.aol.ca", ".aol.co.uk", ".video.aol.com", ".www.aolnews.com", ".video.ap.org", ".apetube.com", ".apiary.io", ".apigee.com", ".appledaily.com", ".archive.is", ".archive.org", ".arctosia.com", ".areca-backup.org", ".army.mil", ".artsy.net", ".asahichinese.com", ".asdfg.jp", ".asiaharvest.org", ".asianews.it", ".asianwomensfilm.de", ".askstudent.com", ".askynz.net", ".assembla.com", ".astonmartinnews.com", ".atchinese.com", ".atgfw.org", ".atj.org.tw", ".atlaspost.com", ".atnext.com", ".avaaz.org", ".avdb.in", ".avidemux.org", ".avoision.com", ".axureformac.com", ".forum.baby-kingdom.com", ".babynet.com.hk", ".backchina.com", ".backpackers.com.tw", ".badoo.com", ".baidu.jp", ".baixing.me", ".hen.bao.li", ".bannedbook.org", ".barnabu.co.uk", ".bayvoice.net", ".dajusha.baywords.com", ".bbc.co.uk", ".bbcchinese.com", ".bbc.in", ".bbg.gov", ".bbsfeed.com", ".bbsland.com", ".bcc.com.tw", ".bcchinese.net", ".bebo.com", ".beijing1989.com", ".beijingspring.com", ".berlintwitterwall.com", ".bestforchina.org", ".bestvpnservice.com", ".bet365.com", ".betfair.com", ".bettween.com", ".bewww.net", ".bfnn.org", ".bfsh.hk", ".biantailajiao.com", ".bigfools.com", ".bignews.org", ".bigsound.org", ".bill2-software.com", ".billypan.com", ".billywr.com", ".bipic.net", ".bit.ly", ".bitshare.com", ".bjzc.org", ".tor.blingblingsquad.net", ".blinkx.com", ".blinw.com", ".blip.tv", ".blockcn.com", ".blog.de", ".blogcatalog.com", ".blogger.com", ".blogimg.jp", ".blog.kangye.org", ".bloglines.com", ".bloglovin.com", ".rconversation.blogs.com", ".blogspot.co.uk", ".blogspot.com", ".blogspot.de", ".blogspot.fr", ".blogspot.hk", ".blogspot.in", ".blogspot.jp", ".blogtd.net", ".blogtd.org", ".bloodshed.net", ".bloomberg.cn", ".bloomberg.com", ".bloomberg.de", ".bloomfortune.com", ".bnrmetal.com", ".boardreader.com", ".bonbonme.com", ".books.com.tw", ".botanwang.com", ".bot.nu", ".bowenpress.com", ".dl.box.net", ".boxun.com", ".boxun.tv", ".boxunblog.com", ".br.st", ".brandonhutchinson.com", ".braumeister.org", ".break.com", ".breakingtweets.com", ".briefdream.com", ".brightkite.com", ".brizzly.com", ".broadbook.com", ".ibros.org", ".brucewang.net", ".bt95.com", ".budaedu.org", ".bullog.org", ".bullogger.com", ".businessweek.com", ".businesstimes.com.cn", ".bugclub.org", ".buugaa.com", ".buzzurl.jp", ".bwsj.hk", ".holz.byethost8.com", ".c-spanvideo.org", ".c-est-simple.com", ".cactusvpn.com", ".cafepress.com", ".calameo.com", ".cn.calameo.com", ".cams.com", ".canadameet.com", ".bbs.cantonese.asia", ".www.cantonese.asia", ".canyu.org", ".cao.im", ".caobian.info", ".caochangqing.com", ".cari.com.my", ".catch22.net", ".catfightpayperview.xxx", ".catholic.org.hk", ".catholic.org.tw", ".cbsnews.com", ".ccavtop10.com", ".ccdtr.org", ".cclife.org", ".ccthere.com", ".cctongbao.com", ".ccue.ca", ".ccue.com", ".cdig.info", ".cdjp.org", ".cdnews.com.tw", ".cdp1998.org", ".cdp2006.org", ".cdpusa.org", ".cdpweb.org", ".cdpwu.org", ".cecc.gov", ".cellulo.info", ".cenci.tk", ".cenews.eu", ".centralnation.com", ".centurys.net", ".chandoo.org", ".change.org", ".changp.com", ".chaturbate.com", ".chengmingmag.com", ".chenguangcheng.com", ".chenpokong.com", ".cherrysave.com", ".china-week.com", ".china101.com", ".china21.com", ".china21.org", ".chinaaffairs.org", ".chinaaid.me", ".chinaaid.us", ".chinaaid.org", ".chinaaid.net", ".chinacomments.org", ".chinachannel.hk", ".chinadigitaltimes.net", ".chinaeweekly.com", ".chinafreepress.org", ".chinageeks.org", ".chinagfw.org", ".chinagreenparty.org", ".chinahush.com", ".chinalawtranslate.com", ".chinaxchina.com", ".chinainperspective.com", ".chinainperspective.net", ".chinainperspective.org", ".chinainterimgov.org", ".chinalawandpolicy.com", ".chinamule.com", ".chinamz.org", ".chinarightsia.org", ".chinasocialdemocraticparty.com", ".chinasoul.org", ".chinatimes.com", ".chinatweeps.com", ".chinaway.org", ".chinaworker.info", ".chinayouth.org.hk", ".chinayuanmin.org", ".chinese-hermit.net", ".chinese-memorial.org", ".chinesedailynews.com", ".chinesen.de", ".chinesenewsnet.com", ".chinesepen.org", ".chinesetalks.net", ".chingcheong.com", ".chn.chosun.com", ".christianstudy.com", ".christusrex.org", ".chrlcg-hk.org", ".chromeadblock.com", ".chubun.com", ".chuizi.net", ".chrispederick.com", ".chrispederick.net", ".chrlawyers.hk", ".allaboutalpha.com", ".citizenlab.org", ".citizensradio.org", ".city9x.com", ".civicparty.hk", ".civilhrfront.org", ".psiphon.civisec.org", ".cjb.net", ".ck101.com", ".classicalguitarblog.net", ".clb.org.hk", ".clipfish.de", ".cmule.com", ".cms.gov", ".cna.com.tw", ".cnavista.com.tw", ".cnd.org", ".wiki.cnitter.com", ".cnn.com", ".news.cnyes.com", ".cochina.org", ".code1984.com", ".codeshare.io", ".tosh.comedycentral.com", ".comefromchina.com", ".compileheart.com", ".conoyo.com", ".coolaler.com", ".coolder.com", ".coolloud.org.tw", ".corumcollege.com", ".couchdbwiki.com", ".cotweet.com", ".cpj.org", ".crackle.com", ".crd-net.org", ".creaders.net", ".crossthewall.net", ".csdparty.com", ".csuchen.de", ".cts.com.tw", ".cuhkacs.org", ".cuihua.org", ".cuiweiping.net", ".curvefish.com", ".culture.tw", ".forum.cyberctm.com", ".cyberghostvpn.com", ".cynscribe.com", ".cytode.us", ".ifan.cz.cc", ".mike.cz.cc", ".nic.cz.cc", ".cl.d0z.net", ".dabr.co.uk", ".dabr.mobi", ".dabr.me", ".dadazim.com", ".dadi360.com", ".dafagood.com", ".dafahao.com", ".dalailama.ru", ".dailidaili.com", ".dailymotion.com", ".dajiyuan.com", ".dajiyuan.eu", ".dalailama.com", ".dalailamaworld.com", ".dalianmeng.org", ".danke4china.net", ".danwei.org", ".daolan.net", ".daxa.cn", ".cn.dayabook.com", ".daylife.com", ".ddc.com.tw", ".de-sci.org", ".lists.debian.org", ".packages.debian.org", ".delcamp.net", ".delicious.com", ".democrats.org", ".desc.se", ".deutsche-welle.de", ".dev102.com", ".devio.us", ".www.dfanning.com", ".dfas.mil", ".diaoyuislands.org", ".digitalnomadsproject.org", ".diigo.com", ".furl.net", ".directcreative.com", ".discuss.com.hk", ".disp.cc", ".dit-inc.us", ".dizhidizhi.com", ".djangosnippets.org", ".dl-laby.jp", ".dlsite.com", ".dnscrypt.org", ".dojin.com", ".dok-forum.net", ".dolc.de", ".dollf.com", ".domain.club.tw", ".dongde.com", ".dongtaiwang.com", ".dongtaiwang.net", ".dongyangjing.com", ".dontfilter.us", ".dontmovetochina.com", ".dotplane.com", ".dotsub.com", ".doubleaf.com", ".dougscripts.com", ".dowei.org", ".doxygen.org", ".dphk.org", ".dpp.org.tw", ".weigegebyc.dreamhosters.com", ".drgan.net", ".dropbox.com", ".dropboxusercontent.com", ".drtuber.com", ".dtiblog.com", ".dtic.mil", ".dtiserv2.com", ".duckduckgo.com", ".duckload.com", ".duckmylife.com", ".duihua.org", ".duoweitimes.com", ".duping.net", ".duplicati.com", ".dupola.com", ".dupola.net", ".dvorak.org", ".dw.de", ".dw-world.com", ".dw-world.de", ".www.dwheeler.com", ".dwnews.com", ".xys.dxiong.com", ".dy24k.info", ".dynawebinc.com", ".dyndns.org", ".dzze.com", ".e-gold.com", ".g.e-hentai.org", ".e-info.org.tw", ".e-traderland.net", ".hkjp.easyweb.hk", ".ebookbrowse.com", ".ebookee.com", ".ecministry.net", ".bbs.ecstart.com", ".edicypages.com", ".edoors.com", ".edubridge.com", ".eevpn.com", ".efcc.org.hk", ".eic-av.com", ".electionsmeter.com", ".eltondisney.com", ".emacsblog.org", ".emory.edu", ".emule-ed2k.com", ".chinese.engadget.com", ".englishfromengland.co.uk", ".entermap.com", ".epochtimes-bg.com", ".epochtimes-romania.com", ".epochtimes.co.il", ".epochtimes.co.kr", ".epochtimes.com", ".epochtimes.de", ".epochtimes.fr", ".epochtimes.ie", ".epochtimes.jp", ".epochtimes.ru", ".epochtimes.se", ".epochtimestr.com", ".epochweekly.com", ".erabaru.net", ".erepublik.com", ".ernestmandel.org", ".erights.net", ".etaiwannews.com", ".etizer.org", ".www.eulam.com", ".eventful.com", ".exblog.jp", ".exblog.co.jp", ".expatshield.com", ".exploader.net", ".extremetube.com", ".eyevio.jp", ".ezpc.tk", ".ezpeer.com", ".facebook.com", ".connect.facebook.net", ".facesofnyfw.com", ".faiththedog.info", ".fakku.net", ".falunart.org", ".falundafa.org", ".falundafamuseum.org", ".falunhr.org", ".fanglizhi.info", ".fangong.org", ".fangongheike.com", ".fanqianghou.com", ".fapdu.com", ".fawanghuihui.org", ".fbcdn.net", ".fanqiangyakexi.net", ".fail.hk", ".famunion.com", ".fan-qiang.com", ".fangbinxing.com", ".fangeming.com", ".fanswong.com", ".fanyue.info", ".farwestchina.com", ".fastly.net", ".favorious.com", ".en.favotter.net", ".faststone.org", ".favstar.fm", ".faydao.com", ".fb.com", ".fb.me", ".fbsbx.com", ".fc2.com", ".fc2china.com", ".blog125.fc2blog.net", ".video.fdbox.com", ".fdc89.jp", ".fourface.nodesnoop.com", ".feedbooks.mobi", ".feeds.feedburner.com", ".feeds2.feedburner.com", ".feedzshare.com", ".feelssh.com", ".feer.com", ".felixcat.net", ".feministteacher.com", ".fengzhenghu.com", ".fflick.com", ".fgmtv.net", ".fgmtv.org", ".filefactory.com", ".files2me.com", ".fileserve.com", ".fillthesquare.org", ".finalion.jp", ".findbook.tw", ".finler.net", ".fireofliberty.org", ".falsefire.com", ".fleshbot.com", ".flickr.com", ".staticflickr.com", ".flickrhivemind.net", ".yuming.flnet.org", ".cn.fmnnow.com", ".blog.foolsmountain.com", ".www.forum4hk.com", ".pioneer-worker.forums-free.com", ".4sq.com", ".fotop.net", ".video.foxbusiness.com", ".fringenetwork.com", ".flecheinthepeche.fr", ".focusvpn.com", ".fofg.org", ".fooooo.com", ".footwiball.com", ".fourthinternational.org", ".foxdie.us", ".foxsub.com", ".foxtang.com", ".fqrouter.com", ".franklc.com", ".freakshare.com", ".free4u.com.ar", ".free-gate.org", ".free.fr", ".allonlinux.free.fr", ".dimitrik.free.fr", ".kineox.free.fr", ".puttycm.free.fr", ".freealim.com", ".whitebear.freebearblog.org", ".freechal.com", ".freedomhouse.org", ".freegao.com", ".freelotto.com", ".freeman2.com", ".freeopenvpn.com", ".freemoren.com", ".freemorenews.com", ".freenet-china.org", ".freenewscn.com", ".freeoz.org", ".freeserve.co.uk", ".freessh.us", ".free-ssh.com", ".freenetproject.org", ".www.freetibet.org", ".freewallpaper4.me", ".freewebs.com", ".freeweibo.com", ".freexinwen.com", ".friendfeed.com", ".friendfeed-media.com", ".ff.im", ".zensur.freerk.com", ".freevpn.nl", ".fring.com", ".frommel.net", ".frontlinedefenders.org", ".fscked.org", ".fsurf.com", ".fuckcnnic.net", ".fuckgfw.org", ".fulue.com", ".funf.tw", ".funp.com", ".furinkan.com", ".futurechinaforum.org", ".futuremessage.org", ".fw.cm", ".fzh999.com", ".fzh999.net", ".gabocorp.com", ".galenwu.com", ".game735.com", ".gamebase.com.tw", ".gamer.com.tw", ".gamez.com.tw", ".gaoming.net", ".ganges.com", ".gaopi.net", ".gappp.org", ".gardennetworks.com", ".gardennetworks.org", ".gartlive.com", ".gather.com", ".gaymap.cc", ".gazotube.com", ".gclooney.com", ".gcpnews.com", ".gdbt.net", ".gdzf.org", ".geek-art.net", ".geekerhome.com", ".geekmanuals.com", ".genuitec.com", ".geocities.co.jp", ".geocities.com", ".hk.geocities.com", ".geocities.jp", ".geohot.com", ".geometrictools.com", ".get-digital-help.com", ".getchu.com", ".getfoxyproxy.org", ".getfreedur.com", ".getlantern.org", ".getjetso.com", ".getiton.com", ".getsocialscope.com", ".gfw.org.ua", ".ggssl.com", ".ghost.org", ".giga-web.jp", ".cn.giganews.com", ".gigporno.ru", ".gimpshop.com", ".girlbanker.com", ".glennhilton.com", ".globaljihad.net", ".globalmuseumoncommunism.org", ".globalrescue.net", ".globalvoicesonline.org", ".gmbd.cn", ".gmhz.org", ".goagent.biz", ".goagentplus.com", ".godfootsteps.org", ".goldenmelody.com.tw", ".goldwave.com", ".gongmeng.info", ".gongm.in", ".gongminliliang.com", ".gongwt.com", ".goodreads.com", ".goodreaders.com", ".goofind.com", ".googleusercontent.com", ".googledrive.com", ".googlesile.com", ".gopetition.com", ".googlevideo.com", ".gotw.ca", ".grandtrial.org", ".graphis.ne.jp", ".greatfirewall.biz", ".greatfirewallofchina.net", ".greatfirewallofchina.org", ".greenparty.org.tw", ".gpass1.com", ".great-firewall.com", ".great-roc.org", ".greatroc.org", ".greatzhonghua.org", ".greenvpn.net", ".gs-discuss.com", ".gtricks.com", ".guancha.org", ".gun-world.net", ".gutteruncensored.com", ".gvm.com.tw", ".gzm.tv", ".gzone-anime.info", ".apis.google.com", ".appspot.com", ".code.google.com", ".autoproxy-gfwlist.googlecode.com", ".gfwinterceptor.googlecode.com", ".goagent.googlecode.com", ".gtap.googlecode.com", ".sshtunnel.googlecode.com", ".tuite.googlecode.com", ".gaeproxy.googlecode.com", ".docs.google.com", ".echofon.com", ".golang.org", ".www.klip.me", ".ub0.cc", ".wozy.in", ".drive.google.com", ".groups.google.com", ".google.com", ".google.com.hk", ".encrypted.google.com", ".feedproxy.google.com", ".knol.google.com", ".picasaweb.google.com", ".sites.google.com", ".talkgadget.google.com", ".video.google.com", ".cnn.googlepages.com", ".freegateget.googlepages.com", ".myboooks.googlepages.com", ".gospelherald.com", ".hk.gradconnection.com", ".graylog2.org", ".greatfire.org", ".greatroc.tw", ".gstatic.com", ".guishan.org", ".gunsamerica.com", ".gyalwarinpoche.com", ".h-china.org", ".h1n1china.org", ".hacken.cc", ".hackthatphone.net", ".hahlo.com", ".hakkatv.org.tw", ".hanunyi.com", ".hardsextube.com", ".hasaowall.com", ".have8.com", ".hdtvb.net", ".heartyit.com", ".hecaitou.net", ".hechaji.com", ".helloandroid.com", ".helloqueer.com", ".hellotxt.com", ".htxt.it", ".hellouk.org", ".helpeachpeople.com", ".helpzhuling.org", ".date.fm", ".flightcaster.com", ".branch.com", ".awardwinningfjords.com", ".futureme.org", ".getcloudapp.com", ".cl.ly", ".getsmartlinks.com", ".git-scm.com", ".lesscss.org", ".list.ly", ".maxgif.com", ".overlapr.com", ".peerpong.com", ".pose.com", ".samsoff.es", ".sendoid.com", ".speckleapp.com", ".stuffimreading.net", ".tomayko.com", ".twt.fm", ".views.fm", ".heqinglian.net", ".here4news.com", ".heungkongdiscuss.com", ".app.heywire.com", ".hgseav.com", ".hidden-advent.org", ".hidecloud.com", ".hidemyass.com", ".hideipvpn.com", ".hihiforum.com", ".hihistory.net", ".higfw.com", ".highrockmedia.com", ".hikinggfw.org", ".himemix.com", ".times.hinet.net", ".hjclub.info", ".hk-pub.com", ".hk32168.com", ".app.hkatvnews.com", ".hkbc.net", ".hkbf.org", ".hkday.net", ".hkdailynews.com.hk", ".hkej.com", ".hkepc.com", ".hkfront.org", ".hkgolden.com", ".hkgreenradio.org", ".hkheadline.com", ".hkhkhk.com", ".hkjc.com", ".hkjp.org", ".hkptu.org", ".hkreporter.com", ".hkzone.org", ".apps.hloli.net", ".hnjhj.com", ".holyspiritspeaks.org", ".derekhsu.homeip.net", ".homeservershow.com", ".hongmeimei.com", ".hongzhi.li", ".hootsuite.com", ".hotfile.com", ".hotpot.hk", ".hotspotshield.com", ".hougaige.com", ".howtoforge.com", ".hqcdp.org", ".hrcir.com", ".hrichina.org", ".hrw.org", ".hsjp.net", ".htmldog.com", ".huaglad.com", ".huanghuagang.org", ".huaren.us", ".huaxia-news.com", ".huaxin.ph", ".hua-yue.net", ".hugoroy.eu", ".t.huhaitai.com", ".hungerstrikeforaids.org", ".huping.net", ".hutianyi.net", ".hutong9.net", ".hwinfo.com", ".hypeshell.com", ".hyperrate.com", ".i1.hk", ".i2p2.de", ".i2runner.com", ".iask.ca", ".iask.bz", ".ibiblio.org", ".iblogserv-f.net", ".cn.ibtimes.com", ".blogs.icerocket.com", ".icij.org", ".icl-fi.org", ".iconpaper.org", ".w.idaiwan.com", ".idemocracy.asia", ".identi.ca", ".idiomconnection.com", ".www.idlcoyote.com", ".idouga.com", ".forum.idsam.com", ".idv.tw", ".ieasynews.net", ".ied2k.net", ".ifanqiang.com", ".ifanr.com", ".ifcss.org", ".ifjc.org", ".ig.com.br", ".igfw.net", ".ignitedetroit.net", ".igvita.com", ".ihakka.net", ".iicns.com", ".illusionfactory.com", ".ilove80.be", ".im.tv", ".im88.tw", ".imageflea.com", ".imageshack.us", ".imagevenue.com", ".imagezilla.net", ".www.imdb.com", ".img.ly", ".imkev.com", ".imlive.com", ".immigration.gov.tw", ".tech2.in.com", ".incredibox.fr", ".inmediahk.net", ".innermongolia.org", ".instagram.com", ".interfaceaddiction.com", ".internationalrivers.org", ".internet.org", ".internetdefenseleague.org", ".internetfreedom.org", ".internetpopculture.com", ".inxian.com", ".iphonehacks.com", ".iphonix.fr", ".ipicture.ru", ".ipobar.com", ".ippotv.com", ".iptorrents.com", ".ipvanish.com", ".iredmail.org", ".ironicsoftware.com", ".ironbigfools.compython.net", ".ironpython.net", ".iset.com.tw", ".islam.org.hk", ".isaacmao.com",".!--isaacmao.com", ".isgreat.org", ".ismprofessional.net", ".isohunt.com", ".israbox.com", ".blog.istef.info", ".istockphoto.com", ".isunaffairs.com", ".isuntv.com", ".itaboo.info", ".ithome.com.tw", ".itshidden.com", ".itweet.net", ".iu45.com", ".ixquick.com", ".izaobao.us", ".gmozomg.izihost.org", ".izles.net", ".j.mp", ".blog.jackjia.com", ".jbtalks.cc", ".jbtalks.com", ".jbtalks.my", ".jeanyim.com", ".jgoodies.com", ".jiaoyou8.com", ".jiehua.cz", ".hk.jiepang.com", ".tw.jiepang.com", ".jieshibaobao.com", ".jimoparty.com", ".jinbushe.org", ".zhao.jinhai.de", ".jingpin.org", ".ac.jiruan.net", ".jitouch.com", ".jkforum.net", ".jmsc.hku.hk", ".joachims.org", ".jobso.tv", ".joeedelman.com", ".journalofdemocracy.org", ".jpopforum.net", ".juliereyc.com", ".junauza.com", ".junefourth-20.net", ".justfreevpn.com", ".zh-tw.justin.tv", ".justtristan.com", ".juziyue.com", ".jwmusic.org", ".jyxf.net", ".ka-wai.com", ".kagyuoffice.org.tw", ".kaiyuan.de", ".kakao.com", ".kanzhongguo.com", ".kanzhongguo.eu", ".karayou.com", ".kcsoftwares.com", ".kechara.com", ".keepandshare.com", ".kendincos.net", ".kenengba.com", ".wiki.keso.cn", ".khmusic.com.tw", ".kimy.com.tw", ".kingdomsalvation.org", ".kinghost.com", ".kingstone.com.tw", ".killwall.com", ".kissbbao.cn", ".knowledgerush.com", ".kodingen.com", ".kompozer.net", ".koolsolutions.com", ".koornk.com", ".kui.name", ".kun.im", ".kurtmunger.com", ".kusocity.com", ".kwongwah.com.my", ".kyohk.net", ".kzeng.info", ".la-forum.org", ".ladbrokes.com", ".labiennale.org", ".lagranepoca.com", ".lalulalu.com", ".laogai.org", ".laomiu.com", ".laoyang.info", ".laptoplockdown.com", ".laqingdan.net", ".larsgeorge.com", ".lastfm.es", ".latelinenews.com", ".lazarsearlymusic.com", ".leecheukyan.org", ".lenwhite.com", ".lerosua.org", ".blog.lester850.info", ".letscorp.net", ".liansi.org", ".lianyue.net", ".liaowangxizang.net", ".liberal.org.hk", ".libertytimes.com.tw", ".lidecheng.com", ".limiao.net", ".abitno.linpie.com", ".line.me", ".linglingfa.com", ".linkideo.com", ".api.linksalpha.com", ".apidocs.linksalpha.com", ".www.linksalpha.com", ".help.linksalpha.com", ".linux-engineer.net", ".linuxconfig.org", ".linuxreviews.org", ".linuxtoy.org", ".lipuman.com", ".listentoyoutube.com", ".listorious.com", ".liudejun.com", ".liuhanyu.com", ".liujianshu.com", ".liuxiaotong.com", ".liu.lu", ".liveleak.com", ".livestation.com", ".livestream.com", ".livingonline.us", ".livingstream.com", ".livevideo.com", ".lizhizhuangbi.com", ".lkcn.net", ".lockdown.com", ".lockestek.com", ".logbot.net", ".logiqx.com", ".logmike.com", ".longhair.hk", ".longtermly.net", ".lookatgame.com", ".lookingglasstheatre.org", ".lookpic.com", ".hkreporter.loved.hk", ".lrfz.com", ".lsd.org.hk", ".lsforum.net", ".lsm.org", ".lsmchinese.org", ".lsmkorean.org", ".lupm.org", ".lvhai.org", ".mh4u.org", ".m-team.cc", ".www.macrovpn.com", ".mad-ar.ch", ".marc.info", ".marguerite.su", ".martincartoons.com", ".maiio.net", ".mail-archive.com", ".malaysiakini.com", ".makemymood.com", ".marines.mil", ".martau.com", ".maruta.be", ".marxist.com", ".marxist.net", ".marxists.org", ".mashable.com", ".matainja.com", ".mathiew-badimon.com", ".matsushimakaede.com", ".mayimayi.com", ".mcadforums.com", ".mcfog.com", ".md-t.org", ".mediafire.com", ".meetup.com", ".mefeedia.com", ".lich355.megabyet.net", ".megaporn.com", ".megarotic.com", ".megavideo.com", ".megurineluka.com", ".meirixiaochao.com", ".melon-peach.com", ".memedia.cn", ".memrijttm.org", ".merit-times.com.tw", ".mesotw.com", ".metacafe.com", ".meteorshowersonline.com", ".metrolife.ca", ".mgoon.com", ".mgstage.com", ".mhradio.org", ".michaelanti.com", ".michaelmarketl.com", ".middle-way.net", ".mihk.hk", ".mihua.org", ".mimivip.com", ".minghui.org", ".minghui-school.org", ".mingjinglishi.com", ".mingjingnews.com", ".mingpao.com", ".mingpaomonthly.com", ".mingpaonews.com", ".mingpaony.com", ".mingpaosf.com", ".mingpaotor.com", ".mingpaovan.com", ".mininova.org", ".minzhuhua.net", ".minzhuzhongguo.org", ".miroguide.com", ".mirrorbooks.com", ".mitbbs.com", ".mixero.com", ".mixpod.com", ".mixx.com", ".mizzmona.com", ".mk5000.com", ".mlcool.com", ".mmaaxx.com", ".plurktop.mmdays.com", ".mmmca.com", ".mobatek.net", ".mobile01.com", ".mobileways.de", ".mobypicture.com", ".moby.to", ".wiki.moegirl.org", ".mog.com", ".molihua.org", ".mondex.org", ".www.monlamit.org", ".c1522.mooo.com", ".monitorchina.org", ".bbs.morbell.com", ".morningsun.org", ".movabletype.com", ".moviefap.com", ".www.moztw.org", ".mp3ye.eu", ".mpettis.com", ".mpfinance.com", ".mpinews.com", ".mrtweet.com", ".msn.com.tw", ".msguancha.com", ".mthruf.com", ".multiply.com", ".multiproxy.org", ".forum.mymaji.com", ".multiupload.com", ".muouju.com", ".muselinks.co.jp", ".muzi.com", ".muzi.net", ".mx981.com", ".my-proxy.com", ".forum.my903.com", ".myactimes.com", ".myaudiocast.com", ".myav.com.tw", ".bbs.mychat.to", ".mychinamyhome.com", ".www.mycould.com", ".myeclipseide.com", ".myforum.com.hk", ".myforum.com.uk", ".myfreshnet.com", ".myparagliding.com", ".mypopescu.com", ".mysinablog.com", ".myspace.com", ".naacoalition.org", ".old.nabble.com", ".naitik.net", ".namsisi.com", ".nanyang.com", ".nanyangpost.com", ".nanzao.com", ".line.naver.jp", ".navicat.com", ".nakido.com", ".naol.ca", ".cyberghost.natado.com", ".navy.mil", ".nccwatch.org.tw", ".nch.com.tw", ".ncn.org", ".etools.ncol.com", ".www.ned.org", ".nekoslovakia.net", ".t.neolee.cn", ".netcolony.com", ".bolin.netfirms.com", ".zh.netlog.com", ".netme.cc", ".networkedblogs.com", ".neverforget8964.org", ".new-3lunch.net", ".new-akiba.com", ".newcenturymc.com", ".newcenturynews.com", ".newchen.com", ".newgrounds.com", ".newlandmagazine.com.au", ".news100.com.tw", ".newscn.org", ".newsminer.com", ".newspeak.cc", ".newsancai.com", ".newtaiwan.com.tw", ".newtalk.tw", ".newyorktimes.com", ".apple.nextmedia.com", ".nexton-net.jp", ".nexttv.com.tw", ".nga.mil", ".ngensis.com", ".nicovideo.jp", ".nighost.org", ".nintendium.com", ".dayaarmongol.ning.com", ".taiwanyes.ning.com", ".njactb.org", ".njuice.com", ".nlfreevpn.com", ".nobelprize.org", ".nobodycanstop.us", ".nokogiri.org", ".nokola.com", ".noobbox.com", ".novelasia.com", ".nownews.com", ".nowtorrents.com", ".noypf.com", ".npa.go.jp", ".nps.gov", ".nrk.no", ".nsc.gov.tw", ".ntdtv.co", ".ntdtv.ca", ".ntdtv.org", ".ntdtv.ru", ".ntu.edu.tw", ".nuexpo.com", ".nurgo-software.com", ".nuvid.com", ".nuzcom.com", ".nydus.ca", ".nyt.com", ".nytco.com", ".nytimes.com", ".nysingtao.com", ".nzchinese.net.nz", ".observechina.net", ".oclp.hk", ".october-review.org", ".offbeatchina.com", ".ogaoga.org", ".twtr2src.ogaoga.org", ".oikos.com.tw", ".oiktv.com", ".oizoblog.com", ".okayfreedom.com", ".old-cat.net", ".olumpo.com", ".olympicwatch.org", ".omgili.com", ".omnitalk.com", ".forum.omy.sg", ".news.omy.sg", ".showbiz.omy.sg", ".the-sun.on.cc", ".tv.on.cc", ".onedrive.live.com", ".onlylady.cn", ".onmoon.net", ".onmoon.com", ".oopsforum.com", ".open.com.hk", ".opendemocracy.net", ".myopenid.com", ".openid.net", ".blog.openinkpot.org", ".openleaks.org", ".openvpn.net", ".openwebster.com", ".help.opera.com", ".my.opera.com", ".demo.opera-mini.net", ".opnir.com", ".www.orchidbbs.com", ".orient-doll.com", ".orientaldaily.com.my", ".orientaldaily.on.cc", ".orn.jp", ".t.orzdream.com", ".tui.orzdream.com", ".orzistic.org", ".osfoora.com", ".m.oulove.org", ".ourdearamy.com", ".oursogo.com", ".oursteps.com.au", ".xinqimeng.over-blog.com", ".share.ovi.com", ".owl.li", ".ht.ly", ".htl.li", ".mash.to", ".www.owind.com", ".www.oxid.it", ".oyax.com", ".ozchinese.com", ".ow.ly", ".bbs.ozchinese.com", ".ozyoyo.com", ".pacificpoker.com", ".packetix.net", ".page2rss.com", ".pagodabox.com", ".paint.net", ".coveringweb.com", ".palacemoon.com", ".forum.palmislife.com", ".paper-replika.com", ".eriversoft.com", ".paper.li", ".paperb.us", ".panluan.net", ".panoramio.com", ".parade.com", ".pastebin.com", ".pastie.org", ".blog.pathtosharepoint.com", ".pbs.org", ".pbwiki.com", ".pbworks.com", ".developers.box.net", ".wiki.oauth.net", ".wiki.phonegap.com", ".wiki.jqueryui.com", ".pbxes.com", ".pbxes.org", ".pcdiscuss.com", ".pcdvd.com.tw", ".pchome.com.tw", ".pct.org.tw", ".pdetails.com", ".pdproxy.com", ".peacefire.org", ".peacehall.com", ".peeasian.com", ".pekingduck.org", ".penchinese.com", ".penchinese.net", ".pengyulong.com", ".blog.pentalogic.net", ".penthouse.com", ".peopo.org", ".percy.in", ".perfectvpn.net", ".perfspot.com", ".perlhowto.com", ".philly.com", ".photofocus.com", ".phuquocservices.com", ".picidae.net", ".picturesocial.com", ".pidown.com", ".pign.net", ".blog.pilotmoon.com", ".pin6.com", ".ping.fm", ".pinoy-n.com", ".piring.com", ".pixelqi.com", ".css.pixnet.in", ".pixnet.net", ".pk.com", ".placemix.com", ".planetsuzy.org", ".pictures.playboy.com", ".playboy.com", ".plays.com.tw", ".m.plixi.com", ".plm.org.hk", ".plunder.com", ".plus28.com", ".plusbb.com", ".pmates.com", ".po2b.com", ".podictionary.com", ".pokerstars.com", ".zh.pokerstrategy.com", ".politicalchina.org", ".popularpages.net", ".popyard.com", ".popyard.org", ".porn.com", ".porn2.com", ".pornbase.org", ".pornhub.com", ".pornmm.net", ".pornoxo.com", ".pornrapidshare.com", ".pornstarclub.com", ".porntube.com", ".pornvisit.com", ".postadult.com", ".powercx.com", ".www.powerpointninja.com", ".pts.org.tw", ".pubu.com.tw", ".puffinbrowser.com", ".post.ly", ".posterous.com", ".post.anyu.org", ".bralio.com", ".calebelston.com", ".designerol.com", ".blog.fizzik.com", ".nf.id.au", ".markmilian.com", ".log.riku.me", ".sogrady.me", ".vatn.org", ".veempiire.com", ".www.vegorpedersen.com", ".ventureswell.com", ".webfee.tk", ".whereiswerner.com", ".zhong.pp.ru", ".power.com", ".powerapple.com", ".abc.pp.ru", ".heix.pp.ru", ".prayforchina.net", ".premeforwindows7.com", ".presentationzen.com", ".prestige-av.com", ".privacybox.de", ".privateinternetaccess.com", ".privatepaste.com", ".privatetunnel.com", ".procopytips.com", ".provideocoalition.com", ".prosiben.de", ".proxifier.com", ".api.proxlet.com", ".proxomitron.info", ".proxy.org", ".proxypy.net", ".proxyroad.com", ".prozz.net", ".psblog.name", ".psiphon.ca", ".ptt.cc", ".puffstore.com", ".pullfolio.com", ".pureconcepts.net", ".purepdf.com", ".purevpn.com", ".putlocker.com", ".pwned.com", ".python.com", ".python.com.tw", ".qanote.com", ".qi-gong.me", ".qienkuen.org", ".qixianglu.cn", ".bbs.qmzdd.com", ".qkshare.com", ".qoos.com", ".efksoft.com", ".qstatus.com", ".qtweeter.com", ".qtrac.eu", ".quadedge.com", ".www.getyouram.com", ".hiitch.com", ".qusi8.net", ".qvodzy.org", ".qxbbs.org", ".radioaustralia.net.au", ".opml.radiotime.com", ".radiovaticana.org", ".raidcall.com.tw", ".rangzen.org", ".ranyunfei.com", ".rapbull.net", ".rapidshare8.com", ".rapidsharedata.com", ".rcinet.ca", ".read100.com", ".readingtimes.com.tw", ".realraptalk.com", ".recordhistory.org", ".redtube.com", ".referer.us", ".reflectivecode.com", ".relaxbbs.com", ".renminbao.com", ".renyurenquan.org", ".subacme.rerouted.org", ".cn.reuters.com", ".revleft.com", ".retweetist.com", ".retweetrank.com", ".connectedchina.reuters.com", ".www.reuters.com", ".revver.com", ".rfa.org", ".rfachina.com", ".rfamobile.org", ".rferl.org", ".rfi.fr", ".rfi.my", ".rhcloud.com", ".rileyguide.com", ".riku.me", ".rlwlw.com", ".chinese.rnw.nl", ".rnw.nl", ".robtex.com", ".robustnessiskey.com", ".rocmp.org", ".rojo.com", ".ronjoneswriter.com", ".roodo.com", ".rsf.org", ".rsf-chinese.org", ".rssmeme.com", ".rthk.hk", ".rthk.org.hk", ".rti.org.tw", ".rushbee.com", ".rutube.ru", ".ruyiseek.com", ".rxhj.net", ".blog.s135.com", ".s1heng.com", ".s8forum.com", ".sacom.hk", ".sadpanda.us", ".saiq.me", ".salvation.org.hk", ".samair.ru", ".sammyjs.org", ".sandnoble.com", ".sankaizok.com", ".sanmin.com.tw", ".sapikachu.net", ".savemedia.com", ".savetibet.org", ".savevid.com", ".say2.info", ".scmp.com", ".scmpchinese.com", ".scribd.com", ".scriptspot.com", ".seapuff.com", ".domainhelp.search.com", ".secretchina.com", ".secretgarden.no", ".default.secureserver.net", ".securitykiss.com", ".seesmic.com", ".seevpn.com", ".seezone.net", ".sejie.com", ".sendspace.com", ".tweets.seraph.me", ".sesawe.net", ".sesawe.org", ".sethwklein.net", ".setty.com.tw", ".sevenload.com", ".sex.com", ".sex-11.com", ".sex8.cc", ".sexandsubmission.com", ".sexhu.com", ".sexhuang.com", ".sexinsex.net", ".sf.net", ".sfileydy.com", ".shadow.ma", ".shadowsocks.org", ".shahamat-english.com", ".shangfang.org", ".shapeservices.com", ".sharebee.com", ".sharecool.org", ".sharkdolphin.com", ".sharpdaily.com.hk", ".sharpdaily.hk", ".shaunthesheep.com", ".sheikyermami.com", ".shellmix.com", ".shenshou.org", ".shenyunperformingarts.org", ".shenzhoufilm.com", ".shinychan.com", ".shitaotv.org", ".shixiao.org", ".shizhao.org", ".shkspr.mobi", ".shodanhq.com", ".shopping.com", ".showtime.jp", ".ch.shvoong.com", ".shwchurch3.com", ".simplecd.org", ".simpleproductivityblog.com", ".bbs.sina.com", ".sina.com.tw", ".dailynews.sina.com", ".sina.com.hk", ".home.sina.com", ".singtao.com", ".news.singtao.ca", ".sinica.edu.tw", ".sino-monthly.com", ".sinocast.com", ".sinocism.com", ".sinomontreal.ca", ".sinonet.ca", ".sinopitt.info", ".sinoants.com", ".sinoquebec.com", ".site90.net", ".sitebro.tw", ".siteks.uk.to", ".sitemaps.org", ".sitetag.us", ".sis.xxx", ".sis001.com", ".sis001.us", ".sjum.cn", ".skimtube.com", ".skybet.com", ".skyhighpremium.com", ".bbs.skykiwi.com", ".www.skype.com", ".share.skype.com", ".xskywalker.com", ".m.slandr.net", ".slavasoft.com", ".slheng.com", ".slideshare.net", ".slime.com.tw", ".slutload.com", ".smhric.org", ".so-ga.net", ".so-news.com", ".so-net.net.tw", ".soc.mil", ".sockslist.net", ".sod.co.jp", ".softether.org", ".softether-download.com", ".sogclub.com", ".sohcradio.com", ".www.somee.com", ".sorting-algorithms.com", ".soumo.info", ".soup.io", ".slinkset.com", ".slickvpn.com", ".snaptu.com", ".sneakme.net", ".snooper.co.uk", ".sobees.com", ".socialwhale.com", ".softether.co.jp", ".softwarebychuck.com", ".blog.sogoo.org", ".soh.tw", ".sohfrance.org", ".chinese.soifind.com", ".sokamonline.com", ".somee.com", ".songjianjun.com", ".sopcast.com", ".sopcast.org", ".soundcloud.com", ".soundofhope.org", ".soupofmedia.com", ".sourceforge.net", ".southnews.com.tw", ".sowers.org.hk", ".wlx.sowiki.net", ".space-scape.com", ".spankwire.com", ".spb.com", ".speedpluss.org", ".spencertipping.com", ".spinejs.com", ".sproutcore.com", ".squarespace.com", ".ssh91.com", ".cdn.sstatic.net", ".www.stackfile.com", ".usinfo.state.gov", ".starp2p.com", ".startpage.com", ".state168.com", ".steel-storm.com", ".sthoo.com", ".stickam.com", ".stickeraction.com", ".stonegames.net", ".stoneip.info", ".storagenewsletter.com", ".stoptibetcrisis.net", ".stoweboyd.com", ".streamingthe.net", ".cn.streetvoice.com", ".cn2.streetvoice.com", ".tw.streetvoice.com", ".strongvpn.com", ".student.tw", ".stupidvideos.com", ".sufeng.org", ".sugarsync.com", ".summify.com", ".suoluo.org", ".api.supertweet.net", ".www.supertweet.net", ".surfeasy.com.au", ".svwind.com", ".sweux.com", ".swift-tools.net", ".sydneytoday.com", ".syncback.com", ".sysadmin1138.net", ".sysresccd.org", ".sytes.net", ".blog.syx86.com", ".blog.syx86.cn", ".szbbs.net", ".szetowah.org.hk", ".t35.com", ".t66y.com", ".taa-usa.org", ".tabtter.jp", ".tacem.org", ".tafaward.com", ".tagwalk.com", ".taipei.gov.tw", ".taipeisociety.org", ".taiwandaily.net", ".taiwantt.org.tw", ".taiwankiss.com", ".taiwannation.com", ".taiwannation.com.tw", ".taiwannews.com.tw", ".taiwanus.net", ".taiwanyes.com", ".taiwan-sex.com", ".tamiaode.tk", ".tanc.org", ".tangben.com", ".taolun.info", ".blog.taragana.com", ".taweet.com", ".tbpic.info", ".tchrd.org", ".teamseesmic.com", ".teashark.com", ".techlifeweb.com", ".techparaiso.com", ".teck.in", ".telecomspace.com", ".telegraph.co.uk", ".tenacy.com", ".theampfactory.com", ".theappleblog.com", ".theatrum-belli.com", ".thebodyshop-usa.com", ".theblemish.com", ".thebcomplex.com", ".thechinabeat.org", ".thedieline.com", ".thedw.us", ".thegatesnotes.com", ".thehousenews.com", ".thehun.net", ".thelifeyoucansave.com", ".thelius.org", ".thepiratebay.org", ".thepiratebay.se", ".theqii.info", ".thereallove.kr", ".thesartorialist.com", ".thespeeder.com", ".thetibetpost.com", ".thetrotskymovie.com", ".thevivekspot.com", ".thisav.com", ".thkphoto.com", ".thomasbernhard.org", ".threatchaos.com", ".throughnightsfire.com", ".thumbzilla.com", ".tiananmenmother.org", ".tiananmenuniv.com", ".tiananmenuniv.net", ".tiandixing.org", ".tianhuayuan.com", ".tiantibooks.org", ".tianzhu.org", ".tibet.com", ".tibet.net", ".tibet.org.tw", ".tibetalk.com", ".tibetanyouthcongress.org", ".tibetfund.org", ".tibetonline.com", ".tibetonline.tv", ".tibetwrites.org", ".time.com", ".blog.tiney.com", ".tinychat.com", ".tinypaste.com", ".tidyread.com", ".tistory.com", ".tkcs-collins.com", ".tkforum.tk", ".cn.tmagazine.com", ".tmi.me", ".tnaflix.com", ".togetter.com", ".tokyo-247.com", ".tokyo-hot.com", ".tokyocn.com", ".tonyyan.net", ".toodoc.com", ".toonel.net", ".topnews.in", ".topshare.us", ".topshareware.com", ".topstyle4.com", ".topsy.com", ".tora.to", ".torproject.org", ".torrentcrazy.com", ".torvpn.com", ".touch99.com", ".toutfr.com", ".tpi.org.tw", ".transgressionism.org", ".travelinlocal.com", ".trendsmap.com", ".trialofccp.org", ".tripod.com", ".trtc.com.tw", ".trulyergonomic.com", ".trustedbi.com", ".truth101.co.tv", ".truthcn.com", ".truveo.com", ".tsemtulku.com", ".tsquare.tv", ".tsunagarumon.com", ".tsctv.net", ".tt1069.com", ".tttan.com", ".ttv.com.tw", ".tuanzt.com", ".tube.com", ".tube8.com", ".tubecao.com", ".tubewolf.com", ".tuidang.net", ".tuidang.org", ".bbs.tuitui.info", ".tumutanzi.com", ".tunein.com", ".tunnelbear.com", ".turbobit.net", ".turningtorso.com", ".tuxtraining.com", ".301works.org", ".365singles.com.ar", ".all-that-is-interesting.com", ".art-or-porn.com", ".news.atebits.com", ".tumblr.awflasher.com", ".badassjs.com", ".basetimesheightdividedby2.com", ".benjaminste.in", ".blog.birdhouseapp.com", ".bobulate.com", ".bonjourlesgeeks.com", ".bookshelfporn.com", ".blog.boxcar.io", ".blog.bitly.com", ".chevronwp7.com", ".clientsfromhell.net", ".codeboxapp.com", ".cookingtothegoodlife.com", ".cubicle17.com", ".photos.dailyme.com", ".davidslog.com", ".blog.davidziegler.net", ".blog.dayoneapp.com", ".drewolanoff.com", ".blog.dribbble.com", ".chaos.e-spacy.com", ".eamonnbrennan.com", ".everyday-carry.com", ".eyespirit.info", ".life.fly4ever.me", ".fredwilson.vc", ".fuckgfw.com", ".geekmade.co.uk", ".generesis.com", ".news.ghostery.com", ".givemesomethingtoread.com", ".blog.gowalla.com", ".heiyo.info", ".hellonewyork.us", ".blog.hotpotato.com", ".ialmostlaugh.com", ".blog.ifttt.com", ".blog.instagram.com", ".blog.instapaper.com", ".interestinglaugh.com", ".blog.iphone-dev.org", ".jayparkinsonmd.com", ".blog.joeyrobert.org", ".kt.kcome.org", ".my.keso.cn", ".blog.kickstarter.com", ".blog.kl.am", ".blog.klip.me", ".t.kun.im", ".blog.lightbox.com", ".littlebigdetails.com", ".lovequicksilver.com", ".lyricsquote.com", ".madmenunbuttoned.com", ".marco.org", ".minimalmac.com", ".mixedmedialabs.com", ".modfetish.com", ".blog.mongodb.org", ".navigeaters.com", ".london.neighborhoodr.com", ".blog.path.com", ".parislemon.com", ".blog.pikchur.com", ".blog.rockmelt.com", ".blog.romanandreg.com", ".solozorro.tk", ".blog.sparrowmailapp.com", ".stuffimreading.com", ".blog.summify.com", ".thedailywh.at", ".theinternetwishlist.com", ".thisiswhyyouarefat.com", ".www.tiffanyarment.com", ".tjholowaychuk.com", ".tomsc.com", ".blog.topify.com", ".thehungrydudes.com", ".tumblweed.org", ".status.twhirl.org", ".blog.usa.gov", ".photo.utom.us", ".v-state.org", ".wellplacedpixels.com", ".whydidyoubuymethat.com", ".wordboner.com", ".wordsandturds.com", ".worstthingieverate.com", ".xmusic.fm", ".xuzhuoer.com", ".bd.zhe.la", ".cocoa.zonble.net", ".tv.com", ".www.tv.com", ".tv-intros.com", ".tvants.com", ".forum.tvb.com", ".tvboxnow.com", ".tvider.com", ".tvunetworks.com", ".twa.sh", ".twapperkeeper.com", ".twaud.io", ".twbbs.net.tw", ".twbbs.org", ".twbbs.tw", ".twblogger.com", ".tweepmag.com", ".tweepml.org", ".tweetbackup.com", ".tweetboard.com", ".tweetboner.biz", ".tweetdeck.com", ".deck.ly", ".tweete.net", ".m.tweete.net", ".mtw.tl", ".tweetedtimes.com", ".tweetmeme.com", ".tweetmylast.fm", ".tweetphoto.com", ".tweetrans.com", ".tweetree.com", ".tweetwally.com", ".tweetymail.com", ".twftp.org", ".twibase.com", ".twibble.de", ".twibbon.com", ".twibs.com", ".twicsy.com", ".twifan.com", ".twiffo.com", ".twilog.org", ".twimbow.com", ".twindexx.com", ".twipple.jp", ".twip.me", ".twistar.cc", ".twisternow.com", ".twistory.net", ".twitbrowser.net", ".twitcause.com", ".twitgether.com", ".twiggit.org", ".twitgoo.com", ".twitiq.com", ".twitlonger.com", ".tl.gd", ".twitoaster.com", ".twitonmsn.com", ".twitpic.com", ".twitreferral.com", ".twit2d.com", ".twitstat.com", ".dotheyfolloweachother.com", ".firstfivefollowers.com", ".retweeteffect.com", ".tweeplike.me", ".tweepguide.com", ".turbotwitter.com", ".twitvid.com", ".t.co", ".twt.tl", ".twimg.com", ".twittbot.net", ".twitter.com", ".twitter.jp", ".twttr.com", ".twitter4j.org", ".twittercounter.com", ".twitterfeed.com", ".twittergadget.com", ".twitterkr.com", ".twittermail.com", ".twittertim.es", ".twitthat.com", ".twitturly.com", ".twitzap.com", ".twiyia.com", ".twreg.info", ".twstar.net", ".twtkr.com", ".twtrland.com", ".twurl.nl", ".twyac.org", ".tycool.com", ".tynsoe.org", ".tzangms.com", ".typepad.com", ".blog.expofutures.com", ".legaltech.law.com", ".www.loiclemeur.com", ".latimesblogs.latimes.com", ".blog.palm.com", ".blogs.tampabay.com", ".contests.twilio.com", ".embr.in", ".guomin.us", ".srcf.ucam.org", ".ucdc1998.org", ".uderzo.it", ".udn.com", ".ufreevpn.com", ".ugo.com", ".uhrp.org", ".uighurbiz.net", ".ulike.net", ".www.ukchinese.com", ".ukliferadio.co.uk", ".ultravpn.fr", ".ultraxs.com", ".unblock.cn.com", ".uncyclomedia.org", ".uncyclopedia.info", ".unholyknight.com", ".uni.cc", ".unicode.org", ".uniteddaily.com.my", ".unix100.com", ".unknownspace.org", ".unpo.org", ".uocn.org", ".tor.updatestar.com", ".upload4u.info", ".uploaded.to", ".uploadstation.com", ".www.urbanoutfitters.com", ".url.com.tw", ".urlborg.com", ".urlparser.com", ".us.to", ".usacn.com", ".beta.usejump.com", ".usfk.mil", ".earthquake.usgs.gov", ".usmc.mil", ".ustream.tv", ".uushare.com", ".uwants.com", ".uwants.net", ".uyghurcongress.org", ".uygur.org", ".v70.us", ".vaayoo.com", ".value-domain.com", ".van698.com", ".vanemu.cn", ".vanilla-jp.com", ".vansky.com", ".vapurl.com", ".vcf-online.org", ".vcfbuilder.org", ".velkaepocha.sk", ".veoh.com", ".verizon.net", ".verybs.com", ".vft.com.tw", ".videobam.com", ".videomo.com", ".vidoemo.com", ".viki.com", ".vimeo.com", ".vimgolf.com", ".vimperator.org", ".vincnd.com", ".vinniev.com", ".video.tiscali.it", ".vmixcore.com", ".cn.voa.mobi", ".tw.voa.mobi", ".voachineseblog.com", ".voagd.com", ".voacantonese.com", ".voachinese.com", ".voatibetan.com", ".voanews.com", ".vocn.tv", ".vot.org", ".www.voy.com", ".www.vpncup.com", ".vpnbook.com", ".vpnfire.com", ".vpngate.jp", ".vpngate.net", ".vpnpop.com", ".vpnpronet.com", ".vtunnel.com", ".lists.w3.org", ".waffle1999.com", ".jyzj.waqn.com", ".wahas.com", ".waigaobu.com", ".waikeung.org", ".waiwaier.com", ".wallornot.org", ".wallpapercasa.com", ".www.wan-press.org", ".wanderinghorse.net", ".wangafu.net", ".wangjinbo.org", ".wanglixiong.com", ".wangruoshui.net", ".www.wangruowang.org", ".want-daily.com", ".wapedia.mobi", ".makzhou.warehouse333.com", ".washeng.net", ".wattpad.com", ".wearn.com", ".hudatoriq.web.id", ".web2project.net", ".webbang.net", ".weblagu.com", ".webs-tv.net", ".webshots.com", ".websitepulse.com", ".webworkerdaily.com", ".weeewooo.net", ".weekmag.info", ".wefong.com", ".weiboleak.com", ".weijingsheng.org", ".weiming.info", ".weiquanwang.org", ".wengewang.com", ".wengewang.org", ".wenhui.ch", ".wenku.com", ".wenxuecity.com", ".wenyunchao.com", ".westca.com", ".westernwolves.com", ".hkg.westkit.net", ".www.wet123.com", ".wepn.info", ".wetpussygames.com", ".wexiaobo.org", ".wezhiyong.org", ".wezone.net", ".wforum.com", ".whatblocked.com", ".whippedass.com", ".whylover.com", ".whyx.org", ".evchk.wikia.com", ".uncyclopedia.wikia.com", ".wikileaks.ch", ".wikileaks.de", ".wikileaks.eu", ".wikileaks.lu", ".wikileaks.org", ".wikileaks.pl", ".collateralmurder.com", ".collateralmurder.org", ".wikilivres.info", ".wikimapia.org", ".secure.wikimedia.org", ".wikimedia.org.mo", ".zh.wikinews.org", ".wikiwiki.jp", ".sports.williamhill.com", ".willw.net", ".windowsphoneme.com", ".winwhispers.info", ".wiredbytes.com", ".wiredpen.com", ".wisevid.com", ".witopia.net", ".wo.tc", ".woeser.com", ".wolfax.com", ".womensrightsofchina.org", ".woopie.jp", ".woopie.tv", ".workatruna.com", ".worldcat.org", ".worldjournal.com", ".wordpress.com", ".woxinghuiguo.com", ".wow-life.net", ".wpoforum.com", ".wqlhw.com", ".wqyd.org", ".wretch.cc", ".wsj.com", ".wtfpeople.com", ".wuala.com", ".wuerkaixi.com", ".wufi.org.tw", ".wujie.net", ".wujieliulan.com", ".wukangrui.net", ".wwitv.com", ".wzyboy.im", ".www.x-berry.com", ".x-art.com", ".x-wall.org", ".x1949x.com", ".x365x.com", ".xanga.com", ".xbookcn.com", ".x.xcity.jp", ".xcritic.com", ".destiny.xfiles.to", ".xfm.pp.ru", ".xgmyd.com", ".xh4n.cn", ".xhamster.com", ".one.xthost.info", ".xiaochuncnjp.com", ".s.xiaod.in", ".xiaohexie.com", ".xiaoma.org", ".xiezhua.com", ".xing.com", ".xinmiao.com.hk", ".xinsheng.net", ".xinshijue.com", ".xinhuanet.org", ".xizang-zhiye.org", ".xjp.cc", ".xml-training-guide.com", ".xmovies.com", ".xnxx.com", ".xpdo.net", ".xpud.org", ".k2.xrea.com", ".xtube.com", ".blog.xuite.net", ".vlog.xuite.net", ".xuzhiyong.net", ".xuchao.org", ".xuchao.net", ".xvedios.com", ".xvideos.com", ".xxbbx.com", ".xxxx.com.au", ".xys.org", ".xysblogs.org", ".xyy69.com", ".xyy69.info", ".bid.yahoo.com", ".yahoo.co.jp", ".yahoo.com.tw", ".hk.yahoo.com", ".knowledge.yahoo.com", ".myblog.yahoo.com", ".news.yahoo.com", ".rd.yahoo.com", ".search.yahoo.com", ".meme.yahoo.com", ".tw.yahoo.com", ".pulse.yahoo.com", ".upcoming.yahoo.com", ".video.yahoo.com", ".yahoo.com.hk", ".yam.com", ".yasni.co.uk", ".yasukuni.or.jp", ".ydy.com", ".yeelou.com", ".yeeyi.com", ".yegle.net", ".yfrog.com", ".yhcw.net", ".yi.org", ".yidio.com", ".yilubbs.com", ".xa.yimg.com", ".yipub.com", ".yogichen.org", ".yong.hu", ".yorkbbs.ca", ".youxu.info", ".yyii.org", ".yzzk.com", ".youjizz.com", ".youmaker.com", ".youpai.org", ".your-freedom.net", ".yousendit.com", ".youthbao.com", ".youthnetradio.org", ".youthwant.com.tw", ".youporn.com", ".youtu.be", ".youtube.com", ".youtube-nocookie.com", ".youtubecn.com", ".youversion.com", ".blog.youxu.info", ".ytimg.com", ".ytht.net", ".yuanming.net", ".yunchao.net", ".yvesgeleyn.com", ".yx51.net", ".yymaya.com", ".zacebook.com", ".zannel.com", ".tap11.com", ".luntan.zaobao.com", ".zaobao.com.sg", ".zaozon.com", ".zarias.com", ".zaurus.org.uk", ".zdnet.com.tw", ".zengjinyan.org", ".zeutch.com", ".www.zfreet.com", ".zgzcjj.net", ".zhanbin.net", ".zhenghui.org", ".zhenlibu.info", ".zhinengluyou.com", ".zhongguotese.net", ".zhongmeng.org", ".zhreader.com", ".zhuichaguoji.org", ".ziddu.com", ".zillionk.com", ".zinio.com", ".ziplib.com", ".zkaip.com", ".zlib.net", ".zmw.cn", ".zomobo.net", ".zonaeuropa.com", ".zootool.com", ".zoozle.net", ".writer.zoho.com", ".zshare.net", ".zsrhao.com", ".zuo.la", ".zuola.com", ".zvereff.com", ".zyzc9.com", ".upload.wikimedia.org", ".wikipedia.org", ".zh-yue.wikipedia.org", ".en.wikipedia.org", ".zh.wikipedia.org", ".m.wikipedia.org", ".zh.wikisource.org", ".gov.tw",

// Place Domains Above.
		"DOMAIN.PADDING";

reject = 118.5.49.6, 128.121.126.139, 159.106.121.75, 169.132.13.103, 188.5.4.96, 189.163.17.5, 192.67.198.6, 197.4.4.12, 202.106.1.2, 202.181.7.85, 203.161.230.171, 203.98.7.65, 207.12.88.98, 208.56.31.43, 209.145.54.50, 209.220.30.174, 209.36.73.33, 209.85.229.138, 211.94.66.147, 213.169.251.35, 216.221.188.182, 216.234.179.13, 23.89.5.60, 243.185.187.39, 249.129.46.48, 253.157.14.165, 37.61.54.158, 4.36.66.178, 46.82.174.68, 49.2.123.56, 54.76.135.1, 59.24.3.173, 64.33.88.161, 64.33.99.47, 64.66.163.251, 65.104.202.252, 65.160.219.113, 66.45.252.237, 72.14.205.104, 72.14.205.99, 74.125.127.102, 74.125.155.102, 74.125.39.102, 74.125.39.113, 77.4.7.92, 78.16.49.15, 8.7.198.45, 93.46.8.89;

}

server {
    label				= "Google"; // Primary
    timeout				= 3;
    ip					= 8.8.8.8, 8.8.4.4, 208.67.222.222, 208.67.220.220;
	proxy_only			= on;
    caching				= on;
    randomize_servers	= on;
}

rr {
	name=localhost;
	reverse=on;
	a=127.0.0.1;
	owner=localhost;
	soa=localhost,root.localhost,42,86400,900,86400,86400;
}

/* vim:set ft=c: */
~~~

这里默认使用北京联通的域名解析服务器，你也可以换成更适合自己的。当遇到被墙域名或者收到了被污染的 IP 时，再使用谷歌和 OpenDNS 的服务器。

执行 `sudo service pdnsd start` 来启动 pdnsd。

## 为使用 pdnsd 配置 Strongswan

我们刚才配置的 iptables 中并没有开启 DNS 服务需要的53端口。这个端口如果完全开放的话，VPS 提供商可能会给我们发安全警告。所以我们要利用 Strongswan 的 `updown script` 来完成对 iptables 的设置。

### 创建 leftupdown 脚本

我把这个脚本放在了 `~/ipsec_config/leftupdown`，你也可以放在你喜欢的位置。

文件内容如下。

~~~ bash
#!/bin/sh

PATH="/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/sbin"
export PATH

echo "updown executing"

ipsec _updown

case "$PLUTO_VERB:$1" in
up-client:)

iptables -C INPUT -s $PLUTO_PEER -p tcp -m tcp --dport 53 -j ACCEPT
exist=$?

if [ $exist -eq 0 ];then
	echo "updown script rule already exists for $PLUTO_PEER"
else
	echo "updown script up client $PLUTO_PEER"
	iptables -I INPUT 4 -s $PLUTO_PEER -p tcp -m tcp --dport 53 -j ACCEPT
	iptables -I INPUT 4 -s $PLUTO_PEER -p udp -m udp --dport 53 -j ACCEPT
	iptables -I INPUT 4 -s $PLUTO_PEER -p tcp -m tcp --sport 53 -j ACCEPT
	iptables -I INPUT 4 -s $PLUTO_PEER -p udp -m udp --sport 53 -j ACCEPT
fi
;;

down-client:)

echo "updown script down client $PLUTO_PEER"

iptables -D INPUT -s $PLUTO_PEER -p tcp -m tcp --dport 53 -j ACCEPT
iptables -D INPUT -s $PLUTO_PEER -p udp -m udp --dport 53 -j ACCEPT
iptables -D INPUT -s $PLUTO_PEER -p tcp -m tcp --sport 53 -j ACCEPT
iptables -D INPUT -s $PLUTO_PEER -p udp -m udp --sport 53 -j ACCEPT
;;

esac
~~~

保存好文件后，修改文件权限 `chmod 777 ~/ipsec_config/leftupdown`。

### 修改 /etc/ipsec.conf

把 `rightdns` 改成 VPS 的 IP。在 `%default` 里添加一行 `leftupdown=/path/to/your/leftupdown`，注意这里把路径换成刚才创建的 `leftupdown` 脚本的绝对路径。

执行 `sudo ipsec reload`，然后客户端重新连接一下，试试效果吧。

[Bither]:http://bither.net
[Twitter]:https://twitter.com/emptyzone0
[Shadowsocks]:http://github.com/clowwindy/shadowsocks
[ocserv]:http://www.infradead.org/ocserv/
[Justin]:https://twitter.com/Cattyhouse
[wzxjohn]:https://twitter.com/wzxjohn
[Strongswan]:http://strongswan.org/