function getCamelCase(str) {
  return str.replace(/_([a-z])/g, function (all, i) {
    return i.toUpperCase();
  });
}
function getCamelCase(str) {
  let arr = str.split("_");
  return arr
    .map((item, index) => {
      if (index === 0) {
        return item;
      } else {
        let upperCase = item.charAt(0);
        return `${upperCase}${item.slice(1)}`;
      }
    })
    .join("");
}
console.log(getCamelCase("xiao_ming"));
