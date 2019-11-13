const loginBtn = document.getElementById("in-btn");
const logoutBtn = document.getElementById("out-btn");
const runningTime = document.getElementById("running-time");
const theDay = document.getElementById("the-day");
let isLooping = false;
let inArray = [];
let outArray = [];
let currentLoginTime = 0;

const hideElements = elements =>
  elements.forEach(element => (element.style.display = "none"));
const showElements = elements =>
  elements.forEach(element => (element.style.display = "block"));

const lsSetter = (key, value) =>
  localStorage.setItem("" + key + "", JSON.stringify(value));
const lsGetter = key => JSON.parse(localStorage.getItem("" + key + ""));

const getTwoDigits = number => (number = number < 10 ? "0" + number : number);

const getLastPost = last => last[last.length - 1];

window.onload = () => {
  let tempInArray = [Date.now()];
  let tempOutArray = [Date.now()];
  let inTimes;
  let outTimes;

  if (lsGetter("inTimes") == null) lsSetter("inTimes", tempInArray);
  if (lsGetter("outTimes") == null) lsSetter("outTimes", tempOutArray);

  inTimes = lsGetter("inTimes");
  outTimes = lsGetter("outTimes");
  currentLoginTime = getLastPost(inTimes);

  console.log("current: ", currentLoginTime);

  console.log("INS: ", inTimes.length);
  console.log("OUTS: ", outTimes.length);

  if (inTimes.length > outTimes.length) isLooping = true;

  isLooping
    ? (showElements([runningTime, logoutBtn]), hideElements([loginBtn]))
    : (hideElements([runningTime, logoutBtn]), showElements([loginBtn]));

  timedCount(inTimes, outTimes);

  console.log("Latest loop: " + showWorkDay());
};

const timedCount = () => {
  runningTime.innerHTML =
    "Current loop: " + msToTime(Date.now() - currentLoginTime);
  timer = setTimeout(timedCount, 1000);
};

/**
 * LOGIN
 */
loginBtn.addEventListener("click", () => {
  const previousArray = lsGetter("inTimes");
  const time = Date.now();

  if (previousArray) inArray = previousArray;
  inArray.push(time);

  showElements([runningTime, logoutBtn]);
  hideElements([loginBtn]);

  lsSetter("inTimes", inArray);
  isLooping = true;

  console.log("Logged in:", msToDate(time));

  currentLoginTime = getLastPost(inArray);

  timedCount();
});

/**
 * LOGOUT
 */
logoutBtn.addEventListener("click", () => {
  const previousArray = lsGetter("outTimes");
  const time = Date.now();

  if (previousArray) outArray = previousArray;
  outArray.push(time);

  hideElements([runningTime, logoutBtn]);
  showElements([loginBtn]);

  console.log("Logged out:", msToDate(time));

  lsSetter("outTimes", outArray);
  isLooping = false;

  console.log("Latest loop: " + showWorkDay());

  theDay.innerHTML = "Today: " + showWorkDay();
});

const msToTime = duration => {
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let seconds = Math.floor((duration / 1000) % 60);

  hours = getTwoDigits(hours);
  minutes = getTwoDigits(minutes);
  seconds = getTwoDigits(seconds);

  return hours + ":" + minutes + ":" + seconds;
};

const msToDate = duration => {
  const time = new Date(Date(duration));
  const days = [
    "Söndag",
    "Måndag",
    "Tisdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lördag"
  ];

  const day = days[time.getDay()];
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();

  hours = getTwoDigits(hours);
  minutes = getTwoDigits(minutes);
  seconds = getTwoDigits(seconds);

  return day + ", " + hours + ":" + minutes + ":" + seconds;
};

const showWorkDay = () => {
  const inTimes = lsGetter("inTimes");
  const outTimes = lsGetter("outTimes");
  let lastIn = getLastPost(inTimes);
  isLooping && (lastIn = inTimes[inTimes.length - 2]);
  const lastOut = getLastPost(outTimes);
  const theDay = msToTime(lastOut - lastIn);
  return theDay;
};
