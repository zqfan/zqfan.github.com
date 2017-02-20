---
layout: page
---
# ZhiQiang Fan's Blog

<h3>Documentations</h3>
<ul>
  <li><a href="./assets/doc/ceilometer-havana-api-v2.html">OpenStack Ceilometer Havana API V2</a></li>
  <li><a href="./assets/doc/ceilometer-juno-api-v2">OpenStack Ceilometer Juno API V2</a></li>
</ul>

<h3>New Posts</h3>
{% for post in site.posts limit:5 %}
<div>
    <p><a href="{{ post.url }}"><h3>{{ post.title }}</h3></a></p>
    <p>
      <span>{{ post.date | date_to_string }}</span>&nbsp;&nbsp;
      <span style="color:red">{{ post.category }}</span>
    </p>
    <p>{{ post.excerpt }}</p>
</div>
{% endfor %}

<hr />
<h3>Older Posts</h3>
<ul>
  {% for post in site.posts offset:5 %}
    <li>
      <span>{{ post.date | date_to_string }}</span> &raquo;
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
