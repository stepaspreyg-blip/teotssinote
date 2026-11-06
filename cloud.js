/* TeotssiNote cloud adapter, Supabase JS v2.
 * Tables use per-user RLS. Photo objects are stored under {user_id}/...
 * Local-demo records are NEVER uploaded automatically at sign-in.
 * Real friend-record sharing is not enabled by this adapter.
 */
(function () {
  'use strict';
  const cfg = window.TEOT_CONFIG;
  let client = null;
  let user = null;
  let synced = false;
  let prior = null;
  const empty = () => ({ version: 1, plants: [], plantLogs: [], forests: [], forestLogs: [], reflections: [], demoFriend: false, nickname: '' });
  const err = (result, label) => { if (result.error) throw new Error(`${label}: ${result.error.message}`); return result.data; };
  const uniqueIds = xs => new Set(xs.map(x => x.id));
  const getRemoved = (oldRows, rows) => oldRows.filter(x => !uniqueIds(rows).has(x.id));

  function toBlob(dataUrl) {
    const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/i.exec(dataUrl);
    if (!match) throw new Error('지원하지 않는 사진 형식입니다.');
    const binary = atob(match[2]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return { blob: new Blob([bytes], { type: match[1] }), contentType: match[1] };
  }
  function checkClient() {
    if (!client || !user) throw new Error('먼저 Google 계정으로 로그인해 주세요.');
  }
  function makeSnapshot(state) {
    return {
      plants: state.plants.map(x => ({ id: x.id })),
      plantLogs: state.plantLogs.map(x => ({ id: x.id, photoPath: x.photoPath || null })),
      forests: state.forests.map(x => ({ id: x.id })),
      forestLogs: state.forestLogs.map(x => ({ id: x.id, photoPath: x.photoPath || null })),
      reflections: state.reflections.map(x => ({ id: x.id }))
    };
  }
  async function signed(path) {
    if (!path) return null;
    const result = await client.storage.from(cfg.photoBucket).createSignedUrl(path, 24 * 3600);
    return err(result, '사진 열람 주소 생성').signedUrl;
  }
  async function resolvePhoto(row) {
    if (!row.photo_path) return { photo: null, photoPath: null };
    try { return { photo: await signed(row.photo_path), photoPath: row.photo_path }; }
    catch (e) { console.warn('Unable to generate signed photo URL', e); return { photo: null, photoPath: row.photo_path }; }
  }
  async function uploadNewPhoto(log, folder) {
    if (!log.photo || !String(log.photo).startsWith('data:image/')) return log.photoPath || null;
    const { blob, contentType } = toBlob(log.photo);
    if (blob.size > 2 * 1024 * 1024) throw new Error('사진이 2MB를 초과합니다. 더 작은 사진을 사용해 주세요.');
    const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
    const path = `${user.id}/${folder}/${log.id}-${Date.now()}.${ext}`;
    err(await client.storage.from(cfg.photoBucket).upload(path, blob, { upsert: false, contentType }), '사진 업로드');
    log.photoPath = path;
    log.photo = await signed(path);
    return path;
  }
  async function upsert(table, rows) {
    if (!rows.length) return;
    err(await client.from(table).upsert(rows, { onConflict: 'id' }), `${table} 저장`);
  }
  async function removeRows(table, oldRows, rows) {
    const ids = getRemoved(oldRows, rows).map(x => x.id);
    if (!ids.length) return;
    err(await client.from(table).delete().in('id', ids), `${table} 삭제`);
  }
  async function sync(state) {
    checkClient();
    if (!synced || !prior) throw new Error('클라우드 기록을 먼저 불러와야 합니다. 새로고침해 주세요.');
    const currentId = user.id;
    const old = prior;
    const plantRows = state.plants.map(p => ({
      id: p.id, user_id: currentId, nickname: p.nickname || '', species: p.species || null,
      planted_on: p.sown || null, grow_place: p.place || null
    }));
    const forestRows = state.forests.map(f => ({
      id: f.id, user_id: currentId, name: f.name,
      place_type: f.type || null, started_on: f.start || null, guide: f.guide || null
    }));
    // Save parents before their child observations.
    await upsert('plants', plantRows);
    await upsert('forest_sites', forestRows);
    for (const log of state.plantLogs) await uploadNewPhoto(log, 'plants');
    for (const log of state.forestLogs) await uploadNewPhoto(log, 'forests');
    await upsert('plant_observations', state.plantLogs.map(l => ({
      id: l.id, plant_id: l.plantId, observed_on: l.date,
      status: l.status, note: l.note || '', photo_path: l.photoPath || null
    })));
    await upsert('forest_observations', state.forestLogs.map(l => ({
      id: l.id, site_id: l.forestId, observed_on: l.date,
      note: l.note || '', photo_path: l.photoPath || null
    })));
    await upsert('reflections', state.reflections.map(r => ({
      id: r.id, user_id: currentId, created_on: r.date, text: r.text
    })));
    // Delete children, then parents; cascading deletes remain consistent.
    await removeRows('plant_observations', old.plantLogs, state.plantLogs);
    await removeRows('forest_observations', old.forestLogs, state.forestLogs);
    await removeRows('reflections', old.reflections, state.reflections);
    await removeRows('plants', old.plants, state.plants);
    await removeRows('forest_sites', old.forests, state.forests);
    // Deleting data does not require immediate photo deletion for database integrity;
    // remove abandoned private objects after the database operation succeeds.
    const orphanPaths = [
      ...getRemoved(old.plantLogs, state.plantLogs),
      ...getRemoved(old.forestLogs, state.forestLogs)
    ].map(l => l.photoPath).filter(Boolean);
    if (orphanPaths.length) {
      const removed = await client.storage.from(cfg.photoBucket).remove(orphanPaths);
      if (removed.error) console.warn('Some removed photos may still occupy storage', removed.error);
    }
    prior = makeSnapshot(state);
  }
  let queue = Promise.resolve();
  async function read() {
    checkClient();
    synced = false;
    const names = ['plants', 'plant_observations', 'forest_sites', 'forest_observations', 'reflections'];
    const responses = await Promise.all(names.map(n => client.from(n).select('*')));
    const [plants, plogs, forests, flogs, reflections] = responses.map((response, i) => err(response, `${names[i]} 읽기`) || []);
    const state = empty();
    state.plants = plants.map(p => ({ id: p.id, nickname: p.nickname || '', species: p.species || '', sown: p.planted_on || '', place: p.grow_place || '' }));
    state.plantLogs = await Promise.all(plogs.map(async l => ({
      id: l.id, plantId: l.plant_id, date: l.observed_on, status: l.status,
      note: l.note || '', ...(await resolvePhoto(l))
    })));
    state.forests = forests.map(f => ({ id: f.id, name: f.name, type: f.place_type || '', start: f.started_on || '', guide: f.guide || '' }));
    state.forestLogs = await Promise.all(flogs.map(async l => ({
      id: l.id, forestId: l.site_id, date: l.observed_on,
      note: l.note || '', ...(await resolvePhoto(l))
    })));
    state.reflections = reflections.map(r => ({ id: r.id, date: r.created_on, text: r.text }));
    prior = makeSnapshot(state);
    synced = true;
    return state;
  }
  async function getProfile() {
    checkClient();
    const r = await client.from('profiles').select('nickname,friend_code').eq('id', user.id).maybeSingle();
    if (r.error) { console.warn('Profile unavailable', r.error); return null; }
    return r.data;
  }
  function installAuthChange(callback) {
    client.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT' && event !== 'USER_DELETED') return;
      // Do not make awaited Supabase calls inside auth change callbacks.
      setTimeout(() => callback(session?.user || null), 0);
    });
  }
  window.TeotCloud = {
    isAvailable() { return !!(cfg && cfg.supabaseUrl && cfg.supabasePublishableKey && window.supabase?.createClient); },
    async init(onChange) {
      if (!this.isAvailable()) return null;
      if (!client) {
        client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabasePublishableKey, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
        if (onChange) installAuthChange(onChange);
      }
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      user = data.session?.user || null;
      return user;
    },
    currentUser() { return user; },
    setUser(u) { if (user?.id !== u?.id) { synced = false; prior = null; } user = u; },
    async signIn() {
      if (!client) throw new Error('Supabase 연결 라이브러리를 불러오지 못했습니다.');
      const redirectTo = `${location.origin}${location.pathname}`;
      err(await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } }), 'Google 로그인');
    },
    async signOut() {
      checkClient();
      err(await client.auth.signOut(), '로그아웃');
      this.setUser(null);
    },
    async load() { return read(); },
    async save(state) {
      checkClient();
      // Serialize writes (e.g. two quick photo entries) rather than race.
      const run = queue.then(() => sync(state));
      queue = run.catch(() => {});
      return run;
    },
    async profile() { return getProfile(); },
    async refresh() { return read(); },
    isCloud: () => !!user,
    async exportWithImages(state) {
      checkClient();
      const clone = JSON.parse(JSON.stringify(state));
      const blobToData = async blob => new Promise((resolve, reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      for (const l of [...clone.plantLogs, ...clone.forestLogs]) {
        if (!l.photoPath) continue;
        const { data: file, error } = await client.storage.from(cfg.photoBucket).download(l.photoPath);
        if (error) throw new Error('사진 백업 실패: ' + error.message);
        l.photo = await blobToData(file);
        delete l.photoPath;
      }
      return clone;
    }
  };
})();
