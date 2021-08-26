---
layout: post
title: Share Static Library From CentOS To Ubuntu
categories: Linux
description:
keywords: linux
---

Our customer has a rare case, which wants to use [Tencent Cloud SDK For C++](https://github.com/TencentCloud/tencentcloud-sdk-cpp) on Ubuntu 16.04 LTS, but the shared library we provided is compiled on CentOS 7.x.

The solution is a bit easy:

1. Provide a static library to reduce compatibility problem.
1. Make sure gcc version on two systems are compatible. In this case, we choose gcc4.8, because it is the minimum version required by the SDK and defaut version on CentOS 7.

But to get this solution costs some time, so I record it here.

## adjust cmake file

We use [the sdk example code](https://github.com/TencentCloud/tencentcloud-sdk-cpp/tree/master/example/cvm/v20170312) to demostrate it.

Firstly, install static library manually, which means copy header file to `/usr/local/include` and copy static library file to `/usr/local/lib`.
Then change the CMakeLists.txt and specify required third-party library, which means add `-lcrypto -lcurl -luuid`, for example:

```
target_link_libraries(DescribeInstances tencentcloud-sdk-cpp-cvm tencentcloud-sdk-cpp-core -lcrypto -lcurl -luuid)
```

## ssl version conflict

```
/usr/bin/ld: warning: libcrypto.so.1.0.0, needed by /usr/lib/gcc/x86_64-linux-gnu/5/../../../x86_64-linux-gnu/libcurl.so, may conflict with libcrypto.so.1.1
/usr/bin/ld: //usr/local/lib/libtencentcloud-sdk-cpp-core.a(Utils.cpp.o): undefined reference to symbol 'HMAC_CTX_init@@OPENSSL_1.0.0'
//lib/x86_64-linux-gnu/libcrypto.so.1.0.0: error adding symbols: DSO missing from command line
```

This error message is caused by multiple version crypto library, and the search order cannot resolve it correctly. We choose to remove libssl1.1 and install 1.0 version which required by libcurl.

```
sudo apt-get purge libssl-dev
sudo apt-get install libssl1.0 libssl-dev
```

On Ubuntu 18.04, it is a bit different, because its default version is openssl1.1, and cmake requires libcurl4 which requires libssl1.1. We install both version:

```
sudo apt-get install libss1.0
# it will remove cmake
sudo apt-get install libcurl-openssl1.0-dev libcurl3
sudo apt-get install cmake libcurl4
```

NOTE: DO NOT remove openssl because it is fundamental which will remove many packages and may not easy to recover.

and specify absolute path in CMakeList.txt `-luuid /usr/lib/x86_64-linux-gnu/libcurl-gnutls.so.3 /usr/lib/x86_64-linux-gnu/libcrypto.so.1.0.0`

## gcc version incompatible

The example code cannot build successfully even linked to the right library.

```
CMakeFiles/DescribeInstances.dir/DescribeInstances.cpp.o: In function `main':
DescribeInstances.cpp:(.text+0xb6): undefined reference to `TencentCloud::Credential::Credential(std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> > const&, std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> > const&)'
```

At first we don't know why the static library linked correctly but still failed with undefined reference.
After some google search, we get the idea from [here](https://stackoverflow.com/questions/1774920/can-i-use-a-shared-library-compiled-on-ubuntu-on-a-redhat-linux-machine).
Then we noticed that the library compile environment CentOS 7 has gcc4.8, while the application compile environment Ubuntu 16.04 has gcc5.4.
We decide to downgrade the gcc version on Ubuntu, and follow the instruction in [here](https://askubuntu.com/questions/312620/how-do-i-install-gcc-4-8-1-on-ubuntu-13-04):

```
sudo update-alternatives --remove-all gcc 
sudo update-alternatives --remove-all g++
sudo apt-get install gcc-4.8
sudo apt-get install g++-4.8
udo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 20
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 20
sudo update-alternatives --config gcc
sudo update-alternatives --config g++
```

Then make again, finally we have an executable file.

License: [(CC 4.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/4.0/)
