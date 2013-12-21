---
layout: page
---
# What man is a man who doesn't make the world better
<ul>
  {% for post in site.posts %}
    <li>
      <span>{{ post.date | date_to_string }}</span> &raquo;
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
