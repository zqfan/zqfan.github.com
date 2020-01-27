---
layout: post
title: "shadowsocks"
description: ""
category: 
tags: []
---
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

OS: Ubuntu 18.04

```
sudo apt-get install python3-pip
sudo pip3 install shadowsocks
sudo ssserver -p 38888 -k happytime -m aes-256-cfb -d start
```

### pip3 problems

```
$ sudo pip3 install shadowsocks
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
AttributeError: /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1: undefined symbol: EVP_CIPHER_CTX_cleanup
```

solution:

```
sudo sed -i 's/EVP_CIPHER_CTX_cleanup/EVP_CIPHER_CTX_reset/g' /usr/local/lib/python3.6/dist-packages/shadowsocks/crypto/openssl.py
```

ref: [https://www.openssl.org/docs/man1.1.0/crypto/EVP\_CIPHER\_CTX\_reset.html](https://www.openssl.org/docs/man1.1.0/crypto/EVP_CIPHER_CTX_reset.html)

```
EVP_CIPHER_CTX was made opaque in OpenSSL 1.1.0. As a result, EVP_CIPHER_CTX_reset() appeared and EVP_CIPHER_CTX_cleanup() disappeared. EVP_CIPHER_CTX_init() remains as an alias for EVP_CIPHER_CTX_reset().
```

### auto start

ref: [https://leihungjyu.com/post/ubuntu-install-shadowsocks.html](https://leihungjyu.com/post/ubuntu-install-shadowsocks.html)

### security group issue

38888 is not a common port for security group rules, don't forget to enable them.
