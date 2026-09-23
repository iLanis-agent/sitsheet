/* SitSheet engine - pure brief-building, shared by app.html and node tests. */
(function(root, factory){
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SitSheetEngine = factory();
})(typeof self !== 'undefined' ? self : this, function(){

  /* profile: {
       home: { wifiName, wifiPass, alarm, trashDay, quirks },
       pets: [{ name, kind, feeding, meds, notes }],
       vet: { name, phone },
       plants: string,
       contacts: [{ name, phone, role }]
     }
     sit: { startISO, endISO, sitterName } */

  function fmtLong(iso){
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var p = iso.split('-');
    return months[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0];
  }

  function nightCount(startISO, endISO){
    var a = startISO.split('-'), b = endISO.split('-');
    var da = Date.UTC(+a[0], +a[1] - 1, +a[2]);
    var db = Date.UTC(+b[0], +b[1] - 1, +b[2]);
    return Math.round((db - da) / 86400000);
  }

  /* headline: "Sep 26 - Oct 2, 2026 (6 nights)"; null-safe */
  function sitLine(sit){
    if (!sit || !sit.startISO || !sit.endISO) return '';
    var n = nightCount(sit.startISO, sit.endISO);
    var sameYear = sit.startISO.split('-')[0] === sit.endISO.split('-')[0];
    var range;
    if (sameYear){
      var sp = sit.startISO.split('-'), ep = sit.endISO.split('-');
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      range = months[+sp[1] - 1] + ' ' + (+sp[2]) + ' - ' + months[+ep[1] - 1] + ' ' + (+ep[2]) + ', ' + sp[0];
    } else {
      range = fmtLong(sit.startISO) + ' - ' + fmtLong(sit.endISO);
    }
    return range + ' (' + n + ' night' + (n === 1 ? '' : 's') + ')';
  }

  function petLine(pet){
    var parts = [pet.name];
    if (pet.kind) parts[0] += ' (' + pet.kind + ')';
    if (pet.feeding) parts.push('Feeding: ' + pet.feeding);
    if (pet.meds) parts.push('Meds: ' + pet.meds);
    if (pet.notes) parts.push(pet.notes);
    return parts.join(' - ');
  }

  /* assemble the brief sections; empty fields are dropped, sections vanish if fully empty */
  function buildSections(profile, sit){
    var sections = [];
    var line = sitLine(sit);
    if (line) sections.push({ title: sit.sitterName ? 'The sit - thanks, ' + sit.sitterName + '!' : 'The sit', lines: [line] });
    if (profile.pets && profile.pets.length){
      var pl = [];
      for (var i = 0; i < profile.pets.length; i++) pl.push(petLine(profile.pets[i]));
      sections.push({ title: 'Pets', lines: pl });
      if (profile.vet && (profile.vet.name || profile.vet.phone)){
        sections.push({ title: 'Vet', lines: [[profile.vet.name, profile.vet.phone].filter(Boolean).join(' - ')] });
      }
    }
    if (profile.plants) sections.push({ title: 'Plants', lines: [profile.plants] });
    var homeLines = [];
    if (profile.home){
      if (profile.home.wifiName) homeLines.push('Wifi: "' + profile.home.wifiName + '"' + (profile.home.wifiPass ? ' - password ' + profile.home.wifiPass : ''));
      if (profile.home.alarm) homeLines.push('Alarm: ' + profile.home.alarm);
      if (profile.home.trashDay) homeLines.push('Trash goes out: ' + profile.home.trashDay);
      if (profile.home.quirks) homeLines.push(profile.home.quirks);
    }
    if (homeLines.length) sections.push({ title: 'The house', lines: homeLines });
    if (profile.contacts && profile.contacts.length){
      var cl = [];
      for (var j = 0; j < profile.contacts.length; j++){
        var c = profile.contacts[j];
        cl.push([c.name, c.phone, c.role ? '(' + c.role + ')' : ''].filter(Boolean).join(' '));
      }
      sections.push({ title: 'If anything comes up', lines: cl });
    }
    return sections;
  }

  /* validation: what should the user add before the sheet is useful */
  function gaps(profile){
    var g = [];
    if (!profile.pets || !profile.pets.length) g.push('no pets listed - add one or confirm this is a house-only sit');
    else {
      for (var i = 0; i < profile.pets.length; i++){
        if (!profile.pets[i].feeding) g.push(profile.pets[i].name + ': no feeding instructions');
      }
      if (!profile.vet || !profile.vet.phone) g.push('no vet phone number');
    }
    if (!profile.contacts || !profile.contacts.length) g.push('no emergency contact');
    if (profile.home && profile.home.wifiName && !profile.home.wifiPass) g.push('wifi name but no password');
    return g;
  }

  return {
    fmtLong: fmtLong,
    nightCount: nightCount,
    sitLine: sitLine,
    petLine: petLine,
    buildSections: buildSections,
    gaps: gaps
  };
});
