import { defineComponent, ref, watch, mergeProps, unref, mergeModels, useModel, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { d as defineStore, b as useNuxtApp } from './server.mjs';
import { useRouter } from 'vue-router';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ConfirmDialog",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    message: {}
  }, {
    "modelValue": { type: Boolean, ...{ default: false } },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["confirm", "cancel"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const show = useModel(__props, "modelValue");
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      if (show.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ style: { "position": "fixed", "inset": "0", "display": "grid", "place-items": "center", "background": "rgba(0,0,0,.5)" } }, _attrs))}><div class="card" style="${ssrRenderStyle({ "max-width": "420px" })}"><p>${ssrInterpolate(props.message || "\xBFConfirmar?")}</p><div style="${ssrRenderStyle({ "display": "flex", "gap": "8px", "justify-content": "flex-end" })}"><button class="button secondary">Cancelar</button><button class="button danger">Eliminar</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmDialog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const useLibraryStore = defineStore("library", {
  state: () => ({
    items: [],
    loading: false
  }),
  actions: {
    // ←↓↓ AQUI VA LO ROJO (fetch)
    async fetch(params = {}) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const list = await $api("/books/my-library", {
          method: "GET",
          query: {
            q: params.q,
            author: params.author,
            // en el back se chequea excludeNoReview === "true"
            excludeNoReview: params.excludeNoReview ? "true" : void 0,
            sort: params.sort
          }
        });
        this.items = Array.isArray(list) ? list : [];
      } catch (err) {
        console.error("[library.fetch] error", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // ←↓↓ Y AQUI VA LO ROJO (remove)
    async remove(id) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/books/my-library/${encodeURIComponent(id)}`, {
          method: "DELETE"
        });
        this.items = this.items.filter((it) => it.id !== id);
      } catch (err) {
        console.error("[library.remove] error", err);
        throw err;
      }
    }
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mi-biblioteca",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const store = useLibraryStore();
    const q = ref("");
    const author = ref("");
    const exclude = ref(false);
    const sort = ref("rating_desc");
    async function fetch() {
      await store.fetch({
        q: q.value || void 0,
        author: author.value || void 0,
        excludeNoReview: exclude.value,
        sort: sort.value
      });
    }
    watch([q, author, exclude, sort], fetch);
    const showConfirm = ref(false);
    async function confirmDelete() {
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConfirmDialog = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "grid",
        style: { "gap": "16px" }
      }, _attrs))}><div class="card" style="${ssrRenderStyle({ "display": "grid", "gap": "8px" })}"><strong>Buscar &amp; Filtrar</strong><div class="grid" style="${ssrRenderStyle({ "grid-template-columns": "1fr 1fr 1fr 1fr", "gap": "8px" })}"><input class="input"${ssrRenderAttr("value", q.value)} placeholder="Buscar por t\xEDtulo"><input class="input"${ssrRenderAttr("value", author.value)} placeholder="Buscar por autor"><select class="select"><option value="rating_desc"${ssrIncludeBooleanAttr(Array.isArray(sort.value) ? ssrLooseContain(sort.value, "rating_desc") : ssrLooseEqual(sort.value, "rating_desc")) ? " selected" : ""}>Rating \u2193</option><option value="rating_asc"${ssrIncludeBooleanAttr(Array.isArray(sort.value) ? ssrLooseContain(sort.value, "rating_asc") : ssrLooseEqual(sort.value, "rating_asc")) ? " selected" : ""}>Rating \u2191</option></select><label style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(exclude.value) ? ssrLooseContain(exclude.value, null) : exclude.value) ? " checked" : ""}> Excluir sin review </label></div></div>`);
      if (unref(store).loading) {
        _push(`<div>Cargando...</div>`);
      } else if (!unref(store).items.length) {
        _push(`<div class="card">No hay libros en tu biblioteca</div>`);
      } else {
        _push(`<div class="grid books"><!--[-->`);
        ssrRenderList(unref(store).items, (b) => {
          _push(`<div class="card" style="${ssrRenderStyle({ "display": "grid", "gap": "8px" })}">`);
          if (b.coverBase64) {
            _push(`<img${ssrRenderAttr("src", b.coverBase64)} alt="portada" style="${ssrRenderStyle({ "width": "100%", "aspect-ratio": "2/3", "object-fit": "cover", "border-radius": "10px" })}">`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div><strong>${ssrInterpolate(b.title)}</strong><div><small class="muted">${ssrInterpolate(b.author)} `);
          if (b.year) {
            _push(`<span>\xB7 ${ssrInterpolate(b.year)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</small></div>`);
          if (b.rating) {
            _push(`<div>\u2B50 ${ssrInterpolate(b.rating)}/5</div>`);
          } else {
            _push(`<!---->`);
          }
          if (b.review) {
            _push(`<p>${ssrInterpolate(b.review)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "8px" })}"><button class="button secondary">Editar</button><button class="button danger">Eliminar</button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        modelValue: showConfirm.value,
        "onUpdate:modelValue": ($event) => showConfirm.value = $event,
        message: "\xBFEliminar este libro de forma permanente?",
        onConfirm: confirmDelete
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/mi-biblioteca.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=mi-biblioteca-v_spenJC.mjs.map
