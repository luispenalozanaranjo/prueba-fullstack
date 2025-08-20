import { computed, toValue, getCurrentInstance, onServerPrefetch, ref, shallowRef, toRef, nextTick, unref, defineComponent, useModel, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { b as useNuxtApp, c as asyncDataDefaults, e as createError } from "../server.mjs";
import { debounce } from "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/perfect-debounce/dist/index.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/klona/dist/index.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/defu/dist/defu.mjs";
import "#internal/nuxt/paths";
import "ofetch";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/hookable/dist/index.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/unctx/dist/index.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/h3/dist/index.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/radix3/dist/index.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/ufo/dist/index.mjs";
const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _a;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ?? (options.server = true);
  options.default ?? (options.default = getDefault);
  options.getCachedData ?? (options.getCachedData = getDefaultCachedData);
  options.lazy ?? (options.lazy = false);
  options.immediate ?? (options.immediate = true);
  options.deep ?? (options.deep = asyncDataDefaults.deep);
  options.dedupe ?? (options.dedupe = "cancel");
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
  if (!((_a = nuxtApp._asyncData[key.value]) == null ? void 0 : _a._init)) {
    initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
    nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
  }
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const initialFetch = () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.data;
    }),
    pending: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.pending;
    }),
    status: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.status;
    }),
    error: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.error;
    }),
    refresh: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    execute: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      var _a;
      return (_a = getter()) == null ? void 0 : _a.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    {
      nuxtApp._asyncData[key].pending.value = false;
    }
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  var _a, _b;
  (_a = nuxtApp.payload._errors)[key] ?? (_a[key] = asyncDataDefaults.errorValue);
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = !import.meta.prerender || !((_b = nuxtApp.ssrContext) == null ? void 0 : _b._sharedPrerenderCache) ? _handler : () => {
    const value = nuxtApp.ssrContext._sharedPrerenderCache.get(key);
    if (value) {
      return value;
    }
    const promise = Promise.resolve().then(() => nuxtApp.runWithContext(() => _handler(nuxtApp)));
    nuxtApp.ssrContext._sharedPrerenderCache.set(key, promise);
    return promise;
  };
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData != null;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: shallowRef(!hasCachedData),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (opts = {}) => {
      if (nuxtApp._asyncDataPromises[key]) {
        if (isDefer(opts.dedupe ?? options.dedupe)) {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      if (opts.cause === "initial" || nuxtApp.isHydrating) {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData != null) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = asyncDataDefaults.errorValue;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      {
        asyncData.pending.value = true;
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = asyncDataDefaults.errorValue;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        {
          asyncData.pending.value = false;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      var _a2;
      unsubRefreshAsyncData();
      if ((_a2 = nuxtApp._asyncData[key]) == null ? void 0 : _a2._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          var _a3;
          if (!((_a3 = nuxtApp._asyncData[key]) == null ? void 0 : _a3._init)) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
            asyncData.data.value = asyncDataDefaults.value;
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => asyncDataDefaults.value;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RatingStars",
  __ssrInlineRender: true,
  props: {
    "modelValue": { default: null },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ style: { "display": "flex", "gap": "8px", "font-size": "24px", "cursor": "pointer" } }, _attrs))}><!--[-->`);
      ssrRenderList(5, (n) => {
        _push(`<span>${ssrInterpolate((model.value ?? 0) >= n ? "★" : "☆")}</span>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RatingStars.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const $api = useNuxtApp().$api;
    const route = useRoute();
    const review = ref("");
    const rating = ref(null);
    const coverBase64 = ref(null);
    const success = ref(false);
    const lastError = ref(null);
    function getDbId() {
      const q = route.query.dbId;
      if (Array.isArray(q)) return q[0] ?? null;
      return q != null ? String(q) : null;
    }
    computed(getDbId);
    const openLibraryId = computed(() => {
      const p = route.params.id;
      const s = Array.isArray(p) ? "/" + p.join("/") : String(p ?? "");
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    });
    const { data: book, pending, error } = useAsyncData("bookDetail", async () => {
      const q = route.query;
      const base = {
        openLibraryId: openLibraryId.value,
        title: String(q.title ?? ""),
        author: String(q.author ?? ""),
        year: q.year != null ? Number(q.year) : null,
        cover: q.cover ? String(q.cover) : null
        // si viene desde Mi Biblioteca
      };
      const dbId = getDbId();
      if (dbId) {
        try {
          const existing = await $api(
            `/books/my-library/${dbId}`,
            { method: "GET" }
          );
          review.value = String((existing == null ? void 0 : existing.review) ?? "");
          rating.value = (existing == null ? void 0 : existing.rating) ?? null;
          if (!base.cover && (existing == null ? void 0 : existing.coverBase64)) base.cover = existing.coverBase64;
        } catch (e) {
          console.warn("No se pudo precargar desde la BD:", e);
        }
      }
      return base;
    });
    const displayCover = computed(() => {
      var _a;
      return coverBase64.value || ((_a = book.value) == null ? void 0 : _a.cover) || null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RatingStars = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "grid",
        style: { "gap": "16px" }
      }, _attrs))}>`);
      if (unref(pending)) {
        _push(`<div class="card">Cargando…</div>`);
      } else if (unref(error)) {
        _push(`<div class="card">Error de precarga: ${ssrInterpolate(unref(error).message)}</div>`);
      } else if (unref(book)) {
        _push(`<div class="card"><div style="${ssrRenderStyle({ "display": "flex", "gap": "16px" })}">`);
        if (displayCover.value) {
          _push(`<img${ssrRenderAttr("src", displayCover.value)} alt="portada" style="${ssrRenderStyle({ "width": "200px", "aspect-ratio": "2/3", "object-fit": "cover", "border-radius": "10px" })}">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div style="${ssrRenderStyle({ "flex": "1" })}"><h2 style="${ssrRenderStyle({ "margin": "0 0 6px" })}">${ssrInterpolate(unref(book).title)}</h2><small class="muted">${ssrInterpolate(unref(book).author)} `);
        if (unref(book).year) {
          _push(`<span>· ${ssrInterpolate(unref(book).year)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</small><div style="${ssrRenderStyle({ "margin-top": "12px" })}"><input type="file"><small class="muted"> Sube una portada (se guarda en base64)</small></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card"><label>Review</label><textarea class="textarea" maxlength="500" rows="6" placeholder="Escribe una reseña (máx 500)">${ssrInterpolate(review.value)}</textarea><label>Calificación</label>`);
      _push(ssrRenderComponent(_component_RatingStars, {
        modelValue: rating.value,
        "onUpdate:modelValue": ($event) => rating.value = $event
      }, null, _parent));
      _push(`<div style="${ssrRenderStyle({ "display": "flex", "justify-content": "flex-end", "margin-top": "12px" })}"><button class="button">Guardar en Mi Biblioteca</button></div>`);
      if (success.value) {
        _push(`<div style="${ssrRenderStyle({ "margin-top": "8px", "color": "#86efac" })}">Guardado correctamente ✔</div>`);
      } else if (lastError.value) {
        _push(`<div class="card" style="${ssrRenderStyle({ "margin-top": "8px", "color": "#fca5a5" })}"> Error del servidor: ${ssrInterpolate(lastError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/libro/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-BUJxs2eD.js.map
