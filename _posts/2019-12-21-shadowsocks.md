---
layout: post
title: "shadowsocks"
description: ""
category: Linux
tags: [shadowsocks]
---

Shadowsocks is a free and open-source encryption protocol project, widely used to circumvent Internet censorship. Shadowsocks is not a proxy on its own, but typically, the client software will connect to a third party socks5 proxy, speaking the shadowsocks language on the machine it is running on, which internet traffic can then be directed towards, similarly to an SSH tunnel. Unlike an SSH tunnel, shadowsocks can also proxy UDP traffic. [1][1]

To use shadowsocks, you need a machine which can access internet freely, such as a virtual machine of Vultr, AWS. Here is a simple example of setup via Vultr instance with Ubuntu 18.04 x64 operating system.

```
sudo apt-get install python3-pip
sudo pip3 install setuptools wheel
sudo pip3 install shadowsocks
sudo sed -i 's/EVP_CIPHER_CTX_cleanup/EVP_CIPHER_CTX_reset/g' \
    /usr/local/lib/python3.6/dist-packages/shadowsocks/crypto/openssl.py
ssserver -p 443 -k pleasechangeit -m aes-256-cfb -d start
```

Then you can download shadowsocks client and connect to the server.

### pip3 problems

```
# pip3 install shadowsocks
Traceback (most recent call last):
  File "/usr/bin/pip3", line 9, in <module>
    from pip import main
ImportError: cannot import name 'main'
```

solution:

```
sudo python3 -m pip uninstall pip
sudo apt install python3-pip --reinstall
```

ref: [https://stackoverflow.com/questions/49836676/error-after-upgrading-pip-cannot-import-name-main](https://stackoverflow.com/questions/49836676/error-after-upgrading-pip-cannot-import-name-main)

### shadowsocks problems

```
AttributeError: /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1: undefined symbol: 
EVP_CIPHER_CTX_cleanup
```

solution:

```
sudo sed -i 's/EVP_CIPHER_CTX_cleanup/EVP_CIPHER_CTX_reset/g' \
    /usr/local/lib/python3.6/dist-packages/shadowsocks/crypto/openssl.py
```

ref: [https://www.openssl.org/docs/man1.1.0/crypto/EVP\_CIPHER\_CTX\_reset.html](https://www.openssl.org/docs/man1.1.0/crypto/EVP_CIPHER_CTX_reset.html)

```
EVP_CIPHER_CTX was made opaque in OpenSSL 1.1.0. 
As a result, EVP_CIPHER_CTX_reset() appeared and EVP_CIPHER_CTX_cleanup() disappeared. 
EVP_CIPHER_CTX_init() remains as an alias for EVP_CIPHER_CTX_reset().
```

### auto start

ref: [https://leihungjyu.com/post/ubuntu-install-shadowsocks.html](https://leihungjyu.com/post/ubuntu-install-shadowsocks.html)

### security group issue

443 is not a common port for security group rules, don't forget to enable them.

[1]: https://en.wikipedia.org/wiki/Shadowsocks

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
