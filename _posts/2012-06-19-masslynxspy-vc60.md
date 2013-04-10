---
layout: post
title: "MasslynxSpy VC6.0"
description: ""
category: C++
tags: [C++, vc6.0, mfc]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## References：
spy++ & application interact:
* http://blog.csdn.net/qiujiahao/article/details/2794844
* http://blog.csdn.net/qiujiahao/article/details/2800173
* http://blog.csdn.net/qiujiahao/article/details/2828916

combo box guide & interact:
* http://topic.csdn.net/u/20111216/14/dcddebe5-6080-4fc0-a73b-e260f4b36326.html
* http://kingsundi.bokee.com/viewdiary.12742892.html
* http://blog.csdn.net/qiurisuixiang/article/details/6746234

keyboard event:
* http://topic.csdn.net/u/20110128/13/b23e1735-db3d-4a08-9376-84dd03adf66f.html (#17)
* http://msdn.microsoft.com/zh-cn/library/ms646304(en-us,VS.85).aspx

list box LBN_SELCHANGE:

* http://topic.csdn.net/t/20010819/21/246424.html (#15)

CToolTipCtrl guide:

* http://hi.baidu.com/fateyeah/blog/item/fc7c07b37ab250a7d9335aa7.html

## 背景：
由于要对大量数据中指定的物质进行分析，本人太菜，在masslynx4.1下没有找到批处理功能，quanlynx工具也没搞明白，也不知道最后能不能生成想要的图片，在masslynx user guide里也没有找到API，最后就采用如下的笨办法实施。

## Abstracts：
Use Microsoft Visual Studio 6.0 Tools -> Spy++ get caption of target window or id of component in MassLynx application, then get handler of window or component by system call, interactive with windows and components with SendMessage() and PostMessage().

## Steps：
### get window caption and component id：

use "find window" function of spy++

### get window handler：

    FindWindow(null, caption)->m_hWnd;

get component id:

    GetDlgCtrlID(hwnd);

### interactive with target component：
EnumChildWindows(hwnd, func_name, lparam); this function need a callback function to invoke， LRESUT CALLBACK func_name (HWND hwnd, LPARAM lparam), the callback function must be a static or global functon, not a member function. hwnd is this component's handler, lparam could be the handler of parent or even frame.
### mouse click message:

    SendMessage(hwnd, WN_LBUTTONDOWN, NULL, 0);
    SendMessage(hwnd, WM_LBUTTONUP, NULL, 0)

### window close message:

    SendMessage(hwnd, WM_CLOSE, NULL, 0);

window update message:

    UpdateWindow(hwnd);

### combo box interactive:
select a item, and to notify other component to update, you should click it:

    SendMessage(hwnd, CB_SHOWDROPDOWN, 1, 0);
    SendMessage(hwnd, CB_SETCURSEL, some_integer, 0);
    SendMessage(hwnd, WM_LBUTTONDOWN, 0, -1);
    SendMessage(hwnd, WM_LBUTTONUP, 0, -1);

get count of items:

    SendMessage(hwnd, CB_GETCOUNT, 0, 0);

### list box interactive:
select a item, and to notify other component to update, you should send it's parent window a notify of LBN_SELCHANGE:

    SendMessage(hwnd, LB_SETCURSEL, some_integer, 0);
    SendMessage( (HWND)GetWindowLong(hwnd, GWL_HWNDPARENT), WM_COMMAND, MAKEWPARAM(GetWindowLong(hwnd, GWL_ID), LBN_SELCHANGE), (LPARAM)hwnd);

get count of items:

    SendMessage(hwnd, LB_GETCOUNT, 0, 0);

### key event:
you should first set the target window to foreground, for example, simulate ctrl+v may like this:

    SetForegroundWindow(hwnd);
    // press CTRL
    keybd_event(VK_CONTROL, 0, KEYEVENTF_EXTENDEDKEY | 0, 0);
    // press V
    keybd_event(0x56, 0, KEYEVENTF_EXTENDEDKEY | 0, 0);
    // release V
    keybd_event(0x56, 0, KEYEVENTF_EXTENDEDKEY | KEYEVENTF_KEYUP, 0);
    // release VK_CONTROL
    keybd_event(VK_CONTROL, 0, KEYEVENTF_EXTENDEDKEY | KEYEVENTF_KEYUP, 0);

some progress are time consuming, so you may need to wait for a short time:

    Sleep(some_miliseconds);

even a window was found, it's child component may not have been initialized, so you cannot find the component immediately after you click a window creating button

## Extend:
### Add tool tips for component
* declare a member variable in dialog class: CToolTipCtrl ttc
* add content to OnInitDoalog() or OnCreate() or other suitable functions

    EnableToolTips(TRUE);
    ttc.Create(this);
    ttc.Activate(TRUE);
    ttc.AddTool(CWnd* target, tool_tip_text);

* override BOOL PreTranslateMessage(MSG* pMsg), add content to it: if (ttc.GetSafeHwnd)   ttc.RelayEvent(pMsg);
