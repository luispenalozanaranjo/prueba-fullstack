import { defineComponent, mergeModels, useModel, mergeProps, useSSRContext, computed, withCtx, createBlock, createCommentVNode, createVNode, openBlock, toDisplayString, createTextVNode, ref, unref, isRef } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { a as __nuxt_component_0, u as useRuntimeConfig, d as defineStore } from "../server.mjs";
import axios from "axios";
import "ofetch";
import "#internal/nuxt/paths";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/hookable/dist/index.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/unctx/dist/index.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/radix3/dist/index.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/defu/dist/defu.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/ufo/dist/index.mjs";
import "C:/Users/luisu/Desktop/19-08-2025AFC/prueba-fullstack/frontend/node_modules/klona/dist/index.mjs";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SearchBar",
  __ssrInlineRender: true,
  props: {
    "modelValue": { default: "" },
    "modelModifiers": {}
  },
  emits: /* @__PURE__ */ mergeModels(["search"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({
        class: "card",
        style: { "display": "grid", "gap": "12px" }
      }, _attrs))}><input class="input"${ssrRenderAttr("value", model.value)} placeholder="Escribe el nombre de un Libro para continuar"><button class="button" type="submit">Buscar</button></form>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SearchBar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BookCard",
  __ssrInlineRender: true,
  props: {
    id: {},
    title: {},
    author: {},
    cover: {},
    year: {}
  },
  setup(__props) {
    const props = __props;
    const to = computed(() => {
      const path = "/libro/" + encodeURIComponent(props.id);
      const q = {};
      if (props.title) q.title = props.title;
      if (props.author) q.author = props.author;
      if (props.year != null) q.year = String(props.year);
      if (props.cover) q.cover = props.cover;
      const query = new URLSearchParams(q).toString();
      return `${path}${query ? `?${query}` : ""}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: to.value,
        class: "card",
        style: { "display": "grid", "gap": "8px" }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (_ctx.cover) {
              _push2(`<img${ssrRenderAttr("src", _ctx.cover)} alt="portada" style="${ssrRenderStyle({ "width": "100%", "aspect-ratio": "2/3", "object-fit": "cover", "border-radius": "10px" })}"${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div${_scopeId}><strong${_scopeId}>${ssrInterpolate(_ctx.title)}</strong><div${_scopeId}><small class="muted"${_scopeId}>${ssrInterpolate(_ctx.author)} `);
            if (_ctx.year) {
              _push2(`<span${_scopeId}>· ${ssrInterpolate(_ctx.year)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</small></div></div>`);
          } else {
            return [
              _ctx.cover ? (openBlock(), createBlock("img", {
                key: 0,
                src: _ctx.cover,
                alt: "portada",
                style: { "width": "100%", "aspect-ratio": "2/3", "object-fit": "cover", "border-radius": "10px" }
              }, null, 8, ["src"])) : createCommentVNode("", true),
              createVNode("div", null, [
                createVNode("strong", null, toDisplayString(_ctx.title), 1),
                createVNode("div", null, [
                  createVNode("small", { class: "muted" }, [
                    createTextVNode(toDisplayString(_ctx.author) + " ", 1),
                    _ctx.year ? (openBlock(), createBlock("span", { key: 0 }, "· " + toDisplayString(_ctx.year), 1)) : createCommentVNode("", true)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BookCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
function useApi() {
  const config = useRuntimeConfig();
  const http = axios.create({ baseURL: config.public.apiBase + "/api" });
  return {
    search: (q) => http.get("/books/search", { params: { q } }).then((r) => r.data),
    lastSearch: () => http.get("/books/last-search").then((r) => r.data),
    save: (payload) => http.post("/books/my-library", payload).then((r) => r.data),
    list: (params = {}) => http.get("/books/my-library", { params }).then((r) => r.data),
    getById: (id) => http.get(`/books/my-library/${id}`).then((r) => r.data),
    update: (id, payload) => http.put(`/books/my-library/${id}`, payload).then((r) => r.data),
    remove: (id) => http.delete(`/books/my-library/${id}`).then((r) => r.data),
    frontCover: (openLibraryId) => http.get(`/books/my-library/front-cover/${encodeURIComponent(openLibraryId)}`).then((r) => r.data)
  };
}
const useSearchStore = defineStore("search", {
  state: () => ({ last: [], results: [], loading: false }),
  actions: {
    async fetchLast() {
      const { lastSearch } = useApi();
      this.last = await lastSearch();
    },
    async search(q) {
      const { search } = useApi();
      this.loading = true;
      try {
        this.results = await search(q);
      } finally {
        this.loading = false;
      }
    }
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const q = ref("");
    const searchStore = useSearchStore();
    async function doSearch(query) {
      await searchStore.search(query);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SearchBar = _sfc_main$2;
      const _component_BookCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "grid",
        style: { "gap": "24px" }
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SearchBar, {
        modelValue: unref(q),
        "onUpdate:modelValue": ($event) => isRef(q) ? q.value = $event : null,
        onSearch: doSearch
      }, null, _parent));
      if (unref(searchStore).last.length) {
        _push(`<div class="card"><strong>Últimas búsquedas</strong><div style="${ssrRenderStyle({ "display": "flex", "gap": "8px", "flex-wrap": "wrap", "margin-top": "8px" })}"><!--[-->`);
        ssrRenderList(unref(searchStore).last, (s) => {
          _push(`<button class="button secondary">${ssrInterpolate(s)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(searchStore).loading) {
        _push(`<div>Buscando...</div>`);
      } else if (!unref(searchStore).results.length) {
        _push(`<div class="card">No hay resultados todavía</div>`);
      } else {
        _push(`<div class="grid books"><!--[-->`);
        ssrRenderList(unref(searchStore).results, (b) => {
          _push(ssrRenderComponent(_component_BookCard, {
            key: b.id,
            id: b.id,
            title: b.title,
            author: b.author,
            year: b.year,
            cover: b.cover
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-6KD8W4X3.js.map
