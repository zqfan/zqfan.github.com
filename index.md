---
layout: page
---
# What man is a man who doesn't make the world better

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
