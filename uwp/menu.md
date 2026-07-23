---
layout: uwp
category: class
---
<header class="course-hero">
  <span class="eyebrow">COURSE MAP</span>
  <h1>你的日语学习路线</h1>
  <p>初学者建议从初级第 1 单元开始。每个单元学习 4 课，每课分两天完成，不需要一次学完所有内容。</p>
  <div class="course-plan">
    <span><b>建议节奏</b> 每周 2 课</span>
    <span><b>每日时长</b> 15–25 分钟</span>
    <span><b>入门周期</b> 约 12 周</span>
  </div>
</header>

<div class="level-tabs" aria-label="课程级别">
  <a href="#beginner">初级课程 <small>48 课</small></a>
  <a href="#intermediate">中级课程 <small>32 课</small></a>
</div>

<section id="beginner" class="course-level">
  <div class="course-level-heading"><div><span>初</span><h2>初级课程<small>从基础句型到日常会话</small></h2></div><b>建议从这里开始</b></div>
  <div class="unit-grid">
  {% for uid in (1..12) %}
    <details class="unit-card"{% if uid == 1 %} open{% endif %}>
      <summary><span>UNIT {{uid}}</span><strong>初级 第 {{uid}} 单元</strong><small>4 课 · 点击展开</small></summary>
      <div class="unit-lessons">
      {% for idx in (1..4) %}
        {% assign lid = uid | minus: 1 | times: 4 | plus: idx %}
        {% assign id = lid | prepend: "l" %}{% assign lesson = site.data.lessons[id] %}
        {% if lesson.title %}{% assign title = lesson.title %}
        {% else %}{% assign title = lesson.basic4 | newline_to_br | strip_newlines | split: '<br />' | first | remove: "> * " %}{% endif %}
        <a class="japan" href="l/lesson{{lid}}.html"><span>{{lid}}</span><p><b>第 {{lid}} 课</b><small>{{title}}</small></p><i>→</i></a>
      {% endfor %}
      </div>
    </details>
  {% endfor %}
  </div>
</section>

<section id="intermediate" class="course-level">
  <div class="course-level-heading"><div><span>中</span><h2>中级课程<small>提升阅读、会话与表达</small></h2></div></div>
  <div class="unit-grid">
  {% for uid in (1..8) %}
    <details class="unit-card">
      <summary><span>UNIT {{uid}}</span><strong>中级 第 {{uid}} 单元</strong><small>4 课 · 点击展开</small></summary>
      <div class="unit-lessons">
      {% for idx in (1..4) %}
        {% assign lid = uid | minus: 1 | times: 4 | plus: idx %}
        {% assign id = lid | prepend: "m" %}{% assign lesson = site.data.mlessons[id] %}
        <a class="japan" href="m/lesson{{lid}}.html"><span>{{lid}}</span><p><b>第 {{lid}} 课</b><small>{{lesson.contitle}}</small></p><i>→</i></a>
      {% endfor %}
      </div>
    </details>
  {% endfor %}
  </div>
</section>
<script>
$(document).ready(function() {
  $('a').each(function() {
    $(this).html(japanruby($(this).html()));
  });
});
</script>
