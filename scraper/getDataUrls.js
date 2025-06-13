document.querySelectorAll('.m-item-list').forEach(list => {
  list.querySelectorAll('div[data-url]').forEach(div => {
    console.log(div.getAttribute('data-url'));
  });
});