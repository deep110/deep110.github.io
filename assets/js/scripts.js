---
---
$(function(){
  $(".menu-icon").click(function(){
    $("body").toggleClass("exp");
  });
});
{% if site.google_analytics %}(function(s,u,b,e,k,t,i){s['GoogleAnalyticsObject']=k;s[k]=s[k]||function(){
  (s[k].q=s[k].q||[]).push(arguments)},s[k].l=1*new Date();t=u.createElement(b),
  i=u.getElementsByTagName(b)[0];t.async=1;t.src=e;i.parentNode.insertBefore(t,i)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', '{{ site.google_analytics }}', 'auto');
ga('send', 'pageview');{% endif %}
