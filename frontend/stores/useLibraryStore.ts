import { defineStore } from 'pinia';
export const useLibraryStore = defineStore('library', {
  state: () => ({ items: [] as any[], loading: false }),
  actions: {
    async fetch(params:any={}){
      const { list } = useApi();
      this.loading = true;
      try { this.items = await list(params); }
      finally { this.loading = false; }
    },
    async remove(id:string){
      const { remove } = useApi();
      await remove(id);
      this.items = this.items.filter(i => i.id !== id);
    }
  }
});
