---
layout: page
title: Projects
---

<p class="message">
	Projects I build or contribute to.
</p>

{% assign projects = site.data.projects %}

<div class="posts" style="margin-top: 0em">
{% for project in projects %}
	<div class="post" style="margin-bottom: 2em">
		<h2> {{ project.name }} </h2>
		{% if project.desc %}
			{{ project.desc }}
		{% endif %}
		{% if project.links %}
			<ul>
			{% assign links = project.links%}
			{% for link in links %}
					<li><a href="{{ link.url }}">{{ link.name }}</a> <span>{{ link.desc }}</span></li>
			{% endfor %}
			</ul>
		{% endif %}
	</div>
{% endfor %}
</div>