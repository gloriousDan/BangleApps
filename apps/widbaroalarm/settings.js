(function(back) {
  const SETTINGS_FILE = "widbaroalarm.json";
  const storage = require('Storage');
  let settings = Object.assign(
    storage.readJSON("widbaroalarm.default.json", true) || {},
    storage.readJSON(SETTINGS_FILE, true) || {}
  );

  function save(key, value) {
    settings[key] = value;
    storage.write(SETTINGS_FILE, settings);
  }

  function showMainMenu() {
    let menu ={
      '': { 'title': 'Barometer alarm widget' },
      /*LANG*/'< Back': back,
      "Interval": {
        value: settings.interval,
        min: 0,
        max: 120,
        step: 1,
        format: x => {
          return x != 0 ? x + ' min' : 'off';
        },
        onchange: x => save("interval", x)
      },
      "Low alarm": {
        value: settings.lowalarm,
        format: x => {
          return x ? 'Yes' : 'No';
        },
        onchange: x => save("lowalarm", x),
      },
      "Low threshold": {
        value: settings.min,
        min: 600,
        max: 1000,
        step: 5,
        onchange: x => save("min", x),
      },
      "High alarm": {
        value: settings.highalarm,
        format: x => {
          return x ? 'Yes' : 'No';
        },
        onchange: x => save("highalarm", x),
      },
      "High threshold": {
        value: settings.max,
        min: 700,
        max: 1100,
        step: 5,
        onchange: x => save("max", x),
      },
      "Drop alarm": {
        value: settings.drop3halarm,
        min: 0,
        max: 10,
        step: 1,
        format: x => {
          return x != 0 ? x + ' hPa/3h' : 'off';
        },
        onchange: x => save("drop3halarm", x)
      },
      "Raise alarm": {
        value: settings.raise3halarm,
        min: 0,
        max: 10,
        step: 1,
        format: x => {
          return x != 0 ? x + ' hPa/3h' : 'off';
        },
        onchange: x => save("raise3halarm", x)
      },
      "Show widget": {
        value: settings.show,
        format: x => {
          return x ? 'Yes' : 'No';
        },
        onchange: x => save('show', x)
      },
      "Buzz on alarm": {
        value: settings.buzz,
        format: x => {
          return x ? 'Yes' : 'No';
        },
        onchange: x => save('buzz', x)
      },
      'Dismiss delay': {
      value: settings.dismissDelayMin,
      min: 5, max: 60,
      onchange: v => {
        save('dismissDelayMin', v)
      },
      format: x => {
        return x + " min";
      }
    },
    'Pause delay': {
      value: settings.pauseDelayMin,
      min: 30, max: 240,
      onchange: v => {
        save('pauseDelayMin', v)
      },
      format: x => {
        return x + " min";
      }
    },
    'Log graph': () => {E.showMenu(); draw();},
    };
    E.showMenu(menu);
  }

  function draw() {
    const history3 = require('Storage').readJSON("widbaroalarm.log.json", true) || []; // history of recent 3 hours
    const data = history3.map(o => o.p);
    const now = new Date()/1000;

    Bangle.setUI({
      mode: "custom",
      back: () => showMainMenu(),
    });

    g.reset().setFont("6x8",1);
    require("graph").drawLine(g, data, {
      axes: true,
      x: 4,
      y: Bangle.appRect.y+8,
      height: Bangle.appRect.h-20,
      gridx: 1,
      gridy: 1,
      miny: Math.min.apply(null, data),
      maxy: Math.max.apply(null, data),
      title: /*LANG*/"Barometer history (mBar)",
      ylabel: y => y,
      xlabel: i => {
        if (i % 4 === 0) {
          return "-" + Math.round((now-history3[i].ts)/(60*60));
        } else {
          return "";
        }
      },
    });
  }

  showMainMenu();
});
