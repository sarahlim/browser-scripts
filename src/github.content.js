// @format

// Content script for linkifying references to PR branches.

function branchURL(tag) {
  const { title } = tag;
  const path = title.replace(':', '/tree/');
  const url = `https://github.com/${path}`;
  return url;
}

function linkify(el, href) {
  const wrapper = document.createElement('a');
  wrapper.href = href;
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

const [...tags] = document.querySelectorAll('.commit-ref');
const urls = tags.map(branchURL);

tags.map((el, i) => [el, urls[i]]).forEach(args => linkify(...args));
