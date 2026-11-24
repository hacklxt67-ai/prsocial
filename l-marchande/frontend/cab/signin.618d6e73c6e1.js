CAB.lang = {"af":"/cab/lang.af.signin.1eda26079811.js","am":"/cab/lang.am.signin.85a4de2c86dc.js","ar":"/cab/lang.ar.signin.8b29a7e6c352.js","as":"/cab/lang.as.signin.f8ed6f9be9f7.js","az":"/cab/lang.az.signin.c3a73266b620.js","bg":"/cab/lang.bg.signin.6d0317f9c624.js","bn":"/cab/lang.bn.signin.2c49a115dd41.js","cs":"/cab/lang.cs.signin.ec3746577a52.js","da":"/cab/lang.da.signin.d07fb6c5e475.js","de":"/cab/lang.de.signin.4ed7aad665d0.js","el":"/cab/lang.el.signin.20f6f0acfb01.js","es":"/cab/lang.es.signin.f7f432b2ab20.js","et":"/cab/lang.et.signin.f0bb946cb86c.js","fa":"/cab/lang.fa.signin.9e5aa36f90b0.js","fi":"/cab/lang.fi.signin.f166d9672dab.js","fr":"/cab/lang.fr.signin.39174aa0b1a5.js","gu":"/cab/lang.gu.signin.1216d9873529.js","ha":"/cab/lang.ha.signin.4eb6d181f2d7.js","he":"/cab/lang.he.signin.e98a39584d90.js","hi":"/cab/lang.hi.signin.eefa8b840fc2.js","hr":"/cab/lang.hr.signin.e96186eda902.js","ht":"/cab/lang.ht.signin.0a397a462d1c.js","hu":"/cab/lang.hu.signin.c5caba952fe1.js","hy":"/cab/lang.hy.signin.b614dced8e8b.js","id":"/cab/lang.id.signin.0bf312e01e7e.js","ig":"/cab/lang.ig.signin.252d8983e69a.js","is":"/cab/lang.is.signin.efaa86f005ae.js","it":"/cab/lang.it.signin.b1c4a40542c9.js","ja":"/cab/lang.ja.signin.3c8d19cfb485.js","ka":"/cab/lang.ka.signin.b5762720921d.js","kk":"/cab/lang.kk.signin.60b51907c4c7.js","km":"/cab/lang.km.signin.71e88ff9da7d.js","kn":"/cab/lang.kn.signin.53dff4e1657f.js","ko":"/cab/lang.ko.signin.cc8db29e9de7.js","ky":"/cab/lang.ky.signin.6bafc291ff89.js","ln":"/cab/lang.ln.signin.685c2e933d6d.js","lo":"/cab/lang.lo.signin.b126495c86ef.js","lt":"/cab/lang.lt.signin.5b1037a1e841.js","lv":"/cab/lang.lv.signin.b20feec4a918.js","mg":"/cab/lang.mg.signin.a6871304dba0.js","mk":"/cab/lang.mk.signin.09630bf31dc3.js","ml":"/cab/lang.ml.signin.126a1b08c767.js","mn":"/cab/lang.mn.signin.e3453b7a0ef5.js","mr":"/cab/lang.mr.signin.c838a3b8b6eb.js","ms":"/cab/lang.ms.signin.05b09e052c30.js","my":"/cab/lang.my.signin.ab84a65ccd25.js","ne":"/cab/lang.ne.signin.937a47880b3e.js","nl":"/cab/lang.nl.signin.721004c659c7.js","no":"/cab/lang.no.signin.ce5b42717a8f.js","om":"/cab/lang.om.signin.915e3e794894.js","or":"/cab/lang.or.signin.0eaf1d8cfa2a.js","pa":"/cab/lang.pa.signin.232d7fde761b.js","pl":"/cab/lang.pl.signin.401a80f3b307.js","ps":"/cab/lang.ps.signin.3c57e1f9a048.js","pt":"/cab/lang.pt.signin.461c79cd3799.js","ro":"/cab/lang.ro.signin.560027f84492.js","ru":"/cab/lang.ru.signin.597357f4583c.js","rw":"/cab/lang.rw.signin.f9056329c949.js","sd":"/cab/lang.sd.signin.9e94370a3b80.js","si":"/cab/lang.si.signin.31a7ad412568.js","sk":"/cab/lang.sk.signin.c3876acaa423.js","sl":"/cab/lang.sl.signin.ec0c9fbad3aa.js","so":"/cab/lang.so.signin.e29ff8f3ff03.js","sq":"/cab/lang.sq.signin.969e8746b644.js","sr":"/cab/lang.sr.signin.93bdd05551f9.js","sv":"/cab/lang.sv.signin.683c2419eb33.js","sw":"/cab/lang.sw.signin.aa81dd8aa423.js","ta":"/cab/lang.ta.signin.6087b66876d6.js","te":"/cab/lang.te.signin.92bbbc2676bc.js","tg":"/cab/lang.tg.signin.2b5da0a2b5fe.js","th":"/cab/lang.th.signin.975bccf3daef.js","tk":"/cab/lang.tk.signin.da450be4a443.js","tl":"/cab/lang.tl.signin.488e382ff7ab.js","tr":"/cab/lang.tr.signin.bfc52ecd9673.js","ug":"/cab/lang.ug.signin.6919bddcbb0f.js","uk":"/cab/lang.uk.signin.71cba55cbdc2.js","ur":"/cab/lang.ur.signin.4f07e5f3464c.js","uz":"/cab/lang.uz.signin.4fa3914960a5.js","vi":"/cab/lang.vi.signin.3644ea883002.js","yo":"/cab/lang.yo.signin.a014cb69044d.js","zh":"/cab/lang.zh.signin.707c56585c7d.js","zu":"/cab/lang.zu.signin.24959dd9fe34.js"};
const KIND = {
  follow: ['Follows', I.userp, (c) => pl(c, 'follow', 'follows')], subscribe: ['Subscriptions', I.userp, (c) => pl(c, 'subscription', 'subscriptions')], join: ['Joins', I.userp, (c) => pl(c, 'join', 'joins')],
  like: ['Likes', I.heart, (c) => pl(c, 'like', 'likes')], react: ['Reactions', I.smile, (c) => pl(c, 'reaction', 'reactions')], comment_custom: ['Custom comments', I.chat, (c) => pl(c, 'custom comment', 'custom comments')],
  vote: ['Votes', I.tasks, (c) => pl(c, 'vote', 'votes')], share: ['Shares', I.share, (c) => pl(c, 'share', 'shares')], retweet: ['Reposts', I.repeat, (c) => pl(c, 'repost', 'reposts')],
  comment: ['Comments', I.chat, (c) => pl(c, 'task', 'tasks')], view: ['Views', I.tasks, (c) => pl(c, 'task', 'tasks')], ads_view: ['Ad views', I.mega, (c) => pl(c, 'task', 'tasks')],
  bot_start: ['Bot starts', I.tasks, (c) => pl(c, 'task', 'tasks')], connection: ['Connections', I.userp, (c) => pl(c, 'task', 'tasks')], star: ['Stars', I.star, (c) => pl(c, 'task', 'tasks')],
  fork: ['Forks', I.layers, (c) => pl(c, 'task', 'tasks')], upvote: ['Upvotes', I.heart, (c) => pl(c, 'task', 'tasks')], other: ['Other tasks', I.tasks, (c) => pl(c, 'task', 'tasks')],
  favorite: ['Favorites', I.heart, (c) => pl(c, 'task', 'tasks')], repost: ['Music reposts', I.repeat, (c) => pl(c, 'task', 'tasks')], play: ['Plays', I.play, (c) => pl(c, 'task', 'tasks')],
  save: ['Saves', I.bookmark, (c) => pl(c, 'task', 'tasks')],
  visit: ['Visits', I.clock, (c) => pl(c, 'visit', 'visits')],
};
const KIND_AS = { comment_emoji: 'comment', comment_crypto: 'comment', comments: 'comment', view_rec: 'view', view_targeted: 'view', story_view: 'view', bot_ads_view: 'ads_view', search_ads_view: 'ads_view',
  friend: 'connection', join_vote: 'vote', like_rec: 'like', likes: 'like', reaction_rec: 'react', followers: 'follow', shazam: 'play',
  comment_like: 'like' };
const KIND_NET = { 'coub:repost': 'share', 'bluesky:repost': 'share' };
const kindKey = (a, net) => { const x = KIND_NET[net + ':' + a] || (/^visit_\d+$/.test(a) ? 'visit' : a); return KIND[x] ? x : KIND[KIND_AS[x]] ? KIND_AS[x] : 'other'; };
const kindOf = (a, net) => KIND[kindKey(a, net)];
const isCmt = (a) => String(a).startsWith('comment') && a !== 'comment_like';
const SHORT = NET_SHORT;
const isHandle = (t) => !!t && !t.includes('/');
const accAt = (k) => (['linkedin', 'facebook', 'odnoklassniki', 'boomplay', 'bilibili', 'niconico', 'bandcamp'].includes(k) ? '' : '@');
const isWide = () => window.matchMedia('(min-width:1232px)').matches;
const cnt = compact;
const OUT = 'target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer"';
const fill = (text, row, w, v) => T(String(text)).replace(/\{(\w+)\}/g, (m, k) => { const lim = () => (v && Number(v.limit)) || HOURLY[row.net + ':' + row.action] || 50, kd = () => kindOf(row.action, row.net);
  return k === 'limit' ? n(lim()) : k === 'kind' ? (kd() ? kd()[2](lim()) : pl(lim(), 'task', 'tasks')) : v && k in v ? v[k] : k === 'net' ? (w ? w.name(row.net) : row.net)
    : k === 'acc' ? '<bdi>' + accAt(row.net) + esc(taskAcc(row) || ME().name) + '</bdi>' : m; });
const dayLimitSay = (limit) => T('Daily limit reached') + ': ' + n(limit) + '.';
const hourLimitSay = (limit) => T('Hourly limit reached') + ': ' + n(limit) + '.';
const kindPausedSay = (row, w, wait) => TF('{kind} on {net} are paused for about {wait}.', { kind: T(kindOf(row.action, row.net)[0]), net: w ? w.name(row.net) : row.net, wait: wait });
function noteBox(m, row, w, opt) {
  const o = typeof opt === 'string' ? { intro: opt } : opt || {}, tone = m[0], list = Array.isArray(m[3]) ? m[3] : [], say = (x) => fill(x, row, w, o.v);
  return '<div class="note' + (tone ? ' ' + tone : '') + '">' + (tone === 'bad' || tone === 'warn' ? I.warn : I.info) + '<div>' + (m[1] ? '<b>' + say(m[1]) + '</b>' : '') + (o.quote ? '<p class="nq"><b>' + T('Reason') + '</b> <q><bdi>' + esc(o.quote) + '</bdi></q></p>' : '') + (o.intro ? '<p>' + o.intro + '</p>' : '')
    + (list.length ? '<ul>' + list.map((x) => '<li>' + say(x) + '</li>').join('') + '</ul>' : '') + (m[2] || o.tail ? '<p>' + (m[2] ? say(m[2]) : '') + (m[2] && o.tail ? ' ' : '') + (o.tail || '') + '</p>' : '') + '</div></div>';
}
const metaLine = (target, tail) => '<small class="ml">' + (target ? '<bdi>' + target + '</bdi>' : '') + '<span>' + (target ? ' · ' : '') + tail + '</span></small>';
function actBar(row) {
  return '<button type="button" class="act" data-go="resume"><span class="act-i">' + I.clock + '</span><div><b>' + T('Task in progress') + '</b><small>' + labelOf(row, { name: (k) => NET_NAME[k] || k }) + (row.target ? ' · <bdi>' + row.target + '</bdi>' : '') + ' · ' + TF('started {ago}', { ago: DT.ago(row.when) }) + '</small></div><span class="btn-w sm">' + T('Continue') + '</span></button>';
}
const FLOW = {
  follow: ['Open the profile and follow it', '', 'Shows that you follow the account', 'It does not show that you follow the account.'],
  subscribe: ['Open the channel and subscribe', '', 'Shows that you are subscribed', 'It does not show that you are subscribed.'],
  join: ['Open the channel and join it', '', 'Shows that you are a member', 'It does not show that you are a member.'],
  like: ['Open the post and like it', '', 'Shows the post with your like', 'It does not show the post with your like.'],
  comment_custom: ['Open the post and paste the comment', '', 'Shows your published comment', 'It does not show your published comment.'],
  share: ['Open the post and share it', 'Tap the Share button under the post, then choose «Send to», «Add to story» or «Copy link».', 'Shows the share menu or the confirmation', 'It does not show the share menu or the confirmation.'],
  retweet: ['Open the post and repost it', 'Tap the repost button under the post and choose «Repost».', 'Shows that the repost is done', 'It does not show that the repost is done.'],
  react: ['Open the post and add this reaction', 'Tap the reaction on the post. Do not post it as a comment.', 'Shows the post with your reaction', 'It does not show the post with your reaction.'],
  vote: ['Open the poll and choose this option', 'Tap the option with this number in the poll.', 'Shows your vote', 'It does not show your vote.'],
  comment: ['Open the post and paste the comment', '', 'Shows your published comment', 'It does not show your published comment.'],
  view: ['Open the video or the post', 'Watch the video to the end, or read the post to the end.', 'Shows the video or the post you opened', 'It does not show the video or the post you opened.'],
  favorite: ['Open the track and add it to favorites', 'Tap the heart or «Favorite» on the track.', 'Shows the track added to your favorites', 'It does not show the track added to your favorites.'],
  repost: ['Open the track and repost it', 'Tap «Repost» on the track.', 'Shows the track with your repost', 'It does not show the track with your repost.'],
  play: ['Open the track and play it', 'Listen to it for at least 30 seconds.', 'Shows the track playing', 'It does not show the track playing.'],
  shazam: ['Open the track and Shazam it', 'Play the track and let the Shazam app on your phone recognize it.', 'Shows the track recognized in Shazam', 'It does not show the track recognized in Shazam.'],
  save: ['Open the post and save it', 'Tap the bookmark under the post.', 'Shows the post saved', 'It does not show the post saved.'],
  'audius:like': ['Open the track and add it to favorites', 'Tap the heart or «Favorite» on the track.', 'Shows the track added to your favorites', 'It does not show the track added to your favorites.'],
  'bandcamp:favorite': ['Open the album or the track and add it to your wishlist', 'Tap the heart «Wishlist» on its page.', 'Shows the album or the track in your wishlist', 'It does not show the album or the track in your wishlist.'],
  'niconico:favorite': ['Open the video and add it to a mylist', 'Tap «Mylist» (マイリスト) under the video and choose a list.', 'Shows the video added to your mylist', 'It does not show the video added to your mylist.'],
  'bilibili:favorite': ['Open the video and add it to favorites', 'Tap the star (收藏) under the video and choose a folder.', 'Shows the star under the video filled', 'It does not show the star under the video filled.'],
  'coub:repost': ['Open the coub and repost it to your channel', 'Tap «Repost» under the coub and choose your channel in «My channels».', 'Shows the coub reposted to your channel', 'It does not show the coub reposted to your channel.'],
  'pinterest:save': ['Open the pin and save it to one of your boards', 'Tap «Save» on the pin and choose a board.', 'Shows the pin saved on your board', 'It does not show the pin saved on your board.'],
  'bluesky:repost': ['Open the post and repost it to your profile', 'Tap the repost button (two arrows) under the post and choose «Repost».', 'Shows the post with your repost', 'It does not show the post with your repost.'],
  'bluesky:comment': ['Open the post and post the reply', 'Tap «Reply» under the post, paste the text you got and post it.', 'Shows your reply under the post', 'It does not show your reply under the post.'],
  'reddit:comment': ['Open the post and post the comment', 'Paste the text you got as a comment on the post. If the community does not let your account comment (karma, the age of the account, its rules), cancel the task.', 'Shows your comment under the post', 'It does not show your comment under the post.'],
  'dzen:share': ['Open the article or the video and share it', 'Tap «Поделиться» (Share) under the article or the video and choose a messenger, a social network or «Копировать ссылку» (Copy link).', 'Shows the share menu open or the confirmation that the link is copied', 'It does not show the share menu or the confirmation that the link is copied.'],
  comment_like: ['Open the link and like the comment it shows', 'The comment opens at the top of the post, highlighted. Tap «Like» under that comment, not under the post.', 'Shows the comment with your like', 'It does not show the comment with your like.'],
};
const flowOf = (row) => FLOW[row.net + ':' + row.action] || FLOW[row.action] || FLOW.follow;
const SHOT_RULES = ['Your username is visible', 'Full screen, not cropped or edited'];
const PER = 10;
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
const r4 = (v) => Math.round(v * 1e4) / 1e4;
function pagerOf(p) {
  if (p.total <= PER && p.pages <= 1) return '';
  const from = (p.page - 1) * PER + 1, to = from + p.rows - 1;
  const range = '<b>' + n(from) + (to > from ? '–' + n(to) : '') + '</b>';
  return '<div class="pager"><span class="pg-t">' + (p.exact === false ? range : TF('{range} of {total}', { range, total: n(p.total) })) + '</span>'
    + '<button class="pg-b" data-page="' + (p.page - 1) + '" aria-label="' + T('Previous page') + '"' + (p.page <= 1 ? ' disabled' : '') + '>' + I.back + '</button>'
    + '<button class="pg-b" data-page="' + (p.page + 1) + '" aria-label="' + T('Next page') + '"' + (p.page >= p.pages ? ' disabled' : '') + '>' + I.chev + '</button></div>';
}
const LINK4 = { audius: ['audius.co/{h}', 'audius.co/{h}/night-drive'], bandcamp: ['citynotes.bandcamp.com', 'citynotes.bandcamp.com/album/night-drive'],
  rumble: ['rumble.com/c/{h}', 'rumble.com/v6xk2q4-night-drive.html'], bilibili: ['space.bilibili.com/3546512345', 'www.bilibili.com/video/BV1GJ411x7h7'],
  niconico: ['www.nicovideo.jp/user/12345678', 'www.nicovideo.jp/watch/sm9'], clapper: ['www.clapperapp.com/{h}', 'www.clapperapp.com/video/0rn1pJ10E1kvPeYy'],
  artstation: ['www.artstation.com/{h}', 'www.artstation.com/artwork/4LOQ8'], coub: ['coub.com/{h}', 'coub.com/view/4aoiqg'],
  reddit: ['www.reddit.com/user/{h}', 'www.reddit.com/r/AskReddit/comments/1g6x5qk/'], bluesky: ['bsky.app/profile/{h}.bsky.social', 'bsky.app/profile/{h}.bsky.social/post/3l6oveex3ii2l'],
  pinterest: ['www.pinterest.com/{h}', 'www.pinterest.com/pin/1407443629147392/'] };
function linkOf(net, row) {
  if (row.url) return row.url;
  if (row.target && !isHandle(row.target)) return row.target;
  const h = (row.target || '@citynotes').slice(1);
  if (row.action === 'comment_like') return 'www.linkedin.com/feed/update/urn:li:activity:7254101934829056000?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7254101934829056000%2C7254107763425198080%29';
  if (LINK4[net]) return LINK4[net][['follow', 'subscribe', 'join'].includes(row.action) ? 0 : 1].replace('{h}', h);
  if (['follow', 'subscribe', 'join'].includes(row.action)) return ({ instagram: 'instagram.com/', youtube: 'youtube.com/@', tiktok: 'tiktok.com/@', twitter: 'x.com/', linkedin: 'linkedin.com/company/', telegram: 't.me/', threads: 'threads.net/@', facebook: 'facebook.com/' }[net] || net + '.com/') + h;
  return ({ instagram: 'instagram.com/p/C9kQ2xLr7aM', youtube: 'youtube.com/watch?v=v_iWa0mGSq0', tiktok: 'tiktok.com/@' + h + '/video/7412203318', twitter: 'x.com/' + h.replace(/\./g, '_') + '/status/18402277', linkedin: 'linkedin.com/posts/' + h + '_7204', telegram: 't.me/' + h + '/418', threads: 'threads.net/@' + h + '/post/C9kQ2x', facebook: 'facebook.com/' + h + '/posts/7204' }[net]) || net + '.com/post/418';
}
const SI = { ttl: 10, tries: 5, resend: 30, sends: 3, trust: 30, mailWait: 2, resetHours: 1, passMin: 6 };
const SI_ERR = {
  bad: ['', 'The sign-in details are wrong', 'Check the email or the name and the password, and try again.'],
  robot: ['', 'Confirm that you are not a robot', 'Wait for the check to finish and press the button again.'],
  closed: ['', 'This account is closed', 'If you think it is a mistake, write to support@pr.social.'],
  off: ['', 'Sign-in is closed for a short while', 'We are working on the site. Please try again later.'],
  upoff: ['', 'New accounts are closed for a short while', 'We are working on the site. Please try again later.'],
  net: ['', 'No connection', 'Check your internet and try again.'],
  many: ['', 'Too many attempts', 'Sign-in is paused for a while. Please try again later.'],
  held: ['', 'Sign-in to this account is paused', 'The password was entered wrong too many times. Set a new password by email, or try again later.'],
  server: ['', 'Something went wrong on our side', 'Nothing was changed. Please try again in a minute.'],
  taken: ['', 'This email or name is already taken', 'Sign in, or choose another email and name.'],
  emailTaken: ['email', 'This email already has an account.'],
  nameTaken: ['name', 'This name is taken.'],
  upmany: ['', 'Too many attempts', 'Try again in a few minutes.'],
  email: ['email', 'This does not look like an email.'],
  refused: ['email', 'This email service is not accepted. Please use another email.'],
  name: ['name', 'From 3 to 30 characters: Latin letters, digits and _.'],
  pass: ['pass', 'Too short: at least 6 characters.'],
  link: ['', 'This link no longer works', 'It was used already or has expired. Ask for a new one.'],
};
const siF = () => STATE.f || (STATE.f = {});
const siBonusHtml = (sum) => (sum > 0 ? '<div class="si-inv si-bonus">' + I.gift + '<span>' + TF('With this code you get {sum} on your balance', { sum: '<b><bdi>$' + esc(Number(sum).toFixed(2)) + '</bdi></b>' }) + '</span></div>' : '');
const siLive = () => { const l = (STATE.site || {}).live; if (!l || !l.count || !(STATE.v === 'in' || STATE.v === 'up')) return '';
  return '<a class="si-live" href="' + href('live') + '">' + liveMark(l.spark) + '<span>' + T('Live~page') + '</span>' + I.chev + '</a>'; };
const siTools = () => '<div class="si-tools"><button class="si-lang" data-k="langs" aria-haspopup="dialog" aria-label="' + TF('{name}: {value}', { name: T('Language'), value: langOf(STATE.lang)[1] }) + '">' + I.globe + '<span lang="' + (STATE.lang || 'en') + '">' + langOf(STATE.lang)[1] + '</span>' + I.down + '</button>'
  + '<button class="si-theme" data-k="theme-toggle" role="switch" aria-checked="' + (STATE.theme === 'dark') + '" aria-label="' + T('Dark theme') + '">' + I.moon + '</button></div>';
const siFieldErr = (name) => (STATE.err && SI_ERR[STATE.err] && SI_ERR[STATE.err][0] === name ? T(SI_ERR[STATE.err][1]) : '');
const siNote = () => { const e = STATE.err && SI_ERR[STATE.err]; if (!e || e[0]) return '';
  const more = STATE.err === 'robot' && STATE.robot === 'ask' ? 'Tick “I am not a robot” and press the button again.' : e[2];
  const tip = STATE.err === 'robot' && (STATE.robotTip === 'samsung' || STATE.robotTip === 'inapp' || STATE.robotRefused >= 2) ? siHelp() : '';
  return '<div class="note warn si-note" role="alert">' + I.warn + '<div><b>' + T(e[1]) + '</b><p>' + T(more) + '</p>' + tip + '</div></div>'; };
const siFix = (name) => (STATE.err === 'emailTaken' && name === 'email' ? '<button class="si-fix" type="button" data-go="si-v" data-to="in" data-then="pass">' + T('Sign in') + ' ' + I.arrow + '</button>'
  : STATE.err === 'nameTaken' && name === 'name' && STATE.names && STATE.names.length
    ? '<div class="si-names" role="group" aria-label="' + T('This name is taken.') + '">' + STATE.names.map((n) => '<button class="si-name" type="button" data-go="si-name" data-name="' + esc(n) + '"><bdi>' + esc(n) + '</bdi></button>').join('') + '</div>' : '');
const siFld = (name, label, inner, hint) => { const err = siFieldErr(name), tip = hint ? T(hint) : ''; return '<div class="fld' + (err ? ' err' : '') + '" data-fld="' + name + '"><span>' + T(label) + '</span><div class="box-in">' + inner + '</div><small' + (err && tip ? ' data-hint="' + esc(tip) + '"' : '') + '>' + (err || tip) + '</small>' + (err ? siFix(name) : '') + '</div>'; };
const siEmail = (auto) => '<input type="email" inputmode="email" autocomplete="' + (auto || 'email') + '" autocapitalize="none" spellcheck="false" enterkeyhint="next" value="' + esc(siF().email || '') + '" data-f="email" placeholder="name@example.com" aria-label="' + T('Email') + '">';
const siLogin = () => '<input type="text" inputmode="email" autocomplete="username" autocapitalize="none" spellcheck="false" enterkeyhint="next" value="' + esc(siF().email || '') + '" data-f="email" placeholder="name@mail.com · username" aria-label="' + T('Email or name on the site') + '">';
const SI_DOT = '<i class="si-dot" aria-hidden="true"></i>', SI_MID = '<i class="si-dot si-mid" aria-hidden="true"></i>';
const siPass = (auto) => '<input type="' + (siF().show ? 'text' : 'password') + '" autocomplete="' + auto + '" enterkeyhint="go" value="' + esc(siF().pass || '') + '" data-f="pass" aria-label="' + T('Password') + '"><button class="mini ic" type="button" data-go="si-eye" aria-label="' + T('Show or hide the password') + '" aria-pressed="' + !!siF().show + '">' + I.eye + '</button>';
const SI_TIP = {
  samsung: 'In Samsung Internet this check sometimes does not pass. Open the site in Chrome.',
  inapp: 'In the browser inside an app this check sometimes does not pass. Open the site in Chrome or another browser: choose “Open in browser” in the app menu.',
  other: 'If a VPN or an ad blocker is on, turn it off for a while, check your internet connection and try again. If this does not help, open the site in another browser.',
  clock: 'The date or time on this device is wrong. Turn on automatic date and time, then try again.',
};
const siTipText = () => T(SI_TIP[STATE.robotWhy === 'clock' ? 'clock' : STATE.robotTip] || SI_TIP.other);
const siChrome = () => (STATE.chromeUrl && STATE.robotWhy !== 'clock' ? '<a class="btn si-chrome" href="' + esc(STATE.chromeUrl) + '">' + T('Open in Chrome') + '</a>' : '');
const siHelp = () => '<div class="si-help"><p>' + siTipText() + '</p>' + siChrome() + '</div>';
const siRobot = () => { const r = STATE.robot; if (!r || r === 'none') return '';
  if (r === 'wait') return '<div class="si-robot" role="status"><i></i><span>' + T('Checking that you are not a robot…')
    + (STATE.robotLong ? '<small>' + T('The check is taking longer than usual. Keep this page open.') + '</small>' : '') + '</span></div>';
  if (r === 'ask') return '<button class="si-robot ask" type="button" data-go="si-robot"><i></i><span>' + T('I am not a robot') + '</span></button>';
  if (r === 'ok') return '<div class="si-robot" role="status"><i class="ok">' + I.check + '</i><span>' + T('You are not a robot') + '</span></div>';
  const bad = { fail: ['The check was not passed', 'Try again', 'si-robot'], old: ['The check has expired', 'Repeat the check', 'si-robot'], down: ['The check did not load', 'Reload the page', 'si-reload'] }[r];
  const help = r === 'fail' || r === 'down';
  const mail = help && STATE.v === 'in' && STATE.robotMail ? '<p class="si-robot-p">' + T('Or set a new password by email: this check is not needed there.')
    + ' <a href="#forgot" data-go="si-v" data-to="forgot">' + T('Forgot your password?') + '</a></p>' : '';
  return '<div class="si-robot bad" role="alert"><p class="si-robot-t"><i class="no">' + I.warn + '</i><b>' + T(bad[0]) + '</b></p>'
    + (help ? '<p class="si-robot-p">' + siTipText() + '</p>' : '') + mail
    + '<div class="si-robot-acts"><button class="btn" type="button" data-go="' + bad[2] + '">' + T(bad[1]) + '</button>' + (help ? siChrome() : '') + '</div></div>'; };
const siMain = (label, busy, go) => (STATE.busy ? '<button class="btn-p busy" style="--p:60%" disabled>' + T(busy) + '</button>' : '<button class="btn-p" data-go="' + go + '">' + T(label) + '</button>');
const siSwap = (ask, label, to) => '<p class="si-swap">' + T(ask) + ' <a href="#' + to + '" data-go="si-v" data-to="' + to + '">' + T(label) + '</a></p>';
function siIn() {
  return '<h1>' + T('Sign in') + '</h1>' + siNote()
    + siFld('email', 'Email or name on the site', siLogin())
    + siFld('pass', 'Password', siPass('current-password'))
    + '<a class="si-forgot" href="#forgot" data-go="si-v" data-to="forgot">' + T('Forgot your password?') + '</a>'
    + siRobot() + siMain('Sign in', 'Signing in…', 'si-in')
    + siSwap('No account yet?', 'Create an account', 'up');
}
function siTfa() {
  const g = STATE.g || (STATE.g = { way: 'tg', has: 'both' }), way = g.way || 'tg';
  const stop = { lock: ['Too many attempts', 'This sign-in is closed. Start again with your password.'], gone: ['The sign-in has expired', TF('It waits for the code for {time}. Start again with your password.', { time: DT.span(SI.ttl, 'minute') })], nosend: ['No more codes for this sign-in', 'Three codes were sent. Start again with your password.'] }[g.err];
  if (stop) return '<div class="si-stop"><i>' + I.clock + '</i><h1>' + T(stop[0]) + '</h1><p>' + T(stop[1]) + '</p></div><button class="btn-p" data-go="si-v" data-to="in">' + T('Start again') + '</button>';
  const title = { tg: 'Enter the code from Telegram', app: 'Enter the code from the app', rc: 'Enter a recovery code' }[way];
  const sub = { tg: TF('We sent it to {name}', { name: '<bdi>' + esc(g.name || '@rahim_k') + '</bdi>' }), app: 'PR.SOCIAL · <bdi>' + esc(siF().email || 'rahim.k@gmail.com') + '</bdi>', rc: T('One of the eight you saved. Each works once.') }[way];
  const left = SI.tries - (g.tries || 1);
  const err = g.err === 'bad' ? plF(left, 'Invalid code. {n} attempt left.', 'Invalid code. {n} attempts left.', { n: left }) : g.err === 'short' ? T(way === 'rc' ? 'A recovery code has 10 characters.' : 'Enter all 6 digits.') : g.err === 'unsent' ? T('Telegram did not take the code. Send a new one.') : '';
  const field = way === 'rc' ? '<div class="fld code' + (err ? ' err' : '') + '" data-fld="code"><span>' + T('Recovery code') + '</span><div class="box-in code-in rc"><input autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go" maxlength="11" value="' + esc(siF().code || '') + '" data-f="code" placeholder="' + T('XXXXX-XXXXX') + '" aria-label="' + T('Recovery code') + '"></div><small>' + err + '</small></div>'
    : '<div class="fld code' + (err ? ' err' : '') + '" data-fld="code"><span>' + T(way === 'tg' ? 'Code from Telegram' : '6 digits from the app') + '</span><div class="box-in code-in"><input inputmode="numeric" autocomplete="one-time-code" maxlength="6" value="' + esc(siF().code || '') + '" data-f="code" placeholder="000000" aria-label="' + T('6-digit code') + '"></div><small>'
      + (err || (way === 'tg' ? TF('The code lives {time}.', { time: DT.span(SI.ttl, 'minute') }) : T('The app shows a new code every 30 seconds.'))) + '</small></div>';
  const other = [way !== 'tg' && g.has !== 'app' ? ['tg', 'Get a code in Telegram'] : null, way !== 'app' && g.has !== 'tg' ? ['app', 'Use the authenticator app'] : null, way !== 'rc' && g.has !== 'tg' ? ['rc', 'Use a recovery code'] : null].filter(Boolean);
  return '<h1>' + T(title) + '</h1><p class="si-sub">' + sub + '</p>'
    + '<label class="si-trust"><input type="checkbox" data-f="trust"' + (g.trust ? ' checked' : '') + '><span><b>' + TF('Trust this browser for {time}', { time: DT.span(SI.trust, 'day') }) + '</b><small>' + T('Not on a phone or computer that others use.') + '</small></span></label>' + field
    + siMain('Sign in', 'Signing in…', 'si-code')
    + '<div class="si-links">' + (way === 'tg' ? (g.wait ? '<span class="tlink off">' + TF('Send again in {time}', { time: DT.dur(g.wait) }) + '</span>' : '<button class="tlink" data-go="si-resend">' + I.refresh + T('Send a new code') + '</button>') : '')
    + other.map((o) => '<button class="tlink" data-go="si-way" data-to="' + o[0] + '">' + T(o[1]) + '</button>').join('') + '</div>'
    + '<p class="si-swap si-two"><a href="#in" data-go="si-v" data-to="in">' + T('Sign in to another account') + '</a><a href="mailto:support@pr.social">' + T('I cannot get a code') + '</a></p>';
}
function siUp() {
  const f = siF(), invited = STATE.invited;
  return '<h1>' + T('Create an account') + '</h1>' + siNote()
    + siFld('name', 'Name on the site', '<input autocomplete="username" autocapitalize="none" spellcheck="false" enterkeyhint="next" maxlength="30" value="' + esc(f.name || '') + '" data-f="name" aria-label="' + T('Name on the site') + '">', 'Latin letters, digits and _. Others see it.')
    + siFld('email', 'Email', siEmail(), 'A letter comes here to confirm the address.')
    + siFld('pass', 'Password', siPass('new-password'), 'At least 6 characters.')
    + (invited ? '<div class="si-inv">' + I.gift + '<span>' + TF('You were invited with the code {code}', { code: '<b><bdi>' + esc(invited) + '</bdi></b>' }) + '</span></div>'
      : f.refOpen ? siFld('ref', 'Invitation code', '<input autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="20" value="' + esc(f.ref || '') + '" data-f="ref" aria-label="' + T('Invitation code') + '">', 'From the friend who invited you. It can be left empty.')
        : '<button class="tlink si-ref" type="button" data-go="si-ref">' + I.gift + T('I have an invitation code') + '</button>')
    + '<div data-bonus>' + siBonusHtml(STATE.bonus || 0) + '</div>'
    + siRobot() + siMain('Create an account', 'Creating the account…', 'si-up')
    + '<p class="si-terms">' + TF('By creating an account you accept the {terms} and the {rules}.', { terms: '<a href="' + href('terms') + '" target="_blank" rel="noopener">' + T('Terms~link') + '</a>', rules: '<a href="' + href('rules') + '" target="_blank" rel="noopener">' + T('Rules~link') + '</a>' }) + '</p>'
    + siSwap('Already have an account?', 'Sign in', 'in');
}
function siSent() {
  const mail = '<b><bdi>' + esc(siF().email || 'rahim.k@gmail.com') + '</bdi></b>';
  return '<div class="si-stop ok"><i>' + I.mail + '</i><h1>' + T('Confirm your email') + '</h1><p>' + TF('We sent a link to {email}. Open it to confirm the address.', { email: mail }) + '</p></div>'
    + (STATE.err === 'net' || STATE.err === 'server' ? siNote() : '')
    + '<button class="btn-p" data-go="si-open">' + T('Open the cabinet') + '</button>'
    + '<div class="si-links">' + (STATE.wait ? '<span class="tlink off">' + TF('Send again in {time}', { time: DT.dur(STATE.wait) }) + '</span>' : '<button class="tlink" data-go="si-mail">' + I.refresh + T('Send the link again') + '</button>') + '</div>'
    + '<p class="si-hint">' + T('The letter can take a few minutes. Look in the spam folder too.') + '</p>';
}
function siMail() {
  const m = STATE.mail || 'ok';
  if (m === 'bad') return '<div class="si-stop"><i>' + I.clock + '</i><h1>' + T('This link no longer works') + '</h1><p>' + T('It was used already or has expired. Sign in and send a new one from your profile.') + '</p></div><button class="btn-p" data-go="si-v" data-to="in">' + T('Sign in') + '</button>';
  return '<div class="si-stop ok"><i>' + I.check + '</i><h1>' + T(m === 'was' ? 'This email is already confirmed' : 'Email confirmed') + '</h1><p>' + T(m === 'was' ? 'Nothing more is needed.' : 'Thank you. Withdrawals and letters about your account now go to this address.') + '</p></div><button class="btn-p" data-go="si-open">' + T('Open the cabinet') + '</button>';
}
function siForgot() {
  return '<h1>' + T('Lost your password?') + '</h1><p class="si-sub">' + T('Enter the email of your account. We will send a link to set a new password.') + '</p>' + siNote()
    + siFld('email', 'Email', siEmail()) + siRobot() + siMain('Send the link', 'Sending…', 'si-forgot')
    + '<p class="si-swap"><a href="#in" data-go="si-v" data-to="in">' + T('Back to sign-in') + '</a></p>';
}
function siFsent() {
  return '<div class="si-stop ok"><i>' + I.mail + '</i><h1>' + T('Check your mail') + '</h1><p>' + TF('If {email} has an account, the link is on its way. It works for {time}.', { email: '<b><bdi>' + esc(siF().email || 'rahim.k@gmail.com') + '</bdi></b>', time: DT.span(SI.resetHours, 'hour') }) + '</p></div>'
    + '<button class="btn-p" data-go="si-v" data-to="in">' + T('Back to sign-in') + '</button><p class="si-hint">' + T('The letter can take a few minutes. Look in the spam folder too.') + '</p>';
}
function siReset() {
  if (STATE.err === 'link') return '<div class="si-stop"><i>' + I.clock + '</i><h1>' + T('This link no longer works') + '</h1><p>' + T('It was used already or has expired. Ask for a new one.') + '</p></div><button class="btn-p" data-go="si-v" data-to="forgot">' + T('Send a new link') + '</button>';
  return '<h1>' + T('Set a new password') + '</h1><p class="si-sub">' + T('After that every other device is signed out.') + '</p>' + siNote()
    + siFld('pass', 'New password', siPass('new-password'), 'At least 6 characters.') + siMain('Save the password', 'Saving…', 'si-reset');
}
function siRdone() {
  return '<div class="si-stop ok"><i>' + I.check + '</i><h1>' + T('Password changed') + '</h1><p>' + T('Sign in with the new password.') + '</p></div><button class="btn-p" data-go="si-v" data-to="in">' + T('Sign in') + '</button>';
}
const PAGE = {
  id: 'signin', title: 'Sign in', short: 'Sign in',
  solo: true,
  state: (q) => Object.assign({ v: 'in', f: {}, err: '', busy: false, g: null, mail: '', wait: 0, invited: '', site: null, robot: '' }, PAGE.preset ? PAGE.preset(q) : null),
  render() {
    const v = STATE.v, body = { in: siIn, tfa: siTfa, up: siUp, sent: siSent, mail: siMail, forgot: siForgot, fsent: siFsent, reset: siReset, rdone: siRdone }[v] || siIn;
    const n = STATE.site || {}, big = (x) => String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
    return '<div class="signin">' + siTools() + '<header class="si-hero"><a class="si-word" href="/" translate="no" aria-label="PR.SOCIAL">PR<i>.</i>SOCIAL</a><p class="si-tag">' + T('Earn on social networks') + '</p></header>'
      + '<main class="si-box" data-view="' + v + '">' + body() + '</main>'
      + (n.people ? '<div class="si-nums"><div><b>' + big(n.people) + '</b><span>' + T('People') + '</span></div><div><b>' + big(n.tasks) + '</b><span>' + T('Tasks done') + '</span></div><div><b class="rw">$' + big(n.paid) + '</b><span>' + T('Earned') + '</span></div></div>' : '')
      + siLive()
      + '<footer class="si-foot"><nav class="si-soc" aria-label="' + T('PR.SOCIAL in social networks') + '">' + [['twitter', 'https://x.com/prsocial_app', 'X'], ['telegram', 'https://t.me/prsocial_info', 'Telegram'], ['youtube', 'https://www.youtube.com/@prsocial_app', 'YouTube']].map((s) => '<a href="' + s[1] + '" target="_blank" rel="noopener" aria-label="' + s[2] + '" title="' + s[2] + '">' + ((NET[s[0]] || {}).svg || I.globe) + '</a>').join('') + '</nav>'
      + '<nav class="si-links2"><span class="si-pair"><a href="' + href('privacy') + '">' + T('Privacy') + '</a>' + SI_DOT + '<a href="' + href('terms') + '">' + T('Terms~link') + '</a>' + SI_DOT + '<a href="' + href('refund') + '">' + T('Refunds') + '</a></span>' + SI_MID + '<span class="si-pair"><a href="' + href('rules') + '">' + T('Rules~link') + '</a>' + SI_DOT + '<a href="' + href('guides') + '">' + T('Guides') + '</a></span></nav>'
      + '<p class="si-copy" translate="no" dir="ltr">© 2021–' + new Date(DT.now()).getFullYear() + ' PR.SOCIAL</p></footer></div>';
  },
  after() {
    document.querySelectorAll('.signin [data-f]').forEach((el) => { el.oninput = () => { const k = el.dataset.f; if (k === 'trust') { (STATE.g || (STATE.g = {})).trust = el.checked; return; } siF()[k] = el.value; if (k === 'ref' && PAGE.refTyped) PAGE.refTyped(el.value);
      const fld = el.closest('.fld.err'); if (fld) {
        fld.classList.remove('err'); const sm = fld.querySelector('small'); if (sm) sm.textContent = sm.dataset.hint || '';
        fld.querySelectorAll('.si-fix, .si-names').forEach((x) => x.remove());
        if (STATE.err && SI_ERR[STATE.err] && SI_ERR[STATE.err][0] === k) { STATE.err = ''; STATE.names = null; } } }; });
    if (PAGE.refTyped && STATE.v === 'up' && STATE.invited && STATE.bonus == null) { STATE.bonus = 0; PAGE.refTyped(STATE.invited); }
  },
  keys(e) { if (e.key === 'Enter' && e.target.matches && e.target.matches('.signin input')) { const b = document.querySelector('.signin .btn-p[data-go]'); if (b) { e.preventDefault(); b.click(); } } },
  click(e) {
    const g = e.target.closest('[data-go]'); if (!g) return false;
    const go = g.dataset.go, f = siF(); e.preventDefault();
    if (go === 'si-name') { f.name = g.dataset.name || f.name; STATE.err = ''; STATE.names = null; render(); return PAGE.act ? PAGE.act('si-up', g) !== false : true; }
    if (go === 'si-v') { STATE.v = g.dataset.to; STATE.err = ''; STATE.names = null; STATE.busy = false; f.pass = ''; f.code = ''; f.show = false; if (STATE.v === 'in') STATE.g = null; render();
      if (g.dataset.then) { const i = document.querySelector('.signin [data-f="' + g.dataset.then + '"]'); if (i) i.focus(); }
      return true; }
    if (go === 'si-eye') { f.show = !f.show; render(); const i = document.querySelector('.signin [data-f="pass"]'); if (i) i.focus(); return true; }
    if (go === 'si-ref') { f.refOpen = true; render(); const i = document.querySelector('.signin [data-f="ref"]'); if (i) i.focus(); return true; }
    if (go === 'si-way') { const s = STATE.g || (STATE.g = {}); s.way = g.dataset.to; s.err = ''; f.code = ''; render(); return true; }
    if (PAGE.act) return PAGE.act(go, g) !== false;
    return true;
  },
};
const SI_SAID = { banned: /banned/i, captcha: /captcha/i, closed: /temporarily disabled/i, emailBad: /email format/i, nameBad: /username/i, passBad: /password must/i, linkBad: /invalid or expired/i, verified: /already verified/i };
const SI_PATH = { in: '/login', up: '/register', forgot: '/forgot-password' };
const SI_FORM = { in: 'si-in', up: 'si-up', forgot: 'si-forgot' };
const SI_MAIL_WAIT = 120;
const SI_SEEN_MS = 2500;
async function getDeviceFingerprint() {
  try {
    const parts = [];
    try {
      const c = document.createElement('canvas');
      c.width = 200; c.height = 50;
      const ctx = c.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(0, 0, 100, 50);
      ctx.fillStyle = '#069';
      ctx.fillText('PR.SOCIAL fp', 2, 15);
      ctx.strokeStyle = 'rgba(102,204,0,0.7)';
      ctx.arc(75, 25, 15, 0, Math.PI * 2);
      ctx.stroke();
      parts.push(c.toDataURL());
    } catch(e) { parts.push('no-canvas'); }
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const dbg = gl && gl.getExtension('WEBGL_debug_renderer_info');
      parts.push(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'no-webgl');
    } catch(e) { parts.push('no-webgl'); }
    parts.push(screen.width + 'x' + screen.height + 'x' + (window.devicePixelRatio || 1));
    parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
    parts.push(navigator.language || '');
    parts.push((navigator.platform || '') + ':' + (navigator.hardwareConcurrency || 0));
    const raw = parts.join('|||');
    const buf = new TextEncoder().encode(raw);
    const hashBuf = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch(e) { return null; }
}
let siDevice = null;
const siFingerprint = () => siDevice || (siDevice = getDeviceFingerprint().catch(() => null));
const TS_TRIES = 3;
const TS_AGAIN_MS = 2000;
const TS_IDLE_TRIES = 3, TS_IDLE_MS = 8000;
const TS_LONG_MS = 20000;
const TS_QUIET_MS = 90000;
const TS_LOAD_MS = 12000;
const TS_FINAL = /^(110100|110110|110200|200100|400020|400021|400070)$/;
const TS = { id: null, token: '', state: 'load', want: null, go: null, tries: 0, idle: 0, t0: Date.now(), sent: 0, bad: false, passed: false, refused: 0,
  longT: 0, quietT: 0, againT: 0, loadT: 0 };
function tsBox() {
  let box = document.getElementById('si-ts');
  if (!box) { box = document.createElement('div'); box.id = 'si-ts'; box.className = 'si-ts'; box.hidden = true; box.innerHTML = '<div class="si-ts-in"><b></b><div id="si-ts-w"></div></div>'; document.body.appendChild(box);
    box.addEventListener('click', (e) => { if (e.target === box) { box.hidden = true; if (TS.want) { tsDrop(); STATE.busy = false; render(); } } }); }
  box.querySelector('b').textContent = T('Confirm that you are not a robot');
  return box;
}
const tsShow = (on) => { const box = tsBox(); box.hidden = !on; };
function tsReport(kind, code) {
  const bad = kind === 'down' || kind === 'fail' || kind === 'slow' || kind === 'refused', first = bad && !TS.bad;
  if (bad) TS.bad = true;
  if (kind !== 'start' && kind !== 'pass' && !first) { if (TS.sent >= 6) return; TS.sent++; }
  try {
    fetch('/api/auth/robot-report', { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, code: code == null ? '' : String(code).slice(0, 40), view: STATE.v || '', ms: Date.now() - TS.t0, first: first ? 1 : 0, bot: navigator.webdriver ? 1 : 0 }) }).catch(() => {});
  } catch (e) {  }
}
function siTip() {
  const ua = navigator.userAgent || '';
  STATE.robotMail = !!(DOOR && DOOR.unchecked && DOOR.unchecked.letter);
  const inApp = /Telegram|FBAN|FBAV|FB_IAB|Instagram|musical_ly|TikTok|BytedanceWebview|; wv\)/i.test(ua);
  STATE.robotTip = /SamsungBrowser/i.test(ua) ? 'samsung' : inApp ? 'inapp' : 'other';
  const chrome = /Chrome\/\d/.test(ua) && !/SamsungBrowser|EdgA|OPR\/|YaBrowser|MiuiBrowser|UCBrowser|HuaweiBrowser|HeyTapBrowser|VivoBrowser|Version\/\d/i.test(ua);
  STATE.chromeUrl = /Android/i.test(ua) && !chrome && !inApp ? 'intent://' + location.host + location.pathname + location.search
    + '#Intent;scheme=' + location.protocol.replace(':', '') + ';package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(location.href) + ';end' : '';
}
function tsSay(state) {
  STATE.robot = state; tsShow(state === 'ask');
  if (state !== 'wait') STATE.robotLong = false;
  if (state === 'ok') setTimeout(() => { if (STATE.robot === 'ok') { STATE.robot = ''; render(); } }, 1400);
  render();
}
function tsRefused(status) { TS.refused++; STATE.robotRefused = TS.refused; tsReport('refused', status); }
function tsQuiet(on) {
  clearTimeout(TS.quietT); TS.quietT = 0;
  if (!on || !TS.want) return;
  const go = TS.want;
  TS.quietT = setTimeout(() => {
    if (TS.want !== go || TS.token || TS.state === 'ask') return;
    const none = TS.id == null;
    tsReport(none ? 'down' : 'slow', none ? 'timeout' : ''); tsStop(none ? 'down' : 'fail');
  }, TS_QUIET_MS);
}
function tsWait(go) {
  clearTimeout(TS.longT); STATE.robotLong = false;
  TS.longT = setTimeout(() => {
    if (TS.want !== go || TS.token || TS.state === 'ask') return;
    STATE.robotLong = true; tsReport('long', TS.id == null ? 'script' : '');
    if (STATE.robot === 'wait') render();
  }, TS_LONG_MS);
  tsQuiet(true);
}
function tsDrop() { clearTimeout(TS.longT); tsQuiet(false); TS.want = null; STATE.robotLong = false; }
function tsStop(why) {
  clearTimeout(TS.againT); TS.againT = 0; tsDrop(); STATE.busy = false;
  STATE.robotWhy = why === 'clock' ? 'clock' : '';
  tsSay(why === 'down' ? 'down' : 'fail');
}
function tsLater(ms) { clearTimeout(TS.againT); TS.againT = setTimeout(() => { TS.againT = 0; if (!TS.token && TS.state === 'fail') tsAgain(); }, ms); }
function tsGot(token) {
  clearTimeout(TS.againT); TS.againT = 0; clearTimeout(TS.longT); tsQuiet(false); TS.tries = 0; TS.idle = 0;
  TS.token = token; TS.state = 'ready';
  if (TS.bad && !TS.passed) { TS.passed = true; tsReport('pass'); }
  const want = TS.want; TS.want = null;
  if (STATE.robot === 'ask' || STATE.robot === 'wait' || STATE.robot === 'fail' || STATE.robot === 'old' || STATE.robot === 'down') tsSay(want ? '' : 'ok');
  if (STATE.err === 'robot' && TS.refused < 2) { STATE.err = ''; render(); }
  if (want) siSend(want);
}
function tsError(code) {
  const c = String(code == null ? '' : code), final = TS_FINAL.test(c);
  TS.token = ''; TS.state = 'fail'; tsReport('fail', c);
  if (TS.want) {
    tsQuiet(true);
    if (!final && TS.tries < TS_TRIES) { TS.tries++; tsLater(TS_AGAIN_MS); return; }
    tsStop(c === '200100' ? 'clock' : 'fail');
    return;
  }
  if (!final && TS.idle < TS_IDLE_TRIES) { TS.idle++; tsLater(TS_IDLE_MS); }
  if (STATE.robot === 'ask') tsSay('');
}
function tsStart() {
  const key = DOOR && DOOR.captcha && DOOR.captcha.key;
  if (!key) { TS.state = 'none'; return; }
  tsBox(); siTip(); tsReport('start');
  const draw = () => {
    if (!window.turnstile || TS.id != null) return;
    clearTimeout(TS.loadT);
    TS.id = window.turnstile.render('#si-ts-w', { sitekey: key, appearance: 'interaction-only', theme: STATE.theme === 'dark' ? 'dark' : 'light', language: STATE.lang || 'auto',
      retry: 'never',
      callback: tsGot,
      'before-interactive-callback': () => { TS.state = 'ask'; if (TS.want || STATE.robot === 'wait') tsSay('ask'); else { STATE.robot = 'ask'; render(); } },
      'expired-callback': () => { TS.token = ''; TS.state = 'load'; if (STATE.robot) tsSay('old'); },
      'error-callback': (code) => { tsError(code); return true; },
      'unsupported-callback': () => { TS.state = 'down'; tsReport('down', 'unsupported'); tsStop('down'); },
    });
  };
  if (window.turnstile) { draw(); return; }
  const s = document.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true;
  s.onload = draw;
  s.onerror = () => { clearTimeout(TS.loadT); TS.state = 'down'; tsReport('down', 'script'); if (TS.want || STATE.robot) tsStop('down'); };
  document.head.appendChild(s);
  TS.loadT = setTimeout(() => { if (TS.id == null && TS.state === 'load') tsReport('long', 'script'); }, TS_LOAD_MS);
}
function tsAgain() {
  clearTimeout(TS.againT); TS.againT = 0; TS.token = '';
  if (TS.state !== 'none' && TS.state !== 'down') TS.state = 'load';
  try { if (window.turnstile && TS.id != null) window.turnstile.reset(TS.id); } catch (e) {  }
}
function tsFor(go) {
  if (TS.state === 'none') return '';
  if (TS.token) return TS.token;
  if (TS.state === 'down') { tsSay('down'); return false; }
  TS.want = go; TS.go = go; TS.tries = 1; TS.idle = 0; STATE.err = ''; STATE.robotWhy = '';
  if (TS.state === 'fail') tsAgain();
  tsWait(go);
  tsSay(TS.state === 'ask' ? 'ask' : 'wait');
  return false;
}
const SI_BARE = {};
const siBareKey = (go) => (go === 'si-in' ? 'in:' + String(siF().email || '').trim().toLowerCase() : go === 'si-forgot' ? 'forgot' : '');
let SI_KNOWN = null;
const siKnown = () => SI_KNOWN || (SI_KNOWN = ask('GET', '/api/cabinet/door').then((r) => { if (!r.ok) SI_KNOWN = null; return !!(r.ok && r.data && r.data.unchecked && r.data.unchecked.known); }));
async function tsOr(go) {
  const may = DOOR && DOOR.unchecked, key = siBareKey(go);
  if (TS.state === 'none' || TS.token || !may || !key || SI_BARE[key]) return tsFor(go);
  if (go === 'si-forgot') return may.letter ? '' : tsFor(go);
  if (!may.signin) return tsFor(go);
  STATE.busy = true; render();
  const known = await siKnown();
  STATE.busy = false;
  if (SI_FORM[STATE.v] !== go) return false;
  return known && !TS.token ? '' : tsFor(go);
}
function siBareAsked(go, key, cfToken, r) {
  if (cfToken || TS.state === 'none' || !key || (r.data || {}).code !== 'CHECK_NEEDED') return false;
  SI_BARE[key] = true; siSend(go);
  return true;
}
const siAsk = async (method, path, body) => { const r = await ask(method, '/api/auth/' + path, body); return Object.assign({ said: String((r.data && r.data.error) || '') }, r, { off: r.code === 'OFFLINE' || r.code === 'TIMEOUT' }); };
const siFail = (r) => { STATE.err = r.off ? 'net' : 'server'; tsReport(r.off ? 'net' : 'server', r.off ? r.code : r.status); };
function siDone(user) {
  try { if (user) localStorage.setItem('pr-user-cache-v1', JSON.stringify(user)); } catch (e) {  }
  const next = HOST.query().get('next') || '';
  location.replace(/^\/[a-z][a-z0-9/_-]*(\?[^#\s\\]*)?$/i.test(next) ? next : ROUTE.dashboard);
}
const siTick = (get, set, sel, say) => { const t = setInterval(() => { const left = get(); if (left <= 0) { clearInterval(t); return; } set(left - 1);
  const el = document.querySelector(sel); if (left - 1 > 0 && el) el.textContent = say(left - 1); else { clearInterval(t); render(); } }, 1000); };
const siWaitG = (g, sec) => { g.wait = sec || 0; if (g.wait > 0) siTick(() => (STATE.g === g ? g.wait : 0), (v) => { g.wait = v; }, '.si-links .tlink.off', (v) => TF('Send again in {time}', { time: DT.dur(v) })); };
const siWaitMail = (sec) => { STATE.wait = sec; siTick(() => (STATE.v === 'sent' ? STATE.wait : 0), (v) => { STATE.wait = v; }, '.si-links .tlink.off', (v) => TF('Send again in {time}', { time: DT.dur(v) })); };
async function siSend(go) {
  const f = siF();
  if (go === 'si-in') {
    STATE.err = '';
    if (!String(f.email || '').trim() || !f.pass) { STATE.err = 'bad'; render(); return; }
    const bareKey = siBareKey(go), cfToken = await tsOr(go); if (cfToken === false) return;
    STATE.busy = true; render();
    const r = await siAsk('POST', 'login', { email: String(f.email).trim(), password: f.pass, cfToken: cfToken || undefined, fingerprint: await siFingerprint() }), d = r.data || {};
    STATE.busy = false;
    if (siBareAsked(go, bareKey, cfToken, r)) return;
    if (cfToken) tsAgain();
    if (r.ok && d.requires_2fa && d.person) {
      const has = d.methods || [], tg = has.includes('telegram'), app = has.includes('totp');
      if (d.ttl_min) SI.ttl = d.ttl_min; if (d.trust_days) SI.trust = d.trust_days;
      STATE.v = 'tfa'; f.code = ''; f.pass = '';
      STATE.g = { session: d.session_id, way: d.method === 'totp' ? 'app' : 'tg', has: tg && app ? 'both' : tg ? 'tg' : 'app', name: (d.hints && d.hints.telegram) || '', trust: false, err: d.sent === false && d.method !== 'totp' ? 'unsent' : '', rc: !!(d.hints && d.hints.recovery), tgSent: d.method !== 'totp' };
      render(); siWaitG(STATE.g, d.retry_in || 0); siFocus('code'); return;
    }
    if (r.ok && d.requires_2fa) { location.href = '/admin/login'; return; }
    if (r.ok) { siDone(d.user); return; }
    if (r.status === 401 || r.status === 400) STATE.err = 'bad';
    else if (r.status === 403 && SI_SAID.banned.test(r.said)) STATE.err = 'closed';
    else if (r.status === 403 && SI_SAID.captcha.test(r.said)) STATE.err = 'robot';
    else if (r.status === 403 && SI_SAID.closed.test(r.said)) STATE.err = 'off';
    else if (r.status === 429) STATE.err = d.code === 'ACCOUNT_HELD' ? 'held' : 'many';
    else siFail(r);
    if (STATE.err === 'robot') tsRefused(r.status);
    f.pass = STATE.err === 'bad' ? '' : f.pass;
    render(); if (STATE.err === 'bad') siFocus('pass'); return;
  }
  if (go === 'si-up') {
    const name = String(f.name || '').trim(), email = String(f.email || '').trim();
    STATE.err = !/^[a-zA-Z0-9_]{3,30}$/.test(name) ? 'name' : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? 'email' : String(f.pass || '').length < SI.passMin ? 'pass' : '';
    if (STATE.err) { render(); siFocus(STATE.err); return; }
    const cfToken = tsFor(go); if (cfToken === false) return;
    STATE.busy = true; render();
    const ref = STATE.invited || String(f.ref || '').trim();
    const r = await siAsk('POST', 'register', { email, password: f.pass, username: name, ref: ref || undefined, cfToken: cfToken || undefined, fingerprint: await siFingerprint() }), d = r.data || {};
    STATE.busy = false; tsAgain();
    if (r.ok) {
      try { localStorage.removeItem('pr_ref'); localStorage.removeItem('pr_ref_ts'); if (d.user) localStorage.setItem('pr-user-cache-v1', JSON.stringify(d.user)); } catch (e) {  }
      f.pass = ''; STATE.v = 'sent'; render(); return;
    }
    if (r.status === 400 && d.code === 'MAIL_REFUSED') STATE.err = 'refused';
    else if (r.status === 409) {
      STATE.names = d.code === 'USERNAME_TAKEN' && Array.isArray(d.suggest) ? d.suggest.filter((n) => /^[a-zA-Z0-9_]{3,30}$/.test(n)).slice(0, 3) : null;
      STATE.err = d.code === 'EMAIL_TAKEN' ? 'emailTaken' : d.code === 'USERNAME_TAKEN' ? 'nameTaken' : 'taken'; }
    else if (r.status === 403 && SI_SAID.captcha.test(r.said)) STATE.err = 'robot';
    else if (r.status === 403) STATE.err = 'upoff';
    else if (r.status === 429) STATE.err = 'upmany';
    else if (r.status === 400) STATE.err = SI_SAID.emailBad.test(r.said) ? 'email' : SI_SAID.nameBad.test(r.said) ? 'name' : SI_SAID.passBad.test(r.said) ? 'pass' : 'server';
    else siFail(r);
    if (STATE.err === 'robot') tsRefused(r.status);
    render(); if (STATE.err === 'refused' || STATE.err === 'emailTaken') siFocus('email'); else if (STATE.err === 'nameTaken') siFocus('name'); return;
  }
  if (go === 'si-forgot') {
    const email = String(f.email || '').trim();
    STATE.err = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? '' : 'email';
    if (STATE.err) { render(); siFocus('email'); return; }
    const bareKey = siBareKey(go), cfToken = await tsOr(go); if (cfToken === false) return;
    STATE.busy = true; render();
    const r = await siAsk('POST', 'forgot-password', { email, cfToken: cfToken || undefined });
    STATE.busy = false;
    if (siBareAsked(go, bareKey, cfToken, r)) return;
    if (cfToken) tsAgain();
    if (r.ok) STATE.v = 'fsent'; else if (r.status === 400 && SI_SAID.captcha.test(r.said)) STATE.err = 'robot'; else if (r.status === 429) STATE.err = 'many'; else siFail(r);
    if (STATE.err === 'robot') tsRefused(r.status);
    render(); return;
  }
}
const siFocus = (name) => { const el = document.querySelector('.signin [data-f="' + name + '"]'); if (el) { el.focus(); try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) {  } } };
async function siCode() {
  const f = siF(), g = STATE.g; if (!g || STATE.busy) return;
  const rc = g.way === 'rc', code = String(f.code || '').trim();
  if (rc ? code.replace(/[^A-Za-z0-9]/g, '').length !== 10 : !/^\d{6}$/.test(code)) { g.err = 'short'; render(); siFocus('code'); return; }
  STATE.busy = true; g.err = ''; render();
  const r = await siAsk('POST', 'verify-2fa', { session_id: g.session, code, method: { tg: 'telegram', app: 'totp', rc: 'recovery' }[g.way], trust_device: !!g.trust, fingerprint: await siFingerprint() }), d = r.data || {};
  STATE.busy = false;
  if (r.ok && d.user) { siDone(d.user); return; }
  if (d.code === 'BAD_CODE') { g.err = 'bad'; g.tries = Math.max(1, SI.tries - (d.left == null ? SI.tries - 1 : d.left)); f.code = ''; }
  else if (d.code === 'LOCKED' || d.locked) g.err = 'lock';
  else if (d.code === 'EXPIRED') g.err = 'gone';
  else toast(r.off ? 'Check your internet and try again.' : 'Something went wrong on our side. Nothing has changed. Please try again in a minute.');
  render(); siFocus('code');
}
async function siResend() {
  const g = STATE.g; if (!g || STATE.busy || g.wait > 0) return;
  const r = await siAsk('POST', '2fa/send', { session_id: g.session, method: 'telegram' }), d = r.data || {};
  if (STATE.g !== g) return;
  g.tgSent = true;
  if (r.ok) { g.err = ''; render(); siWaitG(g, d.retry_in || SI.resend); toast('A new code is sent'); return; }
  if (d.code === 'WAIT') { render(); siWaitG(g, d.retry_in || SI.resend); return; }
  if (d.code === 'NO_MORE_CODES') g.err = 'nosend'; else if (d.code === 'EXPIRED') g.err = 'gone'; else if (r.off) toast('Check your internet and try again.'); else g.err = 'unsent';
  render();
}
PAGE.act = (go) => {
  if (go === 'si-in' || go === 'si-up' || go === 'si-forgot') { if (!STATE.busy) siSend(go); return; }
  if (go === 'si-robot') {
    if (STATE.robot === 'ask') { tsShow(true); return; }
    if (STATE.robot === 'fail' && TS.go && SI_FORM[STATE.v] === TS.go) { if (!STATE.busy) siSend(TS.go); return; }
    if (TS.state === 'fail' || STATE.robot === 'fail' || STATE.robot === 'old') { tsAgain(); tsSay('wait'); } else tsShow(true);
    return;
  }
  if (go === 'si-reload') { location.reload(); return; }
  if (go === 'si-code') { siCode(); return; }
  if (go === 'si-resend') { siResend(); return; }
  if (go === 'si-open') { location.href = ROUTE.dashboard; return; }
  if (go === 'si-mail') {
    siAsk('POST', 'resend-verification').then((r) => {
      if (r.ok || r.status === 429) { STATE.err = ''; render(); siWaitMail(SI_MAIL_WAIT); if (r.ok) toast('The link is sent again'); return; }
      if (r.status === 400 && SI_SAID.verified.test(r.said)) { STATE.v = 'mail'; STATE.mail = 'was'; render(); return; }
      siFail(r); render(); });
    return;
  }
  if (go === 'si-reset') {
    const f = siF();
    STATE.err = String(f.pass || '').length < SI.passMin ? 'pass' : '';
    if (STATE.err || STATE.busy) { render(); if (STATE.err) siFocus('pass'); return; }
    STATE.busy = true; render();
    siAsk('POST', 'reset-password', { token: SI_TOKEN, password: f.pass }).then((r) => { STATE.busy = false;
      if (r.ok) { f.pass = ''; STATE.v = 'rdone'; history.replaceState(null, '', SI_PATH.in); SI_KNOWN = Promise.resolve(true); } else if (r.status === 400 && SI_SAID.linkBad.test(r.said)) STATE.err = 'link'; else if (r.status === 400) STATE.err = 'pass'; else siFail(r);
      render(); });
  }
};
{ const click = PAGE.click, after = PAGE.after;
  PAGE.click = (e) => { const g = e.target.closest('[data-go]'), go = g && g.dataset.go, to = g && g.dataset.to, was = STATE.g && STATE.g.way;
    const done = click(e);
    if (go === 'si-v') { tsDrop(); if (STATE.robot) tsSay(''); if (SI_PATH[to]) history.replaceState(null, '', SI_PATH[to]); }
    if (go === 'si-way' && to === 'tg' && was !== 'tg' && STATE.g && !STATE.g.tgSent) siResend();
    return done; };
  PAGE.after = () => { after();
    if (!TS.begun) { TS.begun = true; tsStart(); }
    const code = document.querySelector('.signin [data-f="code"]');
    if (code && STATE.g && STATE.g.way !== 'rc') code.addEventListener('input', () => { code.value = code.value.replace(/\D/g, '').slice(0, 6); siF().code = code.value; if (code.value.length === 6 && !STATE.busy) siCode(); });
    const box = document.getElementById('si-ts'); if (box) box.querySelector('b').textContent = T('Confirm that you are not a robot'); }; }
let DOOR = null, SI_TOKEN = '', SI_MAILED = '';
function siInvited(q) {
  let ref = String(q.get('ref') || '').trim();
  try { if (ref) { localStorage.setItem('pr_ref', ref); localStorage.setItem('pr_ref_ts', String(Date.now())); }
    else { const kept = localStorage.getItem('pr_ref'), at = parseInt(localStorage.getItem('pr_ref_ts') || '0', 10); if (kept && Date.now() - at < 86400000) ref = kept; } } catch (e) {  }
  return /^[A-Za-z0-9_-]{1,40}$/.test(ref) ? ref : '';
}
{ const drawn = PAGE.state;
  PAGE.state = (q) => { const s = drawn(q), view = served().view || 'in';
    s.v = view === 'mail' ? 'mail' : view; s.site = (DOOR && DOOR.stats) || null; s.invited = siInvited(q);
    if (DOOR && DOOR.code) { SI.ttl = DOOR.code.ttl_min || SI.ttl; SI.trust = DOOR.code.trust_days || SI.trust; }
    SI_TOKEN = String(q.get('token') || '');
    if (view === 'reset' && !SI_TOKEN) s.err = 'link';
    if (view === 'mail') s.mail = SI_MAILED || 'bad';
    return s; }; }
let SI_BONUS_SEQ = 0, SI_BONUS_T = 0;
PAGE.refTyped = (raw) => {
  const code = String(raw || '').trim(), seq = ++SI_BONUS_SEQ;
  clearTimeout(SI_BONUS_T);
  const paint = (sum) => { STATE.bonus = sum || 0; const el = document.querySelector('.signin [data-bonus]'); if (el) el.innerHTML = siBonusHtml(STATE.bonus); };
  if (!/^[A-Za-z0-9_-]{3,40}$/.test(code)) { paint(0); return; }
  SI_BONUS_T = setTimeout(async () => {
    const r = await ask('GET', '/api/auth/invite-code?code=' + encodeURIComponent(code));
    if (seq !== SI_BONUS_SEQ) return;
    paint(r.ok && r.data && r.data.kind === 'promo' ? Number(r.data.bonus) || 0 : 0);
  }, 350);
};
PAGE.headTitle = () => (STATE.v === 'in' ? T('Earn on social networks') : STATE.v === 'up' ? T('Create an account') : '');
PAGE.live = {
  open: true, path: () => '/api/cabinet/door',
  fill: (f, d) => { DOOR = d; return {}; },
  async ready(s) {
    if (location.pathname === '/' && SI_PATH[s.view]) { try { history.replaceState(null, '', SI_PATH[s.view] + location.search + location.hash); } catch (e) {  } }
    if (s.view === 'in' || s.view === 'up') {
      const seen = ask('GET', '/api/auth/me').then((r) => { if (!r.ok || !r.data || !r.data.user) return false; siDone(r.data.user); return true; });
      if (await Promise.race([seen, new Promise((done) => setTimeout(() => done(false), SI_SEEN_MS))])) await new Promise(() => {});
    }
    if (s.view === 'mail') { const token = new URLSearchParams(location.search).get('token') || ''; if (token) { const r = await siAsk('GET', 'verify-email?token=' + encodeURIComponent(token)); SI_MAILED = r.ok ? 'ok' : 'bad'; } }
  },
};
start();