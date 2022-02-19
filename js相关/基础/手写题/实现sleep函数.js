const sleep = (time) => {
  let flag = true;
  let curr = new Date();
  while (flag) {
    let now = new Date() - curr;
    if (now >= time) {
      flag = false;
    }
  }
};
console.log("当前", new Date());
sleep(1000);
console.log("sleep后", new Date());
