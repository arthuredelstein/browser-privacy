// TODO: Let's do the following:
// 1. Write each test such that the test can be printed in a string, which
//    is then evaluated and checked against a predicted value.
// 2. Have a single run_all_tests() function that returns the results in JSON.
// 3. Create a separate script that takes the results and
//    displays them on test.html or test_browser.html.
//
//  The tests can be written first, such that they define the
//  fingerprinting vectors we are trying to mitigate. "TDD". The tests
//  can be useful for browser makers to patch their browsers. Also
//  we can potentially make an automated scorecard using browserstack.com.

/* jshint esversion: 6 */

const dual_tests = function dual_tests () {

const performance_now_tests = [
  [`performance.now()`,
   `Math.floor(performance.now() / 100) * 100`],
  [`Performance.prototype.now.apply(performance)`,
   `Math.floor(performance.now() / 100) * 100`],
];

// ## Date object

const date = new Date();
const date_tests = [
  [`date.getDate()`, `date.getUTCDate()`],
  [`date.getDay()`, `date.getUTCDay()`],
  [`date.getFullYear()`, `date.getUTCFullYear()`],
  [`date.getHours()`, `date.getUTCHours()`],
  [`date.getMilliseconds()`, `date.getUTCMilliseconds()`],
  [`date.getMinutes()`, `date.getUTCMinutes()`],
  [`date.getMonth()`, `date.getUTCMonth()`],
  [`date.getSeconds()`, `date.getUTCSeconds()`],
  [`Date.prototype.getDate.call(date)`, `date.getUTCDate()`],
  [`Date.prototype.getDay.call(date)`, `date.getUTCDay()`],
  [`Date.prototype.getFullYear.call(date)`, `date.getUTCFullYear()`],
  [`Date.prototype.getHours.call(date)`, `date.getUTCHours()`],
  [`Date.prototype.getMilliseconds.call(date)`, `date.getUTCMilliseconds()`],
  [`Date.prototype.getMinutes.call(date)`, `date.getUTCMinutes()`],
  [`Date.prototype.getMonth.call(date)`, `date.getUTCMonth()`],
  [`Date.prototype.getSeconds.call(date)`, `date.getUTCSeconds()`],
];

// ## Intl object

const intl_tests = [
  [`Intl.Collator().resolvedOptions().locale`, `"en-US"`],
  [`Intl.DateTimeFormat().resolvedOptions().locale`, `"en-US"`],
  [`Intl.NumberFormat().resolvedOptions().locale`, `"en-US"`],
  [`new Intl.PluralRules().resolvedOptions().locale`, `"en-US"`],
];

const dual_navigator_tests = [
  [`navigator.hardwareConcurrency`, 2],
  [`navigator.language`, `"en-US"`],
  [`navigator.languages.toString()`, `"en-US,en"`],
];

const event_tests = [
  [`new Event("test").timeStamp % 100`, `0`],
];

const test_pairs = (pairs) => pairs.map(
  ([expression, spoof_expression]) => {
    let actual_value, desired_value;
    let failure = false;
    try {
      actual_value = eval(expression);
    } catch (e) {
      actual_value = e.message;
      failure = true;
      console.log(e);
    }
    try {
      desired_value = eval(spoof_expression);
    } catch (e) {
      desired_value = e.message;
      failure = true;
      console.log(e);
    }
    const passed = !failure && (actual_value === desired_value);
    return { expression, spoof_expression, actual_value, desired_value, passed };
  });

const run_all_tests = function () {
  return [].concat(
    test_pairs(intl_tests),
    test_pairs(dual_navigator_tests),
    test_pairs(performance_now_tests),
    test_pairs(date_tests),
    test_pairs(event_tests),
  );
};

// end dual_tests function
return { test_results: run_all_tests(),
         test_pairs: self.Window ? test_pairs : undefined };
};

const prelude = `
  window.mouseEvent = new MouseEvent("click", { clientX: 10, clientY: 20 });
`;

const window_property_tests = [
  [`screenX`, 0],
  [`screenY`, 0],
  [`outerWidth`, `innerWidth`],
  [`outerHeight`, `innerHeight`],
  [`devicePixelRatio`, 1]
];

const performance_timing_tests = [
  [`performance.timing.connectEnd`, 0],
  [`performance.timing.connectStart`, 0],
  [`performance.timing.domComplete`, 0],
  [`performance.timing.domContentLoadedEventEnd`, 0],
  [`performance.timing.domContentLoadedEventStart`, 0],
  [`performance.timing.domInteractive`, 0],
  [`performance.timing.domLoading`, 0],
  [`performance.timing.domainLookupEnd`, 0],
  [`performance.timing.domainLookupStart`, 0],
  [`performance.timing.fetchStart`, 0],
  [`performance.timing.loadEventEnd`, 0],
  [`performance.timing.loadEventStart`, 0],
  [`performance.timing.navigationStart`, 0],
  [`performance.timing.redirectEnd`, 0],
  [`performance.timing.redirectStart`, 0],
  [`performance.timing.requestStart`, 0],
  [`performance.timing.responseEnd`, 0],
  [`performance.timing.responseStart`, 0],
  [`performance.timing.secureConnectionStart`, 0],
  [`performance.timing.unloadEventEnd`, 0],
  [`performance.timing.unloadEventStart`, 0],
];

const screen_tests = [
  [`screen.width`, `innerWidth`],
  [`screen.height`, `innerHeight`],
  [`Screen.prototype.__lookupGetter__("width").apply(screen)`,
   `innerWidth`],
  [`Screen.prototype.__lookupGetter__("height").apply(screen)`,
   `innerHeight`],
];

let navigator_tests = [
  [`navigator.buildID === undefined || navigator.buildID === "20181001000000"`, true],
  [`navigator.getBattery`, undefined],
  [`try {
      navigator.getBattery();
      true;
    } catch (e) {
      false;
   }`,
   `false`],
  [`navigator.mimeTypes.length`, 0],
  [`navigator.plugins.length`, 0],
  [`Object.getPrototypeOf(navigator.plugins) === PluginArray.prototype`, true],
  [`Object.getPrototypeOf(navigator.mimeTypes) === MimeTypeArray.prototype`, true],
  [`Object.keys(navigator.mimeTypes).length`, 0],
  [`Object.keys(navigator.plugins).length`, 0],
  [`navigator.mimeTypes[0]`, undefined],
  [`navigator.plugins[0]`, undefined],
  [`Navigator.prototype.__lookupGetter__("plugins").call(navigator).length`, 0],
  [`Navigator.prototype.__lookupGetter__("mimeTypes").call(navigator).length`, 0],
];

if (navigator.getGamepads) {
  navigator_tests.concat([
    [`navigator.getGamepads().length`, 0],
    [`Array.isArray(navigator.getGamepads())`, true],
    [`Navigator.prototype.getGamepads.call(navigator).length`, 0],
  ]);
};

const mouse_event_tests = [
  [`mouseEvent.screenX`, `mouseEvent.clientX`],
  [`mouseEvent.screenY`, `mouseEvent.clientY`],
  [`mouseEvent.timeStamp % 100`, `0`],
];

const run_in_worker = function (aFunction) {
  return new Promise(resolve => {
    const worker = new Worker(
      URL.createObjectURL(
        new Blob([
          `postMessage((${aFunction.toString()})())`
        ])
      )
    );
    worker.onmessage = msg => resolve(msg.data);
  });
};

const list_to_map = (list, keyFn) => {
  let obj = {};
  for (let item of list) {
    let key = keyFn(item);
    obj[key] = item;
  };
  return obj;
};

const run_all_tests = async function () {
  let { test_pairs, test_results } = dual_tests();
  let { test_results: test_results_worker } = await run_in_worker(dual_tests);
  test_results_worker.map(t => Object.assign(t, {worker: true}));
  eval(prelude);
  let all_tests = test_results.concat(
    ...test_results_worker,
    test_pairs(window_property_tests),
    test_pairs(navigator_tests),
    test_pairs(screen_tests),
    test_pairs(performance_timing_tests),
    test_pairs(mouse_event_tests),
  );
  return list_to_map(all_tests,
                     x => x.expression + (x.worker ? " [Worker]" : ""));
};
